import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootNavigator from '../src/navigation/rootnavigator';     // 👈 note: ./src/...
import { ThemeProvider } from '../src/theme/ThemeContext';       // 👈 same src path

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
