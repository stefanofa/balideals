# Bali Deals

A TanStack Start app for discovering food promos, happy hours, late-night specials, and local events around Canggu.

## What Is Included

- 630 curated deals across 266 places
- Daily happy hour and food promo collections
- Day-specific views for Monday through Sunday
- Search, quick collections, category filters, price filters, and time filters
- Google Maps embeds, venue map links, and Google review links
- Catalog coverage indicators for map availability and collection size
- SEO landing pages for happy hours, food deals, events, daily deals, coffee, brunch, tacos, and each weekday
- Crawlable venue pages that group promos by normalized restaurant/place name
- Canonical metadata, Open Graph/Twitter tags, JSON-LD, sitemap, robots rules, and branded social preview art

## Development

```bash
pnpm install
pnpm dev
```

The dev server runs on `http://localhost:3000`.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Project Shape

- `src/data/deals.generated.ts` contains the static catalog used by the app.
- `src/domain/deals.ts` contains the filtering, sorting, date/time, map-link, and summarization logic.
- `src/domain/places.ts` groups deals into normalized venue pages.
- `src/domain/seo.ts` contains canonical URL, metadata, sitemap target, and structured-data primitives.
- `src/components/deals` contains the product UI primitives and composed explorer experience.
- `src/components/seo` contains the crawlable landing and venue page layouts.
- `src/components/ui` contains the shadcn/ui primitives used by the app.
