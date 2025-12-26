import { supabase, searchNearbyBars, BarDetails } from '@/utils/supabase';

import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Button, IconButton, Modal, Portal, SegmentedButtons, Snackbar, useTheme, ActivityIndicator, FAB, Card, Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import useLocation from '@/hooks/useLocation';
import * as Localization from 'expo-localization';
export default function BarsScreen() {

    const [distanceFilter, setDistanceFilter] = useState(2);
    const [isLoading, setIsLoading] = useState(true);
    const [bars, setBars] = useState<BarDetails[]>([]);
    const { location, status, refreshLocation, getDistanceMessage } = useLocation();
    const userTimezone = Localization.timezone;
    const theme = useTheme();
    const [fabOpen, setFabOpen] = useState(false);
    useEffect(() => {
        async function fetchBars() {
            if (status !== 'success') {

                return;
            }
            setIsLoading(false);
            // Convert distanceFilter to meters because our DB function uses meters
            let distanceInMeters = distanceFilter * 1609.344;

            const results = await searchNearbyBars(
                location?.coords.latitude || 0,
                location?.coords.longitude || 0,
                distanceInMeters,
                userTimezone
            );

            console.log("**********@@@@@@@@@@@@@@@@@@@@@@@*******");
            console.log("bars n' shit", results);
            console.log("**********@@@@@@@@@@@@@@@@@@@@@@@*******");
            setBars(results);
        }
        fetchBars();
    }, [status, distanceFilter]); // Only depends on location status



    return (
        <View
            className="flex-1 p-15"
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
            {!isLoading && (
                <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.onBackground }}>
                        Found {bars.length} bars
                    </Text>
                    <FlatList
                        data={bars}
                        renderItem={({ item }) => (
                            <Card style={{ marginVertical: 5 }}>
                                <Card.Title
                                    title={item.name}
                                    titleStyle={{ color: theme.colors.onBackground }}
                                    subtitle={item.street_address + ', ' + item.city + ', ' + item.state + ' ' + item.zip}
                                />
                                <Card.Content>
                                     {/* show green check if has special right now*/}
                                    <Text style={{ color: theme.colors.onBackground }}>
                                        {item.has_active_special ? <Icon source="check-circle" color="green" size={16} /> : <Icon source="octagon" color="red" size={16} />}
                                        {item.has_active_special ? ' This bar has current beer specials!' : ' No current beer specials found.'}
                                    </Text>
                                </Card.Content>
                            </Card>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                    //<Portal>
                    //    <FAB.Group
                    //        style={{ marginBottom: 80 }}
                    //        open={fabOpen}
                    //        onStateChange={({ open }) => setFabOpen(open)}
                    //        visible
                    //        icon={fabOpen ? 'minus' : 'plus'}
                    //        actions={[
                    //            {
                    //                icon: 'glass-mug',
                    //                label: 'Add Beers',
                    //                onPress: () => console.log('Pressed star'),
                    //            },
                    //            {
                    //                icon: 'store-plus',
                    //                label: 'Add Bar',
                    //                onPress: () => console.log('Pressed email'),
                    //            },
                    //            {
                    //                icon: 'bell',
                    //                label: 'Specials Reminders',
                    //                onPress: () => console.log('Pressed notifications'),
                    //            },
                    //        ]}
                    //        onPress={() => {
                    //            if (fabOpen) {
                    //                // do something if the speed dial is open
                    //            }
                    //        }}
                    //    />
                    //</Portal>
            )}

        </View>
    );
}