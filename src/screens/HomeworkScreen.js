import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axiosInstance from '../utils/interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
            // TODO: Handle file download here
            }}>
            <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
        </View>
    );

    const handleSubjectChange = (value) => {
        setSubjectId(value);
    };

    // Split data into courses and homeworks
    const courses = data.filter(item => item.course_image);
    const homeworks = data.filter(item => item.homework_image);

    return (
        <View style={styles.container}>
        <Picker selectedValue={subjectId} onValueChange={handleSubjectChange}>
            {subjects.map(subject => (
            <Picker.Item key={subject.id} label={subject.subject_name} value={subject.id} />
            ))}
        </Picker>
        <Text style={styles.title}>Courses</Text>
        <FlatList
            data={courses}
            renderItem={renderItem}
            keyExtractor={item => `course_${item.id}`}
        />
        <Text style={styles.title}>Homework</Text>
        <FlatList
            data={homeworks}
            renderItem={renderItem}
            keyExtractor={item => `homework_${item.id}`}
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
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
    },
    button: {
        backgroundColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default HomeworkScreen;
