import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import React , { useState, useEffect} from 'react';
import CustomButton from './src/Components/CustomButton';
import CustomInput from './src/Components/CustomInput';


export default function App() {

  //Aqui comtrolaremos la pantalla actual: login, splash o register
  const [screen, setScreen] = useState<'splash' | 'login' | 'register'>('splash');

  //Aqui iran los estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // El temporizador de 3 segundos pasar de splash al login
  useEffect(()=> {
    const timer = setTimeout(()=>{
      setScreen('login')
    }, 5000);

  //Cancelar el timeout
    return () => clearTimeout(timer);

  }, []);
  
  //La pantalla splash o sea la que nos muestra la imagen por 3 segundos
  if (screen === 'splash'){
    return (
      <View style = {styles.splashContainer}>
        <StatusBar style='light'/>
        <Image
          source={require('./assets/icono3.jpg')} // aqui ya estamos cagando la imagen
          style = {styles.splashImage}
          resizeMode='contain'
          />
      </View>
    );
  }

  //Pantalla de iniciar sesion y regristro
  return(
    <SafeAreaView style ={styles.container}>
      <StatusBar style = 'dark' />
      <View style = {styles.formContainer}>
        <Text style = {styles.title}>
          {screen === 'login' ? 'Iniciar Sesion' : 'Crear cuenta'}
        </Text>

        <CustomInput
        placeholder = "Ingresa tu correo"
        value = {email}
        onChangeText ={setEmail}
        type = "email"
        />

         <CustomInput
        placeholder = "Ingresa tu Contraseña"
        value = {password}
        onChangeText ={setPassword}
        type = "password"
        />
        <View style = {styles.buttonSpacing}>
          <CustomButton
          title ={screen === 'login' ? 'Iniciar Sesion' : 'Registarse'}
          onPress = {() => console.log(`${screen} presionado: `, {email, password})}
          variant = "primary"
          />
        </View>
        <TouchableOpacity
        onPress={() => setScreen (screen === 'login' ?'register' : 'login')}
        >
          <Text style ={styles.toggleText}>
            {screen === 'login'
            ? '¿No tienes una cuenta? Registrate aqui'
            : '¿Ya tienes una cuenta? Inicia Sesion'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  
  
}
const styles = StyleSheet.create({

  //Estilos del splash
  splashContainer: {
    flex:1,
    backgroundColor : '#2b3a4e',
    justifyContent: 'center',
    alignItems: 'center',
    },
    splashImage: {
      width: 220,
      height: 220,
      borderRadius: 20,
    },

  //Estilo del formulario
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#206291',
    marginBottom:30,
  },
  buttonSpacing: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  toggleText: {
    color: '#206291',
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

