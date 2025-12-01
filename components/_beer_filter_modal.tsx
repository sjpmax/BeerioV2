
import { GroupedBeer } from '@/utils/supabase';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton } from 'react-native-paper';


export default function BeerFilterModal({ modalVisible, hideModal, groupedBeers, selectedTypes, setSelectedTypes, servingTypes, setServingTypes, priceFilter, setPriceFilter, distanceFilter, setDistanceFilter, theme }:
    { modalVisible: boolean, hideModal: any, groupedBeers: Record<string, GroupedBeer>, selectedTypes: Set<string>, setSelectedTypes: (types: Set<string>) => void, servingTypes: Set<string>, setServingTypes: (types: Set<string>) => void, priceFilter: number, setPriceFilter: (price: number) => void, distanceFilter: number, setDistanceFilter: (distance: number) => void, theme: any }) {

    const [priceFilterLocal, setPriceFilterLocal] = useState(priceFilter);
    const [distanceFilterLocal, setDistanceFilterLocal] = useState(distanceFilter);
    const sortedGroups = new Set(Object.values(groupedBeers).map(a => a.type_group));

    const allServingTypes = ["individual", "group"];

    const maxPrice = Math.max(...Object.values(groupedBeers).map(beer => beer.best_price || 0));
    const minPrice = Math.min(...Object.values(groupedBeers).map(beer => beer.best_price || 0));

    const toggleType = (type: string) => {
        const newSet = new Set(selectedTypes);
        if (newSet.has(type)) {
            newSet.delete(type);
        } else {
            newSet.add(type);
        }
        setSelectedTypes(newSet);
    };
    const toggleServingType = (servingType: string) => {
        const newSet = new Set(servingTypes);
        if (newSet.has(servingType)) {
            newSet.delete(servingType);
        } else {
            newSet.add(servingType);
        }
        setServingTypes(newSet);
    };

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: theme.colors.onSurface, flex: 1 }}>Filter Beers</Text>
                <IconButton
                    icon="window-close"
                    size={20}
                    onPress={hideModal}
                    accessibilityLabel="Close filter modal"
                    style={{ margin: 0, padding: 0 }}
                />
            </View>
            <Divider style={{ marginVertical: 10 }} />
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: 300 }}>
                <View style={{ flex: 1,marginTop: 10 }}>
                    {/* Filter options will go here */}
                    <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>Max Price: ${priceFilter}</Text>
                    <Slider
                        minimumValue={minPrice}
                        maximumValue={maxPrice}
                        step={0.5}
                        value={priceFilter}
                        onValueChange={(value) => setPriceFilter(value)}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.onSurfaceVariant}
                        tapToSeek={true}
                        style={{ marginTop: 10, height: 1 }}
                    />

                </View>
                <View style={{ flex: 1 }}>
                    {/* Filter options will go here */}
                    <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>Max Search Radius: {distanceFilter}Mi</Text>
                    <Slider
                        minimumValue={.5}
                        maximumValue={2}
                        step={.5}
                        value={distanceFilter}
                        onValueChange={(value) => setDistanceFilter(parseFloat(value.toFixed(2)))}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.onSurfaceVariant}
                        tapToSeek={true}
                    />

                </View>
                <View style={{ flex: 1,marginTop: 0  }}>
                    <Text style={{ color: theme.colors.onSurface , fontWeight: 'bold'}}>Beer Types:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                        {Array.from(sortedGroups).map((type, idx) => (
                            <TouchableOpacity
                                key={type}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 15,
                                    marginBottom: 5,
                                    padding: 5 // Add some padding for easier tapping
                                }}
                                onPress={() => toggleType(type)}
                            >
                                <Checkbox
                                    key={idx}
                                    value={selectedTypes.has(type)}
                                    onValueChange={() => toggleType(type)}
                                />
                                <Text style={{ color: theme.colors.onSurfaceVariant, marginLeft: 5 }}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
                <View style={{ flex: 1,height: '40%', marginTop: 30  }}>
                    <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>Serving size:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                        {allServingTypes.map((servingType, idx) => ( 
                            <TouchableOpacity
                                key={servingType}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 15,
                                    marginBottom: 5,
                                    padding: 5
                                }}
                                onPress={() => toggleServingType(servingType)}
                            >
                                <Checkbox
                                    key={idx}
                                    value={servingTypes.has(servingType)}  // <- This checks current state
                                    onValueChange={() => toggleServingType(servingType)}
                                />
                                <Text style={{ color: theme.colors.onSurfaceVariant, marginLeft: 5 }}>
                                    {servingType}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </View>

    );
}