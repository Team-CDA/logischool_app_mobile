import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomMediumButton from '../Buttons/CustomMediumButton';
import { useNavigation } from '@react-navigation/native';
import { getUnexcusedAbsences } from '../../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderComponentCard = () => {
  const [edtDate, setEdtDate] = useState('');
  const [absences, setAbsences] = useState(''); 
  const navigation = useNavigation();

  useEffect(() => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setEdtDate(date.toLocaleString('fr-FR', options));

    const fetchAbsences = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const absencesData = await getUnexcusedAbsences(userId);
        const absenceCount = absencesData.length;
        setAbsences(absenceCount > 0 ? `${absenceCount} absences non régularisées` : 'Aucune absence non régularisée');
      } catch (error) {
        console.error("Erreur lors de la récupération des absences : ", error);
      }
    };

    fetchAbsences();

  }, []);

  const handlePress = () => {
    navigation.navigate('CalendarScreen');
  };

  return (
    <View>
      <Card style={styles.edtCard} elevation={0}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.edtTitle}>Emploi du Temps</Text>
            <Text style={styles.edtDate}>Auj. {edtDate}.</Text>
            <CustomMediumButton
              text="Accéder"
              backgroundColor="#1A7540"
              textColor="#FFFFFF"
              borderColor="#0F5C2E"
              iconName="double-arrow"
              onPress={handlePress} 
            />
          </View>
          <View style={styles.edtImgContainer}>
            <Image source={require('../../assets/img/agenda.png')} style={styles.img} />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.notifEdtCard} elevation={0}>
        <Card.Content style={styles.notifEdtCardContent}>
          <Icon name={'error-outline'} size={19} />
            <TouchableOpacity onPress={() => navigation.navigate('AbsenceScreen', { absencesData: absences })}>
              <Text style={styles.notifEdtTitle}>{absences}</Text>
            </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
}

export default HeaderComponentCard;
const styles = StyleSheet.create({
  edtCard: {
    margin: 20,
    marginBottom: 0.5,
    marginTop: 10,
    height: 160,
    backgroundColor: '#E8FAF0',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
    marginTop:20,
  },
  edtImgContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop:40,
     
  },
  img: {
    width: 85,  
    height: 85,
  },
  edtTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F5C2E',
  },
  edtDate: {
    fontSize: 14,
    color: '#0F5C2E',
  },
  notifEdtCard: {
    margin: 10,
    marginTop: 0.5,
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#F7FBFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius:30,
    borderBottomLeftRadius:30,
    alignItems: 'center',
    justifyContent:'center',
  },
  notifEdtCardContent: {
    flexDirection: 'row',
 
  },
  notifEdtTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
