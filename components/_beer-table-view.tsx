import { BeerSuggestion } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import BeerTable from './_beer-table';

interface BeerSuggestionProps {
    groupedBeers: BeerSuggestion[];
    theme: Theme;
}

export default function BeerTableView({ groupedBeers, theme }: BeerSuggestionProps) {

    console.log('Rendering BeerTableView with beers:', Object.values(groupedBeers));


    return (
        <View style={{ backgroundColor: theme.colors.background}}>
            <BeerTable groupedBeers={Object.values(groupedBeers)} theme={theme} />

        </View>
    );

}
