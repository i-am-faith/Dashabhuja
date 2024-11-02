/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// Footprints.js
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StatusBar,
    Animated,
    Dimensions,
    ToastAndroid,
    Platform,
    Share,
    ScrollView,
    Alert,
    Linking,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Search, MapPin, X, ChevronRight } from 'lucide-react-native';
import HeaderTab from './HeaderTab';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import LottieView from 'lottie-react-native';

const { height } = Dimensions.get('window');
Mapbox.setAccessToken('sk.eyJ1Ijoic2lkZC1teXNlbGYiLCJhIjoiY20yd2Y5cXpuMDV4czJrczlpbjRvdDF6dyJ9.S9THkA9uH25A-ZsGFfj06Q');

const Footprints = (props) => {
    const { userdata } = props.route.params;
    const [currentLocation, setCurrentLocation] = useState(null);
    const [destination, setDestination] = useState('');
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [route, setRoute] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [slideAnim] = useState(new Animated.Value(height));
    const greetingText = 'Where would you like to go?';
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setCurrentLocation([userdata.longitude, userdata.latitude]);
    }, [userdata]);

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            setDisplayedText((prev) => prev + greetingText[i]);
            i++;
            if (i >= greetingText.length) { clearInterval(typingInterval); }
        }, 50); // Adjust typing speed here
        return () => clearInterval(typingInterval);
    }, []);

    useEffect(() => {
        if (showMap) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    }, [showMap, slideAnim]);

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    const searchLocation = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=sk.eyJ1Ijoic2lkZC1teXNlbGYiLCJhIjoiY20yd2Y5cXpuMDV4czJrczlpbjRvdDF6dyJ9.S9THkA9uH25A-ZsGFfj06Q`
            );
            const data = await response.json();
            setSearchResults(data.features);
        } catch (error) {
            console.error('Error searching location:', error);
        }
    };

    const selectDestination = async (feature) => {
        setDestination(feature.place_name);
        setDestinationCoords(feature.center);
        setSearchResults([]);
        getRoute(feature.center);
        try {
            const startPoint = {
                latitude: userdata.latitude,
                longitude: userdata.longitude,
            };
            const endPoint = {
                latitude: feature.center[1],
                longitude: feature.center[0],
            };
            const response = await axios.post('https://siddharthapro.in/app4/api/v1/user/initialize-journey', { email: userdata.email, startPoint, endPoint });
            console.log('Initialize journey response:', response.data);
        } catch (error) {
            console.log('Error initializing journey:', error);
        }
        setShowMap(true);
    };

    const getRoute = async (destCoords) => {
        if (!currentLocation) { return; }
        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${currentLocation[0]},${currentLocation[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=sk.eyJ1Ijoic2lkZC1teXNlbGYiLCJhIjoiY20yd2Y5cXpuMDV4czJrczlpbjRvdDF6dyJ9.S9THkA9uH25A-ZsGFfj06Q`
            );
            const data = await response.json();
            setRoute(data.routes[0].geometry);
        } catch (error) {
            console.error('Error getting route:', error);
        }
    };

    const clearDestination = () => {
        setDestination('');
        setSearchResults([]);
    };

    const fetchCurrentLocation = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                );
            });

            const { latitude, longitude } = position.coords;
            console.log('Location found in footprints:', latitude, longitude);

            Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
                'Updating location...',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
            );

            try {
                const response = await axios.post(
                    'https://siddharthapro.in/app4/api/v1/user/update-recent-location',
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

            try {
                const coordinates = {
                    latitude,
                    longitude,
                }
                const response = await axios.post('https://siddharthapro.in/app4/api/v1/user/set-footprint', { email: userdata.email, coordinates });
                console.log('Set footprint response:', response.data);
                Platform.OS === 'android' && ToastAndroid.showWithGravityAndOffset(
                    'Footprint saved successfully',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                )
            } catch (error) {
                console.log('Error saving footprint:', error);
            }
            //   setCurrentLocation([latitude, longitude]);
            setCurrentLocation([longitude, latitude]);
        } catch (error) {
            console.log('Error getting location:', error);
        }
    };//TODO: SetTimeOut to Check Alert Status

    useEffect(() => {
        let interval = null;
        if (destination) {
            interval = setInterval(() => {
                fetchCurrentLocation();
            }, 40000);
        }
        return () => clearInterval(interval);
    }, [destination]);

    //TODO:
    const handleShareLinkwithOtherApps = async () => {
        try {
            const url = 'https://dashabhuja.vercel.app/get-footprints/  ' + userdata.email;
            const supported = await Linking.canOpenURL(url);

            console.log('Attempting to open URL:', url); // Debug log

            if (supported) {
                await Linking.openURL(url);
                console.log('URL opened successfully'); // Debug log
            } else {
                console.log('URL not supported'); // Debug log
                Alert.alert(
                    'Error',
                    "Don't know how to open this URL: " + url
                );
            }
        } catch (error) {
            console.error('Error opening URL:', error); // Debug log
            Alert.alert(
                'Error',
                'An error occurred while opening the link: ' + error.message
            );
        }
    };
    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#FFFFFF', padding: 4 }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <HeaderTab />
            {/* <ScrollView></ScrollView> */}
            {
                !showMap && (<ScrollView>

                    <View style={{ backgroundColor: '#fff', zIndex: 1 }}>
                        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
                            {/* Main prompt */}
                            <View>
                                <LottieView source={require('../Screens/Assets/Maps.json')} autoPlay loop style={{ width: 200, height: 200, alignSelf: 'center' }} />
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: 24, color: '#000000', fontFamily: 'Ubuntu-Bold', marginBottom: 10 }}>
                                    {displayedText}
                                </Text>
                                <Text style={{ fontSize: 16, marginBottom: 22, color: '#444', fontFamily: 'Ubuntu-Light' }}>
                                    Your journey matters, your safety is essential, and we're with you every step of the way. Travel confidently knowing that we're watching over you.
                                </Text>
                            </View>

                            {/* Input field with MapPin icon */}
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f5',
                                borderRadius: 12, paddingHorizontal: 15, height: 50, shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2,
                            }}>
                                <View style={{ marginRight: 12 }}>
                                    <MapPin size={24} color="#000000" />
                                </View>
                                <TextInput
                                    placeholder="Enter your destination"
                                    placeholderTextColor="#888"
                                    value={destination}
                                    onChangeText={(text) => {
                                        setDestination(text);
                                        searchLocation(text);
                                    }}
                                    style={{ flex: 1, color: '#000000', fontSize: 16, height: '100%' }}
                                />
                                {destination !== '' && (
                                    <TouchableOpacity
                                        style={{ padding: 8 }}
                                        onPress={clearDestination}
                                    >
                                        <X size={20} color="#888" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        {searchResults.length > 0 && (
                            <View style={{ marginTop: 8, backgroundColor: '#fff', borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
                                {searchResults.map((result) => (
                                    <TouchableOpacity
                                        key={result.id}
                                        style={{ paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                                        onPress={() => selectDestination(result)}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Search size={20} color="#888" style={{ marginRight: 12 }} />
                                            <View style={{ flex: 1, marginRight: 12 }}>
                                                <Text style={{ fontSize: 16, color: '#000000', fontWeight: '500' }}>
                                                    {result.text}
                                                </Text>
                                                <Text style={{ fontSize: 14, color: '#666666', marginTop: 2 }}>
                                                    {result.place_name}
                                                </Text>
                                            </View>
                                            <ChevronRight size={20} color="#888" />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>)
            }

            {showMap && (
                <>
                    <Mapbox.MapView
                        style={{ flex: 1 }}
                        styleURL={Mapbox.StyleURL.Street}
                    >
                        {currentLocation && (
                            <Mapbox.PointAnnotation
                                key="currentLocation"
                                id="currentLocation"
                                coordinate={currentLocation}
                            >
                                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#007AFF', borderWidth: 3, borderColor: '#FFFFFF' }} />
                            </Mapbox.PointAnnotation>
                        )}

                        {destinationCoords && (
                            <Mapbox.PointAnnotation
                                id="destination"
                                coordinate={destinationCoords}
                            >
                                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#FF3B30', borderWidth: 3, borderColor: '#FFFFFF' }} />
                            </Mapbox.PointAnnotation>
                        )}

                        {route && (
                            <Mapbox.ShapeSource id="routeSource" shape={route}>
                                <Mapbox.LineLayer
                                    id="routeLine"
                                    style={{ lineColor: '#007AFF', lineWidth: 4, lineCap: 'round', lineJoin: 'round' }}
                                />
                            </Mapbox.ShapeSource>
                        )}

                        {currentLocation && (
                            <Mapbox.Camera
                                zoomLevel={14}
                                centerCoordinate={currentLocation}
                            />
                        )}
                    </Mapbox.MapView>

                    <View style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        right: 20,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for overlay effect
                        borderRadius: 12,
                        padding: 16,
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 18,
                            color: '#ffffff',
                            fontFamily: 'Ubuntu-Bold',
                            textAlign: 'center',
                            marginBottom: 6
                        }}>
                            Have a Safe Journey {'\n'} We will Keep Updating Footprints
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#d1d1d1',
                            fontFamily: 'Ubuntu-Regular',
                            textAlign: 'center',
                            marginBottom: 12
                        }}>
                            Click the button below to share a link with your friends to track your journey in real time.
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#007AFF', // Bright blue for visibility
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 20,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                                elevation: 4 // For Android shadow
                            }}
                            onPress={handleShareLinkwithOtherApps}
                        >
                            <Text style={{
                                color: '#ffffff',
                                fontSize: 16,
                                fontFamily: 'Ubuntu-Bold',
                                textAlign: 'center'
                            }}>
                                Share Journey Link
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>

            )}
        </SafeAreaView>
    );
};

export default Footprints;
