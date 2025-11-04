import BeerCardView from '@/components/_beer-card-view';
import BeerTableView from '@/components/_beer-table-view';
import BeerMapView from '@/components/_beer_map_view';
import useLocation from '@/hooks/useLocation';
import { BeerSuggestion, GroupedBeer, searchLocalBeers } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button, IconButton, Menu, Portal, SegmentedButtons, Snackbar, useTheme } from 'react-native-paper';

export default function BeersScreen() {

    const [beerView, setBeerView] = useState("Cards");
    const beerViewTitles = ['Cards', 'Table', 'Map'];
    const [beers, setBeers] = useState<BeerSuggestion[]>([]);
    const [groupedBeers, setGroupedBeers] = useState<Record<string, GroupedBeer>>({});
     
  const { colors } = useTheme();
  const [visibleMenu, setVisibleMenu] = React.useState(null);

  const openMenu = (menu) => setVisibleMenu(menu);
  const closeMenu = () => setVisibleMenu(null);

    const [snackVisible, setSnackVisible] = useState(false);
    const handleBeerViewChange = (value: string) => {
        setBeerView(value);
    }
    const { location, status, errorMsg, refreshLocation, getDistanceMessage } = useLocation();

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
    const renderLocationBanner = () => {
        if (status === 'permission-denied' || status === 'error' || status === 'unavailable') {
            return (
                <TouchableOpacity
                    onPress={refreshLocation}
                    style={{
                        padding: 10,
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderRadius: 4,
                        margin: 10
                    }}
                >
                    <Text style={{ color: '#e74c3c', textAlign: 'center' }}>
                        {status === 'permission-denied'
                            ? 'Location permission needed for distances. Tap to request.'
                            : status === 'unavailable'
                                ? 'Location services disabled. Please enable in settings.'
                                : 'Unable to get location. Tap to retry.'}
                    </Text>
                </TouchableOpacity>
            );
        }

        return null;
    };

    const viewComponents = {
        "Cards": (
            <BeerCardView
                groupedBeers={groupedBeers}
                theme={theme}
                location={location}
                locationStatus={status}
                getDistanceMessage={getDistanceMessage}
            />
        ),
        "Table": (
            <BeerTableView
                groupedBeers={Object.values(groupedBeers)}
                theme={theme}
                location={location}
                locationStatus={status}
                getDistanceMessage={getDistanceMessage}
            />
        ),
        "Map": (
            <BeerMapView
                groupedBeers={groupedBeers}
                theme={theme}
                location={location}
                locationStatus={status}
                getDistanceMessage={getDistanceMessage}
            />
        )
        
    };

    

    return (
        <View
            className="flex-1 p-15"
            //contentContainerStyle={{ justifyContent: 'center' }}
            style={{ backgroundColor: theme.colors.background }}
        >
            <View style={{ flexDirection: 'row', marginTop: 25 }}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 3 }} >
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

     <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor:  '#24324A', // your dark bar background
        paddingVertical: 8,
        height: 50,
      }}
    >
      {/* TYPE dropdown */}
      <Menu
        visible={visibleMenu === 'type'}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="text"
            textColor="#FFD700"
            onPress={() => openMenu('type')}
            contentStyle={{ flexDirection: 'row-reverse' }}
            style={{ flex: 1, height: '100%', paddingBottom: 2
            }}
          >
            Type ▾
          </Button>
        }
      >
        <Menu.Item onPress={closeMenu} title="IPA" />
        <Menu.Item onPress={closeMenu} title="Lager" />
        <Menu.Item onPress={closeMenu} title="Stout" />
      </Menu>

      {/* PRICE dropdown */}
      <Menu
        visible={visibleMenu === 'price'}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="text"
            textColor="#FFD700"
            onPress={() => openMenu('price')}
            contentStyle={{ flexDirection: 'row-reverse' }}
            style={{ flex: 1 }}
          >
            Price ▾
          </Button>
        }
      >
        <Menu.Item onPress={closeMenu} title="Low → High" />
        <Menu.Item onPress={closeMenu} title="High → Low" />
      </Menu>

      {/* ABV dropdown */}
      <Menu
        visible={visibleMenu === 'abv'}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="text"
            textColor="#FFD700"
            onPress={() => openMenu('abv')}
            contentStyle={{ flexDirection: 'row-reverse' }}
            style={{ flex: 1 }}
          >
            ABV ▾
          </Button>
        }
      >
        <Menu.Item onPress={closeMenu} title="Low → High" />
        <Menu.Item onPress={closeMenu} title="High → Low" />
      </Menu>

      {/* DISTANCE dropdown */}
      <Menu
        visible={visibleMenu === 'distance'}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="text"
            textColor="#FFD700"
            onPress={() => openMenu('distance')}
            contentStyle={{ flexDirection: 'row-reverse' }}
            style={{ flex: 1 }}
          >
            Distance ▾
          </Button>
        }
      >
        <Menu.Item onPress={closeMenu} title="Nearest" />
        <Menu.Item onPress={closeMenu} title="Farthest" />
      </Menu>
    </View>

 {renderLocationBanner()}

        {viewComponents[beerView] || viewComponents["Cards"]}


            <Portal>
                <Snackbar
                    visible={snackVisible}
                    onDismiss={() => setSnackVisible(false)}
                    action={{
                        label: 'OK',
                        onPress: () => setSnackVisible(false),
                    }}
                >
                    Unable to refresh beers
                </Snackbar>
            </Portal>
        </View>
    );
}