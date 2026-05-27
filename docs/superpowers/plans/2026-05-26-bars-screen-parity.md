# Bars Screen Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `app/(tabs)/bars.tsx` to match the layout, view-switching, and filtering pattern of `beers.tsx` — adding header row, three view modes (Cards/Table/Map), a filter modal, view-persistence, and a compact card style.

**Architecture:** `bars.tsx` stays the screen container (state + data fetching). Rendering delegates to one of three new view components (`BarCardView`, `BarTableView`, `BarMapView`). Filters live in a new `BarFilterModal`. View selection persists via `AsyncStorage`. Mirrors `beers.tsx` exactly.

**Tech Stack:** React Native + Expo, react-native-paper (Card/DataTable/SegmentedButtons/Modal/Portal/Snackbar), react-native-maps, @react-native-community/slider, expo-checkbox, @react-native-async-storage/async-storage, expo-router.

**Spec:** `docs/superpowers/specs/2026-05-26-bars-screen-parity-design.md`

**Project testing note:** No automated test suite exists; verification steps are manual (run the Expo app, observe behavior). Do not invent tests — verify in the running app.

---

## Task 1: Create `BarFilterModal` component

**Files:**
- Create: `components/_bar_filter_modal.tsx`

This is built first because `bars.tsx` will import it. Mirrors `components/_beer_filter_modal.tsx` structure (slider + checkboxes + Paper Divider/IconButton).

- [ ] **Step 1: Create the file with the full component**

```tsx
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, SegmentedButtons } from 'react-native-paper';

type SortBy = 'distance' | 'name';

interface BarFilterModalProps {
    hideModal: () => void;
    distanceFilter: number;
    setDistanceFilter: (n: number) => void;
    activeSpecialsOnly: boolean;
    setActiveSpecialsOnly: (b: boolean) => void;
    breweriesOnly: boolean;
    setBreweriesOnly: (b: boolean) => void;
    hasBeersOnly: boolean;
    setHasBeersOnly: (b: boolean) => void;
    sortBy: SortBy;
    setSortBy: (s: SortBy) => void;
    theme: any;
}

export default function BarFilterModal({
    hideModal,
    distanceFilter,
    setDistanceFilter,
    activeSpecialsOnly,
    setActiveSpecialsOnly,
    breweriesOnly,
    setBreweriesOnly,
    hasBeersOnly,
    setHasBeersOnly,
    sortBy,
    setSortBy,
    theme,
}: BarFilterModalProps) {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: theme.colors.onSurface, flex: 1 }}>
                    Filter Bars
                </Text>
                <IconButton
                    icon="window-close"
                    size={20}
                    onPress={hideModal}
                    accessibilityLabel="Close filter modal"
                    style={{ margin: 0, padding: 0 }}
                />
            </View>
            <Divider style={{ marginVertical: 10 }} />

            <View style={{ marginTop: 10 }}>
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                    Max Search Radius: {distanceFilter} Mi
                </Text>
                <Slider
                    minimumValue={0.5}
                    maximumValue={25}
                    step={0.5}
                    value={distanceFilter}
                    onValueChange={(value) => setDistanceFilter(parseFloat(value.toFixed(2)))}
                    minimumTrackTintColor={theme.colors.primary}
                    maximumTrackTintColor={theme.colors.onSurfaceVariant}
                    tapToSeek
                />
            </View>

            <View style={{ marginTop: 20 }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                    onPress={() => setActiveSpecialsOnly(!activeSpecialsOnly)}
                >
                    <Checkbox value={activeSpecialsOnly} onValueChange={setActiveSpecialsOnly} />
                    <Text style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}>
                        Active specials only
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                    onPress={() => setBreweriesOnly(!breweriesOnly)}
                >
                    <Checkbox value={breweriesOnly} onValueChange={setBreweriesOnly} />
                    <Text style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}>
                        Breweries only
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 5, opacity: 0.4 }}
                    disabled
                >
                    {/* TODO: v2 — un-disable once nearby_bars RPC returns beer_count. */}
                    <Checkbox value={hasBeersOnly} disabled />
                    <Text style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}>
                        Has beers listed (coming soon)
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', marginBottom: 8 }}>
                    Sort by
                </Text>
                <SegmentedButtons
                    value={sortBy}
                    onValueChange={(v) => setSortBy(v as SortBy)}
                    buttons={[
                        { value: 'distance', label: 'Distance' },
                        { value: 'name', label: 'Name' },
                    ]}
                />
            </View>
        </View>
    );
}
```

