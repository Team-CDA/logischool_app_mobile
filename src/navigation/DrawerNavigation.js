import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { View, TouchableOpacity, Text } from 'react-native';
import ProfileScreen from '../screens/SettingScreen';
import TroisiemeEcran from '../screens/TroisiemeEcran';
import QuatriemeEcran from '../screens/QuatriemeEcran';
import NotificationScreen from '../screens/NotificationScreen';
import TabBarNavigation from './TabBarNavigation';
import React from 'react';
import LogoutModal from '../components/LogoutModal';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <DrawerContentScrollView contentContainerStyle={{flex: 1}}>
      <DrawerItem
        label="Accueil"
        onPress={() => navigation.navigate('Accueil')}
        icon={({ color, size }) => (
          <Icon name="home-outline" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="Notification"
        onPress={() => navigation.navigate('Notification')}
        icon={({ color, size }) => (
          <Icon name="notifications-outline" color={color} size={size} />
        )}
      />
      
      <View style={{marginTop: 'auto'}}>
        <TouchableOpacity onPress={toggleModal}>
          <View style={{flexDirection: 'row', alignItems: 'center', padding: 16, margin:20,  backgroundColor: 'green', borderRadius: 10}}>
            <Icon name="log-out-outline" size={24} color='red' />
            <Text style={{marginLeft: 32, color: 'red', textAlign: 'center'}}>Déconnexion</Text>
          </View>
        </TouchableOpacity>
        <LogoutModal visible={modalVisible} onClose={toggleModal} />
      </View>
    </DrawerContentScrollView>
  );
};

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName="TabBarNavigation"
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        // drawerActiveTintColor: 'red',
        // drawerInactiveTintColor: 'black',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Accueil" component={TabBarNavigation} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
