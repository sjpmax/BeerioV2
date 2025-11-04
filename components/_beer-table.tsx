import { LocationStatus } from '@/hooks/useLocation';
import { calculateDistancesFromArray } from '@/utils/mapUtils';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import BeerTableHeader from './_beer-table-header';
import BeerTableRow from './_beer-table-row';

interface BeerSuggestionProps {
  groupedBeers: any[];
  theme: any;
  location: Location.LocationObject | null;
  locationStatus: LocationStatus;
  getDistanceMessage: (lat?: number | null, long?: number | null) => string;
}   

export default function BeerTable({
  groupedBeers, 
  theme, 
  location,
  locationStatus,
  getDistanceMessage
}: BeerSuggestionProps) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  
// Then in your component:  
const distances = calculateDistancesFromArray(location, groupedBeers);

  return (
    <View style={{ 
      backgroundColor: theme.colors.background,
      width: '100%',  
      padding: 10 
    }}>
      <BeerTableHeader/>
      <FlatList
        data={groupedBeers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View key={item.id} >
            <BeerTableRow 
              groupedBeers={item} 
              theme={theme} 
              rowID={index} 
              isExpanded={expandedRows.has(item.id)} 
              onToggle={() => toggleRow(item.id)} 
              distances={distances}
              getDistanceMessage={getDistanceMessage}
              locationStatus={locationStatus}
            />
          </View>
        )}
      />
    </View>
  );
}