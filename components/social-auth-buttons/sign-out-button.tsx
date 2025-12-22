import { supabase } from '@/utils/supabase'
import React from 'react'
import { Button, Text, useTheme } from 'react-native-paper';

async function onSignOutButtonPress() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error signing out:', error)
    }
}

export default function SignOutButton() {

    const theme = useTheme();
    return <Button icon="logout" onPress={onSignOutButtonPress} style={{  height: 40, backgroundColor: theme.colors.popLight, marginTop: 8 }} ><Text>Sign out</Text></Button>;
    }