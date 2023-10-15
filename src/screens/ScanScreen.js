import React, { useRef } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';
import { sendScannedDocument } from '../utils/axios';



const ScanScreen = () => {
  const cameraRef = useRef();

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
  
      sendScannedDocument(data.base64)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
      />
      <Button title="Prendre une photo" onPress={handleTakePicture} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default ScanScreen;