- [ ] **Step 2: Confirm the file compiles** (no TypeScript errors)

Run: project should still type-check. In VS Code, open the new file and verify no red squiggles.

- [ ] **Step 3: Commit**

```bash
git add components/_bar_filter_modal.tsx
git commit -m "feat(bars): add BarFilterModal component"
```

---

## Task 2: Create `BarCardView` component

**Files:**
- Create: `components/_bar-card-view.tsx`

Compact card per the design — name + distance (top), address (muted), special indicator + Edit button (bottom). Accepts optional `beerCount` and `bestBeer` props for v2 readiness.

- [ ] **Step 1: Create the file**

```tsx
import { BarDetails } from '@/utils/supabase';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Icon } from 'react-native-paper';

interface BarCardItem extends BarDetails {
    beer_count?: number;       // v2
    best_beer_name?: string;   // v2
    best_value?: number;       // v2 — $ per alcohol oz
}

interface Props {
    bars: BarCardItem[];
    theme: any;
}

export default function BarCardView({ bars, theme }: Props) {
    const goToEdit = (barId: string) => {
        router.push({ pathname: '/bar-edit', params: { barId } });
    };

    return (
        <FlatList
            data={bars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => goToEdit(item.id)}>
                    <Card style={{ marginVertical: 5 }}>
                        <Card.Content>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', color: theme.colors.onBackground, flex: 1 }}>
                                    {item.name}
                                </Text>
                                <Text style={{ color: theme.colors.onBackground }}>
                                    {item.dist_meters != null
                                        ? `${(item.dist_meters / 1609.344).toFixed(2)} mi`
                                        : '—'}
                                </Text>
                            </View>
                            <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                                {[item.street_address, item.city, item.state, item.zip].filter(Boolean).join(', ')}
                            </Text>

                            {/* v2 fields render conditionally */}
                            {item.beer_count != null && (
                                <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                    {item.beer_count} beer{item.beer_count === 1 ? '' : 's'} listed
                                    {item.best_beer_name && item.best_value != null
                                        ? ` • best: ${item.best_beer_name} ($${item.best_value.toFixed(2)}/oz)`
                                        : ''}
                                </Text>
                            )}

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Icon
                                        source={item.has_active_special ? 'check-circle' : 'octagon'}
                                        color={item.has_active_special ? 'green' : 'red'}
                                        size={16}
                                    />
                                    <Text style={{ color: theme.colors.onBackground, marginLeft: 4 }}>
                                        {item.has_active_special ? 'Specials active' : 'No current specials'}
                                    </Text>
                                </View>
                                <Button
                                    mode="contained-tonal"
                                    icon="pencil"
                                    compact
                                    onPress={() => goToEdit(item.id)}
                                >
                                    Edit
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            )}
        />
    );
}
```

- [ ] **Step 2: Confirm it compiles** (no TS errors)

- [ ] **Step 3: Commit**

```bash
git add components/_bar-card-view.tsx
git commit -m "feat(bars): add BarCardView component"
```

---

## Task 3: Create `BarTableView` component

**Files:**
- Create: `components/_bar-table-view.tsx`

Uses react-native-paper `DataTable`. Tap-to-edit on each row.

- [ ] **Step 1: Create the file**

