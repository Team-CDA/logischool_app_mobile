import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../utils/context/UserContext';

const CustomHeader = () => {
  const { userInfo: contextUserInfo, alerts } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(contextUserInfo);

  useEffect(() => {
    setUserInfo(contextUserInfo);
  }, [contextUserInfo]);

  const navigation = useNavigation();

  console.log(userInfo);
  return (
    <>
      <View
        style={{
          height: responsiveHeight(12),
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="school" size={30} color="#16385B" />
          <Text
            style={{
              color: '#16385B',
              fontSize: 20,
              marginLeft: 10,
              fontWeight: 'bold',
            }}
          >
            Logischool
          </Text>
        </View>
        {alerts.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                borderRadius: 50,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                left: 70,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {alerts.length}
              </Text>
            </View>
          </View>
        )}
        <Icon
          name="menu-open"
          size={28}
          color="#16385B"
          onPress={() => navigation.openDrawer()}
        />
      </View>
    </>
  );
};

export default CustomHeader;
