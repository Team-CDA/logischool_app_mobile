import {
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { View, TouchableOpacity, Text } from 'react-native';
import NotificationScreen from '../screens/NotificationScreen';
import TabBarNavigation from './TabBarNavigation';
import CantineScreen from '../screens/CantineScreen';
import React , {useState, useCallback, useEffect} from 'react';
import LogoutModal from '../components/LogoutModal';
import Icon from 'react-native-vector-icons/Ionicons';
import { getNotifications } from '../utils/axios'; // le chemin doit correspondre à l'emplacement de votre fichier axios.js


const Drawer = createDrawerNavigator();


  const CustomDrawerContent = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
  
    const loadNotifications = useCallback(() => {
      getNotifications()
        .then(data => {
          setNotificationCount(data.length);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);
  
    useEffect(() => {
      loadNotifications();
    }, [loadNotifications]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const isFocused = (routeName) => {
    return props.state.routes[props.state.index].name === routeName;
  };

  const DrawerButton = ({ label, icon, route, hasBadge }) => (
    <TouchableOpacity onPress={() => props.navigation.navigate(route)}>
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, margin: 10, marginLeft:20,  marginRight:20,  backgroundColor: isFocused(route) ? '#EFF7FF' : 'transparent', borderWidth: isFocused(route) ? 1 : 0, borderColor:'#0F80D7', borderRadius: 10}}>
        <Icon name={icon} size={24} color={isFocused(route) ? '#0F80D7' : 'black'} />
        <Text style={{marginLeft: 32, color: isFocused(route) ? '#0F80D7' : 'black', textAlign: 'center', fontWeight:'bold', fontSize:16}}>{label}</Text>
        {hasBadge && notificationCount > 0 && (
          <View style={{backgroundColor: 'red', borderRadius: 10, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 'auto'}}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>{notificationCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView contentContainerStyle={{flex: 1}}>
      <DrawerButton
        label="Accueil"
        route="Accueil"
        icon="home-outline"
      />
      <DrawerButton
        label="Notification"
        route="Notification"
        icon="notifications-outline"
        hasBadge={true}
      />
      
      <View style={{marginTop: 'auto'}}>
        <TouchableOpacity onPress={toggleModal}>
          <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, margin:20,  backgroundColor: '#FEFCF5', borderWidth:1, borderColor:'#F2DBB7', borderRadius: 10}}>
            <Icon name="log-out-outline" size={24} color='#8C5701' />
            <Text style={{marginLeft: 32, color: '#8C5701', textAlign: 'center', fontWeight:'bold', fontSize:16}}>Déconnexion</Text>
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
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Accueil" component={TabBarNavigation} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />
      <Drawer.Screen name="Cantine" component={CantineScreen} />

    </Drawer.Navigator>
  );
}

export default DrawerNavigation;