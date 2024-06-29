import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Modal, TextInput, ImageBackground} from 'react-native';
import backgroundImage from '../photo/fondo_ima.jpg';
import backgroundImage2 from '../photo/fondo_producto.jpg';
import { getLoggedInUserId } from './globals'; // Ajusta la ruta según la ubicación real de globals.js
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ipAddress = '192.168.16.72';
const baseURL = `http://${ipAddress}:8996/apii`;


export default function ProductoApp() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisibleEditar, setModalVisibleEditar] = useState(false);   // Modal para editar producto existente
    const [editedNombre, setEditedNombre] = useState('');
    const [editedCantidad, setEditedCantidad] = useState('');
    const [editedPrecio, setEditedPrecio] = useState('');
    const [editedTipo, setEditedTipo] = useState('');
    const [editedMarca, setEditedMarca] = useState('');
    const [maxId, setMaxId] = useState(0);
  
    useEffect(() => {
      getProductosData();
      getProductosData2();
    }, []);


  
    const getProductosData= async () => {
      try {
        const response = await fetch(`${baseURL}/Muestra_pr`);
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const getProductosData2= async () => {
      try {
        const response = await fetch(`${baseURL}/Muestra_co`);
        const responseData = await response.json();
        setData2(responseData);
        const maxId = responseData.reduce((max, item) => (item.id_com > max ? item.id_com : max), 0);
        setMaxId(maxId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    
    const handleCantidadChange = (text) => {
      if (text !== undefined) {
        setEditedCantidad(text);
      }
    };
    
  
    const handleSaveChanges = async () => {
      try {

        if (!selectedItem) {
          console.error('No hay item seleccionado para guardar cambios.');
          return;
        }

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Los meses van de 0 a 11, por eso se suma 1
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();

    // Formatear la fecha y hora como string
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

    const id_clii = getLoggedInUserId();

        const response = await fetch(`${baseURL}/Guardar_co`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_com: maxId + 1,
            can_com: parseInt(editedCantidad),
            pre_com: parseInt(editedPrecio),
            fec_com: formattedDateTime,
            id_clii: parseInt(id_clii),
            id_proo: selectedItem.id_pro,
          }),
        });
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        if (response.ok) {
          console.log('Cambios guardados exitosamente.');
          await getProductosData2();
        } else {
          console.error('Error al guardar los cambios:', responseData);
        }
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
      } finally {
        setModalVisibleEditar(false);
      }
    };
  
  
    const renderItem = ({ item }) => (
      <View style={styles.cardContainer}>
      <ImageBackground  source={backgroundImage2} style={styles.cardBackground}>
      <View style={styles.cardContent}>
        <Text style={[styles.itemText, { marginBottom: 5 }]}>ID: {item.id_pro}</Text>
        <Text style={[styles.itemText, { marginBottom: 5 }]}>Nombre: {item.nom_pro}</Text>
        <Text style={[styles.itemText, { marginBottom: 5 }]}>Cantidad: {item.can_pro}</Text>
        <Text style={[styles.itemText, { marginBottom: 5 }]}>Precio: {item.pre_pro}</Text>
        <Text style={[styles.itemText, { marginBottom: 5 }]}>Tipo: {item.tip_pro}</Text>
        <Text style={[styles.itemText, { marginBottom: 5 }]}>Marca: {item.mar_pro}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.buttonn}
            onPress={() => handleDetails(item)}
          >
            <Text style={styles.buttonText}><MaterialCommunityIcons name="cart-plus" size={24} color="black" /> Agregar al carrito</Text>
          </TouchableOpacity>
        </View>
        </View>
        </ImageBackground>
      </View>
    );

    const handleDetails = (item) => {
      setSelectedItem(item);
      setEditedNombre(item.nom_pro);
      setEditedCantidad(item.can_pro.toString());
      setEditedPrecio(item.pre_pro.toString());
      setEditedTipo(item.tip_pro);
      setEditedMarca(item.mar_pro);
      setModalVisibleEditar(true);
    };
  
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Mostrar Productos</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id_pro.toString()}
            renderItem={renderItem}
            style={{ width: '100%', height: '50%' }}
          />
        )}
        <StatusBar style="auto" />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleEditar}
          onRequestClose={() => setModalVisibleEditar(!modalVisibleEditar)}
        >
           <View style={styles.modalView}>
    <Text style={styles.modalText}>ID: {selectedItem?.id_pro}</Text>
    <Text style={styles.modalLabel}>Nombre: {editedNombre}</Text>
    <TextInput
      style={styles.modalInput}
      value={editedCantidad !== undefined ? editedCantidad.toString() : ''}
      onChangeText={handleCantidadChange}
      placeholder="Cantidad"
      keyboardType='numeric'
    />
    <Text style={styles.modalLabel}>Precio: {editedPrecio}</Text>
    <Text style={styles.modalLabel}>Tipo: {editedTipo}</Text>
    <Text style={styles.modalLabel}>Marca: {editedMarca}</Text>
             <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSaveChanges}
              >
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisibleEditar(!modalVisibleEditar)}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      </ImageBackground>
    );
  }
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 25
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // o 'contain' según tus preferencias
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: 10,
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20
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
  button: {
    marginTop: 10,
    paddingHorizontal: 20, // Añade padding horizontal para dar más espacio al texto del botón
    paddingVertical: 10, // Añade padding vertical para dar más altura al botón
    borderRadius: 10, // Borde redondeado
    backgroundColor: '#ffff', // Color de fondo del botón
    shadowColor: '#000', // Color de la sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevación para la sombra en Android
  },
  buttonContainer: {
    flexDirection: 'row',  // Esto alinea los botones horizontalmente
    justifyContent: 'space-between',  // Esto distribuye los botones a los extremos del contenedor
    marginTop: 10,
  },
  buttonn: {
    marginTop: 10,
    paddingHorizontal: 20, // Añade padding horizontal para dar más espacio al texto del botón
    paddingVertical: 10, // Añade padding vertical para dar más altura al botón
    borderRadius: 10, // Borde redondeado
    backgroundColor: '#FDACE0', // Color de fondo del botón
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
