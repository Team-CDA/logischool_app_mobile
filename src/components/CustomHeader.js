import React from 'react';
import { Button, View } from 'react-native';
import { Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

 




const CustomHeader = () => {
  const navigation = useNavigation();

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
          <Text style={{ color: '#16385B', fontSize: 14, marginLeft:5 }}>Mohamed De Saint Exupéry</Text>  
        </View>
        <View style={{ alignItems: 'center' , flexDirection:'row', justifyContent:'center',  paddingBottom:15, backgroundColor:'white'}}>
          <Text style={{ color: '#16385B', fontSize: 12, fontWeight:'bold'}}>Classe : 2nd2</Text>  
        </View>
      </View>
    </>
  )
}

export default CustomHeader;



// import { createDrawerNavigator } from '@react-navigation/drawer';
 

// const Drawer = createDrawerNavigator();

 
  // const pan = React.useRef(new Animated.ValueXY()).current;

  // const panResponder = React.useMemo(
  //   () =>
  //     PanResponder.create({
  //       onStartShouldSetPanResponder: () => true,
  //       onPanResponderMove: (_, gestureState) => {
  //         if (gestureState.dx < 0) {
  //           pan.setValue({ x: gestureState.dx, y: 0 });
  //         }
  //       },
  //       onPanResponderRelease: (_, gestureState) => {
  //         if (gestureState.dx < -50) {
  //           navigation.openDrawer();
  //         } else {
  //           Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
  //         }
  //       },
  //     }),
  //   [navigation, pan]
  // );


  // code pour le Drawer  : il faut installer reanimated et gesture handler
  // yarn add react-native-reanimated
  // yarn add react-native-gesture-handler

