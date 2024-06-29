import React from 'react';
import { TouchableOpacity, View, StyleSheet, ImageBackground, Text} from 'react-native';
import backgroundImage from '../photo/fondo_ima.jpg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BotonIndependiente({ onPress }) {
  return (
  <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
    <View style={styles.container}>
      
      <TouchableOpacity
                style={styles.button}
                onPress={onPress}
              >
                <Text style={styles.buttonText}><MaterialCommunityIcons name="account-arrow-right-outline" size={24} color="black" /> Cerrar sesion</Text>
              </TouchableOpacity>
    
    </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 300
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // o 'contain' según tus preferencias
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#FF1818',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
});