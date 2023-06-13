
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomHeader = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      setUser(JSON.parse(storedUser));
    };

    getUser();
  }, []);

  return (
    <>
      <View style={{ height: responsiveHeight(12), backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="school" size={30} color="#16385B" />
          <Text style={{ color: '#16385B', fontSize: 20, marginLeft: 10, fontWeight:'bold' }}>Logischool</Text>
        </View>
        <Icon 
          name="menu-open" 
          size={28} 
          color="#16385B" 
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <View>
        <View style={{ alignItems: 'center' , flexDirection:'row', justifyContent:'center',    backgroundColor:'white'}}>
          <View style={{width: 10, height: 10, borderRadius: 25, backgroundColor: 'green' }} />
          <Text style={{ color: '#16385B', fontSize: 14, marginLeft:5 }}>
            {user ? `${user.firstname} ${user.lastname}` : "Chargement ..."}
          </Text>  
        </View>
        <View style={{ alignItems: 'center' , flexDirection:'row', justifyContent:'center',  paddingBottom:15, backgroundColor:'white'}}>
          <Text style={{ color: '#16385B', fontSize: 12, fontWeight:'bold'}}>{user ? `${user.id_establishment}` : "Chargement ..."}</Text>  
        </View>
      </View>
    </>
  );
}

export default CustomHeader;




