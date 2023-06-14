import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/fr';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juill.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};

LocaleConfig.defaultLocale = 'fr';
moment.locale('fr');

const originalItems = {
  '2023-06-16': [
    { 
      name: 'Mathématiques', 
      start: '8:00', 
      end: '10:00',
      color: '#ff6347'
    }, 
    { 
      name: 'Anglais',
      start: '11:00', 
      end: '12:00',
      color: '#3cb371'
    }
  ],
  '2023-06-18': [
    { 
      name: 'Histoire', 
      start: '9:00', 
      end: '11:00',
      color: '#1e90ff'
    },
    { 
      name: 'Sport',
      start: '13:00', 
      end: '15:00',
      color: '#9370db'
    }
  ],
  '2023-06-19': [
    { 
      name: 'Histoire', 
      start: '9:00', 
      end: '11:00',
      color: '#1e90ff'
    },
    { 
      name: 'Sport',
      start: '13:00', 
      end: '15:00',
      color: '#9370db'
    }
  ],
};

const CalendarScreen = () => {
  const [items, setItems] = useState(originalItems);

  const onDayPress = (day) => {
    const selectedDayItems = originalItems[day.dateString];
    setItems({ [day.dateString]: selectedDayItems });
  };

  return (
    <Agenda
      firstDay={1}
      items={items}
      onDayPress={onDayPress}
      renderItem={(item, firstItemInDay) => (
        <View style={[styles.item, {backgroundColor: item.color}]}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemText}>{item.start} - {item.end}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    color: 'white',
  },
});

export default CalendarScreen;
