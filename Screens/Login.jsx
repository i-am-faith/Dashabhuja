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
    console.log('Login:', { email, password });
    try {
      const response = await axios.post('http://192.168.29.15:3000/api/v1/user/login', { email, password });
      navigation.navigate('Home', { userdata: response.data });
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 20, justifyContent: 'center' }}>
      <StatusBar barStyle="dark-content" backgroundColor={'#FFFFFF'} />
      {/* Brand Header */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 32, color: '#FF5A5F', fontFamily: 'Samarkan' }}>Dashabhuja</Text>
        <Text style={{ fontSize: 16, color: '#888888', fontFamily: 'Ubuntu-Light' }}>
          Where Every Woman is a Warrior
        </Text>
      </View>
      {/* Welcome Message */}
      <View style={{ marginBottom: 30, paddingHorizontal: 10 }}>
        <Text style={{ 
          fontSize: 28, 
          color: '#510210', 
          fontFamily: 'Ubuntu-Light', 
          marginBottom: 8 
        }}>
          Welcome Back!
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: '#666666', 
          fontFamily: 'Ubuntu-Light',
          lineHeight: 22
        }}>
          Your safety is our priority. Sign in to access your protected space.
        </Text>
      </View>
      {/* Login Form */}
      <View style={{ width: '90%', alignSelf: 'center' }}>
        {/* Email Input */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
          borderWidth: 1,
          borderColor: '#DDDDDD',
          borderRadius: 8,
          paddingHorizontal: 10,
          backgroundColor: '#FFFFFF',
          elevation: 2,
        }}>
          <Mail color="#FF5A5F" size={24} />
          <TextInput
            style={{ 
              flex: 1, 
              height: 50, 
              marginLeft: 10, 
              color: 'black', 
              fontFamily: 'Ubuntu-Light', 
              fontSize: 18 
            }}
            placeholder="Email"
            placeholderTextColor="#999999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {/* Password Input */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
          borderWidth: 1,
          borderColor: '#DDDDDD',
          borderRadius: 8,
          paddingHorizontal: 10,
          backgroundColor: '#FFFFFF',
          elevation: 2,
        }}>
          <Lock color="#FF5A5F" size={24} />
          <TextInput
            style={{ 
              flex: 1, 
              height: 50, 
              marginLeft: 10, 
              color: 'black', 
              fontFamily: 'Ubuntu-Light', 
              fontSize: 18 
            }}
            placeholder="Password"
            placeholderTextColor="#999999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#FF5A5F',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
            elevation: 3,
          }} 
          onPress={handleLogin}
        >
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: 18, 
            fontFamily: 'Ubuntu-Light',
            fontWeight: '600'
          }}>
            Sign In
          </Text>
        </TouchableOpacity>
        {/* Forgot Password */}
        <TouchableOpacity 
          style={{ 
            alignItems: 'center', 
            marginTop: 15,
            padding: 10  // Added padding for better touch target
          }}
        >
          <Text style={{ 
            color: '#FF5A5F', 
            fontSize: 15, 
            fontFamily: 'Ubuntu-Light'
          }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        {/* Don't have an account section */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginTop: 20,
          alignItems: 'center'
        }}>
          <Text style={{ 
            color: '#666666', 
            fontSize: 15, 
            fontFamily: 'Ubuntu-Light' 
          }}>
            Don't have an account?
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Signup')}
            style={{ marginLeft: 5, padding: 5 }}
          >
            <Text style={{ 
              color: '#FF5A5F', 
              fontSize: 15, 
              fontFamily: 'Ubuntu-Light',
              fontWeight: '600'
            }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}