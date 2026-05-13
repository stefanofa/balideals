import { createFileRoute } from "@tanstack/react-router"

import { SeoLandingPage } from "@/components/seo/seo-landing-page"
import { routeHead, seoPage } from "@/domain/seo"

const page = seoPage("monday")

export const Route = createFileRoute("/deals/monday")({
  head: () => routeHead(page),
  component: () => <SeoLandingPage page={page} />,
})
