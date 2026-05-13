import { describe, expect, it } from "vitest"

import { deals } from "@/domain/deals"
import {
  getPlaceBySlug,
  placePath,
  placePathForName,
  places,
  slugifyPlaceName,
} from "@/domain/places"

describe("place catalog", () => {
  it("normalizes venue names into stable place pages", () => {
    expect(places).toHaveLength(256)
    expect(new Set(places.map((place) => place.slug)).size).toBe(places.length)
    expect(placePathForName("Black Sand Brewery")).toBe(
      "/places/black-sand-brewery"
    )
    expect(placePathForName("Lusa by/Suka")).toBe("/places/lusa-by-suka")
  })

  it("keeps spelling variants on the same page", () => {
    const place = getPlaceBySlug("lusa-by-suka")

    if (!place) {
      throw new Error("Expected Lusa by Suka to have a place page")
    }

    expect(place.aliases).toEqual(
      expect.arrayContaining(["Lusa By Suka", "Lusa by Suka", "Lusa by/Suka"])
    )
    expect(placePath(place)).toBe("/places/lusa-by-suka")
  })

  it("keeps every deal reachable through a place page", () => {
    for (const deal of deals) {
      const place = getPlaceBySlug(slugifyPlaceName(deal.placeName))

      expect(place).toBeDefined()
      expect(place?.deals).toContain(deal)
    }
  })
})
