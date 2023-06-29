import {View, Text} from 'react-native';
import React from 'react';
import {useContext, useState, useEffect} from 'react';
import UserContext from '../utils/context/UserContext';

const HomeworkScreen = () => {
  const {userInfo: contextUserInfo, alerts} = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(contextUserInfo);

  useEffect(() => {
    setUserInfo(contextUserInfo);
  }, [contextUserInfo]);

  return (
    <View>
      <Text>HomeworkScreen</Text>
    </View>
  );
};

export default HomeworkScreen;
