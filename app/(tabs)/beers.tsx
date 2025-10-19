import { View, Text, ScrollView } from 'react-native';
import { supabase, searchLocalBeers, BeerSuggestion } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { DataTable,SegmentedButtons, useTheme, List } from 'react-native-paper';
import { Theme } from '@react-navigation/native';
import BeerTableView from '@/components/_beer-table-view';
import BeerCardView from '@/components/_beer-card-view';

export default function BeersScreen() {

    const [beers, setBeers] = useState([]);
    const [beerView, setBeerView] = useState("Table");
    const beerViewTitles = ['Cards', 'Table'];

    const handleBeerViewChange = (value: string) => {
        setBeerView(value);
    }

    const theme = useTheme();

    useEffect(() => {
        async function fetchBeers() {
            const results = await searchLocalBeers('');
            const sorted = [...results].sort((a, b) => a.value_score - b.value_score);
            setBeers(sorted);
            console.log(results);
        }
        fetchBeers();
    }, []);


    return (
        <View
            className="flex-1 p-15 mt-6"
            //contentContainerStyle={{ justifyContent: 'center' }}
            style={{ backgroundColor: theme.colors.background }}
        >           
          
            <SegmentedButtons
                value={beerView}
                onValueChange={handleBeerViewChange}
                style={{ marginHorizontal: '35%', marginTop: 25 }}
                contentInset={{ bottom: 80 }} //IOS only
                buttons={beerViewTitles.map((section) => ({
                    value: section,
                    label: section,
                    style: {
                        backgroundColor:
                            beerView === section
                                ? theme.colors.primary
                                : theme.colors.surfaceVariant,
                        borderColor: theme.colors.outline,
                    },
                    labelStyle: {
                        color:
                            beerView === section
                                ? theme.colors.onPrimary
                                : theme.colors.onSurfaceVariant,
                    },
                }))}
            />
            {beerView === 'Table' ? (
                <BeerTableView beerList={beers} theme={theme} />
            ) : (
                    <BeerCardView beerList={beers} theme={theme} />
            )}
           
            </View>
    );
}