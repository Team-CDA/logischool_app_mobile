import {View, Text, TextInput, StyleSheet, ImageBackground} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  Input,
  Pressable,
  Checkbox,
  useToast,
  Box,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {authenticateUser} from '../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../utils/context/UserContext';
import CustomMediumButton from './Buttons/CustomMediumButton';

// image d'arrière-plan
const bgImage = require('../assets/img/school-background.jpeg'); 

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(null);
  const [mailSaved, setMailSaved] = useState(null);
  const userContext = useContext(UserContext);
  const toast = useToast();
  const toastIdRef = useRef();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("L'adresse e-mail est requise"),
    password: Yup.string().required('Le mot de passe est requis'),
  });

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const verifyIfMailSaved = async () => {
    const isMail = await AsyncStorage.getItem('rememberEmail');
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    if (isMail == 'true') {
      setChecked(true);
      setMailSaved(user.email);
    } else {
      setChecked(false);
    }
  };

  useEffect(() => {
    if (checked == null) {
      verifyIfMailSaved();
    }
  }, [checked]);

  const handleLogin = async values => {
    authenticateUser(values).then(r => {
      if (r) {
        userContext.setToken(r.token);
        if (!checked) {
          AsyncStorage.setItem('rememberEmail', 'false');
        } else {
          AsyncStorage.setItem('rememberEmail', 'true');
        }
      } else {
        setIsLoading(false);
        toastIdRef.current = toast.show({
          render: () => {
            return (
              <Box bg="error.300" px="2" py="1" rounded="sm" mb={5}>
                Identifiant ou mot de passe incorrect
              </Box>
            );
          },
        });
      }
    });
  };

  const [hidePwd, setHidePwd] = React.useState(true);

  return checked !== null ? (
    <ImageBackground source={bgImage} style={styles.container}>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          email: mailSaved,
          password: '',
          checked: checked,
        }}
        onSubmit={values => {
          handleLogin(values);
        }}>
        {({handleChange, handleSubmit, values, errors, validateForm}) => (
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Input
              backgroundColor="white"
              color="black"
              mt={'5%'}
              w={{
                base: '60%',
                md: '20%',
              }}
              placeholder="email"
              onChangeText={handleChange('email')}
              value={values.email}
            />
            {errors.email && <Text>{errors.email}</Text>}
            <Input
              backgroundColor="white"
              color="black"
              mt={'5%'}
              w={{
                base: '60%',
                md: '20%',
              }}
              placeholder="Mot de passe"
              onChangeText={handleChange('password')}
              value={values.password}
              secureTextEntry={hidePwd}
              InputRightElement={
                <Pressable pr={2} onPress={() => setHidePwd(!hidePwd)}>
                  {hidePwd ? (
                    <Icon
                      name={'eye'}
                      size={20}
                      color="black" // Vous pouvez ajuster la couleur à votre thème
                    />
                  ) : (
                    <Icon
                      name={'eye-off'}
                      size={20}
                      color="black" // Vous pouvez ajuster la couleur à votre thème
                    />
                  )}
                </Pressable>
              }
            />
            {errors.password && <Text>{errors.password}</Text>}
            <Checkbox
              defaultIsChecked={checked}
              value="saveEmail"
              onChange={handleCheckboxChange}
              mt={'5%'}>
              Se souvenir de moi
            </Checkbox>
            {isLoading ? (
              <CustomMediumButton
                text="Connexion"
                titleColor="#fff"
                loading
                onPress={async values => {
                  setIsLoading(true);
                  validateForm().then(res => {
                    if (res.email || res.password) {
                      setIsLoading(false);
                    } else {
                      handleSubmit(values);
                    }
                  });
                }}
              />
            ) : (
              <CustomMediumButton
                text="Connexion"
                titleColor="#FFF"
                onPress={async values => {
                  setIsLoading(true);
                  validateForm().then(res => {
                    if (res.email || res.password) {
                      setIsLoading(false);
                    } else {
                      handleSubmit(values);
                    }
                  });
                }}
              />
            )}
          </View>
        )}
      </Formik>
    </ImageBackground>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:'40%',
  },
});

export default LoginForm;