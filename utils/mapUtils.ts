import { LocationObject } from 'expo-location';
import { Linking, Platform } from 'react-native';
import { GroupedBeer } from './supabase';

/**
 * Opens the device's maps application with the specified coordinates
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param name - Name/label for the location
 */
export const openInMaps = async (
  latitude: number,
  longitude: number,
  name: string
) => {
  if (latitude == null || longitude == null) return;

  const coords = `${latitude},${longitude}`;

  // Try platform-specific URI first, fallback to Google Maps web URL
  const appUrl =
    Platform.OS === 'ios'
      ? `maps:0,0?q=${coords}`
      : `geo:0,0?q=${coords}`;

  const webUrl = `https://maps.google.com?q=${name}&loc:${coords}`;

  try {
    const can = await Linking.canOpenURL(appUrl);
    await Linking.openURL(can ? appUrl : webUrl);
  } catch (err) {
    console.error('Unable to open map URL', err);
    // final fallback
    await Linking.openURL(webUrl);
  }
};

/**
 * Calculates the distance between user's location and a bar
 * @param location - User's current location
 * @param barLat - Bar's latitude
 * @param barLong - Bar's longitude
 * @returns Distance in miles, or null if parameters are invalid
 */
export const distanceFromBar = (
  location: LocationObject | null,
  barLat?: number | null,
  barLong?: number | null
): string | null => {
  if (location && typeof barLat === 'number' && typeof barLong === 'number') {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 3958.8; // Radius of the Earth in miles

    const dLat = toRad(barLat - location.coords.latitude);
    const dLon = toRad(barLong - location.coords.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(location.coords.latitude)) *
        Math.cos(toRad(barLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2); // Return distance in miles, rounded to 2 decimal places
  }

  return null;
};

/**
 * Calculates distances from user's location to all bars in the grouped beers
 * This is meant to be used inside a useMemo hook in your component
 * @param location - User's current location
 * @param groupedBeers - Record of grouped beers with their locations
 * @returns Object mapping bar coordinates to distances
 */
export const calculateBarDistances = (
  location: LocationObject | null,
  groupedBeers: Record<string, GroupedBeer>
): Record<string, string | null> => {
  const result: Record<string, string | null> = {};

  if (location) {
    Object.values(groupedBeers).forEach(beer => {
      beer.locations.forEach(loc => {
        if (loc.bar_lat && loc.bar_long) {
          const key = `${loc.bar_lat}-${loc.bar_long}`;
          result[key] = distanceFromBar(location, loc.bar_lat, loc.bar_long);
        }
      });
    });
  }

  return result;
};

export const calculateDistancesFromArray = (location: LocationObject | null, beersArray: GroupedBeer[]): Record<string, string | null> => { 
  const beersRecord = beersArray.reduce((acc, beer) => {
    acc[beer.id] = beer;
    return acc;
  }, {} as Record<string, GroupedBeer>);
  
  return calculateBarDistances(location, beersRecord);
}
