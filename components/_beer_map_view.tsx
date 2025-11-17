import { LocationStatus } from '@/hooks/useLocation';
import { GroupedBeer } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import * as Location from 'expo-location';
import React from 'react';
import { View } from 'react-native';
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
                {Object.values(groupedBeers).map((beerGroup, index) => {
                    const markerBar = beerGroup.locations[0];
                    if (!markerBar || markerBar.bar_lat == null || markerBar.bar_long == null) {
                        console.warn('Skipping beerGroup due to missing location:', beerGroup);
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