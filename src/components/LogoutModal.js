import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import {Button, Modal} from 'native-base';
import UserContext from '../utils/context/UserContext';

const LogoutModal = ({visible, onClose}) => {
  const userContext = useContext(UserContext);

  return (
    <Modal isOpen={visible}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton onPress={onClose} />
        <Modal.Header>Confirmation</Modal.Header>
        <Modal.Body>Êtes-vous sûr(e) de vouloir vous déconnecter ?</Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
              Annuler
            </Button>
            <Button onPress={userContext.disconnect}>Poursuivre</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default LogoutModal;
