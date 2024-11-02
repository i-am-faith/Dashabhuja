/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Image, Switch, TextInput, ScrollView, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Bell, CircleUserRound, MessageSquare, Phone } from 'lucide-react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const SOSAlertSettings = (props) => {
  const { userdata } = props.route.params;
  // console.log('userdata', userdata);

  const [autoSMS, setAutoSMS] = useState(true);
  const [autoCall, setAutoCall] = useState(true);
  const [smsContact1, setSMSContact1] = useState('');
  const [smsContact2, setSMSContact2] = useState('');
  const [callContact, setCallContact] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const navigation = useNavigation();


  const getStatusofCurrentUser = async () => {
    ToastAndroid.showWithGravityAndOffset(
      'Fetching Current Status',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    setShowLoader(true);
    const updatedUser = await axios.post('https://siddharthapro.in/app4/api/v1/user/get', { email: userdata.email });
    setAutoSMS(updatedUser.data.autoSMS);
    setAutoCall(updatedUser.data.autoCall);
    setSMSContact1(updatedUser.data.trustedContactsSMS[0]);
    setSMSContact2(updatedUser.data.trustedContactsSMS[1]);
    setCallContact(updatedUser.data.trustedContactPhone);
    console.log('Updated user: ---> ', updatedUser.data);
    setShowLoader(false);
  }

  const handleSaveSettings = async () => {
     setShowLoader(true);
    try {
      const smsConst = [...new Set([smsContact1, smsContact2])];
      const user = {
        email: userdata.email,
        trustedContactsSMS: smsConst,
        trustedContactsPhone: callContact,
        autoSMS: autoSMS,
        autoCall: autoCall,
      };

      console.log('Saving settings: before swend', user);
      const response = await axios.post('https://siddharthapro.in/app4/api/v1/user/update', user);
      console.log('Save settings response:', response.data);
      ToastAndroid.showWithGravityAndOffset(
        'Settings saved successfully',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      const updatedUser = await axios.post('https://siddharthapro.in/app4/api/v1/user/get', { email: userdata.email });
      console.log('Updated user: ---> ', updatedUser.data);
      navigation.navigate('Home', { userdata: updatedUser.data });
      setShowLoader(false);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error saving settings. Please try again later.');
    }
  };

  useEffect(() => {
    getStatusofCurrentUser();
  }, []);
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', height: '100%', padding: 4, flex: 1 }}>
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
      }}>
        <ActivityIndicator size="large" color="#E90074" animating={showLoader} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StatusBar barStyle={'dark-content'} />
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ backgroundColor: '#FFFFFF' }}>
            <Text style={{ color: '#E90074', fontSize: 24, fontFamily: 'Samarkan' }}>
              Dashabhuja
            </Text>
            <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Ubuntu-Regular' }}>
              Empowerment & Protection
            </Text>
          </View>
          <TouchableOpacity style={{ marginLeft: 'auto', marginTop: 10 }}>
            <Bell color="#4A4947" size={28} />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/maadurga.jpg')} style={{ width: '50%', height: 180 }} />
        </View>

        <View style={{ backgroundColor: '#F4F6FF', borderRadius: 8, padding: 15, borderWidth: 1, borderColor: '#000000', marginTop: 20 }}>
          <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Bold' }}>
            Automatic Actions
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 25 }}>
            <MessageSquare color="#4A4947" size={24} />
            <Text style={{ color: '#000000', fontSize: 16, fontFamily: 'Ubuntu-Light', marginLeft: 10, marginRight: 'auto' }}>
              Auto SMS
            </Text>
            <Switch
              value={autoSMS}
              onValueChange={setAutoSMS}
              trackColor={{ false: '#767577', true: '#FF3B30' }}
              thumbColor={autoSMS ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Phone color="#4A4947" size={24} />
            <Text style={{ color: '#000000', fontSize: 16, fontFamily: 'Ubuntu-Light', marginLeft: 10, marginRight: 'auto' }}>
              Auto Calling
            </Text>
            <Switch
              value={autoCall}
              onValueChange={setAutoCall}
              trackColor={{ false: '#767577', true: '#FF3B30' }}
              thumbColor={autoSMS ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        <View>
          <TouchableOpacity style={{ marginTop: 20 }}>
            <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Bold' }}>
              Emergency Contacts to Notify via SMS
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
            <CircleUserRound color="#E90074" size={34} strokeWidth={1} />
            <TextInput
              style={{ color: '#000000', borderWidth: 1, borderColor: '#E90074', borderRadius: 10, padding: 6, width: '90%' }}
              placeholderTextColor={'#E90074'}
              placeholder="Trusted Contact 1"
              keyboardType="number-pad"
              onChangeText={setSMSContact1}
              value={smsContact1}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
            <CircleUserRound color="#E90074" size={34} strokeWidth={1} />
            <TextInput
              style={{ color: '#000000', borderWidth: 1, borderColor: '#E90074', borderRadius: 10, padding: 6, width: '90%' }}
              placeholderTextColor={'#E90074'}
              placeholder="Trusted Contact 2"
              keyboardType="number-pad"
              onChangeText={setSMSContact2}
              value={smsContact2}
            />
          </View>
          <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Bold', marginTop: 30 }}>
            Emergency Contact to Call
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
            <CircleUserRound color="#E90074" size={34} strokeWidth={1} />
            <TextInput
              style={{ color: '#000000', borderWidth: 1, borderColor: '#E90074', borderRadius: 10, padding: 6, width: '90%' }}
              placeholderTextColor={'#E90074'}
              placeholder="Contact to Call"
              keyboardType="number-pad"
              onChangeText={setCallContact}
              value={callContact}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              handleSaveSettings();
            }}
            style={{ marginTop: 80, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#000000', padding: 15, borderRadius: 10 }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontFamily: 'Ubuntu-Light' }}>
              Save Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SOSAlertSettings;

const styles = StyleSheet.create({});
