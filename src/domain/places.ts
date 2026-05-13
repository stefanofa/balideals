import type { DayName, DealKind, DealRecord } from "@/domain/deals"
import { DAYS, deals } from "@/domain/deals"

export interface PlaceProfile {
  slug: string
  name: string
  aliases: Array<string>
  deals: Array<DealRecord>
  days: Array<DayName>
  categories: Array<string>
  kinds: Array<DealKind>
  mapLinks: Array<string>
  mapSearchQuery: string
  dailyDealCount: number
}

export const places = buildPlaces(deals)
export const placesBySlug = new Map(places.map((place) => [place.slug, place]))

export function getPlaceBySlug(slug: string) {
  return placesBySlug.get(slug)
}

export function placePath(place: Pick<PlaceProfile, "slug">) {
  return `/places/${place.slug}`
}

export function placePathForName(placeName: string) {
  return `/places/${slugifyPlaceName(placeName)}`
}

export function slugifyPlaceName(placeName: string) {
  return (
    placeName
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-") || "place"
  )
}

export function similarPlaces(place: PlaceProfile, limit = 8) {
  const categorySet = new Set(place.categories)

  return places
    .filter((candidate) => candidate.slug !== place.slug)
    .map((candidate) => ({
      place: candidate,
      score:
        candidate.categories.filter((category) => categorySet.has(category))
          .length *
          10 +
        Math.min(candidate.deals.length, 12),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.place.deals.length - a.place.deals.length ||
        a.place.name.localeCompare(b.place.name)
    )
    .slice(0, limit)
    .map((candidate) => candidate.place)
}

export function placeDescription(place: PlaceProfile) {
  const leadCategories = place.categories.slice(0, 3).join(", ").toLowerCase()
  const categoryPhrase = leadCategories ? ` across ${leadCategories}` : ""

  return `${place.name} has ${place.deals.length} listed deals in Canggu${categoryPhrase}, including schedules, prices, Google Maps, and review links.`
}

function buildPlaces(catalog: ReadonlyArray<DealRecord>) {
  const groups = new Map<string, Array<DealRecord>>()

  for (const deal of catalog) {
    const slug = slugifyPlaceName(deal.placeName)
    const group = groups.get(slug) ?? []
    group.push(deal)
    groups.set(slug, group)
  }

  return Array.from(groups, ([slug, placeDeals]) =>
    buildPlace(slug, placeDeals)
  ).sort(
    (a, b) => b.deals.length - a.deals.length || a.name.localeCompare(b.name)
  )
}

function buildPlace(slug: string, placeDeals: Array<DealRecord>): PlaceProfile {
  const aliases = uniqueSorted(placeDeals.map((deal) => deal.placeName))
  const categories = frequencySorted(
    placeDeals.flatMap((deal) => deal.categories)
  )
  const days = DAYS.filter((day) =>
    placeDeals.some((deal) => deal.days.includes(day))
  )
  const kinds = uniqueSorted(placeDeals.map((deal) => deal.kind))
  const mapLinks = uniqueSorted(placeDeals.flatMap((deal) => deal.mapLinks))

  return {
    slug,
    name: pickDisplayName(placeDeals),
    aliases,
    deals: sortPlaceDeals(placeDeals),
    days,
    categories,
    kinds,
    mapLinks,
    mapSearchQuery:
      placeDeals.find((deal) => deal.mapSearchQuery)?.mapSearchQuery ??
      `${placeDeals[0]?.placeName ?? "Restaurant"} Canggu Bali`,
    dailyDealCount: placeDeals.filter((deal) => deal.recurrence === "everyday")
      .length,
  }
}

function sortPlaceDeals(placeDeals: Array<DealRecord>) {
  return [...placeDeals].sort((a, b) => {
    const dayDelta = firstDayIndex(a) - firstDayIndex(b)
    if (dayDelta !== 0) return dayDelta

    return (
      timeValue(a) - timeValue(b) ||
      kindValue(a.kind) - kindValue(b.kind) ||
      a.deal.localeCompare(b.deal)
    )
  })
}

function pickDisplayName(placeDeals: Array<DealRecord>) {
  const counts = new Map<string, number>()

  for (const deal of placeDeals) {
    const name = cleanPlaceName(deal.placeName)
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }

  return [...counts].sort(
    ([nameA, countA], [nameB, countB]) =>
      countB - countA ||
      nameQuality(nameB) - nameQuality(nameA) ||
      nameA.localeCompare(nameB)
  )[0][0]
}

function cleanPlaceName(placeName: string) {
  return placeName.trim().replace(/:+$/, "")
}

function nameQuality(placeName: string) {
  let score = 0

  if (!placeName.endsWith(":")) score += 2
  if (/[A-Z]/.test(placeName)) score += 2
  if (!/[’]/.test(placeName)) score += 1
  if (/[+&]/.test(placeName)) score += 1

  return score
}

function uniqueSorted<T extends string>(values: Array<T>) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function frequencySorted(values: Array<string>) {
  const counts = new Map<string, number>()

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts]
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
    .map(([value]) => value)
}

function firstDayIndex(deal: DealRecord) {
  const indexes = deal.days.map((day) => DAYS.indexOf(day))

  return indexes.length === 0 ? DAYS.length : Math.min(...indexes)
}

function timeValue(deal: DealRecord) {
  return deal.startMinutes ?? (deal.timeBucket === "all-day" ? 0 : 60 * 24)
}

function kindValue(kind: DealKind) {
  switch (kind) {
    case "food-promo":
      return 0
    case "happy-hour":
      return 1
    case "event":
      return 2
    case "deal":
      return 3
  }
}
