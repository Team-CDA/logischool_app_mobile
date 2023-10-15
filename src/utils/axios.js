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


//---------------------------- Récupération des absences 


export const getUnexcusedAbsences = async (userId) => {
  try {
    const response = await axiosInstance.get(`/missing_students/unjustified/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Erreur lors de la récupération des absences non régularisées");
    }
  } catch (error) {
    console.error(error);
  }
};

//----------------------------  Récupérer une absence spécifique pour un utilisateur spécifique en fonction de leur ID
export const getAbsenceByIdUser = async (userId, absenceId) => {
  try {
    const response = await axiosInstance.get(`/missing_students/user/${userId}/${absenceId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Erreur lors de la récupération des absences spécifiques d'un utilisateur");
    }
  } catch (error) {
    console.error(error);
  }
};


//----------------------------  Récupérer toutes les absences d'un utilisateur en fonction de son ID 

export const getAllAbsencesByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/missing_students/user/${userId}`);
    if (response && response.status === 200) {
      return response.data;
    } else {
      throw new Error("Erreur lors de la récupération des absences");
    }
  } catch (error) {
    console.error(error);
  }
};
 

//----------------------------  Récupérer toutes les absences d'un utilisateur Par rapport à son emploi du temps 

export const getAbsencesWithSchedule = async (userId) => {
  try {
    // Récupération des absences de l'utilisateur
    const absencesResponse = await axiosInstance.get(`/missing_students/user/${userId}`);
    if (absencesResponse.status !== 200) {
      throw new Error("Erreur lors de la récupération des absences");
    }
    const absences = absencesResponse.data;

    // Récupération de l'emploi du temps de l'utilisateur
    const schedulesResponse = await axiosInstance.get(`/schedule/${userId}`);
    if (schedulesResponse.status !== 200) {
      throw new Error("Erreur lors de la récupération de l'emploi du temps");
    }
    const schedules = schedulesResponse.data;

    // Combiner les informations des absences et de l'emploi du temps
    const absencesWithSchedule = absences.map((absence) => {
      const schedule = schedules.find((schedule) => schedule.lesson_id === absence.id_lesson);
      return {
        ...absence,
        Schedule: schedule,
      };
    });

    return absencesWithSchedule;
  } catch (error) {
    console.error("Erreur lors de la récupération des absences et des informations de l'emploi du temps :", error);
    throw error;
  }
};
