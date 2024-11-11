/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Image, Alert, ScrollView } from 'react-native';
import { AlertCircle, Camera, Bell } from 'lucide-react-native';
import { pick } from 'react-native-document-picker';
import axios from 'axios';
import HeaderTab from './HeaderTab';
import LottieView from 'lottie-react-native';

export default function ReportIncidents(props) {
  const { userdata } = props.route.params;
  console.log('userdata', userdata);


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userEmail', userdata.email);
    console.log(formData);


    console.log(selectedFile);

    if (selectedFile && selectedFile.length > 0) {

      formData.append('imageIncident', {
        uri: selectedFile[0].uri,  // Ensure the URI is correct
        type: selectedFile[0].type, // e.g., 'image/jpeg'
        name: selectedFile[0].name || 'incident_image.jpg', // Fallback to a default name if fileName is undefined
      });
    }
    console.log(formData);

    try {
      const response = await axios.post('https://siddharthapro.in/app4/api/v1/incident/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      // Only show the success alert after receiving a successful response
      Alert.alert('Incident reported successfully');
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handlePickFile = async () => {
    try {
      const result = await pick({
        type: ['image/*', 'video/*'],
      });
      if (!result.canceled) {
        setSelectedFile(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', height: '100%', padding: 4 }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderTab />
      <ScrollView style={{ padding: 16 }}>
        <LottieView
          source={require('../Screens/Assets/Alert.json')}
          autoPlay
          loop
          style={{ width: '100%', height: 250, marginBottom: 16 }}
        />
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 20, marginBottom: 12, color: '#444', fontFamily: 'Ubuntu-Regular' }}>Anonymously Report Incidents</Text>
          <Text style={{ fontSize: 16, marginBottom: 22, color: '#444', fontFamily: 'Ubuntu-Light' }}>Your voice matters. By sharing incidents, you help create safer spaces and empower others with awareness. All reports can be made anonymously, and your privacy is our priority.
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 8, color: '#444', fontFamily: 'Ubuntu-Regular' }}>Title of the Report</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#e0e0e0',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: '#333',
              fontFamily: 'Ubuntu-Regular',
            }}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter report title"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, color: '#333', fontFamily: 'Ubuntu-Regular' }}>Report Description</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#e0e0e0',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              height: 100,
              textAlignVertical: 'top',
              fontFamily: 'Ubuntu-Regular',
              color: '#333',
            }}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter report description"
            multiline
            numberOfLines={4}
          />
        </View>
        {selectedFile && (
          <Image source={{ uri: selectedFile[0].uri }} style={{ width: 'auto', height: 200, marginBottom: 16, borderRadius: 8, elevation: 2 }} />
        )}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
          onPress={handlePickFile}
        >
          <Camera color="#888" size={24} />
          <Text style={{ marginLeft: 12, color: '#888', fontSize: 16 }}>Upload Image (Optional)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#ff4757',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            borderRadius: 8,
            marginBottom: 26,
          }}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <AlertCircle color="#fff" size={20} />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

