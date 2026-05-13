import { createFileRoute } from "@tanstack/react-router"

import { SeoLandingPage } from "@/components/seo/seo-landing-page"
import { routeHead, seoPage } from "@/domain/seo"

const page = seoPage("daily-deals")

export const Route = createFileRoute("/daily-deals")({
  head: () => routeHead(page),
  component: () => <SeoLandingPage page={page} />,
})
