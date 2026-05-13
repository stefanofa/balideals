import type { DealFilters, DealRecord } from "@/domain/deals"
import {
  DAYS,
  DAY_LABELS,
  deals,
  defaultFilters,
  filterAndSortDeals,
  formatDays,
  getBaliNow,
  getMapsSearchUrl,
  getReviewsUrl,
} from "@/domain/deals"

const siteUrl = "https://balideals.com"

export const siteConfig = {
  name: "Bali Deals",
  area: "Canggu, Bali",
  url: siteUrl,
  image: `${siteUrl}/og-image.svg`,
  description:
    "Find Canggu food promos, happy hours, drink specials, coffee deals, and local events by day, price, time, and venue.",
  keywords: [
    "Bali deals",
    "Canggu deals",
    "Canggu happy hour",
    "Bali food promos",
    "Canggu food deals",
    "Canggu events",
  ],
} as const

export interface SeoPage {
  id: string
  path: string
  title: string
  shortTitle: string
  description: string
  eyebrow: string
  heading: string
  intro: string
  filters: Partial<DealFilters>
  keywords: Array<string>
}

const topicPages = [
  {
    id: "happy-hours",
    path: "/happy-hours",
    title: "Best Happy Hours in Canggu | Bali Deals",
    shortTitle: "Happy hours",
    description:
      "Browse Canggu happy hours, cocktail deals, beer buckets, wine promos, and late-night drink specials with maps and review links.",
    eyebrow: "Drinks",
    heading: "Best happy hours in Canggu",
    intro:
      "Cocktails, beers, wine, and late-night drinks organized by schedule, price, and venue so you can plan the right stop fast.",
    filters: { day: "all", kind: "happy-hour" },
    keywords: ["Canggu happy hour", "Bali drink deals", "Canggu cocktails"],
  },
  {
    id: "food-deals",
    path: "/food-deals",
    title: "Canggu Food Deals and Restaurant Promos | Bali Deals",
    shortTitle: "Food deals",
    description:
      "Find Canggu restaurant deals, brunch promos, tacos, burgers, coffee, pizza, seafood, BOGO offers, and set-menu specials.",
    eyebrow: "Food",
    heading: "Canggu food deals and restaurant promos",
    intro:
      "Daily specials, weekday-only menus, BOGO offers, and price-led food promos across Canggu cafes, bars, and restaurants.",
    filters: { day: "all", kind: "food-promo" },
    keywords: ["Canggu food deals", "Bali restaurant promos", "Canggu brunch"],
  },
  {
    id: "events",
    path: "/events",
    title: "Canggu Events, Live Music and Weekly Specials | Bali Deals",
    shortTitle: "Events",
    description:
      "Discover Canggu events, trivia nights, live music, DJ nights, Sunday sessions, and venue specials with maps and review links.",
    eyebrow: "Events",
    heading: "Canggu events and weekly specials",
    intro:
      "A focused index of weekly happenings, venue nights, and event-led promos around Canggu.",
    filters: { day: "all", kind: "event" },
    keywords: ["Canggu events", "Bali live music", "Canggu weekly events"],
  },
  {
    id: "daily-deals",
    path: "/daily-deals",
    title: "Daily Deals in Canggu | Bali Deals",
    shortTitle: "Daily deals",
    description:
      "Browse daily Canggu deals that run throughout the week, including happy hours, food promos, coffee, beer, and cocktail specials.",
    eyebrow: "Every day",
    heading: "Daily deals in Canggu",
    intro:
      "A compact view of deals that are available every day, useful when you do not want to plan around a specific weekday.",
    filters: { day: "all", everydayOnly: true },
    keywords: ["daily Canggu deals", "everyday Bali deals", "Canggu promos"],
  },
  {
    id: "coffee-deals",
    path: "/coffee-deals",
    title: "Coffee Deals in Canggu | Bali Deals",
    shortTitle: "Coffee",
    description:
      "Find Canggu coffee deals, breakfast coffee promos, cafe specials, and low-price caffeine stops around Bali.",
    eyebrow: "Coffee",
    heading: "Coffee deals in Canggu",
    intro:
      "Cafe promos and coffee-led specials for early starts, laptop days, and low-effort meetups.",
    filters: { day: "all", categories: ["Coffee"] },
    keywords: ["Canggu coffee deals", "Bali cafes", "Canggu cafe promos"],
  },
  {
    id: "brunch-deals",
    path: "/brunch-deals",
    title: "Breakfast and Brunch Deals in Canggu | Bali Deals",
    shortTitle: "Brunch",
    description:
      "Plan breakfast and brunch in Canggu with cafe promos, set menus, coffee combos, and morning food specials.",
    eyebrow: "Morning",
    heading: "Breakfast and brunch deals in Canggu",
    intro:
      "Morning and midday specials for brunch, breakfast plates, coffee pairings, and easy cafe planning.",
    filters: { day: "all", categories: ["Breakfast + Brunch"] },
    keywords: ["Canggu brunch deals", "Canggu breakfast", "Bali brunch"],
  },
  {
    id: "taco-deals",
    path: "/taco-deals",
    title: "Taco and Mexican Deals in Canggu | Bali Deals",
    shortTitle: "Tacos",
    description:
      "Find taco deals, Mexican food promos, margarita specials, and Canggu venues with tacos and drinks.",
    eyebrow: "Mexican",
    heading: "Taco and Mexican deals in Canggu",
    intro:
      "Taco nights, Mexican food promos, margarita pairings, and related Canggu specials in one crawlable guide.",
    filters: { day: "all", categories: ["Tacos + Mexican"] },
    keywords: ["Canggu taco deals", "Canggu Mexican food", "Bali tacos"],
  },
] as const satisfies ReadonlyArray<SeoPage>

