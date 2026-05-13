import { RiExternalLinkLine, RiMapPin2Line, RiStarLine } from "@remixicon/react"

import type { DealRecord } from "@/domain/deals"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  formatDays,
  getMapEmbedUrl,
  getMapsSearchUrl,
  getReviewsUrl,
} from "@/domain/deals"

interface MapPanelProps {
  deal: DealRecord | null
}

export function MapPanel({ deal }: MapPanelProps) {
  if (!deal) {
    return (
      <Card className="sticky top-4" size="sm">
        <CardHeader>
          <CardTitle>Map & Reviews</CardTitle>
          <CardDescription>No deal selected.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const mapsUrl = getMapsSearchUrl(deal)
  const reviewsUrl = getReviewsUrl(deal)

  return (
    <Card className="sticky top-4" size="sm">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <iframe
          key={deal.id}
          title={`Map for ${deal.placeName}`}
          src={getMapEmbedUrl(deal)}
          className="h-full w-full border-0 grayscale-[0.15]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-base">
          {deal.placeName}
        </CardTitle>
        <CardDescription>
          {formatDays(deal)} · {deal.timeDisplay}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm leading-6 text-foreground/85">
          {deal.deal}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="default" size="sm">
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <RiMapPin2Line />
              Maps
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={reviewsUrl} target="_blank" rel="noreferrer">
              <RiStarLine />
              Reviews
            </a>
          </Button>
        </div>
        {deal.mapLinks.length > 1 ? (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Locations
            </p>
            {deal.mapLinks.slice(0, 4).map((link, index) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 text-xs text-muted-foreground hover:text-foreground"
              >
                <span>Google Maps link {index + 1}</span>
                <RiExternalLinkLine className="size-3" />
              </a>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
