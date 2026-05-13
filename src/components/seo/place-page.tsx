import {
  RiArrowRightLine,
  RiCalendarLine,
  RiMapPin2Line,
  RiPriceTag3Line,
  RiStarLine,
  RiTimeLine,
} from "@remixicon/react"

import type { ReactNode } from "react"
import type { DealRecord } from "@/domain/deals"
import type { PlaceProfile } from "@/domain/places"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDays, formatKind } from "@/domain/deals"
import { placeDescription, placePath, similarPlaces } from "@/domain/places"
import { getDealExternalLinks, placeJsonLd, seoPages } from "@/domain/seo"

interface PlacePageProps {
  place: PlaceProfile
}

export function PlacePage({ place }: PlacePageProps) {
  const relatedPlaces = similarPlaces(place)
  const { mapsUrl, reviewsUrl } = getPlaceExternalLinks(place)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <JsonLd data={placeJsonLd(place)} />
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-10 md:grid-cols-[minmax(0,1fr)_320px] md:px-6 md:py-14">
          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
            >
              <a href="/" className="hover:text-foreground">
                Bali Deals
              </a>{" "}
              / <span>{place.name}</span>
            </nav>
            <p className="mt-7 text-xs font-semibold tracking-[0.28em] text-primary uppercase">
              Canggu venue
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              {place.name} deals
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {placeDescription(place)}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <a href="#deals">
                  View deals
                  <RiArrowRightLine />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  <RiMapPin2Line />
                  Map
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href={reviewsUrl} target="_blank" rel="noreferrer">
                  <RiStarLine />
                  Reviews
                </a>
              </Button>
            </div>
          </div>

          <section className="grid gap-px border border-border bg-border">
            <Stat label="Deals" value={place.deals.length.toLocaleString()} />
            <Stat label="Daily" value={place.dailyDealCount.toLocaleString()} />
            <Stat label="Days" value={place.days.length.toLocaleString()} />
            <Stat
              label="Categories"
              value={place.categories.length.toLocaleString()}
            />
          </section>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section id="deals" className="min-w-0 space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              All known promos at {place.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedules, prices, maps, and review links grouped into one
              shareable venue page.
            </p>
          </div>

          <div className="grid gap-4">
            {place.deals.map((deal) => (
              <PlaceDeal key={deal.id} deal={deal} />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <InfoPanel title="Runs on">
            <div className="flex flex-wrap gap-2">
              {place.days.map((day) => (
                <Badge key={day} variant="secondary">
                  {day}
                </Badge>
              ))}
            </div>
          </InfoPanel>

          <InfoPanel title="Good for">
            <div className="flex flex-wrap gap-2">
              {place.categories.slice(0, 10).map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </InfoPanel>

          {place.aliases.length > 1 ? (
            <InfoPanel title="Also listed as">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {place.aliases.map((alias) => (
                  <li key={alias}>{alias}</li>
                ))}
              </ul>
            </InfoPanel>
          ) : null}

          <InfoPanel title="Related places">
            <nav
              aria-label={`Places similar to ${place.name}`}
              className="grid"
            >
              {relatedPlaces.map((relatedPlace) => (
                <a
                  key={relatedPlace.slug}
                  href={placePath(relatedPlace)}
                  className="border-t border-border py-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {relatedPlace.name}
                </a>
              ))}
            </nav>
          </InfoPanel>

          <InfoPanel title="Popular guides">
            <nav aria-label="Popular Bali Deals guides" className="grid">
              {seoPages.slice(0, 8).map((page) => (
                <a
                  key={page.id}
                  href={page.path}
                  className="border-t border-border py-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {page.shortTitle}
                </a>
              ))}
            </nav>
          </InfoPanel>
        </aside>
      </div>
    </main>
  )
}

function PlaceDeal({ deal }: { deal: DealRecord }) {
  const { mapsUrl, reviewsUrl } = getDealExternalLinks(deal)

  return (
    <article className="border border-border bg-card p-5">
      <div className="flex flex-wrap gap-2">
        <Badge>{formatKind(deal.kind)}</Badge>
        {deal.recurrence === "everyday" ? (
          <Badge variant="secondary">Daily</Badge>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-tight">{deal.deal}</h3>
      <dl className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
        <Fact icon={RiCalendarLine} label={formatDays(deal)} />
        <Fact icon={RiTimeLine} label={deal.timeDisplay} />
        <Fact icon={RiPriceTag3Line} label={deal.priceRaw || "Price varies"} />
      </dl>
      {deal.categories.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {deal.categories.slice(0, 6).map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      ) : null}
      {deal.notes ? (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {deal.notes}
        </p>
      ) : null}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-4">
      <p className="text-[0.68rem] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}

function InfoPanel({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="border border-border bg-card p-4">
      <h2 className="text-sm font-semibold tracking-widest uppercase">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Fact({
  icon: Icon,
  label,
}: {
  icon: typeof RiCalendarLine
  label: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-primary" />
      <span className="truncate">{label}</span>
    </div>
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

function getPlaceExternalLinks(place: PlaceProfile) {
  return getDealExternalLinks(place.deals[0])
}
