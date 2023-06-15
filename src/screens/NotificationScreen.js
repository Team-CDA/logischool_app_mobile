import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getNotifications } from '../utils/axios';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications()
      .then(data => {
        setNotifications(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderNotification = ({ item }) => (
    <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#FFFFFF' }}>
      <Text style={{ color: '#000000' }}>{item.title}</Text>  
      <Text style={{ color: '#000000' }}>{item.description}</Text>  
    </View>
  );
  
  const renderEmptyList = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Pas de notification en cours</Text>
    </View>
  );

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotification}
      keyExtractor={(item) => item.id.toString()}  
      ListEmptyComponent={renderEmptyList}
    />
  );
};

export default NotificationScreen;