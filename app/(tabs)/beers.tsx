import { View, Text, ScrollView } from 'react-native';
import { supabase, searchLocalBeers } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { DataTable, Avatar, Card, IconButton, Button, SegmentedButtons } from 'react-native-paper';
export default function BeersScreen() {
    const [beers, setBeers] = useState([]);
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([10, 20, 30]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const [beerView, setBeerView] = useState("table");




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
        className="flex-1 bg-philly-navy p-8"
        contentContainerStyle={{ justifyContent: 'center' }}
    >

            <Text className="text-philly-gold text-5xl">Beers</Text>

            <SegmentedButtons
                value={beerView}
                onValueChange={setBeerView}
                buttons={[
                    {
                        value: 'cards',
                        label: 'Cards',
                        checkedColor: '#FFB302',
                        uncheckedColor: '#DB7F40'
                    },
                    {
                        value: 'table',
                        label: 'Table',
                        checkedColor: '#FFB302',
                        uncheckedColor: '#DB7F40'
                    },
                ]}
            />
            
           
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title><Text className="text-philly-gold">Beer</Text></DataTable.Title>
                    <DataTable.Title numeric><Text className="text-philly-gold">Price</Text></DataTable.Title>
                    <DataTable.Title numeric><Text className="text-philly-gold">Size(OZ)</Text></DataTable.Title>
                    <DataTable.Title numeric><Text className="text-philly-gold">ABV</Text></DataTable.Title>
                </DataTable.Header>

                {beers.slice(from, to).map((beer) => (
                    <DataTable.Row key={beer.id}>
                        <DataTable.Cell> <Text className="text-philly-gold">{beer.name} </Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text className="text-philly-gold">{beer.price}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text className="text-philly-gold">{beer.size}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text className="text-philly-gold">{beer.abv}</Text></DataTable.Cell>
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