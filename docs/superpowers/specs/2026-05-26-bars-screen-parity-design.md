# Bars Screen — Feature Parity with Beers Screen

**Date:** 2026-05-26
**Branch:** color-system-unification
**Goal:** Restructure `app/(tabs)/bars.tsx` so its layout, view options, and filtering match the established `beers.tsx` pattern. Today bars.tsx jumps straight to a FlatList of cards with inline action buttons; the rest of the app uses a header row (Filters button + view switcher + info icon) and delegates rendering to per-view components.

## Scope

In scope:
- Header row matching beers.tsx (Filters button, Cards/Table/Map switcher, info icon)
- Three view modes for bars: Cards, Table, Map
- Filter modal with: distance radius, active-specials-only, breweries-only, has-beers-listed, sort-by
- Persistence of last-selected view via AsyncStorage
- Compact bar card style with an inline Edit button

Out of scope for v1, planned for v2 (see "Planned v2" below):
- Beer count per bar on cards
- Best beer (highest ABV-per-dollar) per bar on cards
- Sort by Best Value
- "Has beers listed" filter (toggle rendered but disabled)

Out of scope entirely:
- FAB for adding bars / beers / reminders (stays commented for now)
- Bar-detail expansion (Edit goes directly to bar-edit)
- Refactoring beers.tsx onto a shared abstraction

## Architecture

`bars.tsx` remains the screen container — it owns state, data fetching, and filter/sort logic. Rendering is delegated to one of three view components selected by a SegmentedButtons control. Filters live in a dedicated modal component. This mirrors the existing structure of `beers.tsx` exactly.

```
app/(tabs)/bars.tsx
├── header row (Filters btn, view switcher, info icon)
├── BarFilterModal           (Portal/Modal)
├── Snackbar                 (info)
└── viewComponents[barView]
    ├── BarCardView          (compact cards)
    ├── BarTableView         (DataTable)
    └── BarMapView           (react-native-maps)
```

## Files

**New files:**
- `components/_bar-card-view.tsx`
- `components/_bar-table-view.tsx`
- `components/_bar-map-view.tsx`
- `components/_bar_filter_modal.tsx`

**Refactored:**
- `app/(tabs)/bars.tsx` — replace the existing FlatList with the header row + delegated view; pull filter/sort logic up; add AsyncStorage persistence for view choice.

## Component Contracts

| Component | Renders | Tap behavior |
|---|---|---|
| `BarCardView` | Compact card per bar: name + distance (top), address (muted), special indicator + inline Edit button (bottom-right). | Tap card → bar-edit. Tap Edit → bar-edit. |
| `BarTableView` | Columns: Name • Distance • Special (✓/—) • Edit. | Tap row → bar-edit. Tap Edit cell → bar-edit. |
| `BarMapView` | Map with one pin per bar. Callout shows name, distance, Edit button. | Tap pin → callout. Tap Edit → bar-edit. |
| `BarFilterModal` | Distance slider (existing logic) • toggle "Active specials only" • toggle "Breweries only" • toggle "Has beers listed" (disabled in v1 — see caveat) • Sort SegmentedButtons (Distance / Name). | Apply on dismiss. |

## Header Row (bars.tsx top)

Matches beers.tsx exactly:
- Row 1: `[Filters]` outlined button
- Row 2: `[flex spacer]` • SegmentedButtons(`Cards`/`Table`/`Map`) • Info icon (Snackbar copy: "Tap a bar to view or edit its beers and specials.")

## State in bars.tsx

```
location, status, getDistanceMessage  (from useLocationContext)
isLoading: boolean
rawBars: BarDetails[]
barView: 'Cards' | 'Table' | 'Map'       // persisted
showFilters: boolean
snackVisible: boolean

// Filter state
distanceFilter: number                    // miles (existing)
activeSpecialsOnly: boolean
breweriesOnly: boolean
hasBeersOnly: boolean                     // disabled v1
sortBy: 'distance' | 'name'
```

## Data Flow

1. `useEffect([status, distanceFilter])` → `searchNearbyBars(...)` → `setRawBars(results)`.
2. `useMemo([rawBars, activeSpecialsOnly, breweriesOnly, hasBeersOnly, sortBy])` → derive `displayedBars`:
   - Filter `has_active_special === true` if `activeSpecialsOnly`
   - Filter `is_brewery === true` if `breweriesOnly`
   - Filter `beer_count > 0` if `hasBeersOnly` (no-op until RPC extended)
   - Sort ascending by `dist_meters` or `name`
3. Render `viewComponents[barView]` with `displayedBars`.

## Persistence

- `AsyncStorage` key `bars:lastView`.
- On mount: hydrate `barView` (default `'Cards'`).
- On view change: write the new value.

## Caveats

**Fields not available on current `BarDetails`:**
The `nearby_bars` RPC returns: `id`, `name`, address fields, `is_brewery`, `dist_meters`, `has_active_special`. It does **not** return `beer_count` or any aggregated beer pricing. This affects three v1 features that are deferred to v2:

1. **"Has beers listed" filter** — toggle is rendered but disabled in v1; a `// TODO` notes the RPC dependency.
2. Aggregated card content (see Planned v2 below) is dropped from v1. v1 cards show name + distance + address + special indicator + Edit only.
3. **"Sort by Best Value"** — dropped from v1 sort options. v1 sort offers Distance and Name only.

## Planned v2 (after RPC extension)

Once `nearby_bars` is extended to return aggregated beer fields, the bar card will gain a third line showing:

- **Beer count** — e.g. "12 beers listed"
- **Best beer at this bar** — `name • $X.XX/alcohol-oz` (highest ABV-per-dollar ratio)

The filter modal will also activate:
- **"Has beers listed"** toggle (un-disabled)
- **"Sort by Best Value"** option added to sort SegmentedButtons

These are explicit follow-ups, not nice-to-haves. Build v1 with the data shape in mind so adding these is a small change rather than a refactor — `BarCardView` should accept the extra optional fields and conditionally render them when present.

## Edge Cases

- `status !== 'success'` → render the same location banner pattern used in beers.tsx.
- `rawBars.length === 0` (loading still in flight) → keep existing ActivityIndicator + "Looking for the best bang for your buck near you..." copy.
- `displayedBars.length === 0` after filtering → "No bars match your filters. Widen your distance or clear filters."
- Bar with `dist_meters == null` → render `—` for distance.

## Verification (Manual)

- Switch views — view persists across app restart
- Each filter toggle drops the count appropriately
- Sort options reorder the list correctly
- Edit on each view navigates to `/bar-edit` with the correct `barId` param
- Loading and empty states both render

## Open Questions

None at this time. The "Has beers listed" filter's dependency on an RPC change is acknowledged and deferred.
