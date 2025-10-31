import { Linking, Platform } from 'react-native';

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
