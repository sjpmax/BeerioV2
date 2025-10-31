// components/_beer-table-view.tsx
import { LocationStatus } from '@/hooks/useLocation';
import { Theme } from '@react-navigation/native';
import * as Location from 'expo-location';
import React from 'react';
import { View } from 'react-native';
import BeerTable from './_beer-table';

interface BeerSuggestionProps {
    groupedBeers: any[]; // Changed to array as you're passing Object.values()
    theme: Theme; 
    location: Location.LocationObject | null;
    locationStatus: LocationStatus;
    getDistanceMessage: (lat?: number | null, long?: number | null) => string;
}

export default function BeerTableView({ 
    groupedBeers,
    theme, 
    location, 
    locationStatus, 
    getDistanceMessage 
}: BeerSuggestionProps) {
    console.log('Rendering BeerTableView with beers:', groupedBeers);

    return (
        <View style={{ backgroundColor: theme.colors.background}}>
            <BeerTable 
                groupedBeers={groupedBeers} 
                theme={theme} 
                location={location}
                locationStatus={locationStatus}
                getDistanceMessage={getDistanceMessage}
            />
        </View>
    );
}