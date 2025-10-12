import { View, Text, ScrollView } from 'react-native';
import { supabase, searchLocalBeers, BeerSuggestion } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { DataTable,SegmentedButtons, useTheme, List } from 'react-native-paper';
import { Theme } from '@react-navigation/native';
import { BeerTableView } from './beerTableView';




//function viewBeerAsCards() {

//    const [expanded, setExpanded] = useState(true);

//    const handlePress = () => setExpanded(!expanded);
//    return (
//        <View>
//            <List.Section title="Accordions">
//                <List.Accordion
//                    title="Uncontrolled Accordion"
//                    left={props => <List.Icon {...props} icon="folder" />}>
//                    <List.Item title="First item" />
//                    <List.Item title="Second item" />
//                </List.Accordion>

//                <List.Accordion
//                    title="Controlled Accordion"
//                    left={props => <List.Icon {...props} icon="glass-mug" />}
//                    expanded={expanded}
//                    onPress={handlePress}>
//                    <List.Item title="First item" />
//                    <List.Item title="Second item" />
//                </List.Accordion>
//            </List.Section>
//        </View>
//    );
//} 

//function viewBeerAsTable({ beers:String[]  }) {

//    return (
//       
//    );
//}

const viewBeerAsCards = () => {
    return (
        <View>
            <Text>Card View Coming Soon!</Text>
        </View>
    );
}

export default function BeersScreen() {
    const [beers, setBeers] = useState([]);
    const [beerView, setBeerView] = useState("Table");
    const beerViewTitles = ['Cards', 'Table'];

    const handleBeerViewChange = (value: string) => {
        setBeerView(value);
    }

    const theme = useTheme();



    useEffect(() => {
        async function fetchBeers() {
            const results = await searchLocalBeers('');
            setBeers(results);
            console.log(results);
        }
        fetchBeers();
    }, []);


    return (
        <ScrollView
            className="flex-1 p-15 mt-6"
            contentContainerStyle={{ justifyContent: 'center' }}
            style={{ backgroundColor: theme.colors.background }}
        >


            

            <SegmentedButtons
                value={beerView}
                onValueChange={handleBeerViewChange}
                style={{ marginHorizontal: '35%', marginTop: 25 }}
                buttons={beerViewTitles.map((section) => ({
                    value: section,
                    label: section,
                    style: {
                        backgroundColor:
                            beerView === section
                                ? theme.colors.primary
                                : theme.colors.surfaceVariant,
                        borderColor: theme.colors.outline,
                    },
                    labelStyle: {
                        color:
                            beerView === section
                                ? theme.colors.onPrimary
                                : theme.colors.onSurfaceVariant,
                    },
                }))}
            />
            {beerView === 'Table' ? (
                <BeerTableView beerList={beers} theme={theme} />
            ) : (
                viewBeerAsCards()
            )}
           
            </ScrollView>
    );
}