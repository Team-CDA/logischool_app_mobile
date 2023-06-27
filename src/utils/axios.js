import axiosInstance from './interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authenticateUser = async values => {
  try {
    console.log('values : ', values);
    const response = await axiosInstance.post('/users/login', values);
    if (response.status === 200) {
      console.log('le fameux token :', response.data.token);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userId', response.data.userInfo.id.toString());
      await AsyncStorage.setItem('user', JSON.stringify(response.data.userInfo));
      return response.data;
    } else {
      throw new Error("Erreur lors de l'authentification");
    }
  } catch (error) {
    console.error(error);
  }
};



//---------------------------- Récupération des Infos de l'utilisateur 

export const getUserInfo = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error("L'ID de l'utilisateur est undefined");

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


//---------------------------- Récupération des Notifications

export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get('/alerts');
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Erreur lors de la récupération des notifications");
    }
  } catch (error) {
    console.error(error);
  }
};



//---------------------------- Récupération de L'emploi du temps de l'utilisateur connecté


export const getSchedules = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error("L'ID de l'utilisateur n'est pas reconnu bb");

    const response = await axiosInstance.get(`/schedule/${userId}`);
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      throw new Error("Erreur lors de la récupération de l'emploi du temps");
    }
  } catch (error) {
    console.error(error);
  }
};



//---------------------------- Envoi d'un document scanné

export const sendScannedDocument = async (image) => {
  try {
    const response = await axiosInstance.post('/upload', { image });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      throw new Error("Erreur lors de l'envoi du document scanné");
    }
  } catch (error) {
    console.error(error);
  }
};
