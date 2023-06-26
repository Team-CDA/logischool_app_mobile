import React, { useState, useEffect , useContext} from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../utils/context/UserContext'; 

const CustomHeader = () => {
  const {userInfo: contextUserInfo} = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(contextUserInfo);
  
  useEffect(() => {
    setUserInfo(contextUserInfo);
  }, [contextUserInfo]);

  const navigation = useNavigation();

  console.log(userInfo);
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
            {userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : "Chargement ..."}
          </Text>  
        </View>
        <View style={{ alignItems: 'center' , flexDirection:'row', justifyContent:'center',  paddingBottom:15, backgroundColor:'white'}}>
          <Text style={{ color: '#16385B', fontSize: 12, fontWeight:'bold'}}>
              Classe : {userInfo && userInfo.classes && userInfo.classes[0] ? ` ${userInfo.classes[0].class_type.class_type} - ${userInfo.classes[0].name}` : "Chargement ..."}
          </Text>  
        </View>

      </View>
    </>
  );
}

export default CustomHeader;
