import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { List, Title, Divider, Card } from "react-native-paper";
import axiosInstance from "../utils/interceptor";
import { Calendar } from 'react-native-calendars';

const CantineScreen = () => {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axiosInstance.get("/menus");
        if (Array.isArray(response.data)) {
          setMenus(response.data);
          const todayMenu = response.data.find(menu => new Date(menu.menu_date).toISOString().split("T")[0] === selectedDate);
          setSelectedMenu(todayMenu);
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
    const selectedMenu = menus.find(menu => new Date(menu.menu_date).toISOString().split("T")[0] === day.dateString);
    setSelectedMenu(selectedMenu);
  }

  return (
    <ScrollView>
      <Calendar 
        onDayPress={onDayPress}
        markedDates={{[selectedDate]: {selected: true}}}
      />
      {selectedMenu && (
        <Card>
          <Card.Title title={`Menu du ${new Date(selectedMenu.menu_date).toDateString()}`} />
          <Card.Content>
            <Title>Entrée</Title>
            <List.Item title={selectedMenu.starter} />
            <Divider />
            <Title>Plat</Title>
            <List.Item title={selectedMenu.main_course} />
            <Divider />
            <Title>Dessert</Title>
            <List.Item title={selectedMenu.dessert} />
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

export default CantineScreen;
