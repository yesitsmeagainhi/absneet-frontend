// // src/navigation/HomeTabs.tsx
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import HomeScreen from '../screens/Home/HomeScreen';
// import NewsScreen from '../screens/Home/NewsScreen';
// import HelpScreen from '../screens/Home/HelpScreen';

// export type HomeTabsParamList = {
//     Home: undefined;
//     News: undefined;
//     Help: undefined;
// };

// const Tab = createBottomTabNavigator<HomeTabsParamList>();

// export default function HomeTabs() {
//     return (
//         <Tab.Navigator
//             screenOptions={({ route }) => ({
//                 headerShown: false,
//                 tabBarIcon: ({ color, size, focused }) => {
//                     const iconMap: Record<string, string> = {
//                         Home: focused ? 'home' : 'home-outline',
//                         News: focused ? 'newspaper' : 'newspaper-outline',
//                         Help: focused ? 'help-circle' : 'help-circle-outline',
//                     };
//                     return (
//                         <Ionicons
//                             name={iconMap[route.name] ?? 'ellipse'}
//                             size={size}
//                             color={color}
//                         />
//                     );
//                 },
//             })}
//         >
//             <Tab.Screen name="Home" component={HomeScreen} />
//             <Tab.Screen name="News" component={NewsScreen} />
//             <Tab.Screen name="Help" component={HelpScreen} />
//         </Tab.Navigator>
//     );
// }


// src/navigation/HomeTabs.tsx
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/Home/HomeScreen';
import NewsScreen from '../screens/Home/NewsScreen';
import HelpScreen from '../screens/Home/HelpScreen';

export type HomeTabsParamList = {
    Home: undefined;
    News: undefined;
    Help: undefined;
};

const Tab = createBottomTabNavigator<HomeTabsParamList>();

export default function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                // THEME COLORS (match new HomeScreen)
                tabBarActiveTintColor: '#22C55E',   // bright green
                tabBarInactiveTintColor: '#9CA3AF', // muted gray
                tabBarStyle: {
                    backgroundColor: '#020617',       // near-black
                    borderTopColor: '#1F2937',
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 4,
                },

                // Custom label so we can style weight per focus state
                tabBarLabel: ({ focused, color }) => {
                    const labelMap: Record<string, string> = {
                        Home: 'Home',
                        News: 'News',
                        Help: 'Help',
                    };
                    const label = labelMap[route.name] ?? route.name;
                    return (
                        <Text
                            style={{
                                color,
                                fontSize: 11,
                                fontWeight: focused ? '700' : '500',
                            }}
                        >
                            {label}
                        </Text>
                    );
                },

                // Icons
                tabBarIcon: ({ color, size, focused }) => {
                    const iconMap: Record<string, { active: string; inactive: string }> = {
                        Home: { active: 'home', inactive: 'home-outline' },
                        News: { active: 'newspaper', inactive: 'newspaper-outline' },
                        Help: { active: 'help-circle', inactive: 'help-circle-outline' },
                    };

                    const cfg = iconMap[route.name] ?? {
                        active: 'ellipse',
                        inactive: 'ellipse-outline',
                    };

                    return (
                        <Ionicons
                            name={focused ? cfg.active : cfg.inactive}
                            size={size}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="News" component={NewsScreen} />
            <Tab.Screen name="Help" component={HelpScreen} />
        </Tab.Navigator>
    );
}

// // src/navigation/HomeTabs.tsx
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import HomeScreen from '../screens/Home/HomeScreen';
// import NewsScreen from '../screens/Home/NewsScreen';
// import HelpScreen from '../screens/Home/HelpScreen';

// export type HomeTabsParamList = {
//     Home: undefined;
//     News: undefined;
//     Help: undefined;
// };

// const Tab = createBottomTabNavigator<HomeTabsParamList>();

// export default function HomeTabs() {
//     return (
//         <Tab.Navigator
//             screenOptions={({ route }) => ({
//                 headerShown: false,
//                 tabBarIcon: ({ color, size, focused }) => {
//                     const iconMap: Record<string, string> = {
//                         Home: focused ? 'home' : 'home-outline',
//                         News: focused ? 'newspaper' : 'newspaper-outline',
//                         Help: focused ? 'help-circle' : 'help-circle-outline',
//                     };
//                     return (
//                         <Ionicons
//                             name={iconMap[route.name] ?? 'ellipse'}
//                             size={size}
//                             color={color}
//                         />
//                     );
//                 },
//             })}
//         >
//             <Tab.Screen name="Home" component={HomeScreen} />
//             <Tab.Screen name="News" component={NewsScreen} />
//             <Tab.Screen name="Help" component={HelpScreen} />
//         </Tab.Navigator>
//     );
// }
