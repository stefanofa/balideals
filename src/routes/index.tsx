import { createFileRoute } from "@tanstack/react-router"

import { DealExplorer } from "@/components/deals/deal-explorer"
import { homeHead } from "@/domain/seo"

export const Route = createFileRoute("/")({ head: homeHead, component: App })

function App() {
  return <DealExplorer />
}
