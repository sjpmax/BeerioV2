import { BeerSuggestion } from '@/utils/supabase';
import { Theme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { DataTable, IconButton, Tooltip } from 'react-native-paper';

interface BeerSuggestionProps {
    beerList: BeerSuggestion[];
    theme: Theme;
}

export default function BeerTableView({ beerList, theme }: BeerSuggestionProps) {

    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([10, 20, 30]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, beerList.length);

    return (
        <View style={{ backgroundColor: theme.colors.background}}>

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title><Text style={{ color: theme.colors.onSecondary }}> Beer</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onSecondary }}> Price</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onSecondary }}> Size(OZ)</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ color: theme.colors.onSecondary }}> ABV</Text></DataTable.Title>
                    <DataTable.Title numeric>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                            <Text style={{color: theme.colors.onSecondary , marginRight: 1 }}>Value</Text>
                            <Tooltip title="Value Score is calculated as (Price / Size) / (ABV %) to help identify the best value beers."
                                enterTouchDelay={0}
                                leaveTouchDelay={3000} >
                            <IconButton
                                icon="information"
                                size={15}
                                onPress={() => {}}
                                accessibilityLabel="Value info"
                                style={{ color: theme.colors.onSecondary, margin: 0, padding: 0 }}                               
                            />
                            </Tooltip>
                        </View>
                    </DataTable.Title>
                    {/* <DataTable.Title numeric className='valueTableContainer'><Text style={{ color: theme.colors.onSecondary }}> Value</Text> <Button className='infoButton' children icon={"information"}></Button>    </DataTable.Title> */}
                </DataTable.Header>

                {beerList.slice(from, to).map((beer) => (
                    <DataTable.Row key={beer.id}>
                        <DataTable.Cell>  <Text style={{ color: theme.colors.onSecondary }}> {beer.name} </Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onSecondary }}> {beer.price}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onSecondary }}> {beer.size}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onSecondary }}> {beer.abv}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ color: theme.colors.onSecondary }}> {beer.value_score}</Text></DataTable.Cell>
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(beerList.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${beerList.length}`}
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
