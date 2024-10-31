/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, StatusBar, StyleSheet, Text, Alert, Linking, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderTab from './HeaderTab';

const Yoga = () => {
  const [redirectStatus, setRedirectStatus] = useState('Initializing...');

  useEffect(() => {
    const openInBrowser = async () => {
      const url = 'https://streamlit.siddharthapro.in/';
      
      setRedirectStatus('Checking URL support...');
      console.log('Attempting to open URL:', url);

      try {
        // Check if the URL can be opened
        const supported = await Linking.canOpenURL(url);
        console.log('URL supported:', supported);
        
        if (supported) {
          setRedirectStatus('Opening URL...');
          
          // Add a small delay to ensure state updates are visible
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const result = await Linking.openURL(url);
          console.log('Linking.openURL result:', result);
          setRedirectStatus('URL opened successfully');
        } else {
          const errorMessage = 'URL format not supported';
          console.log('Error:', errorMessage, url);
          setRedirectStatus('Error: URL not supported');
          Alert.alert(
            'Error',
            'Cannot open the link. The browser might not support this URL format.',
            [{ text: 'OK', onPress: () => console.log('Alert closed') }]
          );
        }
      } catch (error) {
        console.log('Detailed error:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        
        setRedirectStatus('Error occurred');
        Alert.alert(
          'Error',
          `Failed to open link: ${error.message}`,
          [{ text: 'OK', onPress: () => console.log('Error alert closed') }]
        );
      }
    };

    // Add a small delay before attempting to open the URL
    setTimeout(() => {
      openInBrowser();
    }, 1000);

    return () => {
      // Cleanup if needed
      setRedirectStatus('Cleanup');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <HeaderTab />
      <Text style={styles.statusText}>
        {redirectStatus}
      </Text>
      <Text style={styles.redirectText}>
        Redirecting to the yoga live feed in your browser...
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Ubuntu-Light',
    marginTop: 50,
  },
  redirectText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Ubuntu-Light',
    marginTop: 10,
  },
});

export default Yoga;