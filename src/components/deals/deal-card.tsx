import {
  RiCalendarLine,
  RiMapPin2Line,
  RiPriceTag3Line,
  RiStarLine,
  RiTimeLine,
} from "@remixicon/react"

import type { DealRecord } from "@/domain/deals"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  formatDays,
  formatKind,
  getMapsSearchUrl,
  getReviewsUrl,
} from "@/domain/deals"
import { placePathForName } from "@/domain/places"
import { cn } from "@/lib/utils"

interface DealCardProps {
  deal: DealRecord
  selected: boolean
  onSelect: (deal: DealRecord) => void
}

export function DealCard({ deal, selected, onSelect }: DealCardProps) {
  const mapsUrl = getMapsSearchUrl(deal)
  const reviewsUrl = getReviewsUrl(deal)

  return (
    <article
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      onClick={() => onSelect(deal)}
      onKeyDown={(event) => {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("a,button")
        ) {
          return
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect(deal)
        }
      }}
      className={cn(
        "group min-h-72 border border-border bg-card p-5 text-left shadow-sm transition outline-none hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary/70 ring-2 ring-primary/30"
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className={cn("px-2 py-1", kindTone(deal.kind))}>
              {formatKind(deal.kind)}
            </Badge>
            {deal.recurrence === "everyday" ? (
              <Badge className="bg-sky-500/10 px-2 py-1 text-sky-800">
                Daily
              </Badge>
            ) : null}
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
            <a
              href={placePathForName(deal.placeName)}
              className="transition hover:text-primary"
              onClick={(event) => event.stopPropagation()}
            >
              {deal.placeName}
            </a>
          </h3>
        </div>
        <div className="grid size-9 shrink-0 place-items-center bg-primary/10 text-primary">
          {deal.kind === "happy-hour" ? (
            <RiStarLine className="size-4" />
          ) : (
            <RiMapPin2Line className="size-4" />
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-4 text-sm leading-6 text-foreground/85">
        {deal.deal}
      </p>

      <dl className="mt-5 grid gap-2 text-xs text-muted-foreground">
        <Fact icon={RiCalendarLine} label={formatDays(deal)} />
        <Fact
          icon={RiTimeLine}
          label={
            deal.timeQualifier
              ? `${deal.timeDisplay} · ${deal.timeQualifier}`
              : deal.timeDisplay
          }
        />
        <Fact icon={RiPriceTag3Line} label={deal.priceRaw || "Price varies"} />
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        {deal.categories.slice(0, 4).map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="bg-muted px-2 py-1 text-muted-foreground"
          >
            {category}
          </Badge>
        ))}
      </div>

      {deal.notes || deal.qualityFlags.length > 0 ? (
        <p className="mt-4 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {deal.notes ||
            deal.qualityFlags.slice(0, 2).map(formatFlag).join(" · ")}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild size="xs" variant="outline">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            <RiMapPin2Line />
            Map
          </a>
        </Button>
        <Button asChild size="xs" variant="ghost">
          <a
            href={reviewsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            <RiStarLine />
            Reviews
          </a>
        </Button>
      </div>
    </article>
  )
}

interface FactProps {
  icon: typeof RiCalendarLine
  label: string
}

function Fact({ icon: Icon, label }: FactProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-primary" />
      <span className="truncate">{label}</span>
    </div>
  )
}

function kindTone(kind: DealRecord["kind"]) {
  switch (kind) {
    case "happy-hour":
      return "bg-emerald-500/10 text-emerald-800"
    case "food-promo":
      return "bg-orange-500/10 text-orange-800"
    case "event":
      return "bg-violet-500/10 text-violet-800"
    case "deal":
      return "bg-muted text-muted-foreground"
  }
}

function formatFlag(flag: string) {
  return flag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
