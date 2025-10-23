
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function useLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }   
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
            setLoading(false);
        }
        )();
    }, []);
    return { location, errorMsg, loading, requestPermission: async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return false;
        }   
        return true;
    } };
    
}