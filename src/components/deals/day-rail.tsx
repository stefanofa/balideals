import type { BaliNow, DayFilter, DayName } from "@/domain/deals"
import { Button } from "@/components/ui/button"
import { DAYS, DAY_LABELS } from "@/domain/deals"
import { cn } from "@/lib/utils"

interface DayRailProps {
  value: DayFilter
  counts: Map<DayName, number>
  now: BaliNow
  onChange: (day: DayFilter) => void
  className?: string
}

export function DayRail({
  value,
  counts,
  now,
  onChange,
  className,
}: DayRailProps) {
  const items: Array<{ value: DayFilter; label: string; count?: number }> = [
    { value: "all", label: "All" },
    {
      value: "today",
      label: `Today ${DAY_LABELS[now.day]}`,
      count: counts.get(now.day),
    },
    ...DAYS.map((day) => ({
      value: day,
      label: DAY_LABELS[day],
      count: counts.get(day),
    })),
  ]

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex min-w-max gap-2">
        {items.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant={value === item.value ? "default" : "outline"}
            size="sm"
            aria-pressed={value === item.value}
            onClick={() => onChange(item.value)}
            className="min-w-16 justify-between"
          >
            <span>{item.label}</span>
            {item.count ? (
              <span className="text-[0.65rem] opacity-70">{item.count}</span>
            ) : null}
          </Button>
        ))}
      </div>
    </div>
  )
}
