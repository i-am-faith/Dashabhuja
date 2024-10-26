import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
const Splash = () => {
  const checkConnection = async () => {
    try {
      console.log('Checking internet connection...');
      const isConnected = await axios.get('http://192.168.29.15:3000/');
      if (isConnected) {
        console.log('Internet is connected!', isConnected.data);
      } else {
        console.log('Internet is not connected!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const navigation = useNavigation();
  const navigateToLogin = () => {
    navigation.navigate('Signup');
  }
  useEffect(() => {
    checkConnection();
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: '#000000', height: '100%', padding: 4 }}>
      <StatusBar />
      <View>
        <Text>
          Ten Arms of Protection, One Powerful App
        </Text>
      </View>
      <TouchableOpacity style={{height:100, backgroundColor:'blue', }}
      onPress={navigateToLogin}
      >
        <Text>
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Splash

const styles = StyleSheet.create({})