```tsx
import { BarDetails } from '@/utils/supabase';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';

interface Props {
    bars: BarDetails[];
    theme: any;
}

export default function BarTableView({ bars, theme }: Props) {
    const goToEdit = (barId: string) => {
        router.push({ pathname: '/bar-edit', params: { barId } });
    };

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title numeric>Distance</DataTable.Title>
                    <DataTable.Title>Special</DataTable.Title>
                    <DataTable.Title>Edit</DataTable.Title>
                </DataTable.Header>

                {bars.map((bar) => (
                    <DataTable.Row key={bar.id} onPress={() => goToEdit(bar.id)}>
                        <DataTable.Cell>
                            <Text style={{ color: theme.colors.onBackground }} numberOfLines={1}>
                                {bar.name}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell numeric>
                            <Text style={{ color: theme.colors.onBackground }}>
                                {bar.dist_meters != null
                                    ? `${(bar.dist_meters / 1609.344).toFixed(1)} mi`
                                    : '—'}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                            <Text style={{ color: theme.colors.onBackground }}>
                                {bar.has_active_special ? '✓' : '—'}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                            <IconButton
                                icon="pencil"
                                size={18}
                                onPress={() => goToEdit(bar.id)}
                            />
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </ScrollView>
    );
}
```

- [ ] **Step 2: Confirm it compiles**

- [ ] **Step 3: Commit**

```bash
git add components/_bar-table-view.tsx
git commit -m "feat(bars): add BarTableView component"
```

---

## Task 4: Create `BarMapView` component

**Files:**
- Create: `components/_bar-map-view.tsx`

Mirrors `components/_beer_map_view.tsx` — react-native-maps with one marker per bar. Callout description includes distance.

- [ ] **Step 1: Create the file**

```tsx
import { BarDetails } from '@/utils/supabase';
import * as Location from 'expo-location';
import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Props {
    bars: BarDetails[];
    theme: any;
    location: Location.LocationObject | null;
}

export default function BarMapView({ bars, theme, location }: Props) {
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: location?.coords.latitude || 0,
                    longitude: location?.coords.longitude || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {bars.map((bar) => {
                    if (bar.latitude == null || bar.longitude == null) return null;
                    const distMi =
                        bar.dist_meters != null
                            ? `${(bar.dist_meters / 1609.344).toFixed(2)} mi`
                            : '';
                    return (
                        <Marker
                            key={bar.id}
                            coordinate={{
                                latitude: bar.latitude,
                                longitude: bar.longitude,
                            }}
                            title={bar.name}
                            description={[bar.street_address, distMi].filter(Boolean).join(' — ')}
                        />
                    );
                })}
            </MapView>
        </View>
    );
}
```

- [ ] **Step 2: Confirm it compiles**

- [ ] **Step 3: Commit**

```bash
git add components/_bar-map-view.tsx
git commit -m "feat(bars): add BarMapView component"
```

---

## Task 5: Refactor `bars.tsx` — header row, state, delegation

**Files:**
- Modify: `app/(tabs)/bars.tsx` (full rewrite of the screen body)

This wires together everything from Tasks 1–4 plus AsyncStorage persistence and the filter/sort logic.

- [ ] **Step 1: Replace the file contents with the new structure**

