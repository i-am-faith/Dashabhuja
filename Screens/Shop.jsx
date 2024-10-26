import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Shop = (props) => {
    const { userdata } = props.route.params;
    console.log('userdata', userdata);
    const navigation = useNavigation();
    const [showLoad, setShowLoad] = useState(false);


    const [serverResponse, setServerResponse] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = item => {
        console.log('Add to cart');
        ToastAndroid.show('Item added to Cart', ToastAndroid.SHORT);
        console.log(item);
        setCartItems([...cartItems, item]);
    };


    const handleOpenCart = () => {
        navigation.navigate('AddToCart', {
            cartItems: cartItems,
            userAccount: userAccount,
            user: user
        });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            setShowLoad(true);
            const response = await axios.get(
                'https://plantit-backend.onrender.com/products',
            );
            console.log(response.data);
            setServerResponse(response.data);
            setShowLoad(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <SafeAreaView>
            <StatusBar barStyle="light-content" backgroundColor="#E2F4C5" />
            <ScrollView height="100%" keyboardShouldPersistTaps="always">
                {showLoad ? (
                    <>
                        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: 'monospace',
                                color: '#000000'
                            }}
                        >
                            Getting the Best Products. . .
                        </Text>
                    </>
                ) : (
                    <>
                        {Object.keys(serverResponse).map(key => {
                            const item = serverResponse[key];
                            const limitedDescription =
                                item.description.length > 172
                                    ? item.description.substring(0, 221) + '...'
                                    : item.description;
                            return (
                                <View
                                    key={key}
                                    style={{
                                        backgroundColor: '#F7EEDD',
                                        padding: 5,
                                        height: 215,
                                        flexDirection: 'row',
                                        marginTop: 5,
                                        marginBottom: 5,
                                        borderRadius: 10
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={{
                                            minHeight: 200,
                                            minWidth: 200,
                                            borderRadius: 10,
                                            marginRight: 10,
                                            alignItems: 'center',
                                            resizeMode: 'cover'
                                        }}
                                    />
                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: 'monospace',
                                                fontSize: 18,
                                                fontWeight: '900',
                                                marginTop: 10,
                                                color: '#000000'
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'monospace',
                                                fontSize: 10,
                                                fontWeight: '800',
                                                textAlign: 'left',
                                                color: 'grey',
                                                maxWidth: 200,
                                                marginRight: 6,
                                                maxHeight: 100,
                                                minHeight: 70
                                            }}
                                            numberOfLines={6}
                                        >
                                            {limitedDescription}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'monospace',
                                                fontSize: 10,
                                                fontWeight: '800',
                                                textAlign: 'left',
                                                color: 'black',
                                                maxWidth: 200,
                                                marginRight: 6,
                                                marginTop: 10
                                            }}
                                        >
                                            Sold by - {item.seller}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'monospace',
                                                fontSize: 15,
                                                fontWeight: '800',
                                                textAlign: 'left',
                                                marginTop: 14,
                                                color: '#000000'
                                            }}
                                        >
                                            Price- {item.price}/-
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#FF204E',
                                                height: 30,
                                                borderRadius: 3,
                                                width: 190
                                            }}
                                            onPress={() => {
                                                handleAddToCart(item);
                                            }} // Assuming handleAddToCart is defined elsewhere
                                        >
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: 'monospace',
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    marginTop: 'auto',
                                                    marginBottom: 'auto'
                                                }}
                                            >
                                                Add to Cart
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Shop;
