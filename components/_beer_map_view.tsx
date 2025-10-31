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
console.log('Rendering BeerMapView with beers:', groupedBeers);

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
                {Object.values(groupedBeers).map((beerGroup, index) => (
                    beerGroup.locations.map((loc) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: loc.bar_lat,
                                longitude: loc.bar_long,
                            }}
                            title={beerGroup.name}
                            description={`${loc.bar_name} - ${getDistanceMessage(loc.bar_lat, loc.bar_long)}`}  
                        />
                    ))
                ))}
            </MapView>
            
        </View>
    );
}