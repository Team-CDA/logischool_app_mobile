import axiosInstance from './interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

// cette route vers l'API retourne un token si l'authentification est réussie
export const authenticateUser = async values => {
  try {
    console.log('values : ', values);
    const response = await axiosInstance.post('/users/login', values);
    if (response.status === 200) {
      console.log('le fameux token :', response.data.token);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem(
        'user',
        JSON.stringify(response.data.userInfo),
      );
      return response.data;
    } else {
      throw new Error("Erreur lors de l'authentification");
    }
  } catch (error) {
    console.error(error);
  }
};
