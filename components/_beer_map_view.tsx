import { LocationStatus } from '@/hooks/useLocation';
import { GroupedBeer } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
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

    const beerValues = Object.values(groupedBeers);
    const validMarkers = beerValues.filter(
        b => b.locations[0]?.bar_lat != null && b.locations[0]?.bar_long != null
    ).length;

    useEffect(() => {
        const cfg: any = Constants.expoConfig ?? (Constants as any).manifest ?? {};
        const resolvedKey: unknown = cfg?.android?.config?.googleMaps?.apiKey;
        const looksLiteral = resolvedKey === 'process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY';
        console.log('[MapDiag] state', {
            platform: Platform.OS,
            locationStatus,
            hasLocation: !!location,
            lat: location?.coords.latitude,
            lng: location?.coords.longitude,
            beerGroupCount: beerValues.length,
            validMarkers,
            apiKeyResolved: typeof resolvedKey === 'string' && resolvedKey.length > 0,
            apiKeyLooksLiteral: looksLiteral,
            apiKeyLength: typeof resolvedKey === 'string' ? resolvedKey.length : null,
            apiKeyPrefix: typeof resolvedKey === 'string' ? resolvedKey.slice(0, 6) : null,
        });
        if (looksLiteral) {
            console.error(
                '[MapDiag] Android Google Maps apiKey resolved to the literal string ' +
                '"process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY". JSON does not evaluate JS, ' +
                'so Maps SDK will fail to auth and tiles will not load.'
            );
        }
    }, [locationStatus, location, beerValues.length, validMarkers]);

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
                onMapReady={() =>
                    console.log('[MapDiag] onMapReady — native MapView mounted')
                }
                onMapLoaded={() =>
                    console.log('[MapDiag] onMapLoaded — tiles rendered (map is working)')
                }
                onRegionChangeComplete={(r) =>
                    console.log('[MapDiag] onRegionChangeComplete', r)
                }
            >
                {beerValues.map((beerGroup, index) => {
                    const markerBar = beerGroup.locations[0];
                    if (!markerBar || markerBar.bar_lat == null || markerBar.bar_long == null) {
                        console.warn('[MapDiag] skipping beerGroup, missing location:', beerGroup.name);
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