import { RiFilter3Line, RiResetLeftLine } from "@remixicon/react"

import type { DealFilters, PriceBand } from "@/domain/deals"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  FEATURED_CATEGORIES,
  PRICE_BAND_OPTIONS,
  TIME_BUCKET_OPTIONS,
  toggleListValue,
} from "@/domain/deals"
import { cn } from "@/lib/utils"

interface FilterPanelProps {
  filters: DealFilters
  categoryCounts: Map<string, number>
  priceCounts: Map<PriceBand, number>
  onChange: (filters: DealFilters) => void
  onReset: () => void
  className?: string
}

export function FilterPanel({
  filters,
  categoryCounts,
  priceCounts,
  onChange,
  onReset,
  className,
}: FilterPanelProps) {
  const patch = (next: Partial<DealFilters>) =>
    onChange({ ...filters, ...next })

  return (
    <aside className={cn("border border-border bg-card text-sm", className)}>
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-2">
          <RiFilter3Line className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-widest uppercase">
            Filters
          </h2>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onReset}>
          <RiResetLeftLine />
          <span className="sr-only">Reset filters</span>
        </Button>
      </div>

      <Separator />

      <div className="space-y-6 p-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Time of day
          </label>
          <Select
            value={filters.timeBucket}
            onValueChange={(value) =>
              patch({ timeBucket: value as DealFilters["timeBucket"] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_BUCKET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Max listed price
            </label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {filters.maxPriceK >= 300 ? "Any" : `${filters.maxPriceK}k`}
            </span>
          </div>
          <Slider
            value={[filters.maxPriceK]}
            min={0}
            max={300}
            step={10}
            onValueChange={(value) => patch({ maxPriceK: value[0] ?? 300 })}
          />
        </div>

        <FilterCheckbox
          id="open-now"
          checked={filters.openNow}
          label="Open now-ish"
          detail="Uses Bali local day and listed times"
          onChange={(checked) => patch({ openNow: checked })}
        />
        <FilterCheckbox
          id="with-map"
          checked={filters.withMapOnly}
          label="Has Google Maps"
          detail="Hides rows with missing map links"
          onChange={(checked) => patch({ withMapOnly: checked })}
        />
        <FilterCheckbox
          id="everyday-only"
          checked={filters.everydayOnly}
          label="Everyday only"
          detail="Daily happy hours and food promos"
          onChange={(checked) => patch({ everydayOnly: checked })}
        />

        <Separator />

        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Categories
          </h3>
          <div className="space-y-3">
            {FEATURED_CATEGORIES.map((category) => (
              <FilterCheckbox
                key={category}
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                label={category}
                detail={`${categoryCounts.get(category) ?? 0} deals`}
                onChange={() =>
                  patch({
                    categories: toggleListValue(filters.categories, category),
                  })
                }
              />
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Price tags
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {PRICE_BAND_OPTIONS.map((option) => (
              <FilterCheckbox
                key={option.value}
                id={`price-${option.value}`}
                checked={filters.priceBands.includes(option.value)}
                label={option.label}
                detail={`${priceCounts.get(option.value) ?? 0}`}
                onChange={() =>
                  patch({
                    priceBands: toggleListValue(
                      filters.priceBands,
                      option.value
                    ),
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

interface FilterCheckboxProps {
  id: string
  checked: boolean
  label: string
  detail?: string
  onChange: (checked: boolean) => void
}

function FilterCheckbox({
  id,
  checked,
  label,
  detail,
  onChange,
}: FilterCheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
        className="mt-0.5"
      />
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block truncate text-sm font-medium">{label}</span>
        {detail ? (
          <span className="block truncate text-xs text-muted-foreground">
            {detail}
          </span>
        ) : null}
      </label>
    </div>
  )
}
