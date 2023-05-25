 
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomHeader from '../components/CustomHeader'; 

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="CustomHeader" component={CustomHeader} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;

 