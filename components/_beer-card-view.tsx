import { BeerSuggestion } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
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

    const getValueGrade = (score) => {
    if (score <= 0.09) return 'A';
    if (score <= 0.10) return 'B';
    if (score <= 0.12) return 'C';
    if (score <= 0.14) return 'D';
    return 'F';
}
    return (


            <List.Section title="" className="flex flex-row p-5">
            <FlatList
                style={{ height: '100%' }}
                    data={beerList}
                keyExtractor={(item) => item.id}

                contentContainerStyle={{ paddingHorizontal: '10%', paddingBottom:  60 }}
                    renderItem={({ item}) => {
                        return (                
                            <List.Accordion
                        title={` ${truncateText(item.name)} | $${item.price} | Vaue: ${getValueGrade(item.value_score)} | ABV: ${item.abv}%`}
                                onPress={handlePress}
                        left={props => <List.Icon {...props} />}
                                style={{
                                    backgroundColor: theme.colors.popLight,
                                    borderRadius: 2,
                                    borderColor: phillyColors.gold,
                                    borderWidth: 1,                                    
                                    marginTop: 10 ,
                                    paddingRight: 5,
                                }}
                                titleStyle={{ color: theme.colors.accentGold, marginLeft: -20 }}
                            >
                                



                                <View  style={{
                                    backgroundColor: phillyColors.cardBG,
                                    borderColor: phillyColors.gold,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderTopWidth: 0,
                                    marginHorizontal: '2%',
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                    flexDirection: 'column',  // This makes it horizontal!
                                    justifyContent: 'space-around',  // Spreads them out
                                }}>
                                    <View style={{ padding: 8, alignItems: 'left', }}><Text style={{ fontWeight: 'bold', color: phillyColors.gold }} > {item.name} </Text></View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 8 }}>
                                        <Text className="card-text">Price: ${item.price}</Text>
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
