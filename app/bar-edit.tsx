import { useLocalSearchParams } from 'expo-router';
import { FlatList, View } from 'react-native';
import { getBarDetails, getStates, States, getBarBeers } from '../utils/supabase';
import { Button, Text, IconButton, Modal, Portal, SegmentedButtons, Snackbar, useTheme, ActivityIndicator, FAB, Card, Icon, TextInput } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select'

import React, { useEffect, useState } from 'react';
export default function barEdit() {
    const { barId } = useLocalSearchParams();
    const theme = useTheme();
    const [barDetails, setBarDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statesList, setStatesList] = useState<States[]>([]);

    useEffect(() => {
        async function fetchBar() {
            if (!barId) return;

            setIsLoading(true);
            const details = await getBarDetails(barId as string);

            if (details) {
                setBarDetails(details);
            }
            setIsLoading(false);
        }

        fetchBar();
    }, [barId]);

    useEffect(() => {
        async function fetchBarBeers() {
            console.log("Fetching beers for bar ID:", barId);
            if (!barId) return;

            setIsLoading(true);
            const beers = await getBarBeers(barId as string);

            if (beers) {
                setBarDetails((prevDetails) => ({
                    ...prevDetails,
                    beers_offered: beers,
                }));

                const beersArray = Array.isArray(beers) ? beers : Object.values(beers);
                console.log(beersArray.length);
                console.log("Fetched beers for bar:", beers);
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
    }, []);


    return (
        <View
            className="flex-1 p-15"
            style={{ backgroundColor: theme.colors.background }}>
            {isLoading && <ActivityIndicator />}

            {barDetails &&
                <View>
                    <Text variant="headlineLarge">Editing Bar: {barDetails.name}</Text>
                    <TextInput 
                        label="Bar Name"
                        value={barDetails.name}
                        onChangeText={(text) => setBarDetails({ ...barDetails, name: text })}
                    />
                    <TextInput
                        label="Bar Street Address"
                        value={barDetails.street_address}
                        onChangeText={(text) => setBarDetails({ ...barDetails, street_address: text })}
                    />
                    <TextInput
                        label="City"
                        value={barDetails.city}
                        onChangeText={(text) => setBarDetails({ ...barDetails, city: text })}
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
                        value={barDetails.zip}
                        onChangeText={(text) => setBarDetails({ ...barDetails, zip: text })}
                    />

                    <Text variant="headlineMedium">Beers</Text>
                    <FlatList
                        data={barDetails.beers_offered}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Card className="mb-10">
                                <Card.Title title={item.beer_name} subtitle={`${item.serving_type} - $${item.price}`} />
                            </Card>
                        )}
                    />
                    <Text variant="bodyMedium">Total Beers Offered: {Object.values(barDetails.beers_offered).length}</Text>
                </View>
            }

        </View>
    );
}