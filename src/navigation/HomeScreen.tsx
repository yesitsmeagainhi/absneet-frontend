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
                tabBarIcon: ({ color, size, focused }) => {
                    const iconMap: Record<string, string> = {
                        Home: focused ? 'home' : 'home-outline',
                        News: focused ? 'newspaper' : 'newspaper-outline',
                        Help: focused ? 'help-circle' : 'help-circle-outline',
                    };
                    return (
                        <Ionicons
                            name={iconMap[route.name] ?? 'ellipse'}
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
