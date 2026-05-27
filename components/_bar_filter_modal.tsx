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
