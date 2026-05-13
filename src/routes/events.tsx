import { createFileRoute } from "@tanstack/react-router"

import { SeoLandingPage } from "@/components/seo/seo-landing-page"
import { routeHead, seoPage } from "@/domain/seo"

const page = seoPage("events")

export const Route = createFileRoute("/events")({
  head: () => routeHead(page),
  component: () => <SeoLandingPage page={page} />,
})
