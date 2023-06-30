import React, { useEffect, useState, useContext } from "react";
import { Text } from "react-native-paper";
import axiosInstance from "../utils/interceptor";
import UserContext from '../utils/context/UserContext';
import { View, ScrollView, TouchableOpacity } from "react-native";
import { List, Title, Divider, Card, Avatar } from "react-native-paper";



const ProfScreen = () => {
    const { userInfo: contextUserInfo } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState(contextUserInfo);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        setUserInfo(contextUserInfo);
        fetchTeacher(userInfo.id);
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
        <ScrollView style={{ padding: 10 }}>
            {teachers.map((teacher) => (
                <TouchableOpacity
                    key={teacher.user.id}
                    onPress={() => sendMessageToTeacher(teacher)}
                >
                    <Card style={{ marginBottom: 10 }}>
                        <Card.Content>
                            <Title style={{ marginBottom: 10 }}>
                                {teacher.user.subjects[0].subject_name}
                            </Title>
                            <List.Item
                                title={`${teacher.user.lastname} ${teacher.user.firstname}`}
                                description={
                                    teacher.user.gender === 'M' ? 'Monsieur' : 'Madame'
                                }
                                left={(props) => (
                                    <Avatar.Icon
                                        {...props}
                                        icon={teacher.user.gender === 'M' ? 'human-male' : 'human-female'}
                                    />
                                )}
                            />
                            <Divider />
                            <List.Item
                                title="Envoyer un message"
                                description={`Contacter ${teacher.user.firstname} ${teacher.user.lastname}`}
                                left={(props) => (
                                    <List.Icon {...props} icon="email-outline" />
                                )}
                            />
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};


export default ProfScreen;
