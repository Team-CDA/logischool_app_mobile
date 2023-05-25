import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/SettingScreen';
import TroisiemeEcran from '../screens/TroisiemeEcran';
import QuatriemeEcran from '../screens/QuatriemeEcran';
import NotificationScreen from '../screens/NotificationScreen';
import TabBarNavigation from './TabBarNavigation'; 

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator 
    initialRouteName="TabBarNavigation" 
    screenOptions={{
      headerShown: false 
    }}>
      <Drawer.Screen name="Accueil" component={TabBarNavigation} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />

    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
