import React from 'react';
import { Box, HStack, IconButton, Text, Icon } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const CustomGoBackHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <HStack bg='white' px={1} py={3} justifyContent='space-between' alignItems='center'>
      <HStack space={4} alignItems='center'>
        <IconButton icon={<Icon size='sm' as={<MaterialIcons name='arrow-back' />} color='black'/>} onPress={() => navigation.goBack()} />
        <Text color='black' fontSize={20} fontWeight='bold'>{title}</Text>
      </HStack>
    </HStack>
  );
};

export default CustomGoBackHeader;
