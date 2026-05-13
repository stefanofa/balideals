import type {
  DayName,
  DealKind,
  DealRecord,
  PriceBand,
  TimeBucket,
} from "@/data/deals.generated"
import { catalogProfile, catalogStats, deals } from "@/data/deals.generated"

export {
  catalogProfile,
  catalogStats,
  deals,
  type DayName,
  type DealKind,
  type DealRecord,
  type PriceBand,
  type TimeBucket,
}

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const satisfies ReadonlyArray<DayName>

export const DAY_LABELS: Record<DayName, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
}

export const KIND_OPTIONS = [
  { value: "all", label: "All" },
  { value: "food-promo", label: "Food" },
  { value: "happy-hour", label: "Happy hour" },
  { value: "event", label: "Events" },
] as const

export const TIME_BUCKET_OPTIONS = [
  { value: "all", label: "Any time" },
  { value: "all-day", label: "All day" },
  { value: "morning", label: "Morning" },
  { value: "lunch", label: "Lunch" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
  { value: "anytime", label: "Time varies" },
] as const

export const PRICE_BAND_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "discount", label: "Discount" },
  { value: "under-50k", label: "< 50k" },
  { value: "50k-99k", label: "50-99k" },
  { value: "100k-199k", label: "100-199k" },
  { value: "200k-plus", label: "200k+" },
  { value: "varies", label: "Varies" },
  { value: "unknown", label: "Unlisted" },
] as const

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "soonest", label: "Soonest" },
  { value: "lowest-price", label: "Lowest price" },
  { value: "place", label: "Place A-Z" },
] as const

export type DayFilter = "all" | "today" | DayName
export type KindFilter = (typeof KIND_OPTIONS)[number]["value"]
export type SortMode = (typeof SORT_OPTIONS)[number]["value"]

export interface BaliNow {
  day: DayName
  minutes: number
  label: string
}

export interface DealFilters {
  query: string
  day: DayFilter
  kind: KindFilter
  timeBucket: "all" | TimeBucket
  priceBands: Array<PriceBand>
  categories: Array<string>
  maxPriceK: number
  withMapOnly: boolean
  everydayOnly: boolean
  openNow: boolean
  sort: SortMode
}

export interface QuickCollection {
  id: string
  label: string
  patch: Partial<DealFilters>
}

export const defaultFilters: DealFilters = {
  query: "",
  day: "today",
  kind: "all",
  timeBucket: "all",
  priceBands: [],
  categories: [],
  maxPriceK: 300,
  withMapOnly: false,
  everydayOnly: false,
  openNow: false,
  sort: "recommended",
}

export const CATEGORY_OPTIONS = Array.from(
  new Set(deals.flatMap((deal) => deal.categories))
).sort((a, b) => a.localeCompare(b))

export const FEATURED_CATEGORIES = [
  "Cocktails",
  "Coffee",
  "Breakfast + Brunch",
  "Tacos + Mexican",
  "BOGO + Discounts",
  "Nightlife",
  "Beer",
  "Best Food Deals",
  "Grill + Seafood",
] as const

export const QUICK_COLLECTIONS = [
  {
    id: "today",
    label: "Today",
    patch: { day: "today", kind: "all", timeBucket: "all" },
  },
  {
    id: "all-day",
    label: "All day",
    patch: { day: "all", timeBucket: "all-day" },
  },
  {
    id: "under-50",
    label: "Under 50k",
    patch: { day: "all", maxPriceK: 49 },
  },
  {
    id: "coffee",
    label: "Coffee",
    patch: { day: "all", categories: ["Coffee"] as Array<string> },
  },
  {
    id: "nightlife",
    label: "Nightlife",
    patch: { day: "all", categories: ["Nightlife"] as Array<string> },
  },
  {
    id: "happy-hour",
    label: "Happy hour",
    patch: { day: "all", kind: "happy-hour" },
  },
] as const satisfies ReadonlyArray<QuickCollection>

const SEARCH_TOKEN_SEPARATOR = /\s+/

