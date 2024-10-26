

/* eslint-disable no-unused-vars */

/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { User, Mail, Phone, Lock, Users } from 'lucide-react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';

export default function SignupScreen() {
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
    // Implement signup logic here
    // console.log('Signup:', { name, email, phone, password, selected });
    try{
      const response = await axios.post('http://192.168.29.15:3000/api/v1/user/signup', { name, email, phoneNumber:phone, password, gender:selected });
      console.log('Signup response:', response.data);
    }
    catch(error){
      console.error('Signup error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#FFFFFF', padding: 20 }}>
      <StatusBar barStyle="dark-content" backgroundColor={'#FFFFFF'} />
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Text style={{ fontSize: 32, color: '#FF5A5F', fontFamily: 'Samarkan' }}>Dashabhuja</Text>
        <Text style={{ fontSize: 16, color: '#888888', fontFamily:'Ubuntu-Light' }}>Where Every Woman is a Warrior</Text>
      </View>

      <View style={{ width: '90%', alignSelf: 'center' }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 8, paddingHorizontal: 10,
        }}>
          <User color="#FF5A5F" size={24} />
          <TextInput
            style={{ flex: 1, height: 50, marginLeft: 10, color:'#000000', fontFamily:'Ubuntu-Light', fontSize:18 }}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 8, paddingHorizontal: 10,
        }}>
          <Mail color="#FF5A5F" size={24} />
          <TextInput
            style={{ flex: 1, height: 50, marginLeft: 10, color:'#000000', fontFamily:'Ubuntu-Light', fontSize:18 }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 8, paddingHorizontal: 10,
        }}>
          <Phone color="#FF5A5F" size={24} />
          <TextInput
            style={{ flex: 1, height: 50, marginLeft: 10, color:'#000000', fontFamily:'Ubuntu-Light', fontSize:18 }}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 8, paddingHorizontal: 10,
        }}>
          <Lock color="#FF5A5F" size={24} />
          <TextInput
            style={{ flex: 1, height: 50, marginLeft: 10, color:'#000000', fontFamily:'Ubuntu-Light', fontSize:18 }}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 8, paddingHorizontal: 10,
        }}>
          <Users color="#FF5A5F" size={24} />
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={gender}
            save="value"
            placeholder="Gender"
            dropdownTextStyles={{ color: 'grey', fontFamily:'Ubuntu-Light', fontSize:15 }}
            dropdownStyles={{ borderRadius: 8, marginLeft: 10, width: '95%', borderWidth: 0, borderColor: '#FFFFFF' }}
            search={false}
            boxStyles={{ borderRadius: 8, marginLeft: 10, width: '95%', borderWidth: 0, borderColor: '#FFFFFF' }}
            inputStyles={{ color: '#000000', fontFamily:'Ubuntu-Light', fontSize:18 }}
          />
        </View>

        <TouchableOpacity style={{
          backgroundColor: '#FF5A5F', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20,
        }} onPress={handleSignup}>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
