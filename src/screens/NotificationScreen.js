import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Animated, StyleSheet, Modal, Button } from 'react-native';
import { getNotifications } from '../utils/axios';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

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
    setSelectedNotification(item);
    setModalVisible(true);
  };

  const handlePin = (item) => {
    // Implémentez la logique d'épinglage ici
  };

  const confirmDelete = () => {
    setNotifications(notifications.filter(notification => notification.id !== selectedNotification.id));
    setModalVisible(false);
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
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}  
        ListEmptyComponent={renderEmptyList}
        refreshing={refreshing}
        onRefresh={loadNotifications}
      />
      <Button title="Fermer" onPress={() => navigation.goBack()} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirmer la suppression de la notification?</Text>
            <Button onPress={confirmDelete} title="Confirmer" />
            <Button onPress={() => setModalVisible(false)} title="Annuler" />
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default NotificationScreen;
