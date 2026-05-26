import { BarDetails } from '@/utils/supabase';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';

interface Props {
    bars: BarDetails[];
    theme: any;
}

export default function BarTableView({ bars, theme }: Props) {
    const goToEdit = (barId: string) => {
        router.push({ pathname: '/bar-edit', params: { barId } });
    };

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title numeric>Distance</DataTable.Title>
                    <DataTable.Title>Special</DataTable.Title>
                    <DataTable.Title>Edit</DataTable.Title>
                </DataTable.Header>

                {bars.map((bar) => (
                    <DataTable.Row key={bar.id} onPress={() => goToEdit(bar.id)}>
                        <DataTable.Cell>
                            <Text style={{ color: theme.colors.onBackground }} numberOfLines={1}>
                                {bar.name}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell numeric>
                            <Text style={{ color: theme.colors.onBackground }}>
                                {bar.dist_meters != null
                                    ? `${(bar.dist_meters / 1609.344).toFixed(1)} mi`
                                    : '—'}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                            <Text style={{ color: theme.colors.onBackground }}>
                                {bar.has_active_special ? '✓' : '—'}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                            <IconButton
                                icon="pencil"
                                size={18}
                                onPress={() => goToEdit(bar.id)}
                            />
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </ScrollView>
    );
}
