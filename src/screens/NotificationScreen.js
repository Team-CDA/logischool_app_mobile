import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Animated, StyleSheet, Modal, Button } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../utils/context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
  const { alerts, setAlerts } = useContext(UserContext);
  const navigation = useNavigation();

  const handleDelete = async (item) => {
    // Suppression de l'alerte du contexte
    const updatedAlerts = alerts.filter(alert => alert.id !== item.id);
    setAlerts(updatedAlerts);
    
    // Suppression de l'alerte du localStorage
    await AsyncStorage.setItem('alerts', JSON.stringify(updatedAlerts));
  };

  const handlePin = (item) => {
    // Implémentez la logique d'épinglage ici
  };

  const renderAlert = ({ item }) => {
    const renderRightAction = (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      const opacity = dragX.interpolate({
        inputRange: [-100, -50],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      return (
        <RectButton onPress={() => handleDelete(item)}>
          <Animated.View
            style={[
              styles.rightAction,
              {
                transform: [{ scale: scale }],
                opacity: opacity,
              },
            ]}>
            <Text style={styles.actionText}>SUPPRIMER</Text>
          </Animated.View>
        </RectButton>
      );
    };
    
    return (
      <Swipeable renderRightActions={renderRightAction}>
        <RectButton onPress={() => handlePin(item)}>
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#FFFFFF' }}>
            <Text style={{ color: '#000000' }}>{item.message}</Text>  
          </View>
        </RectButton>
      </Swipeable>
    );
  };

  const renderEmptyList = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Pas de notification en cours</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 20 }}>Notifications</Text>
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id.toString()}  
        ListEmptyComponent={renderEmptyList}
      />
      <Button title="Fermer" onPress={() => navigation.goBack()} style={styles.closeButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    color: 'white',
    padding: 20,
    },
  closeButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  });

export default NotificationScreen;
