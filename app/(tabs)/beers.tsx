import BeerCardView from '@/components/_beer-card-view';
import BeerTableView from '@/components/_beer-table-view';
import { BeerSuggestion, GroupedBeer, searchLocalBeers } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { IconButton, Portal, SegmentedButtons, Snackbar, useTheme } from 'react-native-paper';

export default function BeersScreen() {

    const [beerView, setBeerView] = useState("Cards");
    const beerViewTitles = ['Cards', 'Table'];
    const [beers, setBeers] = useState<BeerSuggestion[]>([]);
    const [groupedBeers, setGroupedBeers] = useState<Record<string, GroupedBeer>>({});

    const [snackVisible, setSnackVisible] = useState(false);
    const handleBeerViewChange = (value: string) => {
        setBeerView(value);
    }

    const theme = useTheme();

    useEffect(() => {
        async function fetchBeers() {
            const results = await searchLocalBeers('');
            const sorted = [...results].sort((a, b) =>
                (a.cost_per_alcohol_oz ?? 0) - (b.cost_per_alcohol_oz ?? 0)
            );

            console.log('Fetched beers:', sorted);
            const grouped = sorted.reduce((acc, beer) => {
                
                const key = beer.name; // Use beer name as key

                if (!acc[key]) {
                    acc[key] = {
                        id: beer.id,
                        name: beer.name,
                        abv: beer.abv,
                        type: beer.type,
                        brewery: beer.brewery, // This should now work if your interface matches
                        best_cost_per_oz: beer.cost_per_alcohol_oz,
                        best_size: beer.size,
                        best_price: beer.price,
                        source: beer.source,
                        locations: [],
                    }
                } else {
                    // Beer exists - update best values if current is better
                    if (beer.cost_per_alcohol_oz &&
                        beer.cost_per_alcohol_oz < acc[key].best_cost_per_oz!) {
                        acc[key].best_cost_per_oz = beer.cost_per_alcohol_oz;
                        acc[key].best_price = beer.price;
                        acc[key].best_size = beer.size;
                    }
                }

                // Add location info
                acc[key].locations.push({
                    price: beer.price,
                    bar_name: beer.bar_name,
                    bar_lat: beer.bar_lat,
                    bar_long: beer.bar_long,
                    cost_per_alcohol_oz: beer.cost_per_alcohol_oz,
                    bar_address: beer.bar_address,
                    size: beer.size,
                });

                return acc;
            }, {} as Record<string, GroupedBeer>);

            setGroupedBeers(grouped);
        }
        fetchBeers();
    }, []);


    return (
        <View
            className="flex-1 p-15"
            //contentContainerStyle={{ justifyContent: 'center' }}
            style={{ backgroundColor: theme.colors.background }}
        >
            <View style={{ flexDirection: 'row', marginTop: 25 }}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 1 }} >
                    <SegmentedButtons
                        value={beerView}
                        onValueChange={handleBeerViewChange}
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
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <IconButton
                        icon="information"
                        size={25}
                        onPress={() => setSnackVisible(true)}
                        accessibilityLabel="Value info"

                    />
                    <Portal>
                        <Snackbar
                            visible={snackVisible}
                            onDismiss={() => setSnackVisible(false)}
                            duration={3000}
                            style={{ backgroundColor: theme.colors.snackBarBG }} theme={{
                                colors: {
                                    onSurface: theme.colors.primary,  // Text color
                                    inverseOnSurface: theme.colors.primary
                                }
                            }}
                        >
                            Value Score is calculated as (Price / Size) / (ABV %) to help identify the best value beers. What you see is the cost per PURE alcohol ounce.
                        </Snackbar></Portal>
                </View>
            </View>

            {beerView === 'Table' ? (
                <BeerTableView groupedBeers={groupedBeers} theme={theme} />
            ) : (
                <BeerCardView  groupedBeers={groupedBeers} theme={theme} />
            )}

        </View>
    );
}