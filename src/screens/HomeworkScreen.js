import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axiosInstance from '../utils/interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeworkScreen = () => {
    const [data, setData] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [userClass, setUserClass] = useState(null);
    const [subjectId, setSubjectId] = useState(null);
    const [userId, setUserId] = useState(null);

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

    const renderItem = ({item}) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            {item.course_image && (
                <View style={styles.course}>
                    <Text style={styles.courseTitle}>Course</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            // TODO: Handle file download here
                        }}
                    >
                        <Icon name="download" size={16} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Télécharger le cours</Text>
                    </TouchableOpacity>
                </View>
            )}
            {item.homework_image && (
                <View style={styles.homework}>
                    <Text style={styles.homeworkTitle}>Homework</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            // TODO: Handle file download here
                        }}
                    >
                        <Icon name="download" size={16} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Télécharger le devoir</Text>
                    </TouchableOpacity>
                </View>
            )}
            {item.correction_image && (
                <View style={styles.correction}>
                    <Text style={styles.correctionTitle}>Correction</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            // TODO: Handle file download here
                        }}
                    >
                        <Icon name="download" size={16} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Télécharger la correction</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
    

    const handleSubjectChange = (value) => {
        setSubjectId(value);
    };

    return (
        <View style={styles.container}>
        <Picker selectedValue={subjectId} onValueChange={handleSubjectChange}>
            {subjects.map(subject => (
            <Picker.Item key={subject.id} label={subject.subject_name} value={subject.id} />
            ))}
        </Picker>
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
        shadowOffset: { width: 0, height: 2 },
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
        backgroundColor: '#03395E',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    buttonIcon: {
        marginRight: 10,
    },
});



export default HomeworkScreen;

