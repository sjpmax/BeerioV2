
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

        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '#24324A', // your dark bar background
                paddingVertical: 8,
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
                        style={{ flex: 1 }}
                    >
                         <Icon source="glass-tulip" size={16} color="#FFD700" />Type <Icon source="menu-down" size={16} color="#FFD700" />
                    </Button>
                }
            >
                <Menu.Item onPress={closeMenu} title="IPA" />
                <Menu.Item onPress={closeMenu} title="Lager" />
                <Menu.Item onPress={closeMenu} title="Stout" />
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
                        style={{ flex: 1 }}
                    >
                        <Icon source="currency-usd" size={16} color="#FFD700" />Price <Icon source="menu-down" size={16} color="#FFD700" />
                    </Button>
                }
            >
                <Menu.Item onPress={closeMenu} title="Low → High" />
                <Menu.Item onPress={closeMenu} title="High → Low" />
            </Menu>

            {/* ABV dropdown */}
            <Menu
                visible={visibleMenu === 'abv'}
                onDismiss={closeMenu}
                anchor={
                    <Button
                        mode="text"
                        dark={true}
                        buttonrippleColor="#FFD700"
                        textColor="#FFD700"
                        onPress={() => openMenu('abv')}
                        contentStyle={{ flexDirection: 'row-reverse', }}
                        style={{ flex: 1,
                            borderRight: '1px solid #555',
                            borderLeft: '1px solid #555',
                            paddingHorizontal: 10
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
                <Menu.Item onPress={closeMenu} title="Low → High" />
                <Menu.Item onPress={closeMenu} title="High → Low" />
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
                        style={{ flex: 1 }}
                    >
                        <Icon source="map-marker-distance" size={16} color="#FFD700" /> Distance <Icon source="menu-down" size={16} color="#FFD700" />
                    </Button>
                }
            >
                <Menu.Item onPress={closeMenu} title="Nearest" />
                <Menu.Item onPress={closeMenu} title="Farthest" />
            </Menu>
        </View>

    );
}