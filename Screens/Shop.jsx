/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import slideImage from '../assets/women_shop.png';
import HeaderTab from './HeaderTab';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

const Shop = (props) => {
    const { userdata } = props.route.params;
    const navigation = useNavigation();
    const [showLoad, setShowLoad] = useState(false);
    const [serverResponse, setServerResponse] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const handleBuyNow = item => {
        ToastAndroid.show('Processing your order...', ToastAndroid.SHORT);
        navigation.navigate('Checkout', { item, userdata });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            setShowLoad(true);
            const response = await axios.get(
                'https://siddharthapro.in/app4/api/v1/commerce/get-products',
            );
            setServerResponse(response.data);
            setShowLoad(false);
        } catch (error) {
            console.error('Error:', error);
            ToastAndroid.show('Failed to load products', ToastAndroid.SHORT);
            setShowLoad(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 4 }}>
            <HeaderTab />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="always"
            >
                <Image
                    source={slideImage}
                    style={{
                        width: '100%',
                        height: 200,
                        resizeMode: 'cover',
                    }}
                />
                {showLoad ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 100,
                        }}
                    >
                        <ActivityIndicator size="large" color="#0066CC" />
                        <Text
                            style={{
                                marginTop: 12,
                                fontSize: 16,
                                color: '#666',
                                fontFamily: 'System',
                            }}
                        >
                            Discovering amazing products for you...
                        </Text>
                    </View>
                ) : (
                    <View style={{ padding: 12 }}>
                        {Object.keys(serverResponse).map(key => {
                            const item = serverResponse[key];
                            const limitedDescription = item.description.length > 120
                                ? item.description.substring(0, 120) + '...'
                                : item.description;
                            return (
                                <View
                                    key={key}
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 12,
                                        marginBottom: 16,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={{
                                            width: '100%',
                                            height: 380,
                                            resizeMode: 'cover',
                                        }}
                                    />
                                    <View
                                        style={{
                                            padding: 16,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: '600',
                                                color: '#1A1A1A',
                                                marginBottom: 8,
                                                fontFamily: 'Ubuntu-Bold',
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: '#666666',
                                                lineHeight: 20,
                                                marginBottom: 16,
                                                fontFamily: 'Ubuntu-Regular',
                                            }}
                                        >
                                            {limitedDescription}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    fontWeight: '700',
                                                    color: '#1A1A1A',
                                                    fontFamily: 'System',
                                                }}
                                            >
                                                ₹{item.price}
                                            </Text>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#E90074',
                                                    paddingHorizontal: 24,
                                                    paddingVertical: 12,
                                                    borderRadius: 8,
                                                }}
                                                onPress={() => handleBuyNow(item)}
                                            >
                                                <Text
                                                    style={{
                                                        color: '#FFFFFF',
                                                        fontSize: 16,
                                                        fontWeight: '600',
                                                        fontFamily: 'System',
                                                    }}
                                                >
                                                    Buy Now
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Shop;
