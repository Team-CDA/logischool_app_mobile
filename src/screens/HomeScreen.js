import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Skeleton} from 'native-base';

import HeaderComponentCard from '../components/HomeScreen/HeaderComponentCard';
import FooterComponentCard from '../components/HomeScreen/FooterComponentCard';



const data = [
  {
    id: '6',
    icon: 'folder-shared',
    title: 'Dossier Scolaire',
    color: '#073b4c',
    notification: '1 élèment',
  },
  {
    id: '3',
    icon: 'groups',
    title: 'Professeurs',
    color: '#ef476f',
    notification: '8 professeurs',
  },
  // { id: '2',  icon: 'emoji-emotions',   title: 'Classe',  color: '#0f0', notification: '34 élèves' },
  {
    id: '4',
    icon: 'work',
    title: 'Devoirs',
    color: '#fb8b24',
    notification: '2 DM en cours',
  },
  // { id: '7',  icon: 'note',   title: 'Notes',  color: '#e36414' , notification: 'This is card 6'},
  // { id: '9',  icon: 'emoji-emotions',   title: 'Corrections',  color: '#f0f' , notification: '12 corrections'},
  {
    id: '12',
    icon: 'chat',
    title: 'Mes demandes',
    color: '#3a86ff',
    notification: '2 demandes',
  },

  {
    id: '5',
    icon: 'fastfood',
    title: 'Cantine',
    color: '#06d6a0',
    notification: 'Menu à jour',
  },
];

const HomeScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const onRefresh = useCallback(() => {
    // setRefreshing(true);
    setLoading(false);
    //  Remplacer par True par la suite 

    // fetch data 
    // Remplacer l'url 
    // fetch('api url')
    //   .then((response) => response.json())
    //   .then((json) => {
    //     setData(json);
    //     setLoading(false);
    //   })
    //   .catch((error) => console.error(error))
    //   .finally(() => setRefreshing(false));
  }, []);

  // En attendant que l'api soit branché et que la fonction ci dessus soit complète, ce useEffect permet de ne pas avoir à recharger le skeleton
  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{paddingBottom: 40, backgroundColor: 'white'}}
        ListHeaderComponent={<HeaderComponentCard />}
        renderItem={({item}) => (
          <View style={styles.item}>
            {loading ? (
              <Skeleton
                variant="rect"
                startColor="gray.300"
                endColor="gray.500"
                width="100%"
                height={100}
              />
            ) : (
              <TouchableOpacity
              onPress={() => {
                switch(item.title){
                  case 'Dossier Scolaire':
                    navigation.navigate('#');
                    break;
                  case 'Professeurs':
                    navigation.navigate('ProfScreen');
                    break;
                  case 'Devoirs':
                    navigation.navigate('HomeworkScreen');
                    navigation.navigate('profScreen');
                    break;
                  case 'Devoirs':
                    navigation.navigate('#');
                    break;
                  case 'Mes demandes':
                    navigation.navigate('#');
                    break;
                  case 'Cantine':
                    navigation.navigate('CantineScreen');
                    break;
                }
              }}>
                <Card style={styles.card} elevation={0}>
                  <Card.Content>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.notification}>{item.notification}</Text>
                    <View style={styles.iconContainer}>
                      <Icon name={item.icon} size={40} color={item.color} />
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        ListFooterComponent={<FooterComponentCard />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    flex: 1,
    padding: 10,
  },
  card: {
    height: 100,
    backgroundColor: '#E8F2FE',
  },

  headerImage: {
    width: '90%',
    height: Dimensions.get('window').height * 0.25,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00264D',
  },

  notification: {
    fontSize: 14,
    color: '#888',
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
    top: 50,
  },
});

export default HomeScreen;
