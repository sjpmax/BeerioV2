import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image'
import SignOutButton from '@/components/social-auth-buttons/sign-out-button'
import { useAuthContext } from '@/hooks/use-auth-context'
import AppleSignInButton from '@/components/social-auth-buttons/apple/apple-sign-in-button';
import GoogleSignInButton from '@/components/social-auth-buttons/google/google-sign-in-button';
export default function AccountScreen() {
    const { profile } = useAuthContext()
    return (
        <View className="flex-1 items-center justify-center bg-gray-900">
            <Text className="text-white text-2xl">Account Screen</Text>

            <GoogleSignInButton />
            <AppleSignInButton />
            <SignOutButton />
        </View>
    );
}