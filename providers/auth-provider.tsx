import { AuthContext } from '@/hooks/use-auth-context';
import { supabase, getUserProfile } from '@/utils/supabase';
import type { Session } from '@supabase/supabase-js';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | undefined | null>()
    const [profile, setProfile] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function getProfileData() {
        if (!session?.user.id) {
            return;
        }
        const profileData = await getUserProfile(session?.user.id!);
        setProfile(profileData);

    }

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

            setSession(session)
            setIsLoading(false)
        }
        fetchSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', { event: _event, session })
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
            const profileData = await getUserProfile(session?.user.id!)
            setProfile(profileData)
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
                getProfileData
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}