import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/SettingScreen';
import TroisiemeEcran from '../screens/TroisiemeEcran';
import QuatriemeEcran from '../screens/QuatriemeEcran';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';

const Tab = createBottomTabNavigator();

export default function TabBarNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'md-person' : 'md-person-outline';
          } else if (route.name === 'TroisiemeEcran') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'QuatriemeEcran') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          display: 'flex',  
          alignItems: "center", 
          padding: 10
        },
        header: () => <CustomHeader/>,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: () => null }}/>
      <Tab.Screen name="TroisiemeEcran" component={TroisiemeEcran} options={{ tabBarLabel: () => null }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: () => null }}/>
      <Tab.Screen name="QuatriemeEcran" component={QuatriemeEcran} options={{ tabBarLabel: () => null }}/>
    </Tab.Navigator>
  );
}
