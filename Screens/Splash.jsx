/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, StatusBar, Dimensions, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import TypeWriter from 'react-native-typewriter';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Splash = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showTypewriter, setShowTypewriter] = useState(false);

  const checkConnection = async () => {
    try {
      console.log('Checking internet connection...');
      const isConnected = await axios.get('https://siddharthapro.in/app4/');
      if (isConnected) {
        console.log('Internet is connected!', isConnected.data);
      } else {
        console.log('Internet is not connected!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigation = useNavigation();
  const navigateToLogin = async () => {
    const jsonValue = await AsyncStorage.getItem('userdata');
    const userdata = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (userdata) {
      navigation.navigate('Home', { userdata });
    } else {
      navigation.navigate('Signup');
    }
  };

  useEffect(() => {
    checkConnection();

    // Start typewriter effect after a short delay
    setTimeout(() => {
      setShowTypewriter(true);
    }, 500);

    // Fade in animation for the tagline
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      delay: 2000, // Start after typewriter effect
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 4 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Content Container */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* App Name Section */}
        <View style={{ alignItems: 'center' }}>
          <LottieView
            source={require('../Screens/Assets/MaaDurgaAnnimation.json')}
            autoPlay
            loop
            style={{ width: 300, height: 300 }}
          />
          <Text style={{ fontSize: 48, color: '#FFD700', fontWeight: 'bold', marginBottom: 5 }}> </Text>
        </View>

        {/* Typewriter Effect for App Name */}
        {showTypewriter && (
          <TypeWriter
            typing={1}
            maxDelay={100}
            style={{
              fontSize: 58,
              color: '#FF5A5F',
              fontFamily: 'Samarkan',
              height: 100,
            }}
          >
            dashabhuja
          </TypeWriter>
        )}

        {/* Animated Tagline Section */}
        <View style={{ alignItems: 'center', marginBottom: height * 0.09 }}>
          <Animated.Text
            style={{
              fontSize: 18,
              color: '#510210',
              textAlign: 'center',
              fontWeight: '600',
              marginBottom: 12,
              fontFamily: 'Ubuntu-Light',
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            }}
          >
            Ten Arms of Protection, One Powerful App
          </Animated.Text>
          <Animated.Text
            style={{
              fontSize: 16,
              color: '#510210',
              textAlign: 'center',
              fontWeight: '600',
              marginBottom: 1,
              fontFamily: 'Ubuntu-Light',
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            }}
          >
            Inspired by the divine strength of Maa Durga
          </Animated.Text>
        </View>
      </View>

      {/* Bottom Button Section */}
      <View style={{ width: '50%', paddingBottom: 20, alignSelf: 'center', top: -30 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FF5A5F',
            padding: 15,
            borderRadius: 38,
            alignItems: 'center',
            marginTop: 20,
            elevation: 4,
          }}
          onPress={navigateToLogin}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontFamily: 'Ubuntu-Light' }}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Splash;
