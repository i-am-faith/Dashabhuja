/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
    Linking
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import HeaderTab from './HeaderTab';

const Checkout = ({ route }) => {
    const { item } = route.params;
    const { userdata } = route.params;
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pincode: '',
        address: '',
        email: userdata.email,
    });

    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        pincode: '',
        address: '',
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            phone: '',
            pincode: '',
            address: '',
        };

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Enter a valid 10-digit phone number';
            isValid = false;
        }

        // Pincode validation
        if (!formData.pincode.trim()) {
            newErrors.pincode = 'PIN code is required';
            isValid = false;
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Enter a valid 6-digit PIN code';
            isValid = false;
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleProceedToPayment = () => {
        if (validateForm()) {
            ToastAndroid.show('Proceeding to payment...', ToastAndroid.SHORT);
    
            // UPI payment details
            const upiId = '6289368650@ybl';
            const amount = item.price+40+.00;
            const name = 'Dashabhuja Admin'; // Optional
            const transactionRef = `TXN${Date.now()}`; // Unique transaction ID
    
            // Construct the UPI URL scheme
            const upiURL = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tr=${transactionRef}`;
    
            // Add listener to detect when app is opened with the response
            Linking.addEventListener('url', handleUPIResponse);
    
            // Open UPI payment app
            Linking.openURL(upiURL)
                .catch((err) => {
                    ToastAndroid.show('Unable to open UPI app. Please check your UPI setup.', ToastAndroid.SHORT);
                });
                navigation.navigate('Payment', {
                    orderDetails: {
                        item,
                        shippingDetails: formData,
                        userdata,
                    },
                });
        } else {
            ToastAndroid.show('Please fill all required fields correctly', ToastAndroid.SHORT);
        }
    };
    
    // Function to handle UPI response
    const handleUPIResponse = (event) => {
        const { url } = event;
    
        // Parse URL to get transaction details
        const response = new URLSearchParams(url.split('?')[1]);
        const status = response.get('Status');  // "SUCCESS", "FAILURE", or "SUBMITTED"
        const txnId = response.get('txnId');    // Transaction ID, if available
        const responseCode = response.get('responseCode'); // UPI response code, if available
    
        // Remove listener once response is received
        Linking.removeEventListener('url', handleUPIResponse);
        console.log('UPI Response:', status, txnId, responseCode);
        if (status === 'SUCCESS') {
            ToastAndroid.show('Payment successful!', ToastAndroid.SHORT);
            // Navigate to Payment page with order details
            navigation.navigate('Payment', {
                orderDetails: {
                    item,
                    shippingDetails: formData,
                    userdata,
                },
                transactionId: txnId,
            });
        } else if (status === 'FAILURE') {
            ToastAndroid.show('Payment failed. Please try again.', ToastAndroid.SHORT);
            navigation.navigate('Payment', {
                orderDetails: {
                    item,
                    shippingDetails: formData,
                    userdata,
                },
                transactionId: txnId,
            });
        } else {
            ToastAndroid.show('Payment status: Pending.', ToastAndroid.SHORT);
            navigation.navigate('Payment', {
                orderDetails: {
                    item,
                    shippingDetails: formData,
                    userdata,
                },
                transactionId: txnId,
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <HeaderTab />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Product Summary Section */}
                <View style={styles.productCard}>
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.productImage}
                    />
                    <View style={styles.productDetails}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={{ ...styles.productName, fontWeight: 'normal', fontSize: 14 }}>{item.description}</Text>
                        <Text style={styles.productPrice}>Price - ₹{item.price}</Text>
                    </View>
                </View>

                {/* Delivery Information Section */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Delivery Information</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            placeholder="Enter your full name"
                            placeholderTextColor={'#999999'}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={[styles.input, errors.phone && styles.inputError]}
                            placeholder="Enter 10-digit phone number"
                            placeholderTextColor={'#999999'}
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        />
                        {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PIN Code</Text>
                        <TextInput
                            style={[styles.input, errors.pincode && styles.inputError]}
                            placeholder="Enter 6-digit PIN code"
                            placeholderTextColor={'#999999'}
                            keyboardType="numeric"
                            maxLength={6}
                            value={formData.pincode}
                            onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                        />
                        {errors.pincode ? <Text style={styles.errorText}>{errors.pincode}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Delivery Address</Text>
                        <TextInput
                            style={[styles.input, styles.addressInput, errors.address && styles.inputError]}
                            placeholder="Enter your complete address"
                            placeholderTextColor={'#999999'}
                            multiline
                            numberOfLines={4}
                            value={formData.address}
                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                        />
                        {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
                    </View>
                </View>
                {/* Order Summary Section */}
                <View style={styles.summarySection}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Item Total</Text>
                        <Text style={styles.summaryValue}>₹{item.price}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                        <Text style={styles.summaryValue}>₹40</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>₹{Number(item.price) + 40}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.paymentButton}
                    onPress={handleProceedToPayment}
                >
                    <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding:4
    },
    scrollContent: {
        padding: 16,
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: '100%',
        height: 380,
        borderRadius: 8,
        marginBottom: 10
    },
    productDetails: {
        marginLeft: 12,
        flex: 1,
        fontFamily: 'Ubuntu-Light',
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
        fontFamily: 'Ubuntu-Regular',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#E90074',
        fontFamily: 'Ubuntu-Regular',
    },
    formSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 16,
        fontFamily: 'Ubuntu-Regular',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Ubuntu-Regular',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontFamily: 'Ubuntu-Light',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Ubuntu-Light',
    },
    addressInput: {
        height: 100,
        textAlignVertical: 'top',
        fontFamily: 'Ubuntu-Light',
    },
    summarySection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Ubuntu-Light',
    },
    summaryValue: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
        fontFamily: 'Ubuntu-Light',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        fontFamily: 'Ubuntu-Regular',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        fontFamily: 'Ubuntu-Regular',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#E90074',
        fontFamily: 'Ubuntu-Regular',
    },
    paymentButton: {
        backgroundColor: '#E90074',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 32,
    },
    paymentButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Ubuntu-Regular',
    },
});

export default Checkout;
