// import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import VideosScreen from '../screens/Content/VideosScreen';
// import PdfsScreen from '../screens/Content/PdfsScreen';
// import McqIntroScreen from '../screens/Content/McqIntroScreen';
// import { useRoute } from '@react-navigation/native';


// export type ContentTabParams = { MCQ: undefined; Videos: undefined; PDF: undefined };
// const Tab = createMaterialTopTabNavigator<ContentTabParams>();
// const { params } = useRoute<any>();


// export default function ContentTabs() {
//     return (
//         <Tab.Navigator>
//             <Tab.Screen name="MCQ" component={McqIntroScreen} initialParams={params} />
//             <Tab.Screen name="Videos" component={VideosScreen} initialParams={params} />
//             <Tab.Screen name="PDF" component={PdfsScreen} initialParams={params} />
//         </Tab.Navigator>
//     );
// }

// src/navigation/ContentTabs.tsx
import React, { useMemo } from 'react';
import { View, type TextStyle, type ViewStyle } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import VideosScreen from '../screens/Content/VideosScreen';
import PdfsScreen from '../screens/Content/PdfsScreen';
import McqIntroScreen from '../screens/Content/McqIntroScreen';
import { useTheme, Colors } from '../theme/ThemeContext';

const Tab = createMaterialTopTabNavigator();

export default function ContentTabs({ route }: any) {
    const params = route?.params ?? {};

    const { isDark } = useTheme();

    const {
        tabBarStyle,
        tabBarLabelStyle,
        tabBarIndicatorStyle,
        sceneBg,
        inactiveColor,
    } = useMemo<{
        tabBarStyle: ViewStyle;
        tabBarLabelStyle: TextStyle;
        tabBarIndicatorStyle: ViewStyle;
        sceneBg: string;
        inactiveColor: string;
    }>(
        () => ({
            tabBarStyle: {
                backgroundColor: isDark ? '#020617' : '#FFFFFF',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600' as TextStyle['fontWeight'], // 👈 key line
                textTransform: 'none',
            },
            tabBarIndicatorStyle: {
                backgroundColor: Colors.accent,
            },
            sceneBg: isDark ? '#0F172A' : '#F9FAFB',
            inactiveColor: isDark ? '#9CA3AF' : '#6B7280',
        }),
        [isDark],
    );

    return (
        <View style={{ flex: 1, backgroundColor: sceneBg }}>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle,
                    tabBarIndicatorStyle,
                    tabBarLabelStyle,
                    tabBarActiveTintColor: Colors.accent,
                    tabBarInactiveTintColor: inactiveColor,
                }}
            >
                <Tab.Screen
                    name="MCQ"
                    component={McqIntroScreen}
                    options={{ tabBarLabel: 'MCQ' }}
                    initialParams={params}
                />
                <Tab.Screen
                    name="Videos"
                    component={VideosScreen}
                    options={{ tabBarLabel: 'Videos' }}
                    initialParams={params}
                />
                <Tab.Screen
                    name="PDF"
                    component={PdfsScreen}
                    options={{ tabBarLabel: 'PDFs' }}
                    initialParams={params}
                />
            </Tab.Navigator>
        </View>
    );
}

