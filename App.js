import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from "native-base";
import DrawerNavigation from './src/navigation/DrawerNavigation';


export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <DrawerNavigation/>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
