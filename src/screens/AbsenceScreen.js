import React, { useEffect, useState, useRef } from 'react';
import { Text, View, FlatList, StyleSheet, Button, Modal, PanResponder, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getAbsencesWithSchedule, sendScannedDocument } from '../utils/axios';

function AbsenceScreen() {
  const [absences, setAbsences] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [justificationModalVisible, setJustificationModalVisible] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;
  const swipeThreshold = 100;

  const fetchAbsencesWithSchedule = async () => {
    setRefreshing(true);
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.error("L'ID de l'utilisateur est manquant");
      return;
    }

    try {
      const fetchedAbsences = await getAbsencesWithSchedule(Number(userId));
      setAbsences(fetchedAbsences);
    } catch (error) {
      console.error("Erreur lors de la récupération des absences :", error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAbsencesWithSchedule();
  }, []);

  const handleJustifyAbsence = () => {
    setJustificationModalVisible(true);
  };

  const handleChoosePhoto = () => {
    const options = { quality: 0.5, base64: true };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        sendScannedDocument(response.base64)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
        setJustificationModalVisible(false);
      }
    });
  };

  const handleTakePhoto = () => {
    const options = { quality: 0.5, base64: true };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        sendScannedDocument(response.base64)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
        setJustificationModalVisible(false);
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10; 
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -swipeThreshold) {
          Animated.timing(panY, {
            toValue: -swipeThreshold,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setJustificationModalVisible(false);
            panY.setValue(0);
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderModalContent = () => {
    return (
      <Animated.View
        style={[styles.modalView, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
        <Text>Justification d'absence</Text>
        <Button onPress={handleChoosePhoto} title="Choisir une photo de la galerie" />
        <Button onPress={handleTakePhoto} title="Prendre une nouvelle photo" />
        <Button
          onPress={() => {
            setJustificationModalVisible(false);
          }}
          title="Fermer"
        />
      </Animated.View>
    );
  };

  const renderItem = ({ item }) => {
    const absenceDate = new Date(item.Schedule.lesson_date).toLocaleDateString('fr-FR');
    const absenceTime = item.Schedule.lesson_date.split('T')[1].substring(0, 5);

    return (
      <View style={styles.item}>
        <Text>Nom de la matière: {item.Schedule.subject_name}</Text>
        <Text>Date de l'absence: {absenceDate}</Text>
        <Text>Heure de l'absence: {absenceTime}</Text>
        {item.justified ? (
          <Button title="Justifié" color="green" disabled />
        ) : (
          <Button title="Non justifiée" color="red" onPress={handleJustifyAbsence} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={absences}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onRefresh={fetchAbsencesWithSchedule}
        refreshing={refreshing}
      />
      <Modal animationType="slide" transparent={true} visible={justificationModalVisible}>
        {renderModalContent()}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default AbsenceScreen;
