import useLocation, { LocationStatus } from '@/hooks/useLocation';
import { GroupedBeer } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import * as Location from 'expo-location';
import React from 'react';
import { View } from 'react-native';
import BeerTable from './_beer-table';

const { location, status, errorMsg, refreshLocation, getDistanceMessage } = useLocation();

interface BeerSuggestionProps {
    groupedBeers: Record<string, GroupedBeer>;
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

    console.log('Rendering BeerTableView with beers:', Object.values(groupedBeers));


    return (
        <View style={{ backgroundColor: theme.colors.background}}>
            <BeerTable groupedBeers={Object.values(groupedBeers)} theme={theme} />

        </View>
    );

}
