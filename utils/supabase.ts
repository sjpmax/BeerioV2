
import { createClient } from '@supabase/supabase-js';
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
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

export async function searchNearbyBeers(
  userLat: number, 
  userLng: number, 
  radiusMeters: number = 3000,
  query: string = ''
): Promise<BeerSuggestion[]> {
    try {
        console.log("distance, ", radiusMeters);
    const { data, error } = await supabase
      .rpc('nearby_beers', { 
        user_lat: userLat, 
        user_lng: userLng, 
        radius_meters: radiusMeters 
      });
    
    if (error) throw error;
    
    console.log("Hitting up spatial DB!!!!", data);
    
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