import { phillyColors } from '@/constants/colors';
import { openInMaps } from '@/utils/mapUtils';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

const truncateText = (input: string, maxLength: number): string => input.length > maxLength ? `${input.substring(0, maxLength)}…` : input;

export default function BeerTableRow({ groupedBeers, theme, isExpanded, onToggle, rowID, distances }: BeerSuggestionProps) {
  return (
    <>
      {/* Make the whole row touchable */}
      <TouchableOpacity 
        onPress={onToggle}
        activeOpacity={0.7}
        style={{ 
          flexDirection: 'row', 
          backgroundColor: rowID % 2 === 0 ? theme.colors.lightNavy : theme.colors.popLight, 
          paddingVertical: 8,
          borderRadius: 4,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
          <View style={{ flex: 8, flexDirection: 'row', alignItems: 'center' }} >
            {/* Visual indication of expandability */}
            <Icon 
                source={isExpanded ? "chevron-down" : "chevron-right"}
                size={16} 
                color={phillyColors.gold}
                style={{ marginLeft: 6, marginRight: 8 }}
              />
            <Text style={{ color: phillyColors.gold }}>{truncateText(groupedBeers.name, 15)}</Text>
          </View>
          
          
        </View>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ flex: 1, color: phillyColors.gold }}>{groupedBeers.best_cost_per_oz}</Text>
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{ flex: 1, color: phillyColors.gold }}>{groupedBeers.locations[0].bar_name}</Text>
        </View>
      </TouchableOpacity>

      {/* Expanded content with improved visual hierarchy */}
      {isExpanded && (
        <View style={{ 
          flexDirection: 'column',
          backgroundColor: 'rgba(255,255,255,0.03)',
          marginHorizontal: 4,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          marginBottom: 6,
        }}>
          {/* Rest of your expanded content stays the same */}
          <View style={{ flexDirection: 'row', paddingTop: 4 }}>
            <View style={{ flex: 1}}></View>
            <Text style={{ flex: 1, fontWeight: 'bold', color: 'rgb(54, 199, 124)' }}>{groupedBeers.type}</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: 'rgb(54, 199, 124)' }}>{groupedBeers.abv}%</Text>
            <View style={{ flex: 6}}></View>
          </View>
          
          {/* Your existing expanded content... */}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1}}></View>
            <Text style={{ flex: 3, fontWeight: 'bold', color: phillyColors.mutedGold }}>Location</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.mutedGold }}>Cost</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.mutedGold }}>Size</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', color: phillyColors.mutedGold }}>$/Oz</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1}}></View>
            <View style={{ flex: 9, paddingLeft: 15, backgroundColor: 'rgba(255,255,255,0.05)' }}>
              {groupedBeers.locations.map((location: any, idx: number) => (
                <View key={idx} style={{ flexDirection: 'row', paddingVertical: 5 }}>
                  <Text style={{ flex: 3, color: '#AAA' }}onPress={() => openInMaps(
                                                                      location.bar_lat,
                                                                      location.bar_long, 
                                                                      item.name
                                                                  )}
                                                              >
                                                                  <Icon source="map-marker" size={16} color={phillyColors.gold} />
                                                                  {location.bar_name || 'N/A'}
                  
                                                                  {location
                                                                      ? `, (${distances[`${location.bar_lat}-${location.bar_long}`] ?? 'N/A'} mi)`
                                                                      : ', Location permission not granted'}
                    {location.bar_name}
                    </Text>
                  <Text style={{ flex: 1, color: '#AAA' }}>${location.price}</Text>
                  <Text style={{ flex: 1, color: '#AAA' }}>{location.size}oz</Text>
                  <Text style={{ flex: 1, color: '#AAA' }}>${parseFloat(location.cost_per_alcohol_oz).toFixed(2)}/oz</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </>
  );
}