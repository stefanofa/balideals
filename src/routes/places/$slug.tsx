import { createFileRoute } from "@tanstack/react-router"

import { PlacePage } from "@/components/seo/place-page"
import { getPlaceBySlug } from "@/domain/places"
import { placeHead } from "@/domain/seo"

export const Route = createFileRoute("/places/$slug")({
  head: ({ params }) => {
    const place = getPlaceBySlug(params.slug)

    if (!place) {
      return {
        meta: [
          { title: "Place not found | Bali Deals" },
          { name: "robots", content: "noindex" },
        ],
      }
    }

    return placeHead(place)
  },
  component: PlaceRoute,
})

function PlaceRoute() {
  const { slug } = Route.useParams()
  const place = getPlaceBySlug(slug)

  if (!place) {
    return (
      <main className="grid min-h-svh place-items-center bg-background px-4 text-foreground">
        <section className="max-w-md border border-border bg-card p-6 text-center">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Missing venue
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Place not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This venue page is not in the current Bali Deals catalog.
          </p>
          <a
            href="/"
            className="mt-5 inline-flex h-9 items-center justify-center bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Browse deals
          </a>
        </section>
      </main>
    )
  }

  return <PlacePage place={place} />
}
