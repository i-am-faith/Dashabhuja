/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View, Image, Alert, PermissionsAndroid, Platform, ToastAndroid, ScrollView } from 'react-native';
import Shake from 'react-native-shake';
import BackgroundService from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import { SendDirectSms } from 'react-native-send-direct-sms';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';

import { Bell, Shield, MapPin, Volume2, AlertCircle, Award, BookOpen, Briefcase, UserSearch, ShoppingBag, HeartPulseIcon, VolumeX, PersonStanding, Footprints } from 'lucide-react-native';
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
    if (sosPlaying) {
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
    navigation.navigate('SOSAlertSettings', { userdata });
  };
  const navigateToReportIncidents = () => {
    navigation.navigate('ReportingIncidents', { userdata });
  };
  const handleNavigateToShop = () => {
    navigation.navigate('Shop', { userdata });
  };
  const handleNavigatetoCommunity = () => {
    navigation.navigate('Community', { userdata });
  };
  const handleNavigatetoFootprints = () => {
    navigation.navigate('Footprints', { userdata });
  };
  const navigatetoYoga = () => {
    navigation.navigate('Yoga');
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
      Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
        'Location permission denied',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('Location found:', latitude, longitude);

      Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
        'Updating location...',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      try {
        const response = await axios.post(
          'http://192.168.29.15:3000/api/v1/user/update-recent-location',
          { email: userdata.email, latitude, longitude }
        );
        console.log('Update recent location response:', response.data);

        Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
          'Location updated successfully',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } catch (locationUpdateError) {
        console.log('Error updating location:', locationUpdateError);
      }

      // Fetching alert status
      Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
        'Fetching Alerts...',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      try {
        const alertResponse = await axios.post(
          'http://192.168.29.15:3000/api/v1/user/fetch-alerts',
          { email: userdata.email, latitude, longitude }
        );
        // console.log('Alert response:', alertResponse.data);
        // console.log('Alert Raised by:', alertResponse.data[0].issuedBy);

        // Check if there are any alerts issued by someone else
        if (alertResponse.data?.length > 0 && alertResponse.data[0].issuedBy !== userdata.email) {
          const data = {
            alertData: alertResponse.data[0],
            latitude,
            longitude,
          };
          console.log('Navigating to Alert:', data);
          navigation.navigate('Alert', { data });
        }
      } catch (alertFetchError) {
        console.log('Error fetching alerts:', alertFetchError);
      }

    } catch (error) {
      console.log('Error getting location:', error);
    }
  };//TODO: SetTimeOut to Check Alert Status
  const emergencySOS = async () => {
    try {
      console.log('Finding location...');

      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('Location found:', latitude, longitude);

      // Prepare the emergency message
      const message = `Emergency! Here's my location: https://maps.google.com/?q=${latitude},${longitude}`;

      // Send SMS if autoSMS is enabled
      if (userdata.autoSMS) {
        try {
          userdata.trustedContactsSMS.forEach(contact => {
            contact && SendDirectSms(contact, message);
          });
          console.log('SMS sent to trusted contacts');

          Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
            'SMS sent to trusted contacts',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        } catch (smsError) {
          console.error('Error sending SMS:', smsError);
        }
      } else {
        console.log('SMS not sent to trusted contacts as autoSMS is disabled');
        Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
          'SMS not sent to trusted contacts as autoSMS is disabled',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      // Make emergency call if autoCall is enabled
      if (userdata.autoCall && userdata.trustedContactPhone) {
        try {
          RNImmediatePhoneCall.immediatePhoneCall(userdata.trustedContactPhone);
          console.log('Call sent to trusted contact');

          Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
            'Call sent to trusted contact',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        } catch (callError) {
          console.error('Error making call:', callError);
        }
      } else {
        console.log('Call not sent as autoCall is disabled');
        Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
          'Call not sent to trusted contact as autoCall is disabled',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      // Trigger Alert API
      const response = await axios.post(
        'http://192.168.29.15:3000/api/v1/user/trigger-alert',
        { email: userdata.email, latitude, longitude }
      );
      console.log('Trigger alert response:', response.data);

      Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
        'Alert triggered',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    } catch (error) {
      console.error('Error in emergencySOS:', error);
      Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
        'Failed to send emergency alert',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentLocation();
    }, 90000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    requestLocationPermission();
    fetchCurrentLocation();
    // setupPlayer();
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
      <HeaderTab />
      <ScrollView style={{ height: '100%', backgroundColor: '#FFFFFF' }}>
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

          <TouchableOpacity style={{ flex: 1, height: 125, borderRadius: 10, backgroundColor: '#FFFFFF', elevation: 2, alignItems: 'center', justifyContent: 'center', marginLeft: 4, marginRight: 4 }}
            onPress={handleNavigatetoFootprints}
          >
            <Footprints color="#000000" size={28} style={{ marginBottom: 5 }} />
            <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Regular' }}>
              Live Footprints
            </Text>
            <Text style={{ color: 'grey', fontSize: 13, fontFamily: 'Ubuntu-Light' }}>
              Share with contacts
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={{ flex: 1, height: 125, borderRadius: 10, backgroundColor: '#FFFFFF', elevation: 2, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { playSOSSound(); }}
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
          </TouchableOpacity> */}

        </View>
        <View />
        <View style={{ paddingTop: 10 }}>
          <TouchableOpacity style={{ backgroundColor: '#FEF2F2', height: 90, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => { navigateToReportIncidents(); }}
          >
            <View style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 30, marginRight: 10 }}>
              <AlertCircle color="#DC2626" size={28} />
            </View>
            <View style={{ marginRight: 'auto' }}>
              <Text style={{ color: '#111827', fontSize: 20, fontFamily: 'Ubuntu-Regular' }}>Report Incidents</Text>
              <Text style={{ color: '#4B5563', fontSize: 14, fontFamily: 'Ubuntu-Light' }}>Document and report safely</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#EFF6FF', height: 90, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => { navigatetoYoga(); }}
          >
            <View style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 30, marginRight: 10 }}>
              <PersonStanding color="#2563EB" size={28} />
            </View>
            <View style={{ marginRight: 'auto' }}>
              <Text style={{ color: '#111827', fontSize: 20, fontFamily: 'Ubuntu-Regular' }}>Health and Wellness</Text>
              <Text style={{ color: '#4B5563', fontSize: 14, fontFamily: 'Ubuntu-Light' }}>Yoga, exercise and health tips</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#ECFDF5', height: 90, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => { handleNavigateToShop(); }}
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
            onPress={() => { handleNavigatetoCommunity(); }}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

