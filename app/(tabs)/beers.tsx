import { View, Text, ScrollView } from 'react-native';
import { supabase, searchLocalBeers } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { DataTable, Avatar, Card, IconButton, Button, SegmentedButtons, useTheme } from 'react-native-paper';

export default function BeersScreen() {
    const [beers, setBeers] = useState([]);
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([10, 20, 30]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const [beerView, setBeerView] = useState("Table");
    const beerViewTitles = ['Cards', 'Table'];

    const handleBeerViewChange = (value: string) => {
        setBeerView(value);
    }

    const theme = useTheme();


    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, beers.length);

    console.log(`from: ${from} to ${to}, beer length ${beers.length}`);
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
        className="flex-1 p-8"
            contentContainerStyle={{ justifyContent: 'center' }}
        style={{ backgroundColor: '#001F3F' }} 
    >

            <Text className="text-5xl">Beers</Text>
            <SegmentedButtons
                value={beerView}
                onValueChange={handleBeerViewChange}
                buttons={beerViewTitles.map((section) => ({
                    value: section,
                    label: section,
                    style: {
                        backgroundColor:
                            beerView === section
                                ? theme.colors.surface
                                : theme.colors.surfaceVariant,
                        borderColor: theme.colors.outline,
                    },
                    labelStyle: {
                        color:
                            beerView === section
                                ? theme.colors.onSurface
                                : theme.colors.onSurfaceVariant,
                    },
                }))}
            />
            
           
            <DataTable  >
                <DataTable.Header>
                    <DataTable.Title><Text style={{ color: theme.colors.onPrimary}}> Beer</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onPrimary}}> Price</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onPrimary}}> Size(OZ)</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onPrimary}}> ABV</Text></DataTable.Title>
                </DataTable.Header>

                {beers.slice(from, to).map((beer) => (
                    <DataTable.Row key={beer.id}>
                        <DataTable.Cell>  <Text style={{ color: theme.colors.onPrimary}}> {beer.name} </Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onPrimary}}> {beer.price}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onPrimary}}> {beer.size}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onPrimary}}> {beer.abv}</Text></DataTable.Cell>
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(beers.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${beers.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
            </ScrollView>
    );
}