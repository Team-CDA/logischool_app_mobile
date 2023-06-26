import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/SettingScreen';
import TroisiemeEcran from '../screens/TroisiemeEcran';
import QuatriemeEcran from '../screens/QuatriemeEcran';
import NotificationScreen from '../screens/NotificationScreen';
import TabBarNavigation from './TabBarNavigation';
import CantineScreen from '../screens/CantineScreen';

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
      <Drawer.Screen name="Cantine" component={CantineScreen} />

    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
