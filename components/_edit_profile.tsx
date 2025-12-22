
import { GroupedBeer } from '@/utils/supabase';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
export default function EditProfileModal({ modalVisible, hideModal, theme }:
    { modalVisible: boolean, hideModal: any, theme: any }) {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: theme.colors.onSurface, flex: 1 }}>Edit Profile</Text>
                <IconButton
                    icon="window-close"
                    size={20}
                    onPress={hideModal}
                    accessibilityLabel="Close filter modal"
                    style={{ margin: 0, padding: 0 }}
                />
            </View>
            <Divider style={{ marginVertical: 10 }} />
        </View>

    );

}
