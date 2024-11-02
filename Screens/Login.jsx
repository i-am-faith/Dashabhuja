/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://siddharthapro.in/app4/api/v1/user/login', { email, password });
      navigation.navigate('Home', { userdata: response.data });
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const renderError = (fieldName) => {
    if (errors[fieldName]) {
      return (
        <Text style={{ 
          color: '#FF0000', 
          fontSize: 12, 
          marginLeft: 10, 
          marginTop: 2,
          fontFamily: 'Ubuntu-Light' 
        }}>
          {errors[fieldName]}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 20, justifyContent: 'center' }}>
      <StatusBar barStyle="dark-content" backgroundColor={'#FFFFFF'} />
      {/* Brand Header */}
      <Image
        source={require('../assets/dashabhuja.png')}
        style={{ width: 300, height: 300, marginBottom: 20, alignSelf: 'center' }}
      />
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 32, color: '#FF5A5F', fontFamily: 'Samarkan' }}>Dashabhuja</Text>
        <Text style={{ fontSize: 16, color: '#888888', fontFamily: 'Ubuntu-Light' }}>
          Where Every Woman is a Warrior
        </Text>
      </View>
      {/* Welcome Message */}
      <View style={{ marginBottom: 30, paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 28, color: '#510210', fontFamily: 'Ubuntu-Light', marginBottom: 8 }}>
          Welcome Back!
        </Text>
        <Text style={{ fontSize: 16, color: '#666666', fontFamily: 'Ubuntu-Light', lineHeight: 22 }}>
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
          borderColor: errors.email ? '#FF0000' : '#DDDDDD',
          borderRadius: 8,
          paddingHorizontal: 10,
          backgroundColor: '#FFFFFF',
          elevation: 2,
        }}>
          <Mail color={errors.email ? '#FF0000' : '#FF5A5F'} size={24} />
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
            onChangeText={(text) => {
              setEmail(text);
              setErrors(prev => ({ ...prev, email: '' }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
        {renderError('email')}

        {/* Password Input */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
          borderWidth: 1,
          borderColor: errors.password ? '#FF0000' : '#DDDDDD',
          borderRadius: 8,
          paddingHorizontal: 10,
          backgroundColor: '#FFFFFF',
          elevation: 2,
        }}>
          <Lock color={errors.password ? '#FF0000' : '#FF5A5F'} size={24} />
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
            onChangeText={(text) => {
              setPassword(text);
              setErrors(prev => ({ ...prev, password: '' }));
            }}
            secureTextEntry
            editable={!isLoading}
          />
        </View>
        {renderError('password')}

        {/* Login Button */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#FF5A5F',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
            elevation: 3,
            flexDirection: 'row',
            justifyContent: 'center',
            opacity: isLoading ? 0.7 : 1
          }} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Ubuntu-Light', fontWeight: '600' }}>
                Signing In...
              </Text>
            </>
          ) : (
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Ubuntu-Light', fontWeight: '600' }}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity 
          style={{ alignItems: 'center', marginTop: 15 }}
          disabled={isLoading}
        >
          <Text style={{ color: '#FF5A5F', fontSize: 15, fontFamily: 'Ubuntu-Light' }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Don't have an account section */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ color: '#666666', fontSize: 15, fontFamily: 'Ubuntu-Light' }}>
            Don't have an account?
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Signup')}
            style={{ marginLeft: 5, padding: 5 }}
            disabled={isLoading}
          >
            <Text style={{ color: '#FF5A5F', fontSize: 15, fontFamily: 'Ubuntu-Light', fontWeight: '600' }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
