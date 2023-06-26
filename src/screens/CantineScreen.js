import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { List, Title, Divider } from "react-native-paper";
import axiosInstance from "../utils/interceptor";

const CantineScreen = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axiosInstance.get("/menus");
        if (Array.isArray(response.data)) {
          setMenus(response.data);
        } else {
          console.error("Erreur lors de la récupération des menus");
          setMenus([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des menus:", error);
      }
    };
    
    fetchMenus();
  }, []);

  return (
    <ScrollView>
      {menus.map((menu, index) => (
        <View key={index}>
          <Title>{new Date(menu.menu_date).toDateString()}</Title>
          <List.Section>
            <List.Subheader>Entrée</List.Subheader>
            <List.Item title={menu.starter} />
            <Divider />
            <List.Subheader>Plat</List.Subheader>
            <List.Item title={menu.main_course} />
            <Divider />
            <List.Subheader>Dessert</List.Subheader>
            <List.Item title={menu.dessert} />
          </List.Section>
        </View>
      ))}
    </ScrollView>
  );
};

export default CantineScreen;
