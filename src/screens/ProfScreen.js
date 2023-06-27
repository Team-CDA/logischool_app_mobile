import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";


const ProfScreen = () => {

    const tableViewUser = () => {
        const [studentConnect, setstudentConnect] = useState([]);
    };

    useEffect(() => {
        // Fonction de récupération des professeurs depuis votre API
        const fetchProfesseurs = async () => {
            try {
                const response = await fetch('https://votre-api.com/professeurs');
                const data = await response.json();
                setProfesseurs(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfesseurs();
    }, []);

    return (
        <Text>YOOOOOO</Text>
    );
};

export default ProfScreen;
