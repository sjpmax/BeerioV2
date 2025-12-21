import { supabase } from '@/utils/supabase'
import React from 'react'
import { Button, Text, useTheme } from 'react-native-paper';

async function onSignOutButtonPress() {
    const theme = useTheme();
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error signing out:', error)
    }
}

export default function SignOutButton() {
        return <Button icon="logout" onPress={onSignOutButtonPress} style={{ paddingVertical: 8, height: 88 }} ><Text>Sign out</Text></Button>;
    }