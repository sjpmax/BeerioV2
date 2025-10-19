import { BeerSuggestion } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, FlatList, Text} from 'react-native';
import { List } from 'react-native-paper';
import { phillyColors } from '../constants/colors';

interface BeerSuggestionProps {
    beerList: BeerSuggestion[];
    theme: Theme;
}

export default function BeerCardView({ beerList, theme }: BeerSuggestionProps) {

    const [expanded, setExpanded] = useState(true);
    const truncateText = (input) => input.length > 15 ? `${input.substring(0, 15)}...` : input;
    const handlePress = () => setExpanded(!expanded);
    return (


            <List.Section title="beers" className="flex flex-row p-5">
            <FlatList
                style={{ height: '100%' }}
                    data={beerList}
                keyExtractor={(item) => item.id}

                contentContainerStyle={{ paddingHorizontal: '10%', paddingBottom:  60 }}
                    renderItem={({ item}) => {
                        return (                
                            <List.Accordion
                        title={` ${truncateText(item.name)} | $${item.price} | Vaue: ${item.value_score} | ABV: ${item.abv}%`}
                                onPress={handlePress}
                                className={"potato"}
                        left={props => <List.Icon {...props} icon="glass-mug" />}
                                style={{
                                    backgroundColor: theme.colors.surfaceVariant,
                                    borderRadius: 25,
                                    borderColor: phillyColors.gold,
                                    borderWidth: 1,                                    
                                    marginTop: 10 
                                }}
                            >
                                



                                <View  style={{
                                    backgroundColor: phillyColors.lighterNavy,
                                    borderColor: phillyColors.gold,
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    borderTopWidth: 0,
                                    marginHorizontal: '4%',
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                    flexDirection: 'column',  // This makes it horizontal!
                                    justifyContent: 'space-around',  // Spreads them out
                                }}>
                                    <View style={{ padding: 8, alignItems: 'left', }}><Text style={{ fontWeight: 'bold', color: phillyColors.gold }} > {item.name} </Text></View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 8 }}>
                                        <Text className="red-text">Price: ${item.price}</Text>
                                        <Text >Size: {item.size}oz</Text>
                                    </View>

                                    {/* Second row */}
                                    <View style={{ flexDirection: 'row',  padding: 8 }}>
                                        <Text >ABV: {item.abv}%</Text>
                                        <Text >Type: {item.type}</Text>
                                    </View>
                                </View>
                            </List.Accordion>)  
                    }}
                />
                
            </List.Section>
    );
};
