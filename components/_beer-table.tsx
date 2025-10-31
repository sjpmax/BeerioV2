import { calculateBarDistances } from '@/utils/mapUtils';
import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import useLocation from '../hooks/useLocation';
import BeerTableHeader from './_beer-table-header';
import BeerTableRow from './_beer-table-row';

interface BeerSuggestionProps {
  groupedBeers: any[];
  theme: any;
}   

export default function BeerTable({groupedBeers, theme}: BeerSuggestionProps) {

  const [expandedRows, setExpandedRows] = useState(new Set());
  const { location, loading, errorMsg, requestPermissionAndGetLocation } = useLocation();
    
  const [locationStatus, setLocationStatus] = useState('waiting');

  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  
// In BeerTable.tsx, add console.logs to debug
const distances = useMemo(() => {
  // Convert array to record format for calculateBarDistances
  const beersRecord = groupedBeers.reduce((acc, beer) => {
    acc[beer.id] = beer;
    return acc;
  }, {});
  
  console.log('BeerTable - Location:', location);
  console.log('BeerTable - BeersRecord:', beersRecord);
  
  const result = calculateBarDistances(location, beersRecord);
  console.log('BeerTable - Calculated distances:', result);
  return result;
}, [location, groupedBeers]);

    return (
        <View style={{ backgroundColor: theme.colors.background,
                        width: '100%',  
                        padding: 10   }}>
            <BeerTableHeader/>
            <FlatList
                data={groupedBeers}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View key={item.id} >
                        <View>
                            <BeerTableRow groupedBeers={item} theme={theme} rowID={index} isExpanded={expandedRows.has(item.id)} onToggle={() => toggleRow(item.id)} distances={distances} />
                        </View>
                    </View>
                )}
            />

        </View>
    );

}



        // groupedBeers = [
//   {
//     "id": "67",
//     "name": "Two Hearted",
//     "abv": "7.5",
//     "type": "IPA",
//     "best_cost_per_oz": "5.83",
//     "best_size": 16,
//     "best_price": 7,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "5.83",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       },
//       {
//         "price": 7.5,
//         "bar_name": "ERA",
//         "bar_lat": 39.9730949401855,
//         "bar_long": -75.1820526123047,
//         "cost_per_alcohol_oz": "8.33",
//         "bar_address": "    2743 Poplar St",
//         "size": 12
//       },
//       {
//         "price": 10,
//         "bar_name": "Otto's Taproom",
//         "bar_lat": 39.9751281738281,
//         "bar_long": -75.1834945678711,
//         "cost_per_alcohol_oz": "8.33",
//         "bar_address": "1216 N 29th St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "66",
//     "name": "Lite",
//     "abv": "4.2",
//     "type": "Lite",
//     "best_cost_per_oz": "5.95",
//     "best_size": 16,
//     "best_price": 4,
//     "source": "local",
//     "locations": [
//       {
//         "price": 4,
//         "bar_name": "ERA",
//         "bar_lat": 39.9730949401855,
//         "bar_long": -75.1820526123047,
//         "cost_per_alcohol_oz": "5.95",
//         "bar_address": "    2743 Poplar St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "76",
//     "name": "Juicy Haze",
//     "abv": "7.5",
//     "type": "IPA",
//     "best_cost_per_oz": "6.25",
//     "best_size": 16,
//     "best_price": 7.5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7.5,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "6.25",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "81",
//     "name": "Traditional Lager",
//     "abv": "4.5",
//     "type": "Lager",
//     "best_cost_per_oz": "6.94",
//     "best_size": 16,
//     "best_price": 5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 5,
//         "bar_name": "Billy Pub",
//         "bar_lat": 39.9138374328613,
//         "bar_long": -75.2104034423828,
//         "cost_per_alcohol_oz": "6.94",
//         "bar_address": "2813 Girard Ave",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "77",
//     "name": "IPA",
//     "abv": "5.9",
//     "type": "IPA",
//     "best_cost_per_oz": "7.94",
//     "best_size": 16,
//     "best_price": 7.5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7.5,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "7.94",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "65",
//     "name": "Boston Lager",
//     "abv": "5",
//     "type": "Lager",
//     "best_cost_per_oz": "8.33",
//     "best_size": 12,
//     "best_price": 5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 5,
//         "bar_name": "ERA",
//         "bar_lat": 39.9730949401855,
//         "bar_long": -75.1820526123047,
//         "cost_per_alcohol_oz": "8.33",
//         "bar_address": "    2743 Poplar St",
//         "size": 12
//       }
//     ]
//   },
//   {
//     "id": "72",
//     "name": "The Crisp",
//     "abv": "5",
//     "type": "Pilsner",
//     "best_cost_per_oz": "9.38",
//     "best_size": 16,
//     "best_price": 7.5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7.5,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "9.38",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "78",
//     "name": "Wigwam",
//     "abv": "5",
//     "type": "Pale Ale",
//     "best_cost_per_oz": "9.38",
//     "best_size": 16,
//     "best_price": 7.5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7.5,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "9.38",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "71",
//     "name": "Mamma little Yella Pils",
//     "abv": "4.9",
//     "type": "Pilsner",
//     "best_cost_per_oz": "9.57",
//     "best_size": 16,
//     "best_price": 7.5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7.5,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "9.57",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "75",
//     "name": "Big Wave",
//     "abv": "4.6",
//     "type": "Pale Ale",
//     "best_cost_per_oz": "10.19",
//     "best_size": 16,
//     "best_price": 7.5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7.5,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "10.19",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "69",
//     "name": "Guinness",
//     "abv": "4.2",
//     "type": "Stout",
//     "best_cost_per_oz": "11.16",
//     "best_size": 16,
//     "best_price": 7.5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7.5,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "11.16",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       }
//     ]
//   },
//   {
//     "id": "70",
//     "name": "Mango Cart",
//     "abv": "4",
//     "type": "Hefeweizen",
//     "best_cost_per_oz": "11.72",
//     "best_size": 16,
//     "best_price": 7.5,
//     "source": "local",
//     "locations": [
//       {
//         "price": 7.5,
//         "bar_name": "McCrossen's Tavern",
//         "bar_lat": 39.963089,
//         "bar_long": -75.170891,
//         "cost_per_alcohol_oz": "11.72",
//         "bar_address": "529 N 20th St",
//         "size": 16
//       }
//     ]
//   }
// ]