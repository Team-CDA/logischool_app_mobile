import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { List, Title, Divider, Card, Paragraph } from "react-native-paper";
import axiosInstance from "../utils/interceptor";
import { Agenda } from 'react-native-calendars';
import moment from "moment";

const CantineScreen = () => {
  const [menus, setMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axiosInstance.get("/menus");
        if (Array.isArray(response.data)) {
          let newMenus = {};
          response.data.forEach((menu) => {
            newMenus[new Date(menu.menu_date).toISOString().split("T")[0]] = [menu];
          });
          setMenus(newMenus);
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

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  }

  return (
    <View style={styles.container}>
      <Agenda
        items={menus}
        selected={selectedDate}
        onDayPress={onDayPress}
        renderItem={(item, firstItemInDay) => (
          <Card style={styles.card}>
            <Card.Title title={`Menu du ${new Date(item.menu_date).toLocaleDateString("fr-FR")}`} />
            <Card.Content>
              <Title>Entrée</Title>
              <List.Item title={item.starter} />
              <Divider />
              <Title>Plat</Title>
              <List.Item title={item.main_course} />
              <Divider />
              <Title>Dessert</Title>
              <List.Item title={item.dessert} />
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    padding: 10,
  },
});

export default CantineScreen;
