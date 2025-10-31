// hooks/useLocation.ts
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

// Define location status types for better type safety
export type LocationStatus = 'loading' | 'error' | 'success' | 'permission-denied' | 'unavailable';

export default function useLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [status, setStatus] = useState<LocationStatus>('loading');
    
    // Function to get current location
    const getCurrentLocation = async () => {
        try {
            setStatus('loading');
            
            // Check if location services are enabled
            const isAvailable = await Location.hasServicesEnabledAsync();
            if (!isAvailable) {
                setStatus('unavailable');
                setErrorMsg('Location services are not enabled on this device');
                return null;
            }
            
            // Request permission
            let { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
            if (permissionStatus !== 'granted') {
                setStatus('permission-denied');
                setErrorMsg('Permission to access location was denied');
                return null;
            }
            
            // Get location
            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });
            
            setLocation(loc);
            setStatus('success');
            setErrorMsg(null);
            return loc;
        } catch (error) {
            console.error('Error getting location:', error);
            setErrorMsg('Error getting location');
            setStatus('error');
            return null;
        }
    };
    
    // Initial location fetch
    useEffect(() => {
        getCurrentLocation();
    }, []);
    
    // Function to manually request permission and get location
    const refreshLocation = async () => {
        return await getCurrentLocation();
    };
    
    // Utility function to get a user-friendly distance message
    const getDistanceMessage = (lat?: number | null, long?: number | null) => {
        if (!lat || !long) return '';
        
        switch (status) {
            case 'loading':
                return '(loading distance...)';
            case 'error':
            case 'unavailable':
                return '(distance unavailable)';
            case 'permission-denied':
                return '(location permission needed)';
            case 'success':
                if (!location) return '(calculating...)';
                
                // Use the coordinates to build a key similar to what calculateBarDistances does
                const key = `${lat}-${long}`;
                const distance = calculateDistanceDirectly(location, lat, long);
                return distance ? `(${distance} mi)` : '(unknown distance)';
            default:
                return '';
        }
    };
    
    // Direct calculation of distance between two points
    const calculateDistanceDirectly = (
        userLocation: Location.LocationObject,
        barLat?: number | null,
        barLong?: number | null
    ): string | null => {
        if (userLocation && typeof barLat === 'number' && typeof barLong === 'number') {
            const toRad = (value: number) => (value * Math.PI) / 180;
            const R = 3958.8; // Radius of the Earth in miles
            
            const dLat = toRad(barLat - userLocation.coords.latitude);
            const dLon = toRad(barLong - userLocation.coords.longitude);
            
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(userLocation.coords.latitude)) *
                Math.cos(toRad(barLat)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            return distance.toFixed(2); // Return distance in miles, rounded to 2 decimal places
        }
        return null;
    };
    
    return { 
        location,
        errorMsg,
        status,
        refreshLocation,
        getDistanceMessage
    };
}