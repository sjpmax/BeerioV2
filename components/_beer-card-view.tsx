import { LocationStatus } from '@/hooks/useLocation'; // Only import the type
import { calculateDistancesFromArray, openInMaps } from '@/utils/mapUtils';
import { GroupedBeer } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Icon, List } from 'react-native-paper'; // Import Avatar properly
import { phillyColors } from '../constants/colors';

interface BeerSuggestionProps {
    groupedBeers: Record<string, GroupedBeer>;
    theme: Theme;
    location: Location.LocationObject | null;
    locationStatus: LocationStatus;
    getDistanceMessage: (lat?: number | null, long?: number | null) => string;
}

export default function BeerCardView({
    groupedBeers,
    theme,
    location,
    locationStatus,
    getDistanceMessage
}: BeerSuggestionProps) {
    const [expanded, setExpanded] = useState<boolean>(true);
    const [expandedIds, setExpandedIds] = useState(new Set());
    const truncateText = (input: string, maxLength: number): string => input.length > maxLength ? `${input.substring(0, maxLength)}…` : input;

    const getCardColor = (index: number, totalItems: number) => {
        // Creates a gradient from one color to another
        const startColor = { r: 42, g: 74, b: 94 };  // Your popLight color
        const endColor = { r: 89, g: 78, b: 128 }; // Your accent color
        //const endColor = { r: 10, g: 25, b: 41 };    // Darker blue

        const ratio = index / totalItems;

        const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

        return `rgb(${r}, ${g}, ${b})`;
    };

    const toggleAccordion = (id: string) => {
        setExpandedIds(prevState => {
            const newState = new Set(prevState);
            if (newState.has(id)) {
                newState.delete(id);
            } else {
                newState.add(id);
            }
            return newState;
        });
    };
    // Make sure groupedBeers is an array before passing it
    const beersArray = Array.isArray(groupedBeers) ? groupedBeers : Object.values(groupedBeers);
    const distances = calculateDistancesFromArray(location, beersArray);

    return (
        <List.Section title="" className="flex flex-row p-5">
            <FlatList
                style={{ height: '100%' }}
                data={Object.values(groupedBeers)}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: '10%', paddingBottom: 60 }}
                renderItem={({ item, index }) => (
                    <List.Accordion
                        title={`$/Oz: ${typeof item.best_cost_per_oz === 'string'
                            ? parseFloat(item.best_cost_per_oz).toFixed(2)
                            : item.best_cost_per_oz?.toFixed(2) || 'N/A'
                            } - ${truncateText(item.name, 30)}`}
                        expanded={expandedIds.has(item.id)}
                        onPress={() => toggleAccordion(item.id)}
                        style={{
                            backgroundColor: getCardColor(index, Object.values(groupedBeers).length),
                            borderRadius: 2,
                            borderColor: phillyColors.gold,
                            borderWidth: 1,
                            marginTop: 10,
                            paddingRight: 5,
                            paddingLeft: 20,
                        }}
                        titleStyle={{ color: '#fff', marginLeft: -20 }}
                    >
                        <View style={{
                            backgroundColor: phillyColors.cardBG,
                            borderColor: phillyColors.gold,
                            borderWidth: 1,
                            borderRadius: 5,
                            borderTopWidth: 0,
                            marginHorizontal: '2%',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            padding: 8,
                        }}>
                            {/* Beer name */}

                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                    <Text style={{ fontWeight: 'bold', color: phillyColors.gold }}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: phillyColors.gold }}> {item.type}</Text>
                                </View>


                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text style={{ fontWeight: 'bold', color: phillyColors.gold }}>
                                        ${item.best_price}
                                    </Text>
                                </View>
                            </View>

                            {/* First row - Price and Size */}
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: phillyColors.gold }}> {item.abv}%</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: phillyColors.gold }}>{item.locations[0].size}oz</Text>
                                </View>
                            </View>

                            {/* Second row - Location */}
                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ flex: 2 }}>
                                    {expandedIds.has(item.id) && item.locations && item.locations.length > 0 && (
                                        <Text style={{ color: phillyColors.gold }}>
                                            <Text
                                                style={{ color: phillyColors.accent, fontWeight: 'bold' }}
                                                onPress={() => openInMaps(
                                                    item.locations[0].bar_lat,
                                                    item.locations[0].bar_long,
                                                    item.name
                                                )}
                                            >
                                                <Icon source="map-marker" size={16} color={phillyColors.gold} />
                                                {item.locations[0].bar_name || 'N/A'}

                                                {location
                                                    ? `, (${distances[`${item.locations[0].bar_lat}-${item.locations[0].bar_long}`] ?? 'N/A'} mi)`
                                                    : ', Location permission not granted'}
                                            </Text>
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "#AAA", paddingLeft: 2 }}>Available at these Location(s):</Text>

                                {item.locations.map((location, index) => (
                                    <View key={index} style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 3 }}>
                                            <Text style={{ color: "#AAA", paddingLeft: 2 }}>
                                                <Text
                                                    style={{ color: "#AAA", fontWeight: 'bold' }}
                                                    onPress={() => openInMaps(
                                                        location.bar_lat,
                                                        location.bar_long,
                                                        item.name
                                                    )}
                                                >
                                                    <Icon source="map-marker" size={16} color={"#AAA"} />
                                                    {truncateText(location.bar_name, 6) || 'N/A'}
                                                    {location
                                                        ? `, (${distances[`${location.bar_lat}-${location.bar_long}`] ?? 'N/A'} mi)`
                                                        : ', Location permission not granted'}
                                                </Text>
                                                - ${location.price} for {location.size}oz
                                            </Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                                            <Text style={{ color: index === 0 ? "#FFF" : "#AAA", paddingLeft: 2 }}>
                                                {index === 0
                                                    ? `($${parseFloat(location.cost_per_alcohol_oz).toFixed(2)}/Oz)`
                                                    : `(${parseFloat(location.cost_per_alcohol_oz).toFixed(2)}/Oz)`}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                        </View>
                    </List.Accordion>
                )}
            />
        </List.Section>
    );
};

