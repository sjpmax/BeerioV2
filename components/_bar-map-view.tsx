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
