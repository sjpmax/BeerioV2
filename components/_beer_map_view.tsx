import { LocationStatus } from '@/hooks/useLocation';
import { GroupedBeer } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import * as Location from 'expo-location';
import React from 'react';
import { View } from 'react-native';


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
            
        </View>
    );
}