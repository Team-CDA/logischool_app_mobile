 
import React, { useEffect } from 'react';
import { Text } from 'native-base';
import { getSchedules } from '../utils/axios'

function CantineScreen() {
  useEffect(() => {
    const fetchSchedules = async () => {
      const schedules = await getSchedules();
      console.log(schedules);
    };
    fetchSchedules();
  }, []); 

  return (
     <Text>ok</Text>
  );
}

export default CantineScreen;
