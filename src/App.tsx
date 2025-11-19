import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '../src/navigation/rootnavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}