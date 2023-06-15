import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Animated, StyleSheet } from 'react-native';
import { getNotifications } from '../utils/axios';
import { Swipeable, RectButton } from 'react-native-gesture-handler';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(() => {
    setRefreshing(true);
    getNotifications()
      .then(data => {
        setNotifications(data);
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleDelete = (item) => {
    setNotifications(notifications.filter(notification => notification.id !== item.id));
    // Appel à l'API pour supprimer la notification ici
  };

  const renderNotification = ({ item }) => {
    const renderRightAction = (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      });
      return (
        <RectButton onPress={() => handleDelete(item)}>
          <Animated.View
            style={[
              styles.rightAction,
              {
                transform: [{ translateX: trans }],
              },
            ]}>
            <Text style={styles.actionText}>Supprimer</Text>
          </Animated.View>
        </RectButton>
      );
    };
    return (
      <Swipeable renderRightActions={renderRightAction}>
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#FFFFFF' }}>
          <Text style={{ color: '#000000' }}>{item.message}</Text>  
        </View>
      </Swipeable>
    );
  };

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
      refreshing={refreshing}
      onRefresh={loadNotifications}
    />
  );
};

const styles = StyleSheet.create({
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  actionText: {
    color: 'white',
    padding: 20,
  },
});

export default NotificationScreen;
