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
      await AsyncStorage.setItem('userId', response.data.userInfo.id.toString());
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


// ----------- Récuperer les infos de l'utilisateur : 


export const getUserInfo = async userId => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    if (response.status === 200) {
      console.log('ok bb ');
      return response.data;
    } else {
      
      throw new Error("Erreur lors de la récupération des informations utilisateur");
    }
  } catch (error) {
    console.error(error);
    console.log('erreur bb');
  }
};
// ---------------------------


// ----------- Récuperer les notifications : 


export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get('/Alerts');
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Erreur lors de la récupération des notifications");
    }
  } catch (error) {
    console.error(error);
  }
};


// -----------------------------------------------
