import React from 'react';
import { Box } from 'native-base';
import CustomGoBackHeader from '../components/CustomGoBackHeader';

const NotificationScreen = () => {
  return (
    <Box safeArea flex={1}>
      <CustomGoBackHeader title='Notification'/>
      {/* Le reste du code ici  */}
    </Box>
  );
};

export default NotificationScreen;
