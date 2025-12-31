
import { createClient } from '@supabase/supabase-js';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'expo-sqlite/localStorage/install';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export interface BeerSuggestion {
    id: string;
    name: string;
    abv: string;
    type: string;
    type_group?: string;
    brewery?: string;
    source: 'beerdb' | 'local';
    availableAt?: string;
    price?: number;
    currentSize?: number;
    // Additional fields returned by local search
    cost_per_alcohol_oz?: number;
    size?: number;
    bar_name?: string;
    bar_address?: string;
    bar_long?: number | null;
    bar_lat?: number | null;
    serving_type?: string;
    serving_description?: string;
}


export interface BarDetails {
    id: string;
    name: string;
    street_address?: string;
    zip: string;
    city?: string;
    state?: string;
    longitude?: number | null;
    latitude?: number | null;
    is_brewery?: boolean;
    dist_meters?: number;
    has_active_special?: boolean;
}

export interface BeerLocation {
    price?: number;
    bar_name?: string;
    size?: number;
    bar_address?: string;
    bar_lat?: number | null;
    bar_long?: number | null;
    cost_per_alcohol_oz?: number;
}

export interface GroupedBeer {
    id: string;
    name: string;
    abv: string;
    type: string;
    type_group?: string;
    serving_type?: string;
    serving_description?: string;
    brewery?: string;
    source: 'beerdb' | 'local';
    best_cost_per_oz?: number;
    best_price?: number;
    best_size?: number;
    locations: BeerLocation[];
}

export interface States {
    id: number,
    name: string,
    abbreviation: string,
    country: number
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

export const ExpoAsyncStorageAdapter = {
    getItem: async (key: string) => {
        return AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
        return AsyncStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        return AsyncStorage.removeItem(key);
    },
};

export const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        console.debug("getItem", { key, getItemAsync })
        return getItemAsync(key)
    },
    setItem: (key: string, value: string) => {
        if (value.length > 2048) {
            console.warn('Value being stored in SecureStore is larger than 2048 bytes and it may not be stored successfully. In a future SDK version, this call may throw an error.')
        }
        return setItemAsync(key, value)
    },
    removeItem: (key: string) => {
        return deleteItemAsync(key)
    },
};

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
    auth: {
        storage: ExpoAsyncStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

//looks at our own supabase DB for beers matching the query
export async function searchBeerioDB(query: string): Promise<BeerSuggestion[]> {


    try {
        const { data, error } = await supabase
            .from('beer_offerings')
            .select('beer_id, beer_name, abv, type, price, size_oz, cost_per_alcohol_oz, bar_name, bar_address, bar_long, bar_lat, type_group, serving_type, serving_description')
            .ilike('type', `%${query}%`)
            .limit(50);
        if (error) throw error;
        console.log("Hitting up the DB!!!!", data);
        return data.map(beer => ({
            id: beer.beer_id.toString(),
            name: beer.beer_name,
            // keep value_score as a number for easier grading
            cost_per_alcohol_oz: beer.cost_per_alcohol_oz != null ? parseFloat(Number(beer.cost_per_alcohol_oz).toFixed(2)) : undefined,
            price: beer.price != null ? Number(beer.price) : 0,
            abv: beer.abv?.toString() || '0',
            size: beer.size_oz != null ? Number(beer.size_oz) : 12,
            type: beer.type || 'Unknown',
            type_group: beer.type_group || 'Unknown',
            serving_type: beer.serving_type || 'Unknown',
            serving_description: beer.serving_description || 'No description',
            source: 'local' as const,
            bar_name: beer.bar_name,
            bar_address: beer.bar_address,
            bar_long: beer.bar_long,
            bar_lat: beer.bar_lat,

        }));
    } catch (error) {
        console.error('Local search error:', error);
        return [];
    }
}

export async function getBarDetails(barId: string): Promise<BarDetails | null> {
    try {
        const { data, error } = await supabase
            .from('bars')
            .select('*')
            .eq('id', barId)
            .single();

        if (error) throw error;
        console.log("Fetched bar details:", data);
        return data;
    } catch (error) {
        console.error('Error fetching bar details:', error);
        return null;
    }
}

export async function getStates(): Promise<States[] | null> {
    try {
        const { data, error } = await supabase
            .from('States')
            .select('*');
        if (error) throw error;
        console.log("Fetched bar details:", data);
        return data;
    } catch (error) {
        console.error('Error fetching bar details:', error);
        return null;
    }

}

export async function searchNearbyBars(
    userLat: number,
    userLng: number,
    radiusMeters: number = 3000,
    userTimezone: string = '',
    query: string = ''
): Promise<BarDetails[]> {
    try {
        console.log("lat, lng ", userLat, userLng, "distance, ", radiusMeters, "timezone: ", userTimezone);
        const { data, error } = await supabase
            .rpc('nearby_bars', {
                user_lat: userLat,
                user_long: userLng,
                max_distance_meters: radiusMeters,
                user_timezone: userTimezone
            });

        if (error) throw error;

        console.log("$#%$#@%^^%(&*)(+_Hitting up spatial DB for bars(*^&E%$#$*^(&*^!!!!", data);
        // Filter by query if provided (since we can't pass query to the function)
        let filteredData = data;
        console.log("data from nearby_bars rpc:", data);
        return data;
    } catch (error) {
        console.error('Spatial search error:', error);
        return [];
    }

}


// Hot list of beers nearby based on lat/lng and radius
export async function searchNearbyBeers(
    userLat: number,
    userLng: number,
    radiusMeters: number = 3000,
    query: string = ''
): Promise<BeerSuggestion[]> {
    try {
        console.log("lat, lng ", userLat, userLng, "distance, ", radiusMeters);
        const { data, error } = await supabase
            .rpc('nearby_beers', {
                user_lat: userLat,
                user_lng: userLng,
                radius_meters: radiusMeters
            });

        if (error) throw error;

        console.log("Hitting up spatial DB for beers!!!!", data);

        // Filter by query if provided (since we can't pass query to the function)
        let filteredData = data;
        if (query) {
            filteredData = data.filter(beer =>
                beer.type?.toLowerCase().includes(query.toLowerCase()) ||
                beer.beer_name?.toLowerCase().includes(query.toLowerCase())
            );
        }

        return filteredData.map(beer => ({
            id: beer.beer_id.toString(),
            name: beer.beer_name,
            cost_per_alcohol_oz: beer.cost_per_alcohol_oz != null ? parseFloat(Number(beer.cost_per_alcohol_oz).toFixed(2)) : undefined,
            price: beer.price != null ? Number(beer.price) : 0,
            abv: beer.abv?.toString() || '0',
            size: beer.size_oz != null ? Number(beer.size_oz) : 12,
            type: beer.type || 'Unknown',
            type_group: beer.type_group || 'Unknown',
            serving_type: beer.serving_type || 'Unknown',
            serving_description: beer.serving_description || 'No description',
            source: 'local' as const,
            bar_name: beer.bar_name,
            bar_address: beer.bar_address,
            bar_long: beer.bar_long,
            bar_lat: beer.bar_lat,
            // Add distance for future use
            distance_meters: beer.distance_meters,
        }));
    } catch (error) {
        console.error('Spatial search error:', error);
        return [];
    }
}


export async function getUserProfile(userId: string) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        console.log("got the prof, bro", data);
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

export async function updateUserProfile(userId: string, updates: { nickname?: string; full_name?: string; avatar_url?: string; }) {
    try {
        console.log('Updating user profile with:', updates, "user id:", userId);
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return null;
    }
}
