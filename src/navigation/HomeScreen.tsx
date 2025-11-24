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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home/HomeScreen';
import NewsScreen from '../screens/Home/NewsScreen';
import HelpScreen from '../screens/Home/HelpScreen';
import { useTheme } from '../theme/ThemeContext';

export type HomeTabsParamList = {
    Home: undefined;
    News: undefined;
    Help: undefined;
};

const Tab = createBottomTabNavigator<HomeTabsParamList>();

export default function HomeTabs() {
    // 🔹 Read theme + device safe area (bottom gesture bar)
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const activeTint = isDark ? '#22C55E' : '#16A34A';
    const inactiveTint = isDark ? '#9CA3AF' : '#6B7280';
    const bg = isDark ? '#020617' : '#FFFFFF';
    const border = isDark ? '#1F2937' : '#E5E7EB';

    // base height for tab bar (icons + labels)
    const BASE_HEIGHT = 56;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: activeTint,
                tabBarInactiveTintColor: inactiveTint,

                // 🔹 Dynamic tab bar that respects bottom safe area on all devices
                tabBarStyle: {
                    backgroundColor: bg,
                    borderTopColor: border,
                    borderTopWidth: 1,
                    paddingTop: 4,
                    paddingBottom: Math.max(insets.bottom, 6),
                    height: BASE_HEIGHT + insets.bottom,
                },

                // 🔹 Custom label so we can tweak font-weight
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
                                // small nudge when there is a big bottom inset so text doesn't look cramped
                                marginBottom: insets.bottom ? 2 : 0,
                            }}
                        >
                            {label}
                        </Text>
                    );
                },

                // 🔹 Icons
                tabBarIcon: ({ color, size, focused }) => {
                    const iconMap: Record<
                        string,
                        { active: string; inactive: string }
                    > = {
                        Home: { active: 'home', inactive: 'home-outline' },
                        News: { active: 'newspaper', inactive: 'newspaper-outline' },
                        Help: { active: 'help-circle', inactive: 'help-circle-outline' },
                    };

                    const cfg =
                        iconMap[route.name] ?? {
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
