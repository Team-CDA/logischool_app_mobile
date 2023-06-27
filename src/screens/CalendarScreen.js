import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/fr';
import { LocaleConfig } from 'react-native-calendars';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { getSchedules } from '../utils/axios';  

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juill.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};

LocaleConfig.defaultLocale = 'fr';
moment.locale('fr');

const fetchItems = async () => {
  try {
    const apiItems = await getSchedules();
    const newItems = {};

    for (const item of apiItems) {
      const date = moment(item.lesson_date).format('YYYY-MM-DD');
      const start = moment(item.lesson_date).format('HH:mm');
      const end = moment(item.lesson_date).add(item.duration, 'minutes').format('HH:mm');

      if (newItems[date]) {
        newItems[date].push({
          name: item.subject_name,
          start,
          end,
          color: '#ff6347',  // Remplacez cette valeur fixe par une couleur dynamique si vous le souhaitez
        });
      } else {
        newItems[date] = [{
          name: item.subject_name,
          start,
          end,
          color: '#ff6347',  // Remplacez cette valeur fixe par une couleur dynamique si vous le souhaitez
        }];
      }
    }

    addWeekendNotes(newItems);
    return newItems;
  } catch (error) {
    console.error(error);
  }
};

const addWeekendNotes = (items) => {
  for (let i = -90; i < 90; i++) {
    const time = moment().add(i, 'days');
    const strTime = time.format('YYYY-MM-DD');

    if (time.weekday() === 5 || time.weekday() === 6) { // Check if it's a weekend
      if (items[strTime]) {
        items[strTime].push({
          name: 'Pas de cours à cette date',
          start: '',
          end: '',
          color: 'gray',
        });
      } else {
        items[strTime] = [{
          name: 'Pas de cours à cette date',
          start: '',
          end: '',
          color: 'gray',
        }];
      }
    }
  }
};

const CalendarScreen = () => {
  const [items, setItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // Ajouter cette ligne
  const [isRefreshing, setIsRefreshing] = useState(false); // Nouveau
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const fetchItemsAndSetState = async () => {
    setIsRefreshing(true);
    const fetchedItems = await fetchItems();
    setItems(fetchedItems);
    setIsRefreshing(false);
  }

  useEffect(() => {
    fetchItemsAndSetState();
  }, []);

  const onRefresh = () => {
    fetchItemsAndSetState();
  };

  const onDayPress = (day) => {
    setSelectedDay(day.dateString); // Modifier cette ligne
  };

  const openBottomSheetModal = (item) => {
    setSelectedItem(item);
    bottomSheetModalRef.current.present();
  };

  const getMarkedDates = () => {
    let markedDates = {};
  
    for (let i = -90; i < 90; i++) {
      const time = moment().add(i, 'days');
      const strTime = time.format('YYYY-MM-DD');
  
      if (items[strTime]) {
        markedDates[strTime] = {
          selected: true,
          marked: true,
          selectedColor: items[strTime].some(i => i.name === 'Pas de cours à cette date') ? 'gray' : '#ff6347',
          note: items[strTime].some(i => i.name === 'Pas de cours à cette date') ? 'Pas de cours à cette date' : null,
        };
      }
    }
  
    return markedDates;
  };

  const renderItems = () => {
    if (!selectedDay) {
      return items;
    }
    
    return { [selectedDay]: items[selectedDay] };
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Agenda
            firstDay={1}
            items={renderItems()} // Modifier cette ligne
            onDayPress={onDayPress}
            markedDates={getMarkedDates()}
            renderItem={(item, firstItemInDay) => (
              <TouchableOpacity onPress={() => openBottomSheetModal(item)}>
                <View style={[styles.item, {backgroundColor: item.name === 'Pas de cours à cette date' ? 'gray' : item.color}]}>
                  <Text style={styles.itemTextTitle}>{item.name}</Text>
                  <Text style={styles.itemText}>{item.start} - {item.end}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          dismissOnPanDown={true}
          dismissOnOverlayPress={true}
        >
          {selectedItem && (
            <View style={styles.contentContainer}>
              <Text style={styles.modalText}>{selectedItem.name}</Text>
              <Text style={styles.modalText}>{selectedItem.start} - {selectedItem.end}</Text>
             </View>
          )}
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTextTitle: {
    fontWeight:'bold',
    color: 'white',
  },
  itemText: {
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    margin: 10,
  },
});

export default CalendarScreen;
