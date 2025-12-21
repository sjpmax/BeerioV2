import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image'
import SignOutButton from '@/components/social-auth-buttons/sign-out-button'
import { useAuthContext } from '@/hooks/use-auth-context'
import AppleSignInButton from '@/components/social-auth-buttons/apple/apple-sign-in-button';
import GoogleSignInButton from '@/components/social-auth-buttons/google/google-sign-in-button';
export default function AccountScreen() {
    const { profile, session, user } = useAuthContext()
    
console.log('Auth context:', { profile, session, user });
    return (
         <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-white text-2xl">Account Screen</Text>
        <Text className="text-white text-lg mt-4">
            Welcome, {profile?.full_name || profile?.email || user?.email || 'Guest'}!
        </Text>
        <Text className="text-white">Session: {session ? 'Logged in' : 'Not logged in'}</Text>
        <GoogleSignInButton />
        <AppleSignInButton />
        <SignOutButton />
    </View>
    );
}