import { createFileRoute } from "@tanstack/react-router"

import { DealExplorer } from "@/components/deals/deal-explorer"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return <DealExplorer />
}
