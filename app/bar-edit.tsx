import { useLocalSearchParams } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { getBarDetails } from '../utils/supabase';

import React, { useEffect, useState } from 'react';
export default function barEdit() {
        const { barId } = useLocalSearchParams();

        console.log("Fetching details for bar ID:", barId); // Should log the UUID

    useEffect(() => {
        async function fetchBar() {
            if (!barId) return;

            const barDetails = await getBarDetails(barId as string);

            if (barDetails) {
                const { name, id, latitude, longitude, ...rest } = barDetails;
                console.log("Bar name:", name);
                console.log("Other stuff:", rest);
            }
        }

        fetchBar();
    }, [barId]);

	return (
		<View>
            <Text>Editing Bar: {barId}</Text>

		</View>
	);
}