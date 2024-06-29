import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MenuApp from "./mama/Menu";
import CarritoApp from "./mama/Carrito";
import UsarioApp from "./mama/Usuario";
import Login from './mama/login'; // Componente de inicio de sesión
import BotonIndependiente from './mama/Opcion';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function Navigator(){
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario ha iniciado sesión

    // Función para manejar el inicio de sesión exitoso
    const handleLogin = () => {
        setIsLoggedIn(true);
    };
    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    // Función para manejar errores al mostrar el ícono
    const handleIconError = (error) => {
        console.error('Error al renderizar el ícono:', error);
        // Puedes agregar un manejo adicional aquí si necesitas realizar alguna acción específica
    };

    // Si el usuario no ha iniciado sesión, muestra el componente de inicio de sesión
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    // Si el usuario ha iniciado sesión, muestra las pestañas de navegación
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Menu"
                screenOptions={{
                    tabBarInactiveTintColor: "grey",
                    tabBarActiveTintColor: "purple"
                }}
            >
                <Tab.Screen name="Menu" component={MenuApp} options={{ headerShown: false,
                tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="home" size={size} color={color} />),
                 }}/>
                <Tab.Screen name="Carrito" component={CarritoApp} options={{ headerShown: false,
                tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="cart" size={size} color={color} />),
                }}/>
                <Tab.Screen name="Usuario" component={UsarioApp} options={{headerShown: false, 
                tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="account" size={size} color={color} />),
                }}/>
                <Tab.Screen name="Salir" options={{ headerShown: false, 
                tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="door-closed" size={size} color={color} />),
                }}>
                    {() => <BotonIndependiente onPress={handleLogout} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
