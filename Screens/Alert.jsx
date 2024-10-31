/* eslint-disable react-native/no-inline-styles */
import {
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    Linking,
    Platform
} from 'react-native';
import React from 'react';
import HeaderTab from './HeaderTab';
import LottieView from 'lottie-react-native';
import { AlertCircle, Navigation } from 'lucide-react-native';

const Alert = (props) => {

    const {data} = props.route.params;
    // Sample coordinates (you would replace these with actual coordinates)
    const currentLocation = {
        latitude: data.latitude,
        longitude: data.longitude,
    };

    const sosLocation = {
        latitude: data.alertData.latitude,
        longitude: data.alertData.longitude,
    };

    const openMapsWithNavigation = async (sourceLat, sourceLong, destLat, destLong) => {
        // Google Maps URL format
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${sourceLat},${sourceLong}&destination=${destLat},${destLong}&travelmode=driving`;

        // Apple Maps URL format (for iOS)
        const appleMapsUrl = `maps://app?saddr=${sourceLat},${sourceLong}&daddr=${destLat},${destLong}`;

        try {
            // Check if Google Maps is installed (primarily for Android)
            const googleMapsUrlEncoded = encodeURI(`google.navigation:q=${destLat},${destLong}`);

            if (Platform.OS === 'android') {
                // Try to open Google Maps first
                const isGoogleMapsInstalled = await Linking.canOpenURL(googleMapsUrlEncoded);

                if (isGoogleMapsInstalled) {
                    await Linking.openURL(googleMapsUrlEncoded);
                } else {
                    // If Google Maps is not installed, open in browser
                    await Linking.openURL(googleMapsUrl);
                }
            } else {
                // For iOS, try Apple Maps first, then fall back to Google Maps in browser
                const isAppleMapsInstalled = await Linking.canOpenURL(appleMapsUrl);

                if (isAppleMapsInstalled) {
                    await Linking.openURL(appleMapsUrl);
                } else {
                    await Linking.openURL(googleMapsUrl);
                }
            }
        } catch (error) {
            console.error('Error opening maps:', error);
            // Fallback to browser version
            await Linking.openURL(googleMapsUrl);
        }
    };

    const handleNavigatePress = () => {
        openMapsWithNavigation(
            currentLocation.latitude,
            currentLocation.longitude,
            sosLocation.latitude,
            sosLocation.longitude
        );
    };

    return (
        <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
            <HeaderTab />

            <View style={{ marginTop: 50 }}>
                <View style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    backgroundColor: '#FFE3E3',
                    borderRadius: 100,
                    padding: 13,
                }}>
                    <AlertCircle size={50} color={'red'} />
                </View>

                <View style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        fontSize: 20,
                        color: '#000000',
                        fontFamily: 'Ubuntu-Bold',
                        textAlign: 'center',
                        marginTop: 40,
                    }}>
                        Someone Near You is in Danger
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#000000',
                        fontFamily: 'Ubuntu-Light',
                        textAlign: 'center',
                        marginTop: 10,
                    }}>
                        They have triggered an SOS Alert
                    </Text>

                    <LottieView
                        source={require('../Screens/Assets/Pulse.json')}
                        speed={5}
                        autoPlay
                        loop
                        style={{
                            width: 200,
                            height: 200,
                            marginTop: 15,
                        }}
                    />
                    {/* <LottieView
                        source={require('../Screens/Assets/Pulse.json')}
                        speed={1.5}
                        autoPlay
                        loop
                        style={{
                            width: 200,
                            height: 200,
                            zIndex:10,
                            position: 'absolute',
                            marginTop: 0,
                            top:110
                        }}
                    /> */}

                    <Text style={{
                        fontSize: 13,
                        color: '#000000',
                        fontFamily: 'Ubuntu-Light',
                        textAlign: 'center',
                        marginTop: 150,
                    }}>
                        Click on the Button Below to Navigate to the SOS Alert Point
                    </Text>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#F95454',
                            borderRadius: 10,
                            width: 350,
                            height: 50,
                            marginTop: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={handleNavigatePress}
                    >
                        <Navigation size={25} color={'#FFFFFF'} />
                        <Text style={{
                            fontSize: 16,
                            color: '#FFFFFF',
                            fontFamily: 'Ubuntu-Regular',
                            textAlign: 'center',
                            marginLeft: 10,
                        }}>
                            Navigate to Alert Location
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Alert;
