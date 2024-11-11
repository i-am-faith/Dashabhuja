/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
  ToastAndroid,
  ScrollView,
  Platform,
  PermissionsAndroid,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Shake from 'react-native-shake';
import Geolocation from '@react-native-community/geolocation';
import { SendDirectSms } from 'react-native-send-direct-sms';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {
  Shield,
  Footprints,
  AlertCircle,
  PersonStanding,
  ShoppingBag,
  UserSearch
} from 'lucide-react-native';
import HeaderTab from './HeaderTab';
import LottieView from 'lottie-react-native';

const Home = (props) => {
  const { userdata } = props.route.params;
  const navigation = useNavigation();

  // State to manage refresh and loading indicators
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Navigation Handlers
  const navigateToSOSAlertSettings = () => navigation.navigate('SOSAlertSettings', { userdata });
  const navigateToReportIncidents = () => navigation.navigate('ReportingIncidents', { userdata });
  const handleNavigateToShop = () => navigation.navigate('Shop', { userdata });
  const handleNavigatetoCommunity = () => navigation.navigate('Community', { userdata });
  const handleNavigatetoFootprints = () => navigation.navigate('Footprints', { userdata });
  const navigatetoYoga = () => navigation.navigate('Yoga');

  // Request location permissions on Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
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
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Fetch current location and update on the server
  const fetchCurrentLocation = async () => {
    setLoading(true);
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      ToastAndroid.showWithGravityAndOffset(
        'Location permission denied',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      setLoading(false);
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
      ToastAndroid.showWithGravityAndOffset('Updating location...', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);

      // Update recent location
      await axios.post('https://siddharthapro.in/app4/api/v1/user/update-recent-location', {
        email: userdata.email,
        latitude,
        longitude,
      });

      // Fetch alert status
      ToastAndroid.showWithGravityAndOffset('Fetching Alerts...', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
      const alertResponse = await axios.post('https://siddharthapro.in/app4/api/v1/user/fetch-alerts', {
        email: userdata.email,
        latitude,
        longitude,
      });

      if (alertResponse.data?.length > 0 && alertResponse.data[0].issuedBy !== userdata.email) {
        navigation.navigate('Alert', { data: { alertData: alertResponse.data[0], latitude, longitude } });
      }
    } catch (error) {
      console.log('Error getting or updating location:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle Emergency SOS
  const emergencySOS = async () => {
    setLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 });
      });

      const { latitude, longitude } = position.coords;
      const message = `Hi there, I am in Emergency! Here's my location: https://maps.google.com/?q=${latitude},${longitude}. This message was sent by ${userdata.name} from Dashabhuja App.`;

      // Send SMS to trusted contacts if enabled
      if (userdata.autoSMS) {
        userdata.trustedContactsSMS.forEach(contact => contact && SendDirectSms(contact, message));
        ToastAndroid.showWithGravityAndOffset('SMS sent to trusted contacts', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      }

      // Make an emergency call to trusted contact if enabled
      if (userdata.autoCall && userdata.trustedContactPhone) {
        RNImmediatePhoneCall.immediatePhoneCall(userdata.trustedContactPhone);
        ToastAndroid.showWithGravityAndOffset('Call sent to trusted contact', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      }

      // Trigger Alert API
      await axios.post('https://siddharthapro.in/app4/api/v1/user/trigger-alert', { email: userdata.email, latitude, longitude });
      ToastAndroid.showWithGravityAndOffset('Alert triggered', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } catch (error) {
      console.error('Error in emergencySOS:', error);
      ToastAndroid.showWithGravityAndOffset('Failed to send emergency alert', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => fetchCurrentLocation(), 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchCurrentLocation();
    Shake.addListener(emergencySOS);
    return () => {
      Shake.removeAllListeners();
    };
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', height: '100%', padding: 4 }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderTab />
      <ScrollView
        style={{ height: '100%', backgroundColor: '#FFFFFF' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCurrentLocation(); }} />
        }
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35, marginBottom: 35 }}>
          <LottieView source={require('../Screens/Assets/Yellow-glow.json')} autoPlay loop style={{ width: 400, height: 400, position: 'absolute' }} speed={2} />
          <Image source={require('../assets/dashabhuja.png')} style={{ width: 300, height: 300, zIndex: 10 }} />
        </View>

        <View style={{ marginTop: 0, borderTopColor: '#4A4947', borderTopWidth: 1, paddingTop: 8 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#EF4444', height: 80, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', elevation: 2 }}
            onPress={emergencySOS}
          >
            <Shield color="#FFFFFF" size={28} style={{ marginRight: 10, alignSelf: 'center' }} />
            <View>
              <Text style={{ color: '#FFFFFF', fontSize: 20, fontFamily: 'Ubuntu-Bold' }}>Emergency SOS</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'Ubuntu-Light' }}>Press & hold to activate</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Feature Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <TouchableOpacity style={styles.featureButton} onPress={navigateToSOSAlertSettings}>
            <Shield color="#000000" size={28} style={styles.iconSpacing} />
            <Text style={styles.featureText}>SOS Alert</Text>
            <Text style={styles.subText}>One-tap emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton} onPress={handleNavigatetoFootprints}>
            <Footprints color="#000000" size={28} style={styles.iconSpacing} />
            <Text style={styles.featureText}>Live Footprints</Text>
            <Text style={styles.subText}>Share with contacts</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Action Buttons */}
        <ActionButton
          backgroundColor="#FEF2F2"
          icon={<AlertCircle color="#DC2626" size={28} />}
          title="Report Incidents"
          subtitle="Document and report safely"
          onPress={navigateToReportIncidents}
        />
        <ActionButton
          backgroundColor="#EFF6FF"
          icon={<PersonStanding color="#2563EB" size={28} />}
          title="Yoga & Fitness"
          subtitle="Learn self-defense and Yoga"
          onPress={navigatetoYoga}
        />
        <ActionButton
          backgroundColor="#ECFDF5"
          icon={<ShoppingBag color="#16A34A" size={28} />}
          title="Shop "
          subtitle="Empower businesses run by women"
          onPress={handleNavigateToShop}
        />
        <ActionButton
          backgroundColor="#F5F3FF"
          icon={<UserSearch color="violet" size={28} />}
          title="Connect Community"
          subtitle="Join community for support"
          onPress={handleNavigatetoCommunity}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Action Button Component
const ActionButton = ({ backgroundColor, icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={[styles.actionButton, { backgroundColor }]} onPress={onPress}>
    {icon}
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.featureText}>{title}</Text>
      <Text style={styles.subText}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const styles = {
  featureButton: {
    backgroundColor: '#FAFAFA',
    height: 110,
    borderRadius: 10,
    width: '49.5%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  actionButton: {
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    padding: 15,
    marginTop: 8,
    alignItems: 'center',
  },
  iconSpacing: {
    marginBottom: 10,
  },
  featureText: {
    color: '#000000',
    fontSize: 20,
    fontFamily: 'Ubuntu-Regular',
  },
  subText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Ubuntu-Light',
  },
};

export default Home;
