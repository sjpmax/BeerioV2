import { BeerSuggestion } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';

interface BeerSuggestionProps {
    groupedBeers: BeerSuggestion[];
    theme: Theme;
}

export default function BeerTableView({ groupedBeers, theme }: BeerSuggestionProps) {

    console.log('Rendering BeerTableView with beers:', Object.values(groupedBeers));
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([10, 20, 30]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, Object.values(groupedBeers).length);


    return (
        <View style={{ backgroundColor: theme.colors.background}}>

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title><Text style={{ color: theme.colors.onSecondary }}> Beer</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onSecondary }}> Price</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onSecondary }}> Size(OZ)</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onSecondary }}> ABV</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{color: theme.colors.onSecondary  }}>$/Oz</Text></DataTable.Title>
                </DataTable.Header>

                {Object.values(groupedBeers).slice(from, to).map((beer) => (
                    <DataTable.Row key={beer.id}>
                        <DataTable.Cell>  <Text style={{ color: theme.colors.onSecondary }}> {beer.name} </Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onSecondary }}> {beer.best_price}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onSecondary }}> {beer.best_size}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onSecondary }}> {beer.abv}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onSecondary }}> {beer.best_cost_per_oz}</Text></DataTable.Cell>
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(Object.values(groupedBeers).length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${Object.values(groupedBeers).length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
        </View>
    );

}
