import { BarDetails } from '@/utils/supabase';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Icon } from 'react-native-paper';

interface BarCardItem extends BarDetails {
    beer_count?: number;       // v2
    best_beer_name?: string;   // v2
    best_value?: number;       // v2 — $ per alcohol oz
}

interface Props {
    bars: BarCardItem[];
    theme: any;
}

export default function BarCardView({ bars, theme }: Props) {
    const goToEdit = (barId: string) => {
        router.push({ pathname: '/bar-edit', params: { barId } });
    };

    return (
        <FlatList
            data={bars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => goToEdit(item.id)}>
                    <Card style={{ marginVertical: 5 }}>
                        <Card.Content>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', color: theme.colors.onBackground, flex: 1 }}>
                                    {item.name}
                                </Text>
                                <Text style={{ color: theme.colors.onBackground }}>
                                    {item.dist_meters != null
                                        ? `${(item.dist_meters / 1609.344).toFixed(2)} mi`
                                        : '—'}
                                </Text>
                            </View>
                            <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                                {[item.street_address, item.city, item.state, item.zip].filter(Boolean).join(', ')}
                            </Text>

                            {/* v2 fields render conditionally */}
                            {item.beer_count != null && (
                                <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                    {item.beer_count} beer{item.beer_count === 1 ? '' : 's'} listed
                                    {item.best_beer_name && item.best_value != null
                                        ? ` • best: ${item.best_beer_name} ($${item.best_value.toFixed(2)}/oz)`
                                        : ''}
                                </Text>
                            )}

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Icon
                                        source={item.has_active_special ? 'check-circle' : 'octagon'}
                                        color={item.has_active_special ? 'green' : 'red'}
                                        size={16}
                                    />
                                    <Text style={{ color: theme.colors.onBackground, marginLeft: 4 }}>
                                        {item.has_active_special ? 'Specials active' : 'No current specials'}
                                    </Text>
                                </View>
                                <Button
                                    mode="contained-tonal"
                                    icon="pencil"
                                    compact
                                    onPress={() => goToEdit(item.id)}
                                >
                                    Edit
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            )}
        />
    );
}
