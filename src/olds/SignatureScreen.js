import React, {useRef, useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import axiosInstance from '../utils/interceptor';
import Signature from 'react-native-signature-canvas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AnimatePresence} from 'framer-motion';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview'; 

const SignatureScreen = () => {
  const [establishmentData, setEstablishmentData] = useState([]);
  const [user, setUser] = useState({});
  useEffect(() => {
    const getData = async () => {
      const data = await AsyncStorage.getItem('establishmentData');
      setEstablishmentData(JSON.parse(data));
      const userData = await AsyncStorage.getItem('user');
      setUser(JSON.parse(userData));
    };
    getData();
  }, []);

  const [signature, setSignature] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitSignature = async signatureDataURL => {
    const data = {
      student_id: user.id,
      date_emargement: new Date(),
      signature: signatureDataURL,
    };

    try {
      const response = await axiosInstance.post('/signatures/create', data);

      if (response.status === 200 || response.status === 201) {
        console.log('Signature saved:', response.data);
      } else {
        console.error('Error saving signature:', response.status);
      }
    } catch (error) {
      console.error('Error submitting signature:', error);
    }
  };

  const handleSignature = signature => {
    setSignature(signature);
  };

  const clearSignature = () => {
    setSignature(null);
  };

  const saveSignature = () => {
    if (signature) {
      console.log('Signature data:', signature);
      submitSignature(signature);
      setIsSubmitted(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {establishmentData?.establishmentType?.name} {establishmentData?.name}
      </Text>
      <Text style={styles.subtitle}>
        {isSubmitted
          ? 'Merci pour votre émargement'
          : `Emargement du ${new Date()
              .getDate()
              .toString()
              .padStart(2, '0')}/${(new Date().getMonth() + 1)
              .toString()
              .padStart(2, '0')}/${new Date().getFullYear()} ${
              new Date().getHours() < 12 ? 'Matin' : 'Après-midi'
            } ${user.firstname} ${user.lastname}`}
      </Text>
      {!isSubmitted && (
        <Signature
          onOK={handleSignature}
          onEmpty={() => Alert.alert('Signature is required')}
          descriptionText="Sign"
          clearText="Clear"
          confirmText="Save"
          webStyle={styles.signature}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearSignature}
          disabled={isSubmitted}>
          <Text style={styles.buttonText}>Effacer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={saveSignature}
          disabled={isSubmitted || !signature}>
          <Text style={styles.buttonText}>Soumettre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    margin: 8,
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#3f51b5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SignatureScreen;
