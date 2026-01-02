import { useLocalSearchParams, Stack } from 'expo-router';
import { FlatList, View, TouchableOpacity, ScrollView } from 'react-native';
import { getBarDetails, getStates, States, getBarBeers, ExpoAsyncStorageAdapter } from '../utils/supabase';
import { Button, Text, IconButton, Modal, Portal, Snackbar, useTheme, ActivityIndicator, FAB, Card, Icon, TextInput, Dialog, Divider } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Autocomplete } from 'react-native-autocomplete-input';

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function barEdit() {

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
    const [fabOpen, setFabOpen] = useState(false);
    const [showFab, setShowFab] = useState(true);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const modalStyles = {
        backgroundColor: theme.colors.surface,
        padding: 20,
        margin: 20,
        borderRadius: 8,
        height: 500,
    };
    const [showAddBeer, setShowAddBeer] = useState(false);
    const [showAddSpecial, setShowAddSpecial] = useState(false);
    const [newBeerName, setNewBeerName] = useState('');
    const [newBrewery, setNewBrewery] = useState('');
    const [newAbv, setNewAbv] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newServingType, setNewServingType] = useState('');



    useEffect(() => {
        async function fetchBarBeers() {
            console.log("Fetching beers for bar ID:", barId);
            if (!barId) return;

            setIsLoading(true);
            const barData = await getBarBeers(barId as string);

            if (barData) {
                setBarDetails(barData.barDetails);
                setBeersOffered(barData.beersOffered);
                setBarSpecials(barData.barSpecials);
                console.log("Fetched beers:", barData.beersOffered);
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
    }, []);


    const handleDialogDismiss = () => {
        setInfoDialogVisible(false);
        AsyncStorage.setItem('bar.edit.alert.seen', 'true');
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
                        <Modal
                            visible={showAddBeer}
                            onDismiss={() => setShowAddBeer (false)}
                            contentContainerStyle={modalStyles}
                        >
                            <View style={{ justifyContent: 'space-between',  marginBottom: 10, flex: 1 }}>
                               {/* Need name, brewery, abv, price, serving type (bottle, can, draft, etc)*/}
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={{ fontSize: 18, marginBottom: 10, color: theme.colors.onSurface, flex: 1 }}>Filter Beers</Text>
                                    <IconButton
                                        icon="window-close"
                                        size={20}
                                        onPress={() => setShowAddBeer(false)}
                                        accessibilityLabel="Close filter modal"
                                        style={{ margin: 0, padding: 0 }}
                                    />
                                </View>
                                <Divider style={{ marginVertical: 10 }} />
                                <View style={{ flex: 10 }}>
                                    <TextInput label="Name" value={newBeerName} onChangeText={setNewBeerName} />
                                    <TextInput label="Brewery" value={newBrewery} onChangeText={setNewBrewery} />
                                    <TextInput label="ABV" value={newAbv} onChangeText={setNewAbv} />
                                    <TextInput label="Price" value={newPrice} onChangeText={setNewPrice} />
                                    <TextInput label="Serving Type" value={newServingType} onChangeText={setNewServingType} />
                                    <Button mode="contained" onPress={() => console.log('Add beer')} style={{ marginTop: 20 }}>Add Beer</Button>
                                </View>
                            </View>

                        </Modal>
                    </Portal>

                </ScrollView>
            </View>
        </>
    );
}