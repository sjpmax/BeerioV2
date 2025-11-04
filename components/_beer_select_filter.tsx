

import React from 'react';
import { View } from 'react-native';
import { Button, Menu } from 'react-native-paper';

const [visibleMenu, setVisibleMenu] = React.useState(null);

const openMenu = (menu) => setVisibleMenu(menu);
const closeMenu = () => setVisibleMenu(null);


export default function BeerSelectFilter() {
    return (

        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '#24324A', // your dark bar background
                paddingVertical: 8,
                height: 50,
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
                        contentStyle={{ flexDirection: 'row-reverse', paddingBottom: 2 }}
                        style={{
                            flex: 1, 
                        }}
                    >
                        Type ▾
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
                        Price ▾
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
                        textColor="#FFD700"
                        onPress={() => openMenu('abv')}
                        contentStyle={{ flexDirection: 'row-reverse' }}
                        style={{ flex: 1 }}
                    >
                        ABV ▾
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
                        Distance ▾
                    </Button>
                }
            >
                <Menu.Item onPress={closeMenu} title="Nearest" />
                <Menu.Item onPress={closeMenu} title="Farthest" />
            </Menu>
        </View>

    );
}