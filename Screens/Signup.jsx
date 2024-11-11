import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Image, ActivityIndicator, Alert } from 'react-native';
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
  const [selected, setSelected] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  const gender = [
    { key: '1', value: 'Select', disabled: true },
    { key: '2', value: 'Male' },
    { key: '3', value: 'Female' },
  ];

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const validatePassword = (password) => ({
    isValid: password.length >= 8 &&
             /[A-Z]/.test(password) &&
             /[a-z]/.test(password) &&
             /[0-9]/.test(password) &&
             /[!@#$%^&*(),.?":{}|<>]/.test(password),
    message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
  });

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Invalid phone number (must be 10 digits)';
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (!selected || selected === 'Select') {
      newErrors.gender = 'Please select your gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please correct the following errors:\n' + Object.values(errors).join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://siddharthapro.in/app4/api/v1/user/signup', { 
        name, 
        email, 
        phoneNumber: phone, 
        password, 
        gender: selected 
      });
      console.log('Signup response:', response.data);
      Alert.alert(
        'Success',
        'Account created successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch(error) {
      console.error('Signup error:', error);
      let errorMessage = 'An error occurred during signup';

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid information provided';
            break;
          case 409:
            errorMessage = 'Email or phone number already exists';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }

      setPasswordAttempts(prev => {
        const attempts = prev + 1;
        if (attempts >= 3) {
          Alert.alert(
            'Warning',
            'Too many incorrect attempts. Please check your password carefully.',
            [{ text: 'OK' }]
          );
        }
        return attempts;
      });
      
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#FFFFFF', padding: 20 }}>
      <StatusBar barStyle="dark-content" backgroundColor={'#FFFFFF'} />
      <Image source={require('../assets/dashabhuja.png')} style={{ width: 300, height: 300, marginBottom: 20, alignSelf: 'center' }} />
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 32, color: '#FF5A5F', fontFamily: 'Samarkan' }}>Dashabhuja</Text>
        <Text style={{ fontSize: 16, color: '#888888', fontFamily: 'Ubuntu-Light', marginBottom: 5 }}>
          Where Every Woman is a Warrior
        </Text>
      </View>

      <View style={{ width: '90%', alignSelf: 'center' }}>
        {/* Name Input */}
        <View style={{margin:3}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.name ? '#FF0000' : '#DDDDDD', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#FFFFFF', elevation: 2 }}>
            <User color={errors.name ? '#FF0000' : '#FF5A5F'} size={24} />
            <TextInput
              style={{ flex: 1, height: 50, marginLeft: 10, color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
              placeholder="Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholderTextColor="#999999"
              editable={!isLoading}
            />
          </View>
          {renderError('name')}
        </View>

        {/* Email Input */}
        <View style={{margin:3}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.email ? '#FF0000' : '#DDDDDD', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#FFFFFF', elevation: 2 }}>
            <Mail color={errors.email ? '#FF0000' : '#FF5A5F'} size={24} />
            <TextInput
              style={{ flex: 1, height: 50, marginLeft: 10, color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholderTextColor="#999999"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>
          {renderError('email')}
        </View>

        {/* Phone Input */}
        <View style={{margin:3}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.phone ? '#FF0000' : '#DDDDDD', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#FFFFFF', elevation: 2 }}>
            <Phone color={errors.phone ? '#FF0000' : '#FF5A5F'} size={24} />
            <TextInput
              style={{ flex: 1, height: 50, marginLeft: 10, color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
              placeholder="Phone"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrors(prev => ({ ...prev, phone: '' }));
              }}
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>
          {renderError('phone')}
        </View>

        {/* Password Input */}
        <View style={{margin:3}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.password ? '#FF0000' : '#DDDDDD', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#FFFFFF', elevation: 2 }}>
            <Lock color={errors.password ? '#FF0000' : '#FF5A5F'} size={24} />
            <TextInput
              style={{ flex: 1, height: 50, marginLeft: 10, color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 18 }}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({ ...prev, password: '' }));
              }}
              placeholderTextColor="#999999"
              secureTextEntry
              editable={!isLoading}
            />
          </View>
          {renderError('password')}
        </View>

        {/* Gender Input */}
        <View style={{ margin: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.gender ? '#FF0000' : '#DDDDDD', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#FFFFFF', elevation: 2 }}>
            <Users color={errors.gender ? '#FF0000' : '#FF5A5F'} size={24} />
            <SelectList
              data={[{ key: 'male', value: 'Male' }, { key: 'female', value: 'Female' }]}
              style={{ flex: 1, height: 50, marginLeft: 10, borderWidth: 0, color: '#000000', backgroundColor: '#FFFFFF' }}
              setSelected={setSelected}
              placeholder="Select Gender"
              search={false}
              placeholderTextColor="#999999"
              boxStyles={{ flex: 1, height: 50, marginLeft: 10, borderWidth: 0, color: '#000000', backgroundColor: '#FFFFFF' }}
              textStyles={{ color: '#000000', fontFamily: 'Ubuntu-Light', fontSize: 28 }}
              dropdownStyles={{ borderWidth: 0, borderColor: '#DDDDDD', borderRadius: 8, backgroundColor: '#FFFFFF' }}
              editable={!isLoading}
            />
          </View>
          {renderError('gender')}
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#FF5A5F',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
            elevation: 3,
            opacity: isLoading ? 0.7 : 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }} 
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Ubuntu-Light', fontWeight: '600' }}>
                Creating Account...
              </Text>
            </>
          ) : (
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Ubuntu-Light', fontWeight: '600' }}>
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading} style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15, color: '#999999', fontFamily: 'Ubuntu-Light' }}>Already have an account?</Text>
            <Text style={{ fontSize: 15, color: isLoading ? '#CCCCCC' : '#FF5A5F', fontFamily: 'Ubuntu-Light', fontWeight: '600' , marginLeft: 10 }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
