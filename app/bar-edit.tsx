import { useLocalSearchParams } from 'expo-router';
import { FlatList, View } from 'react-native';
import { getBarDetails, getStates, States } from '../utils/supabase';
import { Button, Text, IconButton, Modal, Portal, SegmentedButtons, Snackbar, useTheme, ActivityIndicator, FAB, Card, Icon, TextInput } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select'

import React, { useEffect, useState } from 'react';
export default function barEdit() {
    const { barId } = useLocalSearchParams();
    const theme = useTheme();
    console.log("Fetching details for bar ID:", barId); // Should log the UUID
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
                    <PaperSelect
                        label="State"
                        value={barDetails.state}
                        onValueChange={(value) => setBarDetails({ ...barDetails, state: value })}
                    >
                        {statesList.map((state) => (
                            <PaperSelect.Item key={state.id} label={state.name} value={state.id} />
                        ))}
                    </PaperSelect>
                </View>
            }

        </View>
    );
}