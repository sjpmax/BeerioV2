
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { phillyColors } from '@/constants/colors';

export const unstable_settings = {
    anchor: '(tabs)',
};

//'navy': '#001F3F',      // Deep navy blue background
//'midnight': '#0A1929',   // Even darker blue for cards/contrast
//'gold': '#D4AF37',       // Classic gold (good contrast)
//'dark-gold': '#B8860B',  // Dark goldenrod for subtle text
//'accent': '#FFB302',     // Bright gold for highlights/buttons
//'unselected': '#DB7F40', // Muted orange for unselected items

const Theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: phillyColors.navy,
        onPrimary: phillyColors.gold,
        secondary: phillyColors.midnight,
        onSecondary: phillyColors.gold,
        background: phillyColors.navy,
        surface: phillyColors.gold,
        surfaceVariant: phillyColors.darkGold,
        onSurface: phillyColors.midnight,
        onSurfaceVariant: phillyColors.midnight,  // dark gold
    },
};

export default function RootLayout() {

    return (
        <PaperProvider theme={Theme} >
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Theme.colors.secondary,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </PaperProvider>

    );
}
