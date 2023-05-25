import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from "native-base";
import TabBarNavigation from './src/navigation/TabBarNavigation';



export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <TabBarNavigation/>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
