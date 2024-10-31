/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { User, Mail, Phone, Lock, Users } from 'lucide-react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selected, setSelected] = React.useState('');
  const gender = [
    { key: '1', value: 'Select', disabled: true },
    { key: '2', value: 'Male' },
    { key: '3', value: 'Female' },
  ];

  const handleSignup = async() => {
    try{
      const response = await axios.post('http://192.168.29.15:3000/api/v1/user/signup', { 
        name, 
        email, 
        phoneNumber:phone, 
        password, 
        gender:selected 
      });
      console.log('Signup response:', response.data);
    }
    catch(error){
      console.error('Signup error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#FFFFFF', padding: 20 }}>
      <StatusBar barStyle="dark-content" backgroundColor={'#FFFFFF'} />
      
      {/* Header Section */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 32, color: '#FF5A5F', fontFamily: 'Samarkan' }}>Dashabhuja</Text>
        <Text style={{ fontSize: 16, color: '#888888', fontFamily: 'Ubuntu-Light', marginBottom: 5 }}>
          Where Every Woman is a Warrior
        </Text>
      </View>

      {/* Greeting Section */}
      <View style={{ marginBottom: 30, paddingHorizontal: 10 }}>
        <Text style={{ 
          fontSize: 28, 
          color: '#510210', 
          fontFamily: 'Ubuntu-Light', 
          marginBottom: 8 
        }}>
          Welcome!
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: '#666666', 
          fontFamily: 'Ubuntu-Light',
          lineHeight: 22
        }}>
          Join our community of strong, empowered individuals. Create your account to access safety features and support.
        </Text>
      </View>

      {/* Form Section */}
      <View style={{ width: '90%', alignSelf: 'center' }}>
        {/* Name Input */}
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
          <User color="#FF5A5F" size={24} />
          <TextInput
            style={{ flex: 1, height: 50, marginLeft: 10, color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999999"
          />
        </View>

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
            style={{ flex: 1, height: 50, marginLeft: 10, color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#999999"
          />
        </View>

        {/* Phone Input */}
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
          <Phone color="#FF5A5F" size={24} />
          <TextInput
            style={{ flex: 1, height: 50, marginLeft: 10, color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#999999"
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
            style={{ flex: 1, height: 50, marginLeft: 10, color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999999"
          />
        </View>

        {/* Gender Select */}
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
          <Users color="#FF5A5F" size={24} />
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={gender}
            save="value"
            placeholder="Gender"
            dropdownTextStyles={{ color: 'grey', fontFamily: 'Ubuntu-Light', fontSize: 15 }}
            dropdownStyles={{ borderRadius: 8, marginLeft: 10, width: '95%', borderWidth: 0, borderColor: '#FFFFFF' }}
            search={false}
            boxStyles={{ borderRadius: 8, marginLeft: 10, width: '95%', borderWidth: 0, borderColor: '#FFFFFF' }}
            inputStyles={{ color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
          />
        </View>

        {/* Signup Button */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#FF5A5F',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
            elevation: 3,
          }} 
          onPress={handleSignup}
        >
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: 18, 
            fontFamily: 'Ubuntu-Light',
            fontWeight: '600'
          }}>
            Create Account
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 14, color: '#999999', fontFamily: 'Ubuntu-Light' }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ fontSize: 14, color: '#FF5A5F', fontFamily: 'Ubuntu-Light', fontWeight: '600' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}