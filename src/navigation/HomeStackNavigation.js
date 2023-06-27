import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CantineScreen from '../screens/CantineScreen';
import profScreen from '../screens/ProfScreen';

const Stack = createStackNavigator();

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Accueil' , headerShown:false}}
      />
      <Stack.Screen 
        name="CalendarScreen" 
        component={CalendarScreen} 
        options={{ title: 'Emploi du Temps' }}
      />
       <Stack.Screen 
        name="CantineScreen" 
        component={CantineScreen} 
        options={{ title: 'Emploi du Temps' }}
      />
        <Stack.Screen 
        name="profScreen" 
        component={profScreen} 
        options={{ title: 'Emploi du Temps' }}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigation;