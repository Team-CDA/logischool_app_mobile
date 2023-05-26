import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import ProfileScreen from '../screens/SettingScreen';
import TroisiemeEcran from '../screens/TroisiemeEcran';
import QuatriemeEcran from '../screens/QuatriemeEcran';
import NotificationScreen from '../screens/NotificationScreen';
import TabBarNavigation from './TabBarNavigation';
import React from 'react';
import LogoutModal from '../components/LogoutModal';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="Accueil"
        onPress={() => navigation.navigate('Accueil')}
      />
      <DrawerItem
        label="Notification"
        onPress={() => navigation.navigate('Notification')}
      />
      <DrawerItem label="Déconnexion" onPress={toggleModal} />
      <LogoutModal visible={modalVisible} onClose={toggleModal} />
    </DrawerContentScrollView>
  );
};

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      drawer
      initialRouteName="TabBarNavigation"
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Accueil" component={TabBarNavigation} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
