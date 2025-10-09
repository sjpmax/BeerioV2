
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
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
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#f59e0b',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                    backgroundColor: '#1f2937',
                    borderTopColor: '#374151',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: '#1f2937',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
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