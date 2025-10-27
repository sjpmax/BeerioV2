import { phillyColors } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

export default function BeerTableHeader() {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.gold }}>Name</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.gold }}>ABV</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.gold }}>Type</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.gold }}>Best Cost/Oz</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.gold }}>Best Size</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.gold }}>Best Price</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.gold }}>Source</Text>
        </View>
    );
}