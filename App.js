console.disableYellowBox = true;

import React, {useState, useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import {
  NativeBaseProvider,
  extendTheme,
} from 'native-base';
import { View, Image } from 'react-native';

import LoginForm from './src/components/LoginForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from './src/utils/context/UserContext';
import io from 'socket.io-client';


import { getUserInfo } from './src/utils/axios';



const myTheme = {
  backgroundColor: 'rgb(3, 57, 94)',
};

const theme = extendTheme(myTheme);

function App() {
  const [token, setToken] = useState(null);
  const socket = io('http://10.0.2.2:3000'); // pour l'émulateur android, utiliser 10.2.2:3000 au lieu de localhost:3000
  const [notifications, setNotifications] = useState(0);
  const [alerts, setAlerts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

const [userInfo, setUserInfo] = useState(null);

useEffect(() => {
  // Simuler un chargement de 3 secondes avant d'afficher l'application
  setTimeout(() => {
    setIsLoading(false);
  }, 3000);
}, []); 

useEffect(() => {
  const fetchUserInfo = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const userInfo = await getUserInfo(userId);
    console.log('Infos user', userInfo);
    setUserInfo(userInfo);
  };
  
  fetchUserInfo();
}, []);

  // récupération des alertes via socket.io
  useEffect(() => {
    socket.on('newAlert', (alert, socketGroups) => {
      console.log('Nouvelle alerte reçue :', alert);
      console.log('Groupes associés :', socketGroups);
      console.log('Infos utilisateur', userInfo);
      
      const userGroupIds = userInfo.groups.map(group => group.id);
      console.log('Groupes de l\'utilisateur', userGroupIds);
      const isAlertRelevant = socketGroups.some(id => userGroupIds.includes(id));
      console.log('Alerte pertinente ?', isAlertRelevant);

      if (isAlertRelevant) {
        setNotifications(prevNotifications => prevNotifications + 1);
        setAlerts(prevAlerts => {
          const updatedAlerts = [...prevAlerts, alert];
          AsyncStorage.setItem('alerts', JSON.stringify(updatedAlerts));
          return updatedAlerts;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo]);

  useEffect(() => {
    async function checkStoredAlerts() {
      const storedAlerts = await AsyncStorage.getItem('alerts');
      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts));
        setNotifications(JSON.parse(storedAlerts).length);
      }
    }

    checkStoredAlerts();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setToken(token);
    };

    // AsyncStorage.removeItem('token');
    // AsyncStorage.removeItem('user');

    getToken();
  }, [token]);

  const disconnect = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };
  console.log('le token :', token);
  return (
    <UserContext.Provider
      value={{
        token: token,
        setToken: setToken,
        userInfo: userInfo,
        setUserInfo: setUserInfo,
        disconnect: disconnect,
        alerts: alerts,
        setAlerts: setAlerts,
      }}>
      <NativeBaseProvider theme={theme}>
        {isLoading ? (
          // Page de chargement
          <View style={{ flex: 1, backgroundColor: '#005F7D', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('./src/assets/img/LOGO LOGISCHOOL - 750x750.png')} />
          </View>
        ) : !token ? (
          // Page de connexion
          <LoginForm />
        ) : (
          // Application
          <NavigationContainer>
            <DrawerNavigation />
          </NavigationContainer>
        )}
      </NativeBaseProvider>
    </UserContext.Provider>
  );
  
}

export default App;


