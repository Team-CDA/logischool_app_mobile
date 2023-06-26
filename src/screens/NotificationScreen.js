import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Animated, StyleSheet, Modal, Button } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../utils/context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
  const { alerts, setAlerts } = useContext(UserContext);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const handleDelete = (item) => {
    setSelectedAlert(item);
    setModalVisible(true);
  };

  const handlePin = (item) => {
    // Implémentez la logique d'épinglage ici
  };

  const confirmDelete = async () => {
    // Suppression de l'alerte du contexte
    const updatedAlerts = alerts.filter(alert => alert.id !== selectedAlert.id);
    setAlerts(updatedAlerts);
    setModalVisible(false);
    
    // Suppression de l'alerte du localStorage
    await AsyncStorage.setItem('alerts', JSON.stringify(updatedAlerts));
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
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id.toString()}  
        ListEmptyComponent={renderEmptyList}
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
            <Text style={styles.modalText}>Confirmer la suppression de l'alerte?</Text>
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
