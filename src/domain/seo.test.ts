import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  canonicalUrl,
  featuredDealsForPage,
  homeHead,
  routeHead,
  seoPage,
  seoPages,
  siteConfig,
} from "@/domain/seo"
import { placePath, places } from "@/domain/places"

describe("SEO configuration", () => {
  it("defines unique crawlable landing pages", () => {
    expect(seoPages.length).toBe(14)
    expect(new Set(seoPages.map((page) => page.path)).size).toBe(
      seoPages.length
    )
    expect(seoPages.map((page) => page.path)).toContain("/happy-hours")
    expect(seoPages.map((page) => page.path)).toContain("/deals/sunday")
  })

  it("uses absolute canonical URLs and page-specific metadata", () => {
    const page = seoPage("food-deals")
    const head = routeHead(page)

    expect(head.links).toContainEqual({
      rel: "canonical",
      href: canonicalUrl("/food-deals"),
    })
    expect(head.meta).toContainEqual({ title: page.title })
    expect(head.meta).toContainEqual({
      name: "description",
      content: page.description,
    })
    expect(homeHead().links).toContainEqual({
      rel: "canonical",
      href: siteConfig.url,
    })
  })

  it("has featured deals for high-intent pages", () => {
    expect(featuredDealsForPage(seoPage("happy-hours")).length).toBeGreaterThan(
      0
    )
    expect(
      featuredDealsForPage(seoPage("coffee-deals")).length
    ).toBeGreaterThan(0)
  })

  it("lists every canonical landing page in the sitemap and robots file", () => {
    const sitemap = readPublicFile("sitemap.xml")
    const robots = readPublicFile("robots.txt")

    expect(sitemap).toContain(canonicalUrl("/"))
    for (const page of seoPages) {
      expect(sitemap).toContain(canonicalUrl(page.path))
    }
    for (const place of places) {
      expect(sitemap).toContain(canonicalUrl(placePath(place)))
    }

    expect(robots).toContain(`Sitemap: ${canonicalUrl("/sitemap.xml")}`)
    expect(robots).toContain("Disallow: /*?*")
  })
})

function readPublicFile(name: string) {
  return readFileSync(join(process.cwd(), "public", name), "utf8")
}
