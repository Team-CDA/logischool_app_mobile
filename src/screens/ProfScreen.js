import React, { useEffect, useState, useContext } from "react";
import { ScrollView, TouchableOpacity, Linking } from "react-native";
import { List, Title, Divider, Card, Avatar } from "react-native-paper";
import axiosInstance from "../utils/interceptor";
import UserContext from "../utils/context/UserContext";

const ProfScreen = () => {
    const { userInfo: contextUserInfo } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState(contextUserInfo);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        setUserInfo(contextUserInfo);
        fetchTeacher(userInfo.id);
    }, [contextUserInfo]);

    const fetchTeacher = async (userId) => {
        try {
            const response = await axiosInstance.get(`/profclass/${userId}`);
            setTeachers(response.data.data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    const sendMessageToTeacher = (teacher) => {
        const recipientEmail = teacher.user.email;
        const emailSubject = "Objet du mail";
        const emailMessage = "Contenu du message";

        const gmailUrl = `googlegmail://co?to=${recipientEmail}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`;

        Linking.canOpenURL(gmailUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(gmailUrl);
                } else {
                    console.error("L'application Gmail n'est pas installée sur cet appareil.");
                }
            })
            .catch((error) => {
                console.error("Erreur lors de l'ouverture de l'application Gmail :", error);
            });
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
                            <Title style={{ marginBottom: 10 }}>{teacher.user.subjects[0].subject_name}</Title>
                            <List.Item
                                title={`${teacher.user.lastname} ${teacher.user.firstname}`}
                                description={teacher.user.gender === "M" ? "Monsieur" : "Madame"}
                                left={(props) => (
                                    <Avatar.Icon
                                        {...props}
                                        icon={teacher.user.gender === "M" ? "human-male" : "human-female"}
                                    />
                                )}
                            />
                            <Divider />
                            <List.Item
                                title="Envoyer un message"
                                description={`Contacter ${teacher.user.firstname} ${teacher.user.lastname}`}
                                left={(props) => <List.Icon {...props} icon="email-outline" />}
                            />
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default ProfScreen;
