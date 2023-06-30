import React, { useEffect, useState, useContext } from "react";
import { Text } from "react-native-paper";
import axiosInstance from "../utils/interceptor";
import UserContext from '../utils/context/UserContext';
import { View, ScrollView, TouchableOpacity } from "react-native";
import { List, Title, Divider, Card } from "react-native-paper";



const ProfScreen = () => {
    const { userInfo: contextUserInfo } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState(contextUserInfo);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        setUserInfo(contextUserInfo);
        fetchTeacher(userInfo.id);
        // fetchSubject(userInfo.id)
    }, [contextUserInfo]);

    const fetchTeacher = async (userId) => {
        const response = await axiosInstance.get(`/profclass/${userId}`)
        setTeachers(response.data.data)
    }

    const sendMessageToTeacher = (teacher) => {
        // Logique d'envoi de message au professeur
        console.log(`Envoyer un message au professeur : ${teacher.user.email}`);
    };


    return (
        <ScrollView>
            {teachers.map(teacher => (
                <TouchableOpacity key={teacher.user.id} onPress={() => sendMessageToTeacher(teacher)}>
                    <Card>
                        <Card.Content>
                            <Card.Title title={`${teacher.user.subjects[0].subject_name}`} />
                            <List.Item
                                title={`${teacher.user.gender === 'M' ? 'Mr' : 'Mme'} ${teacher.user.lastname} ${teacher.user.firstname}`}
                            />
                            <Divider />
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};


export default ProfScreen;
