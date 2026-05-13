# Bali Deals

A TanStack Start app built from a multi-sheet Bali/Canggu deals workbook. The site turns the spreadsheet into a searchable guide with day, category, time, price, and deal-type filters, plus Google Maps and review links for each venue.

## What Is Included

- 630 normalized deals across 266 places
- Everyday happy hour and food promo sections
- Day-specific sections for Monday through Sunday
- Search, quick collections, category filters, price filters, and time filters
- Google Maps embeds, venue map links, and Google review links
- A source audit view back to sheet names and row numbers

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

- `src/data/deals.generated.ts` contains the normalized static catalog derived from the workbook.
- `src/domain/deals.ts` contains the filtering, sorting, date/time, map-link, and summarization logic.
- `src/components/deals` contains the product UI primitives and composed explorer experience.
- `src/components/ui` contains the shadcn/ui primitives used by the app.
