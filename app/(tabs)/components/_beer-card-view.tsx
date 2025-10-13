import { BeerSuggestion } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { List } from 'react-native-paper';
import { phillyColors } from '../../../constants/colors';

interface BeerSuggestionProps {
    beerList: BeerSuggestion[];
    theme: Theme;
}

export default function BeerCardView({ beerList, theme }: BeerSuggestionProps) {

    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);
    return (


            <List.Section title="beers" className="flex flex-row p-5">
            <FlatList
                style={{ height: '100%' }}
                    data={beerList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: '10%'}}
                    renderItem={({ item}) => {
                        return (                
                            <List.Accordion
                        title={`Name: ${item.name} | Price: $${item.price} | Size: ${item.size}oz | ABV: ${item.abv}%`}
                        onPress={handlePress}
                        left={props => <List.Icon {...props} icon="glass-mug" />}
                                style={{
                                    backgroundColor: theme.colors.surfaceVariant,
                                    borderRadius: 25,
                                    borderColor: phillyColors.gold,
                                    borderWidth: 1,                                    
                                    marginTop: 10 
                                }}
                            >
                                <View style={{
                                    backgroundColor: phillyColors.lighterNavy,
                                    borderColor: phillyColors.gold,
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    borderTopWidth: 0,
                                    marginHorizontal: '4%',
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                }}>
                                    <List.Item title={`Price: $${item.price}`} />
                                    <List.Item title={`ABV: ${item.abv}%`} />
                                </View>
                            </List.Accordion>)
                    }}
                />
                
            </List.Section>
    );
};
