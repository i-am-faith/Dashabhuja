/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const handleLogin = async() => {
    // Implement login logic here
    console.log('Login:', { email, password });
    try {
      const response = await axios.post('http://192.168.29.15:3000/api/v1/user/login', { email, password });
      // console.log('Login response:', response.data);
      navigation.navigate('Home',  { userdata: response.data  });

    } catch (error) {
      console.log('Login error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 20, justifyContent: 'center' }}>
      <StatusBar barStyle="dark-content" backgroundColor={'#FFFFFF'} />
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Text style={{ fontSize: 32, color: '#FF5A5F', fontFamily: 'Samarkan' }}>Dashabhuja</Text>
        <Text style={{ fontSize: 16, color: '#888888', fontFamily:'Ubuntu-Light' }}>Where Every Woman is a Warrior</Text>
      </View>

      <View style={{ width: '90%', alignSelf: 'center' }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1,
          borderColor: '#DDDDDD', borderRadius: 8, paddingHorizontal: 10,
        }}>
          <Mail color="#FF5A5F" size={24} />
          <TextInput
            style={{ flex: 1, height: 50, marginLeft: 10, color: 'black', fontFamily:'Ubuntu-Light', fontSize:18 }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"

          />
        </View>

        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1,
          borderColor: '#DDDDDD', borderRadius: 8, paddingHorizontal: 10,
        }}>
          <Lock color="#FF5A5F" size={24} />
          <TextInput
            style={{ flex: 1, height: 50, marginLeft: 10, color: 'black', fontFamily:'Ubuntu-Light', fontSize:18 }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={{
          backgroundColor: '#FF5A5F', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20,
        }} onPress={handleLogin}>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily:'Ubuntu-Regular' }}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', marginTop: 15 }}>
          <Text style={{ color: '#FF5A5F', fontSize: 14, fontFamily:'Ubuntu-Light' }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
