
import { updateUserProfile, getUserProfile } from '@/utils/supabase';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Text,  TouchableOpacity, View } from 'react-native';
import { Divider, TextInput, IconButton, useTheme, Button } from 'react-native-paper';
import { useAuthContext } from '@/hooks/use-auth-context';
import  AuthProvider  from '@/providers/auth-provider';
import { Image } from 'expo-image'
export default function EditProfileModal({ modalVisible, hideModal, theme }:
    { modalVisible: boolean, hideModal: any, theme: any }) {
        
    const { profile, session } = useAuthContext();
    const [nickname, setNickname] = useState(profile?.nickname || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
    const [fullName, setFullName] = useState(profile?.full_name || '');

    useEffect(() => {
        setNickname(profile?.nickname || '');
        setAvatarUrl(profile?.avatar_url || '');
        setFullName(profile?.full_name || '');
    }, [profile]);


    const handleSubmit = () => {
        //updateUserProfile
        const updateProfile = async () => {
            const updates = {
                nickname,
                full_name: fullName,
                avatar_url: avatarUrl,
            };
            console.log('Submitting profile updates:', updates);
            const result = await updateUserProfile(profile.id, updates);
            if (result) {
                console.log('Profile updated successfully:', result);
            }
            hideModal(true);
        };
        updateProfile();
    }


    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: theme.colors.onSurface, flex: 1 }}>Edit Profile</Text>
                <IconButton
                    icon="window-close"
                    size={20}
                    onPress={hideModal}
                    accessibilityLabel="Close profile modal"
                    style={{ margin: 0, padding: 0 }}
                />
            </View>
            <Divider style={{ marginVertical: 10 }} />
            <Text style={{ color: theme.colors.onSurface }}>Email: {session?.user.email || 'Unknown'}</Text>
            <TextInput
                style={{ backgroundColor: theme.colors.surface, borderRadius: 5, padding: 10, marginVertical: 10, color: theme.colors.onSurface }}
                placeholder="Full Name"
                label="Full Name"
                value={fullName}
            />
            <TextInput
                style={{ backgroundColor: theme.colors.surface, borderRadius: 5, padding: 10, marginVertical: 10, color: theme.colors.onSurface }}
                placeholder="Nickname"
                label="Nickname"
                value={nickname}
                onChangeText={setNickname}
            />
            <Image source={{ uri: profile?.avatar_url }} style={{ width: 100, height: 100, borderRadius: 50 }} />
            <Button onPress={() => handleSubmit()} style={{ marginTop: 20 }} >
               <Text>Submit</Text>
           </Button>
        </View>

    );

}
