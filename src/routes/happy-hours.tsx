import { createFileRoute } from "@tanstack/react-router"

import { SeoLandingPage } from "@/components/seo/seo-landing-page"
import { routeHead, seoPage } from "@/domain/seo"

const page = seoPage("happy-hours")

export const Route = createFileRoute("/happy-hours")({
  head: () => routeHead(page),
  component: () => <SeoLandingPage page={page} />,
})
