import { StyleSheet, Text, View, Dimensions , TouchableOpacity, Linking} from 'react-native';
import React from 'react'
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';


const FooterComponentCard = () => {

    const openMaps = (address) => {
        const daddr = encodeURIComponent(address);
        Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
      }

  return (
    <View style={styles.footerContainer}>
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Lycée Coluche Ben Salah</Text>
            <TouchableOpacity 
              onPress={() => openMaps('72 Rue des Jacobins, 80000 Amiens')}  // Remplacez par l'adresse de votre choix
              style={styles.footerContent}
            >
              <Icon name='place' size={24} color='#8C5802'/>
              <Text style={styles.footerText}>72 Rue des Jacobins, 80000 Amiens</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => Linking.openURL('tel:0322456567')} 
              style={styles.footerContent}
            >
              <Icon name='phone' size={24} color='#06d6a0'  />
              <Text style={styles.footerText}>0322456567</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => Linking.openURL('mailto:contact@contact.fr')} 
              style={styles.footerContent}
            >
              <Icon name='email' size={24} color='#3a86ff'/>
              <Text style={styles.footerText}>contact@contact.fr</Text>
            </TouchableOpacity>
          </View>
    </View>
  )
}

export default FooterComponentCard

const styles = StyleSheet.create({

    footerContainer: {
        margin: 10,
      },
    
      footerCard: {

        alignItems: 'center', 
        justifyContent: 'center', 
        width:'100%', 
        height: Dimensions.get('window').height * 0.20, 
        alignSelf: 'center',
        backgroundColor: '#FEFCF5',
        borderWidth:1,
        borderColor:'#F1D9A4', 
        paddingTop: 15,
        borderRadius:15,
    
      },
      footerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        
      },
      footerAdressTitle: {
        fontSize: 14,
        marginBottom: 10,
      },
      footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      footerText: {
        marginLeft: 10,
      },
     
})