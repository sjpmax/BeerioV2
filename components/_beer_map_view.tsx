import { LocationStatus } from '@/hooks/useLocation';
import { GroupedBeer } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import * as Location from 'expo-location';
import React from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


interface BeerSuggestionProps {
    groupedBeers: Record<string, GroupedBeer>;
    theme: Theme;
    location: Location.LocationObject | null;
    locationStatus: LocationStatus;
    getDistanceMessage: (lat?: number | null, long?: number | null) => string;
}

export default function BeerMapView({
    groupedBeers,
    theme,
    location,
    locationStatus,
    getDistanceMessage
}: BeerSuggestionProps) {

    const beerCount = Object.values(groupedBeers).length;
    const lat = location?.coords.latitude;
    const lng = location?.coords.longitude;

    let validMarkers = 0;
    let skippedNoLoc = 0;
    Object.values(groupedBeers).forEach((bg) => {
        const m = bg.locations?.[0];
        if (m && m.bar_lat != null && m.bar_long != null) validMarkers++;
        else skippedNoLoc++;
    });

    console.log('[BeerMapView] render', {
        locationStatus,
        lat,
        lng,
        beerCount,
        validMarkers,
        skippedNoLoc,
        firstBeer: Object.values(groupedBeers)[0],
    });

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{
                position: 'absolute',
                top: 8,
                left: 8,
                right: 8,
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: 8,
                borderRadius: 4,
            }}>
                <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'monospace' }}>
                    locStatus: {String(locationStatus)} | lat: {lat?.toFixed(4) ?? 'null'} | lng: {lng?.toFixed(4) ?? 'null'}
                </Text>
                <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'monospace' }}>
                    beers: {beerCount} | markers: {validMarkers} | skipped(no loc): {skippedNoLoc}
                </Text>
            </View>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: lat || 0,
                    longitude: lng || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {Object.values(groupedBeers).map((beerGroup, index) => {
                    const markerBar = beerGroup.locations[0];
                    if (!markerBar || markerBar.bar_lat == null || markerBar.bar_long == null) {
                        console.warn('[BeerMapView] skipping (no loc):', beerGroup.name, beerGroup);
                        return null;
                    }
                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: markerBar.bar_lat,
                                longitude: markerBar.bar_long,
                            }}
                            title={beerGroup.name}
                            description={`${markerBar.bar_name} - ${getDistanceMessage(markerBar.bar_lat, markerBar.bar_long)}`}
                        />
                    );
                })}

            </MapView>

        </View>
    );
}