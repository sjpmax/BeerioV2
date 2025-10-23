import { GroupedBeer } from '@/utils/supabase';
import { Link, Theme } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Linking, Platform, Text, View } from 'react-native';
import { Icon, List } from 'react-native-paper';
import { phillyColors } from '../constants/colors';
import useLocation from '../hooks/useLocation';
const { Avatar } = require('react-native-paper');

interface BeerSuggestionProps {
    groupedBeers: Record<string, GroupedBeer>;
    theme: Theme;
}

export default function BeerCardView({ groupedBeers, theme }: BeerSuggestionProps) {

    const [expanded, setExpanded] = useState<boolean>(true);
    const truncateText = (input: string): string => input.length > 30 ? `${input.substring(0, 30)}...` : input;
    const handlePress = () => setExpanded(!expanded);
    const { location, requestPermission } = useLocation();
    const openInMaps = async (latitude: number, longitude: number) => {
        if (latitude == null || longitude == null) return;
        const coords = `${latitude},${longitude}`;
        // Try platform-specific URI first, fallback to Google Maps web URL
        const appUrl = Platform.OS === 'ios'
            ? `maps:0,0?q=${coords}`
            : `geo:0,0?q=${coords}`;
        const webUrl = `https://maps.google.com?q=${coords}`;

        try {
            const can = await Linking.canOpenURL(appUrl);
            await Linking.openURL(can ? appUrl : webUrl);
        } catch (err) {
            console.error('Unable to open map URL', err);
            // final fallback
            await Linking.openURL(webUrl);
        }
    };

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

    const distanceFromBar = (barLat?: number | null, barLong?: number | null): string | null => {
        if (location && typeof barLat === 'number' && typeof barLong === 'number') {
            //console.log('Calculating distance from bar:', { barLat, barLong, userLat: location.coords.latitude, userLong: location.coords.longitude });
            const toRad = (value: number) => (value * Math.PI) / 180;
            const R = 3958.8; // Radius of the Earth in miles
            console.log('User location:', location.coords.latitude, location.coords.longitude);
            console.log('Bar location:', barLat, barLong);
            const dLat = toRad(barLat - location.coords.latitude);
            const dLon = toRad(barLong - location.coords.longitude);

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(location.coords.latitude)) *
                Math.cos(toRad(barLat)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            return distance.toFixed(2); // Return distance in miles, rounded to 2 decimal places
        }

        return null;
    }


    return (


        <List.Section title="" className="flex flex-row p-5">
            <FlatList
                style={{ height: '100%' }}
                data={Object.values(groupedBeers)}
                keyExtractor={(item) => item.id}

                contentContainerStyle={{ paddingHorizontal: '10%', paddingBottom: 60 }}
                renderItem={({ item, index }) => {
                    return (

                        <List.Accordion
                            title={`$/Oz: ${item.best_cost_per_oz} -  ${truncateText(item.name)}  `}
                            onPress={handlePress}
                            // right={props => renderValueGradeAvatar(item.value_score ?? 0)}
                            style={{
                                backgroundColor: getCardColor(index, Object.values(groupedBeers).length),
                                // backgroundColor: (theme.colors as any).popLight ?? theme.colors.background,
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
                                    <View style={{ flex: 1 , alignItems: 'flex-start' }}>
                                        <Text style={{ fontWeight: 'bold', color: phillyColors.gold }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                                        <Text style={{ fontWeight: 'bold', color: phillyColors.gold }}>
                                            ${item.price}
                                        </Text>
                                    </View>
                                </View>

                                {/* First row - Price and Size */}
                                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: phillyColors.gold }}> {item.abv}%</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: phillyColors.gold }}>{item.size}oz</Text>
                                    </View>
                                     <View style={{ flex: 1 }}>
                                        <Text style={{ color: phillyColors.gold }}> {item.type}</Text>
                                    </View>
                                </View>

                                {/* Second row - Location */}
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={{ color: phillyColors.gold }}><Link style={{ color: phillyColors.accent, fontWeight: 'bold' }} source="map-marker" size={16} color={phillyColors.gold} onPress={() => openInMaps(item.bar_lat, item.bar_long)} >
                                            <Icon source="map-marker" size={16} color={phillyColors.gold} /> {item.bar_name || 'N/A'}
                                            {location
                                                ? `, (${distanceFromBar(item.bar_lat, item.bar_long) ?? 'N/A'} mi)`
                                                : ', Location permission not granted'}
                                        </Link>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </List.Accordion>)
                }}
            />

        </List.Section>
    );
};

