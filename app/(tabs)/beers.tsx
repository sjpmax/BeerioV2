import BeerCardView from '@/components/_beer-card-view';
import BeerTableView from '@/components/_beer-table-view';
import { searchLocalBeers } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { IconButton, Portal, SegmentedButtons, Snackbar, useTheme } from 'react-native-paper';

export default function BeersScreen() {

    const [beers, setBeers] = useState([]);
    const [beerView, setBeerView] = useState("Table");
    const beerViewTitles = ['Cards', 'Table'];

    const [visible, setVisible] = useState(false);
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
            className="flex-1 p-15"
            //contentContainerStyle={{ justifyContent: 'center' }}
            style={{ backgroundColor: theme.colors.background }}
        >           
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: '35%', marginTop: 25 }}>
   
            <SegmentedButtons
                value={beerView}
                onValueChange={handleBeerViewChange}
                style={{ flex: 1 }}
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

                            <IconButton
                                icon="information"
                                size={15}
                                 onPress={() => setVisible(true)}
                                accessibilityLabel="Value info"
                                                         
                            />
                            <Portal>
                            <Snackbar
                                visible={visible}
                                onDismiss={() => setVisible(false)}
                                duration={3000}   
                                style={{ backgroundColor:  theme.colors.snackBarBG}} theme={{ 
        colors: { 
            onSurface: theme.colors.primary,  // Text color
            inverseOnSurface: theme.colors.primary 
        } 
    }}
                                >
                                Value Score is calculated as (Price / Size) / (ABV %) to help identify the best value beers.
                            </Snackbar></Portal>
</View>
            {beerView === 'Table' ? (
                <BeerTableView beerList={beers} theme={theme} />
            ) : (
                    <BeerCardView beerList={beers} theme={theme} />
            )}
           
            </View>
    );
}