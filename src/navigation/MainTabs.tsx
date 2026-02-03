// src/navigation/MainTabs.tsx
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MainScreen from '../screens/Main/MainScreen';
import NewsScreen from '../screens/Home/NewsScreen';
import HelpScreen from '../screens/Home/HelpScreen';
import { useTheme } from '../theme/ThemeContext';

export type MainTabsParamList = {
    Main: undefined;
    News: undefined;
    Help: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const activeTint = isDark ? '#22C55E' : '#16A34A';
    const inactiveTint = isDark ? '#9CA3AF' : '#6B7280';
    const bg = isDark ? '#020617' : '#FFFFFF';
    const border = isDark ? '#1F2937' : '#E5E7EB';

    const BASE_HEIGHT = 56;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: activeTint,
                tabBarInactiveTintColor: inactiveTint,
                tabBarStyle: {
                    backgroundColor: bg,
                    borderTopColor: border,
                    borderTopWidth: 1,
                    paddingTop: 4,
                    paddingBottom: Math.max(insets.bottom, 6),
                    height: BASE_HEIGHT + insets.bottom,
                },
                tabBarLabel: ({ focused, color }) => {
                    const labelMap: Record<string, string> = {
                        Main: 'Home',
                        News: 'News',
                        Help: 'Help',
                    };
                    return (
                        <Text
                            style={{
                                color,
                                fontSize: 11,
                                fontWeight: focused ? '700' : '500',
                                marginBottom: insets.bottom ? 2 : 0,
                            }}
                        >
                            {labelMap[route.name] ?? route.name}
                        </Text>
                    );
                },
                tabBarIcon: ({ color, size, focused }) => {
                    const iconMap: Record<string, { active: string; inactive: string }> = {
                        Main: { active: 'home', inactive: 'home-outline' },
                        News: { active: 'newspaper', inactive: 'newspaper-outline' },
                        Help: { active: 'help-circle', inactive: 'help-circle-outline' },
                    };
                    const cfg = iconMap[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
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
            <Tab.Screen name="Main" component={MainScreen} />
            <Tab.Screen name="News" component={NewsScreen} />
            <Tab.Screen name="Help" component={HelpScreen} />
        </Tab.Navigator>
    );
}
