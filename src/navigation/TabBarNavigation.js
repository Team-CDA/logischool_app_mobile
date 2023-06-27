import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigation from './HomeStackNavigation';
import ProfileScreen from '../screens/SettingScreen';
import ScanScreen from '../screens/ScanScreen';
import QuatriemeEcran from '../screens/QuatriemeEcran';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';



const Tab = createBottomTabNavigator();

const TabBarNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeStackNavigation') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'md-person' : 'md-person-outline';
          } else if (route.name === 'ScanScreen') {
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
        header: () => <CustomHeader/>
        ,
      })}
    >
      <Tab.Screen name="HomeStackNavigation" component={HomeStackNavigation} options={{ tabBarLabel: () => null }}/>
      <Tab.Screen name="ScanScreen" component={ScanScreen} options={{ tabBarLabel: () => null }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: () => null }}/>
      <Tab.Screen name="QuatriemeEcran" component={QuatriemeEcran} options={{ tabBarLabel: () => null }}/>
    </Tab.Navigator>
  );
}


export default TabBarNavigation;