const dayPages = DAYS.map((day) => ({
  id: day.toLowerCase(),
  path: `/deals/${day.toLowerCase()}`,
  title: `${day} Deals in Canggu | Bali Deals`,
  shortTitle: `${DAY_LABELS[day]} deals`,
  description: `Find ${day} Canggu food deals, happy hours, drink specials, events, and restaurant promos with maps and review links.`,
  eyebrow: day,
  heading: `${day} deals in Canggu`,
  intro:
    "Food, drinks, and events grouped by weekday so you can plan around the deals actually running that day.",
  filters: { day },
  keywords: [`${day} Canggu deals`, `${day} Bali deals`, "Canggu promos"],
})) satisfies ReadonlyArray<SeoPage>

export const seoPages = [...topicPages, ...dayPages] as const

export function canonicalUrl(path: string) {
  return `${siteConfig.url}${path === "/" ? "" : path}`
}

export function findSeoPage(id: string) {
  return seoPages.find((page) => page.id === id)
}

export function seoPage(id: string) {
  const page = findSeoPage(id)

  if (!page) {
    throw new Error(`Unknown SEO page: ${id}`)
  }

  return page
}

export function featuredDealsForPage(page: SeoPage, limit = 12) {
  const filters: DealFilters = {
    ...defaultFilters,
    day: "all",
    sort: "recommended",
    ...page.filters,
  }

  return filterAndSortDeals(deals, filters, getBaliNow()).slice(0, limit)
}

export function routeHead(page: SeoPage) {
  return {
    meta: pageMeta({
      title: page.title,
      description: page.description,
      path: page.path,
      keywords: page.keywords,
    }),
    links: [{ rel: "canonical", href: canonicalUrl(page.path) }],
  }
}

export function homeHead() {
  return {
    meta: pageMeta({
      title: "Bali Deals | Canggu Food Promos, Happy Hours and Events",
      description: siteConfig.description,
      path: "/",
      keywords: [...siteConfig.keywords],
    }),
    links: [{ rel: "canonical", href: canonicalUrl("/") }],
  }
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: "en",
  description: siteConfig.description,
  about: ["food promos", "happy hours", "restaurant deals", "local events"],
  areaServed: {
    "@type": "Place",
    name: siteConfig.area,
  },
}

export function landingPageJsonLd(
  page: SeoPage,
  featuredDeals: Array<DealRecord>,
) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: page.heading,
      description: page.description,
      url: canonicalUrl(page.path),
      isPartOf: {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      about: page.keywords,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteConfig.name,
          item: canonicalUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.shortTitle,
          item: canonicalUrl(page.path),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.heading,
      numberOfItems: featuredDeals.length,
      itemListElement: featuredDeals.map((deal, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          name: `${deal.placeName}: ${deal.deal}`,
          description: `${formatDays(deal)} · ${deal.timeDisplay} · ${
            deal.priceRaw || "Price varies"
          }`,
          availability: "https://schema.org/InStoreOnly",
          areaServed: siteConfig.area,
          url: getMapsSearchUrl(deal),
        },
      })),
    },
  ]
}

export function getDealExternalLinks(deal: DealRecord) {
  return {
    mapsUrl: getMapsSearchUrl(deal),
    reviewsUrl: getReviewsUrl(deal),
  }
}

function pageMeta({
  title,
  description,
  path,
  keywords,
}: {
  title: string
  description: string
  path: string
  keywords: Array<string>
}) {
  const url = canonicalUrl(path)

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { name: "robots", content: "index,follow,max-image-preview:large" },
    { property: "og:site_name", content: siteConfig.name },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: siteConfig.image },
    { property: "og:image:alt", content: "Bali Deals Canggu guide preview" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: siteConfig.image },
  ]
}