export function getBaliNow(date = new Date()): BaliNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Makassar",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date)

  const day = parts.find((part) => part.type === "weekday")?.value as DayName
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0)
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0
  )
  const normalizedHour = hour === 24 ? 0 : hour

  return {
    day: DAYS.includes(day) ? day : "Monday",
    minutes: normalizedHour * 60 + minute,
    label: `${DAY_LABELS[DAYS.includes(day) ? day : "Monday"]} ${String(normalizedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  }
}

export function resolveDayFilter(day: DayFilter, now: BaliNow): DayName | null {
  if (day === "all") {
    return null
  }

  return day === "today" ? now.day : day
}

export function filterAndSortDeals(
  catalog: ReadonlyArray<DealRecord>,
  filters: DealFilters,
  now: BaliNow
): Array<DealRecord> {
  const resolvedDay = resolveDayFilter(filters.day, now)
  const queryTokens = normalizeQuery(filters.query)
  const filtered = catalog.filter((deal) => {
    if (resolvedDay && !deal.days.includes(resolvedDay)) {
      return false
    }

    if (filters.kind !== "all" && deal.kind !== filters.kind) {
      return false
    }

    if (
      filters.timeBucket !== "all" &&
      deal.timeBucket !== filters.timeBucket
    ) {
      return false
    }

    if (
      filters.priceBands.length > 0 &&
      !filters.priceBands.includes(deal.priceBand)
    ) {
      return false
    }

    if (deal.minPriceK !== null && deal.minPriceK > filters.maxPriceK) {
      return false
    }

    if (filters.withMapOnly && deal.mapLinks.length === 0) {
      return false
    }

    if (filters.everydayOnly && deal.recurrence !== "everyday") {
      return false
    }

    if (filters.openNow && !isDealOpenAt(deal, now)) {
      return false
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.some((category) => deal.categories.includes(category))
    ) {
      return false
    }

    if (
      queryTokens.length > 0 &&
      !queryTokens.every((token) =>
        deal.searchText.toLowerCase().includes(token)
      )
    ) {
      return false
    }

    return true
  })

  return sortDeals(filtered, filters.sort, now)
}

export function buildFacetCounts(catalog: ReadonlyArray<DealRecord>) {
  const categories = new Map<string, number>()
  const days = new Map<DayName, number>()
  const timeBuckets = new Map<TimeBucket, number>()
  const priceBands = new Map<PriceBand, number>()

  for (const deal of catalog) {
    for (const category of deal.categories) {
      categories.set(category, (categories.get(category) ?? 0) + 1)
    }

    for (const day of deal.days) {
      days.set(day, (days.get(day) ?? 0) + 1)
    }

    timeBuckets.set(
      deal.timeBucket,
      (timeBuckets.get(deal.timeBucket) ?? 0) + 1
    )
    priceBands.set(deal.priceBand, (priceBands.get(deal.priceBand) ?? 0) + 1)
  }

  return { categories, days, timeBuckets, priceBands }
}

export function summarizeDeals(catalog: ReadonlyArray<DealRecord>) {
  const places = new Set(catalog.map((deal) => deal.placeName))
  const withMaps = catalog.filter((deal) => deal.mapLinks.length > 0).length
  const everyday = catalog.filter(
    (deal) => deal.recurrence === "everyday"
  ).length
  const events = catalog.filter((deal) => deal.kind === "event").length
  const dayCounts = buildFacetCounts(catalog).days
  let busiestDay: DayName = "Monday"
  let busiestDayCount = 0

  for (const [day, count] of dayCounts) {
    if (count > busiestDayCount) {
      busiestDay = day
      busiestDayCount = count
    }
  }

  return {
    totalDeals: catalog.length,
    uniquePlaces: places.size,
    withMaps,
    everyday,
    events,
    busiestDay,
    busiestDayCount,
  }
}

export function formatKind(kind: DealKind) {
  switch (kind) {
    case "happy-hour":
      return "Happy hour"
    case "food-promo":
      return "Food"
    case "event":
      return "Event"
    case "deal":
      return "Deal"
  }
}

export function formatDays(deal: Pick<DealRecord, "days" | "daysRaw">) {
  if (deal.days.length === DAYS.length) {
    return "Every day"
  }

  if (deal.days.length === 0) {
    return deal.daysRaw || "Schedule varies"
  }

  return deal.days.map((day) => DAY_LABELS[day]).join(", ")
}

export function getMapEmbedUrl(deal: Pick<DealRecord, "mapSearchQuery">) {
  return `https://www.google.com/maps?q=${encodeURIComponent(deal.mapSearchQuery)}&output=embed`
}

