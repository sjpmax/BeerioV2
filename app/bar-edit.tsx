import { useLocalSearchParams, Stack } from 'expo-router';
import { FlatList, View, TouchableOpacity, ScrollView, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { getBarDetails, getStates, States, getBarBeers, ExpoAsyncStorageAdapter, searchCanonicalBeers, getServingTypes, addPendingBeer } from '../utils/supabase';
import { Button, Text, IconButton, Modal, Portal, Snackbar, useTheme, ActivityIndicator, FAB, Card, Icon, TextInput, Dialog, Divider, Checkbox, Tooltip, Banner } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Autocomplete, AutocompleteScrollView } from 'react-native-paper-autocomplete';
import { useAuthContext } from '@/hooks/use-auth-context';

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function barEdit() {

    const { profile, session } = useAuthContext()
    const insets = useSafeAreaInsets();
    const { barId } = useLocalSearchParams();
    const theme = useTheme();
    const [barDetails, setBarDetails] = useState(null);
    const [beersOffered, setBeersOffered] = useState([]);
    const [barSpecials, setBarSpecials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statesList, setStatesList] = useState<States[]>([]);
    const [detailsSectionExpanded, setDetailsSectionExpanded] = useState(true);
    const [beerSectionExpanded, setBeerSectionExpanded] = useState(true);
    const [specialsSectionExpanded, setSpecialsSectionExpanded] = useState(true);
    const [infoDialogVisible, setInfoDialogVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [bannerVisible, setBannerVisible] = React.useState(false);
    const [fabOpen, setFabOpen] = useState(false);
    const [showFab, setShowFab] = useState(true);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const modalStyles = {
        backgroundColor: theme.colors.surface,
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 40,  // ← Space from top/bottom
        borderRadius: 8,
        flex: 1,  // ← Take available space
    };
    const [showAddBeer, setShowAddBeer] = useState(false);
    const [showAddSpecial, setShowAddSpecial] = useState(false);
    const [newBeerName, setNewBeerName] = useState('');
    const [newBrewery, setNewBrewery] = useState('');
    const [newAbv, setNewAbv] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newServingType, setNewServingType] = useState(null);
    const [beerQuery, setBeerQuery] = useState('');
    const [beerSuggestions, setBeerSuggestions] = useState([]);
    const [selectedBeer, setSelectedBeer] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    // typed as array of objects returned from DB: { id, name, ... }
    const [servingTypes, setServingTypes] = useState<Array<{ id: number; name: string }>>([]);
    const [selectedServingType, setSelectedServingType] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => {
        async function fetchBeerSuggestions() {
            console.log("Fetching beer suggestions for query:", beerQuery);
            if (beerQuery.length < 3) {
                setSelectedBeer(null);
                setBeerSuggestions([]);
                setBannerVisible(false);
                return;
            }
            const suggestions = await searchCanonicalBeers(beerQuery);
            setBeerSuggestions(suggestions);
            setHasSearched(true);
            console.log("debounce this BABY", suggestions);
            if (suggestions.length === 0) {
                setSnackbarMessage('No beers found matching your search. Please try a different query or add the beer manually.');
                setSnackbarVisible(true);
                setBannerVisible(true);
            }

        }

        if (beerQuery) {
            const timerId = setTimeout(() => {
                fetchBeerSuggestions();
            }, 500);
            return () => {
                clearTimeout(timerId);
            };
        } else {
            setBeerSuggestions([]);
        }
    }, [beerQuery]);


    useEffect(() => {
        async function fetchBarBeers() {
            console.log("Fetching beers for bar ID:", barId);
            if (!barId) return;

            setIsLoading(true);
            const barData = await getBarBeers(barId as string);

            console.log("profile id: ", profile.id); 

            if (barData) {
                setBarDetails(barData.barDetails);
                setBeersOffered(barData.beersOffered);
                setBarSpecials(barData.barSpecials);
            }
            setIsLoading(false);
        }

        fetchBarBeers();
    }, [barId]);

    useEffect(() => {
        async function fetchStates() {
            const states = await getStates();
            if (states) {
                setStatesList(states);

            }
        }

        fetchStates();

        AsyncStorage.getItem('bar.edit.alert.seen').then((value) => {
            console.log("Bar edit alert seen value:", value);
            if (!value) {
                setInfoDialogVisible(true);
            }
            else if (value === 'true') {
                setInfoDialogVisible(false);
            }
        });

        async function fetchServingTypes() {
            // must be array
            const types = await getServingTypes();
            console.log("Fetched serving types:", types);
            if (types && Array.isArray(types)) {
                // normalize to expected shape { id, name }
                const normalized = types.map((t: any) => ({ id: t.id, name: t.name }));
                setServingTypes(normalized);
            }
        }

        // call the fetch function (previously declared but never invoked)
        fetchServingTypes();

    }, []);

    const handleBeerSelection = (beerSelection) => {
        console.log('Handling beer selection:', beerSelection);
        console.log("beer offered:", beersOffered);
        Keyboard.dismiss();
        // Check if this beer already exists in the bar's offerings
        const matchedBeer = beersOffered.find(b => b.canon_id.toString() === beerSelection.id);

        if (matchedBeer) {

            setSnackbarMessage('This beer already exists at this bar. Please edit the existing beer.');
            setSnackbarVisible(true);
            setBeerQuery('');
        } else {
            // Beer is new, populate the form fields
            setSelectedBeer(beerSelection);
            setNewBeerName(beerSelection.name);
            setNewBrewery(beerSelection.brewery_name);
            setNewAbv(beerSelection.abv);
        }
    }

    const handleSaveChanges = () => {
        console.log('Add beer:', { newBeerName, newBrewery, newAbv, newPrice, newServingType });
        console.log('Selected beer from suggestions:', selectedBeer);
        

    }


    const handleDialogDismiss = () => {
        setInfoDialogVisible(false);
        AsyncStorage.setItem('bar.edit.alert.seen', 'true');
    };

    const handleCloseModal = () => {
        setShowAddBeer(false);
        setSelectedBeer(null);
        setHasSearched(false);
        setBeerQuery('');
        setNewBeerName('');
        setNewBrewery('');
        setNewAbv('');
        setNewPrice('');
        setNewServingType('');
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: barDetails?.barName || 'Edit Bar'
                }}
            />
            <View
                className="flex-1 p-4"
                style={{ backgroundColor: theme.colors.background, paddingBottom: insets.bottom }}
            >
                <ScrollView className="flex-1  "
                    style={{ backgroundColor: theme.colors.background, paddingBottom: 160 }}>


                    {isLoading && <ActivityIndicator />}
                    <Portal>
                        <Dialog visible={infoDialogVisible} onDismiss={() => handleDialogDismiss()}>
                            <Dialog.Title>Edit Bar Details</Dialog.Title>
                            <Dialog.Content>
                                <Text variant="bodyMedium">On this screen, when you edit a field, you're making a suggestion which will be reviewed by our staff. If approved, your changes will be applied soon.</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => handleDialogDismiss()}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                    <Portal>
                        <Snackbar
                            wrapperStyle={{ top: 60 }}
                            visible={snackbarVisible}
                            onDismiss={() => setSnackbarVisible(false)}
                            duration={3000}
                        >
                            {snackbarMessage}
                        </Snackbar>
                    </Portal>


                    {/*********************************************************/}
                    {/*Bar Details Section*/}
                    {/*********************************************************/}

                    {barDetails &&
                        <View>
                            <View>
                                <TouchableOpacity

                                    onPress={() => setDetailsSectionExpanded(!detailsSectionExpanded)}
                                ><Text variant="headlineMedium" style={{ paddingLeft: 5 }}>Bar Details <Icon source={detailsSectionExpanded ? 'minus' : 'plus'} size={25} /></Text>
                                </TouchableOpacity>

                                <View style={{ marginVertical: 10, padding: 5, height: detailsSectionExpanded ? 'auto' : 10 }} >

                                    <TextInput
                                        label="Bar Name"
                                        value={barDetails.barName}
                                        onChangeText={(text) => setBarDetails({ ...barDetails, barName: text })}
                                    />
                                    <TextInput
                                        label="Bar Street Address"
                                        value={barDetails.barStreetAddress}
                                        onChangeText={(text) => setBarDetails({ ...barDetails, barStreetAddress: text })}
                                    />
                                    <TextInput
                                        label="City"
                                        value={barDetails.barCity}
                                        onChangeText={(text) => setBarDetails({ ...barDetails, barCity: text })}

                                    />


                                    {/*<PaperSelect*/}

                                    {/*    label="State"*/}
                                    {/*    value={barDetails.state_id}*/}
                                    {/*    onSelection={(value) => setBarDetails({*/}
                                    {/*        ...barDetails,*/}
                                    {/*        value: */}
                                    {/*    })}*/}
                                    {/*</PaperSelect>*/}
                                    <TextInput
                                        label="Zip Code"
                                        value={barDetails.barZip}
                                        onChangeText={(text) => setBarDetails({ ...barDetails, barZip: text })}
                                    />
                                </View>

                            </View>
                            {/*********************************************************/}
                            {/*Beer Section*/}
                            {/*********************************************************/}

                            <TouchableOpacity

                                onPress={() => setBeerSectionExpanded(!beerSectionExpanded)}
                            ><Text variant="headlineMedium" style={{ paddingLeft: 5 }}>Beers <Icon source={beerSectionExpanded ? 'minus' : 'plus'} size={25} /></Text>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: theme.colors.popLight, marginVertical: 10, padding: 5, height: beerSectionExpanded ? 'auto' : 10 }} >
                                {beersOffered && beersOffered.length > 0 ? (
                                    <FlatList
                                        scrollEnabled={false}
                                        data={beersOffered}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <Card style={{ marginVertical: 5, backgroundColor: theme.colors.surface }}>
                                                <Card.Content>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ flex: 9, alignItems: 'flex-start' }}>
                                                            <Text variant="titleMedium">{item.name} - <Icon source={item.serving_icon} color="green" size={16} /> {item.serving_type}</Text>
                                                        </View>
                                                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'flex-end center' }}>
                                                            <IconButton icon="pencil" size={20} onPress={() => console.log('Edit beer ' + item.name)} style={{ margin: 0, marginTop: -4 }} />
                                                            <IconButton icon="delete" size={20} onPress={() => console.log('Delete beer ' + item.name)} style={{ margin: 0, marginTop: -4 }} />
                                                        </View>
                                                    </View>
                                                    <Text>{item.brewery + ' | ABV: ' + item.abv + '% | Price: $' + item.price}</Text>

                                                </Card.Content>
                                            </Card>
                                        )}
                                    />) : <Text>No beers offered have been added yet.</Text>}
                            </View>


                            {/*********************************************************/}
                            {/*Specials Section*/}
                            {/*********************************************************/}

                            <TouchableOpacity

                                onPress={() => setSpecialsSectionExpanded(!specialsSectionExpanded)}
                            ><Text variant="headlineMedium" style={{ paddingLeft: 5 }}>Specials / Happy Hours <Icon source={specialsSectionExpanded ? 'minus' : 'plus'} size={25} /></Text>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: theme.colors.popLight, marginVertical: 10, padding: 5, height: specialsSectionExpanded ? 'auto' : 10 }} >
                                {barSpecials && barSpecials.length > 0 ? (
                                    <FlatList
                                        scrollEnabled={false}
                                        data={barSpecials}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <Card style={{ marginVertical: 5, backgroundColor: theme.colors.surface }}>
                                                <Card.Content>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ flex: 9, alignItems: 'flex-start' }}>
                                                            <Text variant="titleMedium" style={{ color: theme.colors.crimson }}>{item.special_type.toUpperCase()} - {dayNames[item.day_of_week]}</Text>
                                                        </View>
                                                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'flex-end center' }}>
                                                            <IconButton icon="pencil" size={20} onPress={() => console.log('Edit special ' + item.name)} style={{ margin: 0, marginTop: -4, color: theme.colors.crimson }} iconColor={theme.colors.crimson} />
                                                            <IconButton icon="delete" size={20} onPress={() => console.log('Delete special ' + item.name)} style={{ margin: 0, marginTop: -4, color: theme.colors.crimson }} iconColor={theme.colors.crimson} />
                                                        </View>
                                                    </View>
                                                    <Text style={{ color: theme.colors.crimson }}>{item.description}</Text>
                                                    <Text style={{ color: theme.colors.crimson }}>{item.time_start} - {item.time_end}</Text>
                                                </Card.Content>
                                            </Card>
                                        )}
                                    />
                                ) : <Text>No specials or happy hours have been added yet.</Text>}
                            </View>

                            <View style={{ height: 20 }}></View>
                        </View>
                    }
                    <Portal>
                        <FAB.Group
                            style={{ marginBottom: 20 }}
                            open={fabOpen}
                            onStateChange={({ open }) => setFabOpen(open)}
                            visible={showFab}
                            icon={fabOpen ? 'minus' : 'plus'}
                            actions={[
                                {
                                    icon: 'glass-mug',
                                    label: 'Add Beer',
                                    onPress: () => setShowAddBeer(true),
                                },

                                {
                                    icon: 'star-box',
                                    label: 'Add Specials',
                                    onPress: () => console.log('Pressed notifications'),
                                },
                            ]}
                            onPress={() => {
                                if (fabOpen) {
                                    // do something if the speed dial is open
                                }
                            }}
                        />
                    </Portal>
                    <Portal>
                        <Modal visible={showAddBeer} onDismiss={handleCloseModal} contentContainerStyle={modalStyles}>
                            <View style={{ flex: 1 }}>
                                {/* Header - Fixed at top */}
                                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                    <Text style={{ fontSize: 18, color: theme.colors.onSurface, flex: 1 }}>Add Beer</Text>
                                    <IconButton icon="window-close" size={20} onPress={handleCloseModal} />
                                </View>

                                <Divider />
                                <Text style={{ fontSize: 14, color: theme.colors.outline, marginBottom: 10 }}>
                                    Search for a beer below. If found, we'll auto-fill the details - you just add price and serving type.
                                </Text>
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={{ flex: 1 }}
                                >

                                    <View style={{ height: 80, marginVertical: 10 }}>
                                        <AutocompleteScrollView>
                                            <Autocomplete
                                                onChange={(newValue) => {
                                                    handleBeerSelection(newValue);
                                                }}

                                                getOptionLabel={(item) => item.name + " - " + item.abv + " - " + item.brewery_name + " - " + item.type}  // ← This tells it how to display
                                                getOptionValue={(item) => item.id}    // ← This tells it the unique key
                                                value={selectedBeer}
                                                options={beerSuggestions}
                                                inputProps={{
                                                    value: beerQuery,
                                                    placeholder: 'Search Beer',
                                                    // ...all other props which are available in react native paper
                                                    onChangeText: (search) => {
                                                        setBeerQuery(search);
                                                        setSelectedBeer(null);
                                                    },
                                                }}
                                            />
                                        </AutocompleteScrollView>

                                    </View>
                                    {!hasSearched && (
                                        <Text style={{ fontSize: 14, color: theme.colors.outline, marginBottom: 10 }}>
                                            Search in the autocomplete above to find the beer you want to add. If it's not found, just fill in the details manually.
                                        </Text>
                                    )}

                                    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">


                                        <TouchableOpacity onPress={() => setBannerVisible(false)}>
                                            <Banner visible={bannerVisible}
                                                style={{ backgroundColor: "#1B4D3E", marginLeft: 20 }}
                                                actions={[
                                                    {
                                                        label: 'Awesome!',
                                                        onPress: () => setBannerVisible(false),
                                                    },
                                                ]}
                                            >
                                                <Text style={{ color: '#A8D5A2' }}>It will take a few days for new beers to be approved by our team, but once approved, it will be added to the beer list for this bar and available for other bars to add as well. You will get extra points for adding a new beer!</Text>
                                            </Banner>
                                        </TouchableOpacity>
                                        <TextInput label="Name" value={newBeerName} onChangeText={setNewBeerName} disabled={!hasSearched || selectedBeer !== null} />
                                        <TextInput label="Brewery" value={newBrewery} onChangeText={setNewBrewery} disabled={!hasSearched || selectedBeer !== null} />
                                        <TextInput label="ABV" value={newAbv} onChangeText={setNewAbv} disabled={!hasSearched || selectedBeer !== null} />
                                        <TextInput label="Price" value={newPrice} onChangeText={setNewPrice} disabled={!hasSearched} keyboardType='numeric' />
                                        <PaperSelect
                                            disabled={!hasSearched}
                                            label="Serving Type"
                                            value={newServingType?.name || ''}
                                            onSelection={(value: any) => {
                                                const selected = servingTypes.find(type => type.name === value.text);
                                                setNewServingType(selected);
                                            }}
                                            arrayList={servingTypes.map((type) => ({
                                                _id: type.id.toString(), // ← Try adding _id
                                                value: type.name,
                                                label: type.name
                                            }))}
                                            selectedArrayList={newServingType ? [{
                                                _id: newServingType.id.toString(), // ← And here
                                                value: newServingType.name,
                                                label: newServingType.name
                                            }] : []}
                                            multiEnable={false}
                                        />
                                        <Button mode="contained" onPress={() => handleSaveChanges()} style={{ marginTop: 20 }}>Add Beer</Button>
                                    </ScrollView>

                                </KeyboardAvoidingView>
                            </View>
                        </Modal>
                    </Portal>

                </ScrollView>

            </View >
        </>
    );
}