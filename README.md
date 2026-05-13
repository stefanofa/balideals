# Bali Deals

A TanStack Start app for discovering food promos, happy hours, late-night specials, and local events around Canggu.

## What Is Included

- 630 curated deals across 266 places
- Daily happy hour and food promo collections
- Day-specific views for Monday through Sunday
- Search, quick collections, category filters, price filters, and time filters
- Google Maps embeds, venue map links, and Google review links
- Catalog coverage indicators for map availability and collection size

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
- `src/components/deals` contains the product UI primitives and composed explorer experience.
- `src/components/ui` contains the shadcn/ui primitives used by the app.
