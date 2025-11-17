
import React from 'react';
import { View } from 'react-native';
import { Button, Icon, Menu } from 'react-native-paper';

export default function BeerSelectFilter(filters: any, onFilterChange: any) {
    const [visibleMenu, setVisibleMenu] = React.useState(null);
    const closeMenu = () => setVisibleMenu(null);
    const setQuery = (value: string) => {
        closeMenu();   // Close menu after selection
        filters.setQuery(value);
    };


    const openMenu = (menu) => {
        if (visibleMenu === menu) {
            setVisibleMenu(null);  // Close if already open
        } else {
            setVisibleMenu(menu);  // Open if closed or different menu
        }
    };

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: '#24324A', // your dark bar background
                    paddingVertical: 5,
                    height: 50
                }}
            >
                {/* TYPE dropdown */}
                <Menu
                    visible={visibleMenu === 'type'}
                    onDismiss={closeMenu}
                    anchor={
                        <Button
                            mode="text"
                            textColor="#FFD700"
                            onPress={() => openMenu('type')}
                            contentStyle={{ flexDirection: 'row-reverse' }}
                            labelStyle={{ fontSize: 14 }}
                            style={{ flex: 1 }}
                        >
                            <Icon source="glass-tulip" size={20} color="#FFD700" />Type <Icon source="menu-down" size={20} color="#FFD700" />
                        </Button>
                    }
                >
                </Menu>

                {/* PRICE dropdown */}
                <Menu
                    visible={visibleMenu === 'price'}
                    onDismiss={closeMenu}
                    anchor={
                        <Button
                            mode="text"
                            textColor="#FFD700"
                            onPress={() => openMenu('price')}
                            contentStyle={{ flexDirection: 'row-reverse' }}
                            labelStyle={{
                                fontSize: 14,
                                backgroundColor: '#white'
                            }}
                            style={{
                                flex: 1,
                                borderLeftWidth: 1,
                                borderLeftColor: '#2a4a5e',
                                borderRadius: 0
                            }}
                        >
                            <Icon source="currency-usd" size={20} color="#FFD700" />Price <Icon source="menu-down" size={20} color="#FFD700" />
                        </Button>
                    }
                >
                </Menu>

                {/* ABV dropdown */}
                <Menu
                    visible={visibleMenu === 'abv'}
                    onDismiss={closeMenu}
                    anchor={
                        <Button
                            mode="text"
                            dark={true}
                            textColor="#FFD700"
                            onPress={() => openMenu('abv')}
                            contentStyle={{ flexDirection: 'row-reverse', }}
                            style={{
                                flex: 1,
                                borderLeftWidth: 1,
                                borderLeftColor: '#2a4a5e',
                                borderRadius: 0
                            }}
                            labelStyle={{
                                fontSize: 14,
                                letterSpacing: 0.5  // Add slight letter spacing
                            }}
                        >
                            <Icon source="water-percent" size={20} color="#FFD700" />ABV <Icon source="menu-down" size={18} color="#FFD700" />
                        </Button>
                    }
                >
                </Menu>

                {/* DISTANCE dropdown */}
                <Menu
                    visible={visibleMenu === 'distance'}
                    onDismiss={closeMenu}
                    anchor={
                        <Button
                            mode="text"
                            textColor="#FFD700"
                            onPress={() => openMenu('distance')}
                            contentStyle={{ flexDirection: 'row-reverse' }}
                            labelStyle={{ fontSize: 14 }}
                            style={{
                                flex: 1,
                                borderLeftWidth: 1,
                                borderLeftColor: '#2a4a5e',
                                borderRadius: 0
                            }}
                        >
                            <Icon source="map-marker-distance" size={20} color="#FFD700" /> Distance <Icon source="menu-down" size={20} color="#FFD700" />
                        </Button>
                    }
                >
                </Menu>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>

            </View>
        </View>

    );
}