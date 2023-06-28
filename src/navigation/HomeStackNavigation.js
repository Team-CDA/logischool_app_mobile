import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CantineScreen from '../screens/CantineScreen';
import HomeworkScreen from '../screens/HomeworkScreen';

const Stack = createStackNavigator();

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="CalendarScreen" 
        component={CalendarScreen} 
        options={{ title: 'Emploi du Temps' }}
      />
      <Stack.Screen
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Accueil' , headerShown:false}}
      />
      <Stack.Screen 
        name="CantineScreen"
        component={CantineScreen} 
        options={{ title: 'Menu cantine' }}
      />
      <Stack.Screen
        name="HomeworkScreen"
        component={HomeworkScreen}
        options={{ title: 'Devoirs' }}
      />
      

    </Stack.Navigator>
  );
}

export default HomeStackNavigation;
