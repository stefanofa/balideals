import { RiArrowRightLine, RiMapPin2Line, RiStarLine } from "@remixicon/react"

import type { DealRecord } from "@/domain/deals"
import type { SeoPage } from "@/domain/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDays, formatKind } from "@/domain/deals"
import { placePathForName } from "@/domain/places"
import {
  featuredDealsForPage,
  getDealExternalLinks,
  landingPageJsonLd,
  seoPages,
  siteConfig,
} from "@/domain/seo"

interface SeoLandingPageProps {
  page: SeoPage
}

export function SeoLandingPage({ page }: SeoLandingPageProps) {
  const featuredDeals = featuredDealsForPage(page)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <JsonLd data={landingPageJsonLd(page, featuredDeals)} />
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-10 md:grid-cols-[minmax(0,1fr)_360px] md:px-6 md:py-14">
          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
            >
              <a href="/" className="hover:text-foreground">
                {siteConfig.name}
              </a>{" "}
              / <span>{page.shortTitle}</span>
            </nav>
            <p className="mt-7 text-xs font-semibold tracking-[0.28em] text-primary uppercase">
              {page.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              {page.heading}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {page.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <a href="/">
                  Explore the full guide
                  <RiArrowRightLine />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="#featured-deals">See featured deals</a>
              </Button>
            </div>
          </div>

          <img
            src="/og-image.svg"
            width="1200"
            height="630"
            alt="Bali Deals preview for Canggu food promos, happy hours, and events"
            className="aspect-[1200/630] w-full border border-border bg-background object-cover shadow-sm"
          />
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section id="featured-deals" className="min-w-0 space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Featured deals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A crawlable sample of matching places, schedules, prices, maps,
              and review links.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredDeals.map((deal) => (
              <FeaturedDeal key={deal.id} deal={deal} />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="border border-border bg-card p-4">
            <h2 className="text-sm font-semibold tracking-widest uppercase">
              Popular guides
            </h2>
            <nav aria-label="Popular Bali Deals pages" className="mt-3 grid">
              {seoPages.slice(0, 10).map((relatedPage) => (
                <a
                  key={relatedPage.id}
                  href={relatedPage.path}
                  className="border-t border-border py-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {relatedPage.shortTitle}
                </a>
              ))}
            </nav>
          </section>

          <section className="border border-border bg-card p-4">
            <h2 className="text-sm font-semibold tracking-widest uppercase">
              What this page covers
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {page.keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}

function FeaturedDeal({ deal }: { deal: DealRecord }) {
  const { mapsUrl, reviewsUrl } = getDealExternalLinks(deal)

  return (
    <article className="border border-border bg-card p-5">
      <div className="flex flex-wrap gap-2">
        <Badge>{formatKind(deal.kind)}</Badge>
        {deal.recurrence === "everyday" ? (
          <Badge variant="secondary">Daily</Badge>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-tight">
        <a
          href={placePathForName(deal.placeName)}
          className="hover:text-primary"
        >
          {deal.placeName}
        </a>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/85">
        {deal.deal}
      </p>
      <dl className="mt-4 grid gap-1 text-sm text-muted-foreground">
        <div>
          <dt className="sr-only">Schedule</dt>
          <dd>{formatDays(deal)}</dd>
        </div>
        <div>
          <dt className="sr-only">Time</dt>
          <dd>{deal.timeDisplay}</dd>
        </div>
        <div>
          <dt className="sr-only">Price</dt>
          <dd>{deal.priceRaw || "Price varies"}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild size="xs" variant="outline">
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            <RiMapPin2Line />
            Map
          </a>
        </Button>
        <Button asChild size="xs" variant="ghost">
          <a href={reviewsUrl} target="_blank" rel="noreferrer">
            <RiStarLine />
            Reviews
          </a>
        </Button>
      </div>
    </article>
  )
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
