import {
  RiCalendarLine,
  RiMapPin2Line,
  RiRestaurant2Line,
  RiTimeLine,
} from "@remixicon/react"

import type { BaliNow } from "@/domain/deals"
import { catalogStats } from "@/domain/deals"
import { cn } from "@/lib/utils"

interface InsightStripProps {
  filteredCount: number
  now: BaliNow
  className?: string
}

export function InsightStrip({
  filteredCount,
  now,
  className,
}: InsightStripProps) {
  const stats = [
    {
      label: "Deals",
      value: catalogStats.totalDeals.toLocaleString(),
      detail: `${filteredCount.toLocaleString()} visible`,
      icon: RiRestaurant2Line,
      tone: "text-emerald-700 bg-emerald-500/10",
    },
    {
      label: "Places",
      value: catalogStats.uniquePlaces.toLocaleString(),
      detail: `${catalogStats.multiLocationDeals} multi-location`,
      icon: RiMapPin2Line,
      tone: "text-sky-700 bg-sky-500/10",
    },
    {
      label: "Bali time",
      value: now.label,
      detail: "Asia/Makassar",
      icon: RiTimeLine,
      tone: "text-amber-700 bg-amber-500/10",
    },
    {
      label: "Largest lane",
      value: "Food",
      detail: `${catalogStats.collections["Daily Food Promos"]} daily food promos`,
      icon: RiCalendarLine,
      tone: "text-rose-700 bg-rose-500/10",
    },
  ] as const

  return (
    <section
      className={cn(
        "grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div key={stat.label} className="min-w-0 bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 truncate text-xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {stat.detail}
                </p>
              </div>
              <div
                className={cn(
                  "grid size-9 shrink-0 place-items-center",
                  stat.tone
                )}
              >
                <Icon className="size-4" />
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
