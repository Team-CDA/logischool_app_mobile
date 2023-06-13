import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import {
  NativeBaseProvider,
  Text,
  Box,
  extendTheme,
  Modal,
  Button,
} from 'native-base';
import LoginForm from './src/components/LoginForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Pressable} from 'react-native';
import UserContext from './src/utils/context/UserContext';
import io from 'socket.io-client';

const myTheme = {
  backgroundColor: 'rgb(3, 57, 94)',
};

const theme = extendTheme(myTheme);

function App() {
  const [token, setToken] = useState(null);
  const socket = io('http://10.0.2.2:3000'); // pour l'émulateur android, utiliser 10.2.2:3000 au lieu de localhost:3000
  const [notifications, setNotifications] = useState(0);
  const [alerts, setAlerts] = useState([]);

  //Mise en place des alertes via socket.io
  useEffect(() => {
    socket.on('newAlert', alert => {
      console.log('Nouvelle alerte reçue :', alert);
      setNotifications(prevNotifications => prevNotifications + 1);
      setAlerts(prevAlerts => {
        const updatedAlerts = [...prevAlerts, alert];
        AsyncStorage.setItem('alerts', JSON.stringify(updatedAlerts));
        return updatedAlerts;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
        disconnect: disconnect,
      }}>
      <NativeBaseProvider theme={theme}>
        {!token ? (
          <LoginForm />
        ) : (
          <NavigationContainer>
            <DrawerNavigation />
          </NavigationContainer>
        )}
      </NativeBaseProvider>
    </UserContext.Provider>
  );
}

export default App;


