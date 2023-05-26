import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  Input,
  Pressable,
  Button,
  useTheme,
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

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(null);
  const [mailSaved, setMailSaved] = useState(null);
  const userContext = useContext(UserContext);
  const [groupValue, setGroupValue] = useState(['saveEmail']);

  //Création du toast d'erreur de connexion
  const toast = useToast();
  const toastIdRef = useRef();

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  function addToast() {
    // toastIdRef.current = toast.show({
    //   title: 'Identifiant ou mot de passe incorrect',
    //   variant: 'outline',
    // });
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

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("L'adresse e-mail est requise"),
    password: Yup.string().required('Le mot de passe est requis'),
  });

  const handleCheckboxChange = () => {
    setChecked(!checked);
    // console.log(checked);
  };

  const verifyIfMailSaved = async () => {
    const isMail = await AsyncStorage.getItem('rememberEmail');
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    console.log(user);
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

  const theme = useTheme();

  const handleLogin = async values => {
    console.log('values', values);
    authenticateUser(values).then(r => {
      if (r) {
        userContext.setToken(r.token);
        if (!checked) {
          AsyncStorage.setItem('rememberEmail', 'false');
        } else {
          AsyncStorage.setItem('rememberEmail', 'true');
        }
      } else {
        console.log('erreur');
        setIsLoading(false);
        addToast();
      }
    });
  };
  const [hidePwd, setHidePwd] = React.useState(true);
  console.log('checked', checked);
  return checked !== null ? (
    <View>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          email: mailSaved,
          password: 'examplePassword',
          checked: checked,
        }}
        onSubmit={values => {
          handleLogin(values);
        }}>
        {({handleChange, handleSubmit, values, errors, validateForm}) => (
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Input
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
                      color={theme.backgroundColor}
                    />
                  ) : (
                    <Icon
                      name={'eye-off'}
                      size={20}
                      color={theme.backgroundColor}
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
              <Button isLoading bg={theme.backgroundColor} mt={'5%'} w={'60%'}>
                Connexion
              </Button>
            ) : (
              <Button
                bg={theme.backgroundColor}
                mt={'5%'}
                w={'60%'}
                onPress={async values => {
                  setIsLoading(true);
                  validateForm().then(res => {
                    if (res.email || res.password) {
                      setIsLoading(false);
                    } else {
                      handleSubmit(values);
                    }
                  });
                }}>
                Connexion
              </Button>
            )}
          </View>
        )}
      </Formik>
    </View>
  ) : (
    <></>
  );
};

export default LoginForm;
