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
