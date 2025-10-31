import useLocation, { LocationStatus } from '@/hooks/useLocation';
import { calculateBarDistances, openInMaps } from '@/utils/mapUtils';
import { GroupedBeer } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Icon, List } from 'react-native-paper';
import { phillyColors } from '../constants/colors';

const { Avatar } = require('react-native-paper');
const { location, status, errorMsg, refreshLocation, getDistanceMessage } = useLocation();

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
    const handlePress = () => setExpanded(!expanded);

   

    console.log('Current location in BeerCardView:', location);


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

    const getValueGrade = (score: number): string => {
        // Lazy-require Avatar so you don't need to modify top-level imports here.
        // You can replace this with a top-level: `import { Avatar } from 'react-native-paper'`
        // and change the return type if you prefer static imports.

        const grade = score <= 0.09 ? 'A'
            : score <= 0.10 ? 'B'
                : score <= 0.12 ? 'C'
                    : score <= 0.14 ? 'D'
                        : 'F';


        return grade;
    };

    const renderValueGradeAvatar = (score: number) => {
        const grade = getValueGrade(score);
        const colorMap: Record<string, string> = {
            A: '#2ecc71',
            B: '#9bdb6a',
            C: '#f1c40f',
            D: '#e67e22',
            F: '#e74c3c',
        };

        return (
            <View
                style={{
                    position: 'absolute',
                    right: 25,
                    top: '50%',
                    transform: [{ translateY: -12 }]
                }}
            >
                <View
                    style={{
                        backgroundColor: colorMap[grade],
                        borderRadius: 6,
                        height: 28, // Reduced height here
                        width: 28, // Making it square for better proportions
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        {grade}
                    </Text>
                </View>
            </View>
        );
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

    const distances = useMemo(() => 
    calculateBarDistances(location, groupedBeers), 
    [location, groupedBeers]
);

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
                                    <View key={index} style={{flexDirection: 'row'}}> 
                                    <View style={{ flex: 3}}>
                                    <Text  style={{ color: "#AAA", paddingLeft: 2 }}>
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