```tsx
import BarCardView from '@/components/_bar-card-view';
import BarFilterModal from '@/components/_bar_filter_modal';
import BarMapView from '@/components/_bar-map-view';
import BarTableView from '@/components/_bar-table-view';
import { useLocationContext } from '@/contexts/LocationContext';
import { BarDetails, searchNearbyBars } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    IconButton,
    Modal,
    Portal,
    SegmentedButtons,
    Snackbar,
    useTheme,
} from 'react-native-paper';

type BarView = 'Cards' | 'Table' | 'Map';
type SortBy = 'distance' | 'name';

const VIEW_STORAGE_KEY = 'bars:lastView';

export default function BarsScreen() {
    const { location, status } = useLocationContext();
    const userTimezone = Localization.getCalendars()[0].timeZone;
    const theme = useTheme();

    // View
    const [barView, setBarView] = useState<BarView>('Cards');

    // Data
    const [isLoading, setIsLoading] = useState(true);
    const [rawBars, setRawBars] = useState<BarDetails[]>([]);

    // UI
    const [showFilters, setShowFilters] = useState(false);
    const [snackVisible, setSnackVisible] = useState(false);

    // Filters
    const [distanceFilter, setDistanceFilter] = useState(2);
    const [activeSpecialsOnly, setActiveSpecialsOnly] = useState(false);
    const [breweriesOnly, setBreweriesOnly] = useState(false);
    const [hasBeersOnly, setHasBeersOnly] = useState(false); // disabled in v1
    const [sortBy, setSortBy] = useState<SortBy>('distance');

    // Hydrate view choice on mount
    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem(VIEW_STORAGE_KEY);
            if (stored === 'Cards' || stored === 'Table' || stored === 'Map') {
                setBarView(stored);
            }
        })();
    }, []);

    // Persist view choice on change
    const handleViewChange = (v: string) => {
        const next = v as BarView;
        setBarView(next);
        AsyncStorage.setItem(VIEW_STORAGE_KEY, next);
    };

    // Fetch
    useEffect(() => {
        async function fetchBars() {
            if (status !== 'success') return;
            setIsLoading(false);
            const distanceInMeters = distanceFilter * 1609.344;
            const results = await searchNearbyBars(
                location?.coords.latitude || 0,
                location?.coords.longitude || 0,
                distanceInMeters,
                userTimezone
            );
            setRawBars(results);
        }
        fetchBars();
    }, [status, distanceFilter]);

    // Filter + sort
    const displayedBars = useMemo(() => {
        let list = rawBars.slice();
        if (activeSpecialsOnly) list = list.filter((b) => b.has_active_special === true);
        if (breweriesOnly) list = list.filter((b) => b.is_brewery === true);
        // hasBeersOnly: no-op until nearby_bars RPC returns beer_count
        list.sort((a, b) => {
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
            return (a.dist_meters ?? Infinity) - (b.dist_meters ?? Infinity);
        });
        return list;
    }, [rawBars, activeSpecialsOnly, breweriesOnly, hasBeersOnly, sortBy]);

    const modalStyles = {
        backgroundColor: theme.colors.surface,
        padding: 20,
        margin: 20,
        borderRadius: 8,
    };

    const viewComponents: Record<BarView, React.ReactNode> = {
        Cards: <BarCardView bars={displayedBars} theme={theme} />,
        Table: <BarTableView bars={displayedBars} theme={theme} />,
        Map: <BarMapView bars={displayedBars} theme={theme} location={location} />,
    };

    const renderLocationBanner = () => {
        if (status === 'permission-denied' || status === 'error' || status === 'unavailable') {
            return (
                <TouchableOpacity
                    style={{
                        padding: 10,
                        backgroundColor: 'rgba(187, 0, 37, 0.15)',
                        borderRadius: 4,
                        marginVertical: 10,
                    }}
                >
                    <Text style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
                        {status === 'permission-denied'
                            ? 'Location permission needed for distances.'
                            : status === 'unavailable'
                                ? 'Location services disabled. Please enable in settings.'
                                : 'Unable to get location.'}
                    </Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <View className="flex-1 p-15" style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            {isLoading && (
                <View>
                    <ActivityIndicator animating size="large" style={{ marginTop: '50%' }} />
                    <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.onBackground }}>
                        Looking for the best bang for your buck near you...
                    </Text>
                </View>
            )}

            {!isLoading && (
                <View style={{ flex: 1 }}>
                    <Button
                        style={{ marginTop: 30 }}
                        mode="outlined"
                        onPress={() => setShowFilters((v) => !v)}
                    >
                        Filters
                    </Button>

                    <View style={{ flexDirection: 'row', marginTop: 25, alignItems: 'center' }}>
                        <View style={{ flex: 1 }} />
                        <View style={{ flex: 4 }}>
                            <SegmentedButtons
                                value={barView}
                                onValueChange={handleViewChange}
                                buttons={(['Cards', 'Table', 'Map'] as BarView[]).map((v) => ({
                                    value: v,
                                    label: v,
                                    style: {
                                        backgroundColor:
                                            barView === v
                                                ? theme.colors.primary
                                                : theme.colors.surfaceVariant,
                                        borderColor: theme.colors.outline,
                                    },
                                    labelStyle: {
                                        color:
                                            barView === v
                                                ? theme.colors.onPrimary
                                                : theme.colors.onSurfaceVariant,
                                    },
                                }))}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <IconButton
                                icon="information"
                                size={25}
                                onPress={() => setSnackVisible(true)}
                                accessibilityLabel="Bars info"
                            />
                        </View>
                    </View>

                    {renderLocationBanner()}

                    <Text style={{ color: theme.colors.onBackground, marginTop: 6 }}>
                        Found {displayedBars.length} bars
                    </Text>

                    {displayedBars.length === 0 ? (
                        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 20, textAlign: 'center' }}>
                            No bars match your filters. Widen your distance or clear filters.
                        </Text>
                    ) : (
                        viewComponents[barView]
                    )}

                    <Portal>
                        <Modal
                            visible={showFilters}
                            onDismiss={() => setShowFilters(false)}
                            contentContainerStyle={modalStyles}
                        >
                            <BarFilterModal
                                hideModal={() => setShowFilters(false)}
                                distanceFilter={distanceFilter}
                                setDistanceFilter={setDistanceFilter}
                                activeSpecialsOnly={activeSpecialsOnly}
                                setActiveSpecialsOnly={setActiveSpecialsOnly}
                                breweriesOnly={breweriesOnly}
                                setBreweriesOnly={setBreweriesOnly}
                                hasBeersOnly={hasBeersOnly}
                                setHasBeersOnly={setHasBeersOnly}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                theme={theme}
                            />
                        </Modal>
                    </Portal>

                    <Portal>
                        <Snackbar
                            visible={snackVisible}
                            onDismiss={() => setSnackVisible(false)}
                            duration={3000}
                            action={{ label: 'OK', onPress: () => setSnackVisible(false) }}
                        >
                            Tap a bar to view or edit its beers and specials.
                        </Snackbar>
                    </Portal>
                </View>
            )}
        </View>
    );
}
```

