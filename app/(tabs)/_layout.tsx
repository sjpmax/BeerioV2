import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function BeerIcon({ focused }: { focused: boolean }) {
    return (
        <View className={`w-6 h-6 items-center justify-center ${focused ? 'opacity-100' : 'opacity-50'}`}>
            <Text className="text-2xl">🍺</Text>
        </View>
    );
}

function BarIcon({ focused }: { focused: boolean }) {
    return (
        <View className={`w-6 h-6 items-center justify-center ${focused ? 'opacity-100' : 'opacity-50'}`}>
            <Text className="text-2xl">🏪</Text>
        </View>
    );
}

function AccountIcon({ focused }: { focused: boolean }) {
    return (
        <View className={`w-6 h-6 items-center justify-center ${focused ? 'opacity-100' : 'opacity-50'}`}>
            <Text className="text-2xl">👤</Text>
        </View>
    );
}

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.accentGold,
                tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                tabBarStyle: {
                    backgroundColor: theme.colors.secondary,  // Dark frame at bottom
                    borderTopColor: theme.colors.surfaceVariant,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerShown: true,
                headerStyle: { backgroundColor: theme.colors.primary ,
                    height: 50
                }
            }}
        >
            <Tabs.Screen
                name="beers"
                options={{
                    title: 'Beers',
                    tabBarIcon: ({ focused }) => <BeerIcon focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="bars"
                options={{
                    title: 'Bars',
                    tabBarIcon: ({ focused }) => <BarIcon focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ focused }) => <AccountIcon focused={focused} />,
                }}
            />
        </Tabs>
    );
}