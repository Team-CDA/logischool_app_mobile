// Importer les modules nécessaires
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/fr';
import { LocaleConfig } from 'react-native-calendars';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { getSchedules } from '../utils/axios'; 

// Configuration de la langue pour la date et le calendrier  
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juill.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};
LocaleConfig.defaultLocale = 'fr';
moment.locale('fr');

// Couleurs prédéfinies pour les différentes matières 
const subjectColors = {
  Mathématiques: '#0000FF',
  Anglais: '#FFA500',
};

// Une fonction asynchrone pour obtenir les éléments à partir de l'API 
const fetchItems = async (day) => {
  try {
    // Appeler l'API
    const apiItems = await getSchedules();
    const newItems = {};

    // Parcourir les éléments et les formatter comme nécessaire 
    for (const item of apiItems) {
      // Extraire la date, l'heure de début et de fin à partir de l'élément 
      const date = moment(item.lesson_date).format('YYYY-MM-DD');
      const start = moment(item.lesson_date).format('HH:mm');
      const end = moment(item.lesson_date).add(item.duration, 'minutes').format('HH:mm');
      
      // Déterminer la couleur de l'élément en fonction de la matière 
      const color = subjectColors[item.subject_name] || '#ff6347';

      // Ajouter l'élément à newItems 
      if (newItems[date]) {
        newItems[date].push({
          name: item.subject_name,
          start,
          end,
          color,
          classType: item.classes_name,
          room: item.rooms_name,
          roomType: item.room_type,
        });
      } else {
        newItems[date] = [{
          name: item.subject_name,
          start,
          end,
          color,
          classType: item.classes_name,
          room: item.rooms_name,
          roomType: item.room_type,
        }];
      }
    }

    // Ajouter des notes pour le week-end du jour actuel 
    addWeekendNotes(newItems, day);
    return newItems;
  } catch (error) {
    console.error(error);
  }
};


// Une fonction pour ajouter des notes pour le week-end 
const addWeekendNotes = (items, day) => {
  const time = moment(day, 'YYYY-MM-DD');
  const strTime = time.format('YYYY-MM-DD');

  // Si le jour est un week-end, ajouter une note
  if (time.weekday() === 5 || time.weekday() === 6) {
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
};

// Le composant principal 
const CalendarScreen = () => {
  // Déclarer les hooks d'état pour les éléments, l'élément sélectionné, le jour sélectionné et l'indicateur de rafraîchissement 
  const [items, setItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDay, setSelectedDay] = useState(moment().format('YYYY-MM-DD'));
  const [refreshing, setRefreshing] = useState(false);
  
  // Référence à la feuille inférieure 
  const bottomSheetModalRef = useRef(null);
  
  // Points de capture pour le modal 
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // Appeler la fonction fetchItems au montage du composant 
  useEffect(() => {
    fetchItems(selectedDay).then(setItems);
  }, []);

  // Fonction pour rafraîchir les éléments 
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchItems(selectedDay).then(newItems => {
      setItems(newItems);
      setRefreshing(false);
    });
  }, [selectedDay]);

  // Fonction pour gérer le clic sur un jour 
  const onDayPress = (day) => {
    setSelectedDay(day.dateString);
    fetchItems(day.dateString).then(newItems => {
      setItems(newItems);
    });
  };


  // Fonction pour ouvrir la feuille de bas de page 
  const openBottomSheetModal = (item) => {
    setSelectedItem(item);
    bottomSheetModalRef.current.present();
  };

  // Fonction pour obtenir les dates marquées 
  const getMarkedDates = () => {
    let markedDates = {};

    for (let i = -90; i < 90; i++) {
      const time = moment().add(i, 'days');
      const strTime = time.format('YYYY-MM-DD');

      if (items[strTime]) {
        markedDates[strTime] = {
          selected: true,
          marked: true,
          selectedColor: items[strTime].some(i => i.name === 'Pas de cours à cette date') ? 'gray' : '#800000',
          note: items[strTime].some(i => i.name === 'Pas de cours à cette date') ? 'Pas de cours à cette date' : null,
        };
      }
    }

    return markedDates;
  };

  // Fonction pour rendre les éléments 
  const renderItems = () => {
    if (!selectedDay) {
      return items;
    }
    
    return { [selectedDay]: items[selectedDay] };
  }

  // Le rendu du composant 
  return (
    <BottomSheetModalProvider>
      <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Agenda
          firstDay={1}
          items={renderItems()}
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          renderItem={(item, firstItemInDay) => (
            <TouchableOpacity onPress={() => openBottomSheetModal(item)}>
              <View style={[styles.item, {backgroundColor: item.color}]}>
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
            <Text style={styles.modalText}>Classe : {selectedItem.classType}</Text>
            <Text style={styles.modalText}>Salle : {selectedItem.room}</Text>
            <Text style={styles.modalText}>Type de Salle : {selectedItem.roomType}</Text>
          </View>
        )}
      </BottomSheetModal>

      </ScrollView>
    </BottomSheetModalProvider>
  );
};

// Styles pour le composant 
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

// Exporter le composant 
export default CalendarScreen;
