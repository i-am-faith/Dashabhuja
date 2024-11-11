/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { BackHandler, SafeAreaView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import HeaderTab from './HeaderTab';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Payment = ({route}) => {
    const {orderDetails} = route.params;
    const userdata = orderDetails.userdata;
    const navigation = useNavigation();

    const address = `Name- ${orderDetails.shippingDetails.name}\nPhone- ${orderDetails.shippingDetails.phone}\nContact Email- ${orderDetails.shippingDetails.email}\nAddress- ${orderDetails.shippingDetails.address}, \nPIN CODE- ${orderDetails.shippingDetails.pincode}`;
    const product = orderDetails.item._id;
    const sellerEmail = orderDetails.item.sellerEmail;
    const buyerEmail = orderDetails.shippingDetails.email;

    const handleBackPress = () => {
        navigation.navigate('Home', { userdata });
        return true;
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, [navigation]);

    const createOrder = async () => {
        try{
            ToastAndroid.show('Creating order...', ToastAndroid.SHORT);
            const response = await axios.post('https://siddharthapro.in/app4/api/v1/commerce/create-order', {
                buyerEmail: buyerEmail,
                sellerEmail: sellerEmail,
                product: product,
                address: address,
            })
            ToastAndroid.show('Order created successfully', ToastAndroid.SHORT);
        }
        catch(error){
            console.log(error);
        }
    };

    useEffect(() => {
        createOrder();
    });

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            padding: 16
        }}>
            <HeaderTab />
            
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20
            }}>
                <View style={{
                    width: '100%',
                    maxWidth: 400,
                    alignItems: 'center'
                }}>
                    <LottieView
                        autoPlay
                        loop
                        source={require('../Screens/Assets/Success.json')}
                        style={{
                            width: 200,
                            height: 200,
                            marginBottom: 30
                        }}
                        speed={0.4}
                    />
                    
                    <Text style={{
                        color: '#000000',
                        fontSize: 24,
                        fontFamily: 'Ubuntu-Bold',
                        marginBottom: 16,
                        textAlign: 'center'
                    }}>
                        Order Placed Successfully!
                    </Text>

                    <View style={{
                        backgroundColor: '#F8F9FA',
                        padding: 16,
                        borderRadius: 12,
                        width: '100%',
                        marginBottom: 24
                    }}>
                        <Text style={{
                            color: '#6C757D',
                            fontSize: 16,
                            textAlign: 'center',
                            lineHeight: 24
                        }}>
                            Order details have been sent to{'\n'}
                            <Text style={{
                                color: '#E90074',
                                fontFamily: 'Ubuntu-Bold'
                            }}>
                                {orderDetails.shippingDetails.email}
                            </Text>
                        </Text>
                    </View>

                    <TouchableOpacity 
                        style={{
                            backgroundColor: '#E90074',
                            borderRadius: 12,
                            paddingVertical: 16,
                            paddingHorizontal: 32,
                            width: '100%',
                            alignItems: 'center',
                            elevation: 2
                        }}
                        onPress={() => navigation.navigate('Home', { userdata })}
                    >
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            fontFamily: 'Ubuntu-Bold'
                        }}>
                            Back to Home
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Payment;