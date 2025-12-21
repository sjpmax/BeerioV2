import BeerCardView from '@/components/_beer-card-view';
import BeerTableView from '@/components/_beer-table-view';
import BeerFilterModal from '@/components/_beer_filter_modal';
import BeerMapView from '@/components/_beer_map_view';
import useLocation from '@/hooks/useLocation';
import { GroupedBeer, searchNearbyBeers } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button, IconButton, Modal, Portal, SegmentedButtons, Snackbar, useTheme, ActivityIndicator } from 'react-native-paper';

export default function BeersScreen() {
    const [beerView, setBeerView] = useState("Cards");
    const beerViewTitles = ['Cards', 'Table', 'Map'];
    const [groupedBeers, setGroupedBeers] = useState<Record<string, GroupedBeer>>({});
    const [filteredBeers, setFilteredBeers] = useState<GroupedBeer[]>([]);
    const [filters, setFilters] = useState({ type: '', price: '', abv: '', distance: '' });
    const [snackVisible, setSnackVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rawBeers, setRawBeers] = useState<any[]>([]); // Store raw beer data
    const handleBeerViewChange = (value: string) => {
        setBeerView(value);
    }
    const { location, status, refreshLocation, getDistanceMessage } = useLocation();
    const theme = useTheme();
    const [showFilters, setShowFilters] = useState(false);
    const modalStyles = {
        backgroundColor: theme.colors.surface,
        padding: 20,
        margin: 20,
        borderRadius: 8,
    };
    // Available types (from data)
    const [availableBeerTypes, setAvailableBeerTypes] = useState(new Set());

    // Selected types (user's filter choice) 
    const [selectedTypes, setSelectedTypes] = useState(new Set());
    const [servingTypes, setServingTypes] = useState(new Set(["individual", "group"]));
    const [distanceUnits, setDistanceUnits] = useState(new Set(["Mi", "Km"]));
    const [distanceUnit, setDistanceUnit] = useState("Mi");
    const [priceFilter, setPriceFilter] = useState(20);
    // Initial distance filter in miles, which will get converted to meters for the query
    const [distanceFilter, setDistanceFilter] = useState(2);

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
    }


    useEffect(() => {
        async function fetchBeers() {
            if (status !== 'success') {

                return;
            }
            setIsLoading(false);
            // Convert distanceFilter to meters because our DB function uses meters
            let distanceInMeters = distanceFilter * 1609.344;

            const results = await searchNearbyBeers(
                location?.coords.latitude || 0,
                location?.coords.longitude || 0, distanceInMeters);

            const availableTypes = new Set(results.map(a => a.type_group));
            setAvailableBeerTypes(availableTypes);
            if (selectedTypes.size === 0) {
                setSelectedTypes(availableTypes);
            }
            setRawBeers(results); // Just store raw data
        }
        fetchBeers();
    }, [status, distanceFilter]); // Only depends on location status

    useEffect(() => {
        if (!rawBeers.length) return;


        console.log("****************************************");
        console.log("price filter", priceFilter);
        console.log("****************************************");

        // All your current logic goes here:
        const filteredResults = rawBeers.filter(beer => {
            if (!servingTypes.has("individual")) {
                if (["Can", "Bottle", "Draft", "Nitro", "Cask"].includes(beer.serving_type)) return false;
            }
            if (!servingTypes.has("group")) {
                if (["Pitcher", "Growler", "Crowler", "Bucket", "Tower"].includes(beer.serving_type)) return false;
            }

            console.log("Beer:", beer.name, "Price:", beer.price, "price filter:", priceFilter, "ID: ", beer.id, "\n");
            // Price filter
            if (beer.price && beer.price > priceFilter) return false;

            // Beer type filter
            if (!selectedTypes.has(beer.type_group))
                return false;

            return true;
        });

        const sorted = [...filteredResults].sort((a, b) =>
            (a.cost_per_alcohol_oz ?? 0) - (b.cost_per_alcohol_oz ?? 0)
        );

        const grouped = sorted.reduce((acc, beer) => {
            const key = beer.name; // Use beer name as key

            if (!acc[key]) {
                acc[key] = {
                    id: beer.id,
                    name: beer.name,
                    abv: beer.abv,
                    type: beer.type,
                    type_group: beer.type_group,
                    serving_type: beer.serving_type,
                    serving_description: beer.serving_description,
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
                    acc[key].serving_type = beer.serving_type;
                    acc[key].serving_description = beer.serving_description;
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
                serving_type: beer.serving_type,
                serving_description: beer.serving_description,
            });

            return acc;
        }, {} as Record<string, GroupedBeer>);

        setGroupedBeers(grouped);
    }, [rawBeers, servingTypes, selectedTypes, location, priceFilter, distanceFilter, location]);



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
            {/* Loading screen. I want an animated gif of Beerio pouring a beer here.*/}
            {isLoading && <View>
                <ActivityIndicator
                    animating={true} size="large"
                    style={{ marginTop: '50%' }}
                />
                <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.onBackground }}>Looking for the best bang for your buck near you...</Text>
            </View>}
            {/*    After the data comes back: */}
            {!isLoading && (<View>
                <Button style={{ marginTop: 30 }} onPress={showFilters ? () => setShowFilters(false) : () => setShowFilters(true)} mode="outlined">
                    Filters
                </Button>
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
                <Portal>
                    <Modal
                        visible={showFilters}
                        onDismiss={() => setShowFilters(false)}
                        contentContainerStyle={modalStyles}
                    >
                        <BeerFilterModal
                            modalVisible={showFilters}
                            hideModal={() => setShowFilters(false)}
                            groupedBeers={groupedBeers}
                            availableBeerTypes={availableBeerTypes}
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                            servingTypes={servingTypes}
                            setServingTypes={setServingTypes}
                            priceFilter={priceFilter}
                            setPriceFilter={setPriceFilter}
                            distanceFilter={distanceFilter}
                            setDistanceFilter={setDistanceFilter}
                            distanceUnits={distanceUnits}
                            setDistanceUnits={setDistanceUnits}
                            theme={theme}
                        />

                    </Modal>
                </Portal>

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
            </View>)
            }
        </View>

    );
}