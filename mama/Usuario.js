import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground,Alert} from 'react-native';
import backgroundImage from '../photo/fondo_ima.jpg';
import { getLoggedInUserId } from './globals'; // Ajusta la ruta según la ubicación real de globals.js
import backgroundImage2 from '../photo/fondo_admin.jpg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const id_cii = getLoggedInUserId();
const ipAddress = '192.168.16.72';
const baseURL = `http://${ipAddress}:8996/apii`;

export default function ProductoApp() {
  const [editedNombre, setEditedNombre] = useState('');
  const [editedUsuario, setEditedUsuario] = useState('');
  const [editedContrasena, setEditedContrasena] = useState('');
  const [editedDomicilio, setEditedDomicilio] = useState('');
  const [id_clllll, setIdClii]= useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getLoggedInUserId();
        setIdClii(userId);
        const response = await fetch(`${baseURL}/Muestras_cl/${userId}`);
        const userData = await response.json();
        console.log('Datos del usuario:', userData);
        setEditedNombre(userData.nom_cli);
        setEditedUsuario(userData.usu_cli);
        setEditedContrasena(userData.con_cli);
        setEditedDomicilio(userData.dom_cli);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);


  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${baseURL}/Guardar_cl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom_cli: editedNombre,
          num_cli: 0,
          usu_cli: editedUsuario,
          con_cli: editedContrasena,
          dom_cli: editedDomicilio,
          id_cli: id_clllll,
        }),
      });
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      if (response.ok) {
        console.log('Cambios guardados exitosamente.');
        Alert.alert('Éxito', 'Los cambios han sido guardados exitosamente.');
      } else {
        console.error('Error al guardar los cambios:', responseData);
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
      <View style={styles.cardContainer}>
      <ImageBackground source={backgroundImage2} style={styles.cardBackground}>
        <View style={styles.cardContent}>
        <Text style={styles.title}><MaterialCommunityIcons name="account" size={24} color="black" /> Editar Datos</Text>
        <TextInput
          style={styles.modalInput}
          value={editedNombre}
          onChangeText={text => setEditedNombre(text)}
          placeholder="Nombre"
        />
        <TextInput
          style={styles.modalInput}
          value={editedUsuario}
          onChangeText={text => setEditedUsuario(text)}
          placeholder="Usuario"
        />
        <TextInput
          style={styles.modalInput}
          value={editedContrasena}
          onChangeText={text => setEditedContrasena(text)}
          placeholder="Contraseña"
          secureTextEntry={true}
        />
        <TextInput
          style={styles.modalInput}
          value={editedDomicilio}
          onChangeText={text => setEditedDomicilio(text)}
          placeholder="Domicilio"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveChanges}
        >
          <Text style={styles.buttonText}><MaterialCommunityIcons name="content-save" size={24} color="black" /> Guardar</Text>
        </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    backgroundColor: 'white', // Cambiar el color de fondo a blanco
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#FDACE0',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#739EF4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  }, cardContainer: {
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  cardBackground: {
    resizeMode: 'cover',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fondo semi-transparente para el contenido de la tarjeta
    padding: 20,
  },
});