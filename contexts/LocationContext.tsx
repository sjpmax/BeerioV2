import React, { createContext, useContext } from 'react';
import useLocation from '@/hooks/useLocation';
import { LocationObject } from 'expo-location';
import { LocationStatus } from '@/hooks/useLocation';

// Define what data the context provides
type LocationContextType = {
    location: LocationObject | null;
    status: LocationStatus;
    refreshLocation: () => Promise<void>;
    getDistanceMessage: (lat?: number | null, long?: number | null) => string;
};

// Create the context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider component that wraps your app
export function LocationProvider({ children }: { children: React.ReactNode }) {
    const locationData = useLocation(); // Your existing hook!

    return (
        <LocationContext.Provider value={locationData}>
            {children}
        </LocationContext.Provider>
    );
}

// Custom hook to use the context
export function useLocationContext() {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationContext must be used within LocationProvider');
    }
    return context;
}