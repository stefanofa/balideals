import { useEffect, useMemo, useState } from "react"
import { RiFilter3Line, RiSearchLine } from "@remixicon/react"

import type { DealFilters, KindFilter, SortMode } from "@/domain/deals"
import { DealCard } from "@/components/deals/deal-card"
import { DayRail } from "@/components/deals/day-rail"
import { FilterPanel } from "@/components/deals/filter-panel"
import { InsightStrip } from "@/components/deals/insight-strip"
import { MapPanel } from "@/components/deals/map-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  KIND_OPTIONS,
  QUICK_COLLECTIONS,
  SORT_OPTIONS,
  buildFacetCounts,
  catalogProfile,
  catalogStats,
  deals,
  defaultFilters,
  filterAndSortDeals,
  getBaliNow,
  summarizeDeals,
} from "@/domain/deals"
import { seoPages } from "@/domain/seo"

const INITIAL_LIMIT = 72
const LIMIT_STEP = 72

export function DealExplorer() {
  const [filters, setFilters] = useState<DealFilters>(defaultFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_LIMIT)
  const now = useMemo(() => getBaliNow(), [])
  const facets = useMemo(() => buildFacetCounts(deals), [])
  const fullSummary = useMemo(() => summarizeDeals(deals), [])
  const filteredDeals = useMemo(
    () => filterAndSortDeals(deals, filters, now),
    [filters, now]
  )
  const filteredSummary = useMemo(
    () => summarizeDeals(filteredDeals),
    [filteredDeals]
  )
  const visibleDeals = filteredDeals.slice(0, visibleLimit)
  const selectedDeal =
    filteredDeals.length === 0
      ? null
      : (filteredDeals.find((deal) => deal.id === selectedId) ??
        filteredDeals[0])
  const activeFilterCount = countActiveFilters(filters)

  useEffect(() => {
    setVisibleLimit(INITIAL_LIMIT)
  }, [filters])

  useEffect(() => {
    if (selectedDeal && selectedDeal.id !== selectedId) {
      setSelectedId(selectedDeal.id)
    }
  }, [selectedDeal, selectedId])

  const resetFilters = () => setFilters(defaultFilters)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-5 md:px-6">
        <InsightStrip filteredCount={filteredDeals.length} now={now} />

        <section className="border border-border bg-card p-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-end">
            <div className="min-w-0">
              <label
                htmlFor="deal-search"
                className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
              >
                Search places, deals, cuisines
              </label>
              <div className="relative mt-1">
                <RiSearchLine className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="deal-search"
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      query: event.target.value,
                    }))
                  }
                  className="pl-7"
                  placeholder="tacos, coffee, Black Sand, oysters..."
                />
              </div>
            </div>

            <Tabs
              value={filters.kind}
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  kind: value as KindFilter,
                }))
              }
              className="min-w-0"
            >
              <TabsList variant="line" className="w-full overflow-x-auto">
                {KIND_OPTIONS.map((option) => (
                  <TabsTrigger key={option.value} value={option.value}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex sm:items-end">
              <div className="min-w-40">
                <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Sort
                </label>
                <Select
                  value={filters.sort}
                  onValueChange={(value) =>
                    setFilters((current) => ({
                      ...current,
                      sort: value as SortMode,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <MobileFilters
                filters={filters}
                facets={facets}
                activeFilterCount={activeFilterCount}
                setFilters={setFilters}
                resetFilters={resetFilters}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_COLLECTIONS.map((collection) => (
              <Button
                key={collection.id}
                type="button"
                variant="outline"
                size="xs"
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    ...collection.patch,
                  }))
                }
              >
                {collection.label}
              </Button>
            ))}
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)_380px]">
          <FilterPanel
            filters={filters}
            categoryCounts={facets.categories}
            priceCounts={facets.priceBands}
            onChange={setFilters}
            onReset={resetFilters}
            className="hidden xl:sticky xl:top-4 xl:block xl:max-h-[calc(100svh-2rem)] xl:overflow-auto"
          />

          <section className="min-w-0 space-y-4">
            <DayRail
              value={filters.day}
              counts={facets.days}
              now={now}
              onChange={(day) => setFilters((current) => ({ ...current, day }))}
            />

            <div className="flex flex-col gap-2 border-y border-border py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">
                  {filteredDeals.length.toLocaleString()} deals across{" "}
                  {filteredSummary.uniquePlaces.toLocaleString()} places
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredSummary.withMaps.toLocaleString()} with maps ·{" "}
                  {filteredSummary.everyday.toLocaleString()} daily ·{" "}
                  {filteredSummary.events.toLocaleString()} events
                </p>
              </div>
              {activeFilterCount > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  Reset {activeFilterCount}
                </Button>
              ) : null}
            </div>

            {visibleDeals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {visibleDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    selected={
                      selectedDeal ? deal.id === selectedDeal.id : false
                    }
                    onSelect={(nextDeal) => setSelectedId(nextDeal.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyResults onReset={resetFilters} />
            )}

            {visibleLimit < filteredDeals.length ? (
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setVisibleLimit((current) =>
                      Math.min(current + LIMIT_STEP, filteredDeals.length)
                    )
                  }
                >
                  Load{" "}
                  {Math.min(LIMIT_STEP, filteredDeals.length - visibleLimit)}{" "}
                  more
                </Button>
              </div>
            ) : null}
          </section>

          <div className="hidden xl:block">
            <MapPanel deal={selectedDeal} />
          </div>
        </div>

        <section className="border border-border bg-card p-5">
          <h2 className="text-sm font-semibold tracking-widest uppercase">
            Popular Canggu guides
          </h2>
          <nav
            aria-label="Popular Bali Deals guides"
            className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            {seoPages.slice(0, 12).map((page) => (
              <a
                key={page.id}
                href={page.path}
                className="border border-border px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {page.heading}
              </a>
            ))}
          </nav>
        </section>

        <section className="border border-border bg-card p-5">
          <div>
            <h2 className="text-sm font-semibold tracking-widest uppercase">
              Catalog coverage
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              {fullSummary.totalDeals.toLocaleString()} curated deals across{" "}
              {fullSummary.uniquePlaces.toLocaleString()} places, with weekday
              specials, daily happy hours, food promos, and events.{" "}
              {fullSummary.withMaps.toLocaleString()} entries route directly to
              Google Maps; {catalogStats.missingMapLinks} use smart venue search
              fallback.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

interface MobileFiltersProps {
  filters: DealFilters
  facets: ReturnType<typeof buildFacetCounts>
  activeFilterCount: number
  setFilters: (filters: DealFilters) => void
  resetFilters: () => void
}

function MobileFilters({
  filters,
  facets,
  activeFilterCount,
  setFilters,
  resetFilters,
}: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative xl:hidden"
        >
          <RiFilter3Line />
          <span className="sr-only">Open filters</span>
          {activeFilterCount > 0 ? (
            <span className="absolute -top-1 -right-1 grid size-5 place-items-center bg-primary text-[0.65rem] text-primary-foreground">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[90vw] overflow-auto p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the Canggu deals catalog.</SheetDescription>
        </SheetHeader>
        <FilterPanel
          filters={filters}
          categoryCounts={facets.categories}
          priceCounts={facets.priceBands}
          onChange={setFilters}
          onReset={resetFilters}
          className="border-0"
        />
      </SheetContent>
    </Sheet>
  )
}

function AppHeader() {
  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-2 px-4 py-5 md:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.28em] text-primary uppercase">
            {catalogProfile.area}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            {catalogProfile.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Food promos, happy hours, late-night specials, and local events in
            one fast guide.
          </p>
        </div>
      </div>
    </header>
  )
}

function EmptyResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="border border-dashed border-border bg-card p-10 text-center">
      <h2 className="text-lg font-semibold tracking-tight">
        No matching deals
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        The current filters are too narrow for the catalog.
      </p>
      <Button
        type="button"
        className="mt-5"
        variant="outline"
        onClick={onReset}
      >
        Reset filters
      </Button>
    </div>
  )
}

function countActiveFilters(filters: DealFilters) {
  let count = 0

  if (filters.query.trim()) count += 1
  if (filters.day !== defaultFilters.day) count += 1
  if (filters.kind !== defaultFilters.kind) count += 1
  if (filters.timeBucket !== defaultFilters.timeBucket) count += 1
  if (filters.priceBands.length > 0) count += 1
  if (filters.categories.length > 0) count += 1
  if (filters.maxPriceK !== defaultFilters.maxPriceK) count += 1
  if (filters.withMapOnly) count += 1
  if (filters.everydayOnly) count += 1
  if (filters.openNow) count += 1

  return count
}
