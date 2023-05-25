
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';


const CustomMediumButton = ({ text, backgroundColor, textColor, borderColor, onPress, width, height, iconName }) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: 110,
      height: 40,
      marginTop: 10,
      borderRadius: 10,
       
    }}
  >
        <View  style={{ flexDirection:'row' , justifyContent:'center', alignItems:'center'}}>
            <Text style={{ color: textColor, textAlign: 'center', lineHeight: height }}>{text}</Text>
            <Icon name={iconName} size={16} style={{ color: textColor, marginLeft:5, marginTop: 2.5 }} />
        </View>
    </TouchableOpacity>
  );
};

export default CustomMediumButton;