export function getMapsSearchUrl(
  deal: Pick<DealRecord, "mapLinks" | "mapSearchQuery">
) {
  return (
    deal.mapLinks[0] ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deal.mapSearchQuery)}`
  )
}

export function getReviewsUrl(
  deal: Pick<DealRecord, "mapLinks" | "mapSearchQuery">
) {
  const base = getMapsSearchUrl(deal)

  return base.includes("google.com/maps")
    ? `${base}${base.includes("?") ? "&" : "?"}hl=en`
    : base
}

export function isDealOpenAt(deal: DealRecord, now: BaliNow) {
  if (!deal.days.includes(now.day)) {
    return false
  }

  if (deal.timeBucket === "all-day") {
    return true
  }

  if (deal.startMinutes === null && deal.endMinutes === null) {
    return false
  }

  if (deal.startMinutes !== null && deal.endMinutes === null) {
    return now.minutes >= deal.startMinutes
  }

  if (deal.startMinutes === null && deal.endMinutes !== null) {
    return now.minutes <= deal.endMinutes
  }

  if (deal.startMinutes === null || deal.endMinutes === null) {
    return false
  }

  if (deal.crossesMidnight) {
    return now.minutes >= deal.startMinutes || now.minutes <= deal.endMinutes
  }

  return now.minutes >= deal.startMinutes && now.minutes <= deal.endMinutes
}

export function updateFilters(
  filters: DealFilters,
  patch: Partial<DealFilters>
): DealFilters {
  return { ...filters, ...patch }
}

export function toggleListValue<T extends string>(
  values: ReadonlyArray<T>,
  value: T
) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

function normalizeQuery(query: string) {
  return query
    .toLowerCase()
    .trim()
    .split(SEARCH_TOKEN_SEPARATOR)
    .filter(Boolean)
}

function sortDeals(
  dealsToSort: Array<DealRecord>,
  sort: SortMode,
  now: BaliNow
) {
  const sorted = [...dealsToSort]

  sorted.sort((a, b) => {
    switch (sort) {
      case "soonest":
        return (
          soonestValue(a, now) - soonestValue(b, now) ||
          a.placeName.localeCompare(b.placeName)
        )
      case "lowest-price":
        return (
          priceValue(a) - priceValue(b) ||
          a.placeName.localeCompare(b.placeName)
        )
      case "place":
        return (
          a.placeName.localeCompare(b.placeName) || a.deal.localeCompare(b.deal)
        )
      case "recommended":
        return (
          recommendedScore(b, now) - recommendedScore(a, now) ||
          a.placeName.localeCompare(b.placeName)
        )
    }
  })

  return sorted
}

function recommendedScore(deal: DealRecord, now: BaliNow) {
  let score = 0

  if (deal.days.includes(now.day)) score += 12
  if (deal.mapLinks.length > 0) score += 6
  if (deal.recurrence === "everyday") score += 4
  if (deal.timeBucket !== "anytime") score += 3
  if (deal.kind === "event") score += 2
  if (deal.priceBand === "free" || deal.priceBand === "under-50k") score += 3
  if (deal.priceBand === "discount") score += 2
  if (deal.qualityFlags.includes("schedule-detail")) score -= 2

  const startsSoon = soonestValue(deal, now)
  if (startsSoon < 180) score += 4
  if (startsSoon < 60) score += 3

  return score
}

function soonestValue(deal: DealRecord, now: BaliNow) {
  if (!deal.days.includes(now.day)) {
    return 60 * 24
  }

  if (deal.timeBucket === "all-day") {
    return 0
  }

  if (deal.startMinutes === null) {
    return 60 * 24 - 1
  }

  const delta = deal.startMinutes - now.minutes
  return delta >= 0 ? delta : delta + 60 * 24
}

function priceValue(deal: DealRecord) {
  if (deal.minPriceK !== null) {
    return deal.minPriceK
  }

  if (deal.priceBand === "free") {
    return 0
  }

  if (deal.priceBand === "discount") {
    return 25
  }

  return 999
}
