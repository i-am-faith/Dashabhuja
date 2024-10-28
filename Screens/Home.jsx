/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View, Image, Alert, PermissionsAndroid, Platform } from 'react-native';
import Shake from 'react-native-shake';
import BackgroundService from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import { SendDirectSms } from 'react-native-send-direct-sms';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';

import { Bell, Shield, MapPin, Volume2, AlertCircle, Award, BookOpen, Briefcase, UserSearch, ShoppingBag, HeartPulseIcon, VolumeX } from 'lucide-react-native';
import axios from 'axios';
import HeaderTab from './HeaderTab';
import { set } from 'mongoose';

const Home = (props) => {
  const { userdata } = props.route.params;
  console.log('userdata', userdata);
  const [sosPlaying, setSosPlaying] = useState(false);
  const navigation = useNavigation();

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (error) {
      console.log('Error in setupPlayer', error);
    }
  };
  const playSOSSound = async () => {
    if(sosPlaying){
      TrackPlayer.stop();
      setSosPlaying(false);
      return;
    }
    try {
      const track = await TrackPlayer.add({
        id: 'sos',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'SOS',
        artist: 'SOS',
        genre: 'SOS',
        date: new Date(),
      });
      await TrackPlayer.play();
      setSosPlaying(true);
      setTimeout(() => {
        TrackPlayer.stop();
        TrackPlayer.reset();
        
      }, 30000); 
    } catch (error) {
      console.log('Error in playSOSSound', error);
    }
  };
  const navigateToSOSAlertSettings = () => {
    navigation.navigate('SOSAlertSettings',{ userdata });
  };
  const navigateToReportIncidents = () => {
    navigation.navigate('ReportingIncidents',{ userdata });
  }
  const handleNavigateToShop = () => {
    navigation.navigate('Shop', { userdata });
  };
  const handleNavigatetoCommunity = () => {
    navigation.navigate('Community', { userdata });
  };
  const requestLocationPermission = async () => {
    try {
      console.log('Requesting location permission...');
      console.log('Platform:', Platform.OS);
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location for better services',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Location permission granted:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const fetchCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log('Location permission denied');
      return;
    }
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location found:', latitude, longitude);
      },
      (error) => {
        console.log('Error getting location', error);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };
  const emergencySOS = async () => {
    try {
      console.log('Finding location...');
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location found:', latitude, longitude);
          console.log('Sending SMS...');
          const message = `Emergency! Here's my location: https://maps.google.com/?q=${latitude},${longitude}`;
          SendDirectSms('9832694658', message);
          console.log('SMS sent');
          console.log('Sending call...');
          RNImmediatePhoneCall.immediatePhoneCall('9832694658');
          console.log('Call Initiated');
        },
        (error) => {
          console.log('Error getting location', error);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.log('Error in emergencySOS', error);
    }
  };
  
  useEffect(() => {
    requestLocationPermission();
    fetchCurrentLocation();
    setupPlayer();
    const shakeSubscription = Shake.addListener(() => {
      console.log('Shake detected');
      emergencySOS().catch(error => console.log('Error in emergencySOS', error));
    });
    return () => {
      shakeSubscription.remove();
      BackgroundService.stop();
    };
  }, []);


  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', height: '100%', padding: 4 }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderTab/>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../assets/maadurga.jpg')} style={{ width: '50%', height: 180 }} />
      </View>

      <View style={{ marginTop: 0, borderTopColor: '#4A4947', borderTopWidth: 1, paddingTop: 8 }}>
        <TouchableOpacity style={{ backgroundColor: '#EF4444', height: 80, borderRadius: 10, flexDirection: 'row', padding: 10 }}
          onPress={() => emergencySOS('+919038471652', 'Message Sent from App')}
        >
          <View style={{ marginLeft: 'auto', justifyContent: 'center' }}>
            <Shield color="#FFFFFF" size={28} style={{ marginRight: 10 }} />
          </View>
          <View style={{ marginRight: 'auto', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontFamily: 'Ubuntu-Regular', fontWeight: '900' }}>
              Emergency SOS
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'Ubuntu-Light', fontWeight: '200' }}>
              Press & hold to activate
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>

        <TouchableOpacity style={{ flex: 1, height: 125, elevation: 4, borderRadius: 10, backgroundColor: '#FFFFFF', elevation: 2, alignItems: 'center', justifyContent: 'center' }}
          onPress={navigateToSOSAlertSettings}
        >
          <Shield color="#000000" size={28} style={{ marginBottom: 5 }} />
          <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Regular' }}>
            SOS Alert
          </Text>
          <Text style={{ color: 'grey', fontSize: 13, fontFamily: 'Ubuntu-Light' }}>
            One-tap emergency
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, height: 125, borderRadius: 10, backgroundColor: '#FFFFFF', elevation: 2, alignItems: 'center', justifyContent: 'center', marginLeft: 4, marginRight: 4 }}>
          <MapPin color="#000000" size={28} style={{ marginBottom: 5 }} />
          <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Regular' }}>
            Live Location
          </Text>
          <Text style={{ color: 'grey', fontSize: 13, fontFamily: 'Ubuntu-Light' }}>
            Share with contacts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, height: 125, borderRadius: 10, backgroundColor: '#FFFFFF', elevation: 2, alignItems: 'center', justifyContent: 'center' }}
        onPress={()=>{playSOSSound()}}
        >
          {!sosPlaying ? (
            <>
              <Volume2 color="#000000" size={28} style={{ marginBottom: 5 }} />
              <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Regular' }}>
                Safety Alarm
              </Text>
              <Text style={{ color: 'grey', fontSize: 13, fontFamily: 'Ubuntu-Light' }}>
                Trigger loud alert
              </Text>
            </>
          ) : (
            <>
              <VolumeX color="red" size={28} style={{ marginBottom: 5 }} />
              <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Regular' }}>
                Safety Alarm
              </Text>
              <Text style={{ color: 'grey', fontSize: 13, fontFamily: 'Ubuntu-Light' }}>
                Trigger silent alert
              </Text>
            </>
          )}
        </TouchableOpacity>

      </View>
      <View />
      <View style={{ paddingTop: 10 }}>
        <TouchableOpacity style={{ backgroundColor: '#FEF2F2', height: 90, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}
        onPress={()=>{navigateToReportIncidents()}}
        >
          <View style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 30, marginRight: 10 }}>
            <AlertCircle color="#DC2626" size={28} />
          </View>
          <View style={{ marginRight: 'auto' }}>
            <Text style={{ color: '#111827', fontSize: 20, fontFamily: 'Ubuntu-Regular' }}>Report Incidents</Text>
            <Text style={{ color: '#4B5563', fontSize: 14, fontFamily: 'Ubuntu-Light' }}>Document and report safely</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#EFF6FF', height: 90, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 30, marginRight: 10 }}>
            <HeartPulseIcon color="#2563EB" size={28} />
          </View>
          <View style={{ marginRight: 'auto' }}>
            <Text style={{ color: '#111827', fontSize: 20, fontFamily: 'Ubuntu-Regular' }}>Self Defense</Text>
            <Text style={{ color: '#4B5563', fontSize: 14, fontFamily: 'Ubuntu-Light' }}>Learn how to defend yourself</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#ECFDF5', height: 90, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}
        onPress={()=>{handleNavigateToShop()}}
        >
          <View style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 30, marginRight: 10 }}>
            <ShoppingBag color="#16A34A" size={28} />
          </View>
          <View style={{ marginRight: 'auto' }}>
            <Text style={{ color: '#111827', fontSize: 20, fontFamily: 'Ubuntu-Regular' }}>Shop</Text>
            <Text style={{ color: '#4B5563', fontSize: 14, fontFamily: 'Ubuntu-Light' }}>Empower businesses run by women</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#F5F3FF', height: 90, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}
        onPress={()=>{handleNavigatetoCommunity()}}
        >
          <View style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 30, marginRight: 10 }}>
            <UserSearch color="#7E22CE" size={28} />
          </View>
          <View style={{ marginRight: 'auto' }}>
            <Text style={{ color: '#111827', fontSize: 20, fontFamily: 'Ubuntu-Regular' }}>Community</Text>
            <Text style={{ color: '#4B5563', fontSize: 14, fontFamily: 'Ubuntu-Light' }}>Join the community for Women</Text>
          </View>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default Home;

