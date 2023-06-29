import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axiosInstance from '../utils/interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {format} from 'date-fns';
import RNFetchBlob from 'rn-fetch-blob';

const handleDownloadFile = async fileName => {
  const downloadDest = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
  const fileUrl = `http://10.0.2.2:3000/files/${fileName}`;

  try {
    const response = await RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        description: 'Downloading file...',
        path: downloadDest,
      },
    }).fetch('GET', fileUrl);

    if (response.respInfo.status === 200) {
      console.log('Fichier téléchargé :', downloadDest);
    } else {
      console.log('Erreur lors du téléchargement du fichier :', response);
    }
  } catch (error) {
    console.log('Erreur globale lors du téléchargement du fichier :', error);
  }
};

const HomeworkScreen = () => {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [userClass, setUserClass] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [displayType, setDisplayType] = useState('courses');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = await AsyncStorage.getItem('userId');
      console.log('User id', userId);
      setUserId(userId);

      axiosInstance
        .get(`/users_classes/user/${userId}`)
        .then(response => {
          if (response.data) {
            console.log('User class', response.data.id_class);
            setUserClass(response.data.id_class);
          }
        })
        .catch(error => {
          console.error(error);
        });
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    axiosInstance
      .get('/subjects')
      .then(response => {
        if (response.data) {
          console.log('Subjects', response.data);
          setSubjects(response.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (userClass && subjectId) {
      axiosInstance
        .get(`/homeworks/${userClass}/${subjectId}`)
        .then(response => {
          const filteredData = response.data.filter(item => {
            return item.id_class === userClass && item.id_subject === subjectId;
          });

          setData(filteredData);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userClass, subjectId]);

  const renderItem = ({item}) => {
    const now = new Date();

    if (displayType === 'courses' && item.course_image) {
      console.log(
        "Chemin d'accès du fichier à ouvrir :",
        `${RNFetchBlob.fs.dirs.DocumentDir}/${item.course_image}`,
      );
      return (
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.course}>
            <Text style={styles.courseTitle}>Cours</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleDownloadFile(item.course_image);
              }}>
              <Icon
                name="download"
                size={16}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Télécharger</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (displayType === 'homeworks') {
      const isCorrectionDatePassed =
        item.date_correction &&
        format(new Date(item.date_correction), 'yyyy-MM-dd') <
          format(now, 'yyyy-MM-dd');
      const isHomeworkDateFuture =
        item.date_devoir &&
        format(new Date(item.date_devoir), 'yyyy-MM-dd') >
          format(now, 'yyyy-MM-dd');
      if (
        item.homework_image ||
        (isCorrectionDatePassed && item.correction_image)
      ) {
        return (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            {item.homework_image && (
              <View style={styles.homework}>
                <Text style={styles.homeworkTitle}>Devoir</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleDownloadFile(item.homework_image);
                  }}>
                  <Icon
                    name="download"
                    size={16}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Télécharger</Text>
                </TouchableOpacity>
              </View>
            )}
            {isCorrectionDatePassed && item.correction_image && (
              <View style={styles.correction}>
                <Text style={styles.correctionTitle}>Correction</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleDownloadFile(item.correction_image);
                  }}>
                  <Icon
                    name="download"
                    size={16}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Télécharger</Text>
                </TouchableOpacity>
              </View>
            )}
            {isHomeworkDateFuture && (
              <Text style={styles.deadlineText}>
                A faire pour le :{' '}
                {format(new Date(item.date_devoir), 'dd/MM/yyyy')}
              </Text>
            )}
          </View>
        );
      }
    }

    return null;
  };

  const handleSubjectChange = value => {
    setSubjectId(value);
  };

  return (
    <View style={styles.container}>
      <Picker selectedValue={subjectId} onValueChange={handleSubjectChange}>
        {subjects.map(subject => (
          <Picker.Item
            key={subject.id}
            label={subject.subject_name}
            value={subject.id}
          />
        ))}
      </Picker>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            displayType === 'courses' ? styles.activeButton : null,
          ]}
          onPress={() => setDisplayType('courses')}>
          <Text
            style={[
              styles.buttonText,
              displayType === 'courses' ? styles.activeButtonText : null,
            ]}>
            Cours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            displayType === 'homeworks' ? styles.activeButton : null,
          ]}
          onPress={() => setDisplayType('homeworks')}>
          <Text
            style={[
              styles.buttonText,
              displayType === 'homeworks' ? styles.activeButtonText : null,
            ]}>
            Devoirs et Corrections
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
  },
  course: {
    marginTop: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  homeworkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  correctionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  homework: {
    marginTop: 10,
  },
  correction: {
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#03395E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#FFF',
    borderColor: '#03395E',
    borderWidth: 1,
  },
  buttonText: {
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#fff',
  },
  activeButtonText: {
    // fontWeight: 'bold',
    color: '#03395E',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  deadlineText: {
    fontSize: 16,
    color: '#022D47',
    marginTop: 10,
  },
});

export default HomeworkScreen;
