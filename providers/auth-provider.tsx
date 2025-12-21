import { AuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/utils/supabase';
import type { Session } from '@supabase/supabase-js';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | undefined | null>()
    const [profile, setProfile] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Fetch the session once, and subscribe to auth state changes
    useEffect(() => {
        const fetchSession = async () => {
            setIsLoading(true)
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession()
            console.log('Initial session fetch:', { session, error });
            if (error) {
                console.error('Error fetching session:', error)
            }
             
        Alert.alert('Session Check', session ? 'Session found!' : 'No session');
        
            setSession(session)
            setIsLoading(false)
        }
        fetchSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', { event: _event, session })
              Alert.alert('Auth State Change', _event || 'unknown event');
            setSession(session)
        })

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    // Fetch the profile when the session changes
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true)
            if (session) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                setProfile(data)
            } else {
                setProfile(null)
            }
            setIsLoading(false)
        }
        fetchProfile()
    }, [session])

    return (
        <AuthContext.Provider
            value={{
                session,
                isLoading,
                profile,
                isLoggedIn: session != undefined,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}