import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button, IconButton, Modal, Portal, SegmentedButtons, Snackbar, useTheme, ActivityIndicator } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image'
import SignOutButton from '@/components/social-auth-buttons/sign-out-button'
import { useAuthContext } from '@/hooks/use-auth-context'
import AppleSignInButton from '@/components/social-auth-buttons/apple/apple-sign-in-button';
import GoogleSignInButton from '@/components/social-auth-buttons/google/google-sign-in-button';
import EditProfileModal from '@/components/_edit_profile';
export default function AccountScreen() {
    const theme = useTheme();
    const { profile, session } = useAuthContext()

    const [ShowProfileModal, setShowProfileModal] = useState(false);
    const modalStyles = {
        backgroundColor: theme.colors.surface,
        padding: 20,
        margin: 20,
        borderRadius: 8,
    };
    console.log('Auth context:', { profile, session});
    return (
        <View className="flex-1 items-center justify-center bg-gray-900" styles={{ flexDirection: 'column' }}>
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}></View>
            <Text className="text-white text-2xl" style={{ flex: 1 }} >Account Screen</Text>
            <Text className="text-white text-lg mt-4" style={{ flex: 1 }}>
                Welcome, {profile?.full_name || profile?.email || 'Beerio friend'}!
            </Text>
            {session ?
                /*   If the user is logged in, show the sign-out button, badges, and other account details*/
                (

                    <View style={{ flex: 1 }}>
                        <Button icon="account" buttonColor={theme.colors.primaryContainer} onPress={ShowProfileModal ? () => setShowProfileModal(false) : () => setShowProfileModal(true)} ><Text>Edit Profile</Text> </Button>
                        <View style={{ flex: 1 }}><SignOutButton /></View>
                    </View>
                ) :
                /* If the user is not logged in, show the social sign-in buttons */
                (<View style={{ flex: 1 }}>
                    {Platform.OS === 'android' && <View style={{ flex: 1 }}><GoogleSignInButton /></View>}
                    {Platform.OS === 'ios' && <View style={{ flex: 1 }}><AppleSignInButton /></View>}

                </View>)}
            <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}></View>
            <Portal>
                <Modal
                    visible={ShowProfileModal}
                    onDismiss={() => setShowProfileModal(false)}
                    contentContainerStyle={modalStyles}
                >
                    <EditProfileModal
                        modalVisible={ShowProfileModal}
                        hideModal={() => setShowProfileModal(false)}
                        theme={theme}
                    />
                </Modal>
            </Portal>
        </View>
    );
}