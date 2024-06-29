import React, { useState, useEffect} from 'react';
import { View, TextInput, Modal, Alert, StyleSheet, Text, ImageBackground,TouchableOpacity } from 'react-native';
import backgroundImage from '../photo/login_ima.jpg';
import { setLoggedInUserId } from './globals'; // Importa la función para establecer la ID de usuario global
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ipAddress = '192.168.16.72';
const baseURL = `http://${ipAddress}:8996/apii`;

export default function Login({ onLogin }) {
  const [data2, setData2] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisibleAgregar, setModalVisibleAgregar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [editedDomici, setEditedDomici] = useState('');
  const [maxId, setMaxId] = useState(0);

  const getAdministrador = async () => {
    try {
      const response = await fetch('http://192.168.16.72:8996/apii/Muestra_cl');
      const data = await response.json();
      console.log("Data from server:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const getOtherMenuData = async () => {
    try {
      const response = await fetch(`${baseURL}/Muestra_cl`); // Cambiar la URL por la correspondiente
      const responseData = await response.json();
      console.log(responseData); // Verificar la respuesta de la API
      setData2(responseData);
      const maxId = responseData.reduce((max, item) => (item.id_cli > max ? item.id_cli : max), 0);
      setMaxId(maxId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOtherMenuData();
  }, []);

  const handleAgregarNuevo = () => {
    setSelectedItem(null);
    setEditedName('');
    setEditedUsername('');
    setEditedPassword('');
    setEditedDomici('');
    setModalVisibleAgregar(true);
  };

  const handleAgregarNuevo2 = async () => {
    try {
      const userExists = data2.some(item => item.usu_cli === editedUsername);
    if (userExists) {
      console.error('El usuario ya existe.');
      return;
    }

      const response = await fetch(`${baseURL}/Guardar_cl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cli: maxId + 1,
          nom_cli: editedName,
          usu_cli: editedUsername,
          con_cli: editedPassword,
          dom_cli: editedDomici,
        }),
      });
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      if (response.ok) {
        console.log('Cambios guardados exitosamente.');
        await getAdministrador();
      } else {
        console.error('Error al guardar los cambios:', responseData);
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    } finally {
      setModalVisibleAgregar(false);
    }
  };
  const handleLogin = async () => {
    setLoading(true);

    try {
      const administradores = await getAdministrador();
      for (const admin of administradores) {
        const { usu_cli: correctUsername, con_cli: correctPassword, id_cli } = admin;
  
        if (username === correctUsername && password === correctPassword) {
          setLoggedInUserId(id_cli); // Establece la ID del usuario logueado globalmente
          onLogin({ username });
          return;
        }
      }
      Alert.alert('Error', 'Credenciales incorrectas');
    } catch (error) {
      Alert.alert('Error', 'Error al obtener los datos del administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Inicio de Sesión</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Nombre de usuario"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry={true}
          editable={!loading}
        />
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleAgregar}
                onRequestClose={() => {
                  setModalVisibleAgregar(!modalVisibleAgregar);
                }}
              >
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>ID: {maxId + 1}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editedName}
                    onChangeText={text => setEditedName(text)}
                    placeholder="Nombre"
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={editedUsername}
                    onChangeText={text => setEditedUsername(text)}
                    placeholder="Usuario"
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={editedPassword}
                    onChangeText={text => setEditedPassword(text)}
                    placeholder="Contraseña"
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={editedDomici}
                    onChangeText={text => setEditedDomici(text)}
                    placeholder="Domicilio"
                  />
                  <View style={styles.modalButtonContainer}>
                  <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.buttonn}
                onPress={handleAgregarNuevo2}
              >
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonn}
                onPress={() => setModalVisibleAgregar(!modalVisibleAgregar)}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
                  </View>
                </View>
              </Modal>
              <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        >
        <Text style={styles.buttonText}><MaterialCommunityIcons name="login" size={24} color="black" /> Iniciar Sesion</Text>
        </TouchableOpacity>
              <TouchableOpacity
          style={styles.addButton}
          onPress={handleAgregarNuevo}
        >
          <Text style={styles.buttonText}><MaterialCommunityIcons name="account-plus" size={24} color="black" /> Crear Usuario</Text>
        </TouchableOpacity>
        
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  title: {
    marginTop: 10,
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20
  },
  flatList: {
    width: '100%',
    marginBottom: 20,
  },
  cardContainer: {
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
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  otherMenuCard: {
    backgroundColor: '#FFD700', // Cambia el color de fondo
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'black',
    width: '90%',
    alignSelf: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  buttonn: {
    marginTop: 10,
    paddingHorizontal: 20, // Añade padding horizontal para dar más espacio al texto del botón
    paddingVertical: 10, // Añade padding vertical para dar más altura al botón
    borderRadius: 10, // Borde redondeado
    backgroundColor: '#9BBAF9', // Color de fondo del botón
    shadowColor: '#000', // Color de la sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevación para la sombra en Android
  },
  buttonText: {
    color: 'black', // Color del texto del botón
    fontWeight: 'bold', // Fuente en negrita
    fontSize: 20, // Tamaño de fuente
  },
  button: {
    marginTop: 10,
    backgroundColor: '#9BF7F9', // Color de fondo del botón
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#FF0078',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#CEF7BE',
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
});