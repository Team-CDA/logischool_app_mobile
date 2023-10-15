import React, { useState, useRef, useMemo , useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/fr';
import { LocaleConfig } from 'react-native-calendars';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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
  '2023-06-14': [
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
  '2023-06-15': [
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



const addWeekendNotes = () => {
  for (let i = -90; i < 90; i++) {
    const time = moment().add(i, 'days');
    const strTime = time.format('YYYY-MM-DD');

    if (time.weekday() === 5 || time.weekday() === 6) { // Check if it's a weekend
      if (originalItems[strTime]) {
        originalItems[strTime].push({
          name: 'Pas de cours à cette date',
          start: '',
          end: '',
          color: 'gray',
        });
      } else {
        originalItems[strTime] = [{
          name: 'Pas de cours à cette date',
          start: '',
          end: '',
          color: 'gray',
        }];
      }
    }
  }
};
addWeekendNotes();


const CalendarScreen = () => {
  const [items, setItems] = useState(originalItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const onDayPress = (day) => {
    const selectedDayItems = originalItems[day.dateString];
    setItems({ [day.dateString]: selectedDayItems });
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
  
      if (time.weekday() === 5 || time.weekday() === 6) {
        markedDates[strTime] = {
          selected: true,
          marked: true,
          selectedColor: 'gray',
          note: 'Pas de cours à cette date',
        };
      }
    }
  
    return markedDates;
  };
 

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Agenda
          firstDay={1} 
          items={items} 
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
              {/* Add more details... */}
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
