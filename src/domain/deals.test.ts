import { describe, expect, it } from "vitest"

import type { BaliNow } from "@/domain/deals"
import {
  catalogStats,
  deals,
  defaultFilters,
  filterAndSortDeals,
  getBaliNow,
  getMapsSearchUrl,
} from "@/domain/deals"

describe("deal catalog", () => {
  const wednesdayNoon: BaliNow = {
    day: "Wednesday",
    minutes: 12 * 60,
    label: "Wed 12:00",
  }

  it("contains the expected catalog coverage", () => {
    expect(catalogStats.totalDeals).toBe(630)
    expect(catalogStats.uniquePlaces).toBe(266)
    expect(catalogStats.collections).toMatchObject({
      "Daily Food Promos": 154,
      "Daily Happy Hours": 108,
      Wednesday: 69,
    })
  })

  it("filters by day, kind, query, and price ceiling together", () => {
    const results = filterAndSortDeals(
      deals,
      {
        ...defaultFilters,
        day: "Wednesday",
        kind: "food-promo",
        maxPriceK: 100,
        query: "oyster",
        sort: "place",
      },
      wednesdayNoon
    )

    expect(results.length).toBeGreaterThan(0)
    expect(
      results.every(
        (deal) =>
          deal.days.includes("Wednesday") &&
          deal.kind === "food-promo" &&
          deal.searchText.toLowerCase().includes("oyster") &&
          (deal.minPriceK === null || deal.minPriceK <= 100)
      )
    ).toBe(true)
  })

  it("builds a Google Maps search URL when an entry has no direct map link", () => {
    const missingMapDeal = deals.find((deal) => deal.mapLinks.length === 0)

    if (!missingMapDeal) {
      throw new Error("Expected at least one catalog entry without a map link")
    }

    expect(getMapsSearchUrl(missingMapDeal)).toContain(
      "https://www.google.com/maps/search/"
    )
  })

  it("resolves the Bali-local weekday from a fixed instant", () => {
    expect(getBaliNow(new Date("2026-05-13T00:30:00.000Z"))).toMatchObject({
      day: "Wednesday",
      label: "Wed 08:30",
    })
  })
})