- [ ] **Step 2: Confirm it compiles**

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/bars.tsx
git commit -m "feat(bars): refactor screen to match beers.tsx layout (header, views, filters)"
```

---

## Task 6: Manual verification in the running app

**Files:** none (run-only)

This task is "run the app, click through each scenario, confirm it works."

- [ ] **Step 1: Start the Expo dev server**

```bash
npx expo start
```

- [ ] **Step 2: Open the Bars tab and verify Cards view renders**

Expected: header row visible (Filters button, Cards/Table/Map switcher, info icon). One card per nearby bar with name, distance, address, special indicator, Edit button. "Found N bars" text above the list.

- [ ] **Step 3: Switch to Table view**

Expected: DataTable with columns Name / Distance / Special / Edit. Tapping a row navigates to bar-edit with the correct `barId`.

- [ ] **Step 4: Switch to Map view**

Expected: MapView centered on user location with a pin per bar. Tap pin → callout shows bar name and distance.

- [ ] **Step 5: Verify view persistence**

Switch to Table, fully close + reopen the app. Expected: app re-opens with Table view selected.

- [ ] **Step 6: Verify each filter**

Open Filters modal. Toggle "Active specials only" — count drops to bars where `has_active_special === true`. Toggle "Breweries only" — count drops further. Confirm "Has beers listed" is disabled (greyed out). Change sort to "Name" — list reorders alphabetically. Adjust distance slider — list updates after fetch completes.

- [ ] **Step 7: Verify empty state**

Tighten filters until 0 bars match. Expected: empty-state copy renders: "No bars match your filters. Widen your distance or clear filters."

- [ ] **Step 8: Verify info snackbar**

Tap info icon. Expected: snackbar appears at bottom with "Tap a bar to view or edit its beers and specials." and an OK action.

- [ ] **Step 9: Verify Edit navigation from each view**

From Cards: tap Edit button → bar-edit screen for that bar. From Table: tap Edit icon → same. From Map: tap pin → callout → (current scope: callout description only; tapping the callout itself need not navigate — the Edit flow is via Cards/Table views).

- [ ] **Step 10: Final commit if any fixes were needed**

```bash
git status
# If anything changed during verification, commit it:
git add <changed files>
git commit -m "fix(bars): <what you fixed>"
```

---

## Done When

- All six tasks complete and committed
- All ten verification steps in Task 6 pass
- bars.tsx visually matches beers.tsx layout (header row + view switcher + info icon)
- View choice persists across app restart
- Filters & sort behave as specified
