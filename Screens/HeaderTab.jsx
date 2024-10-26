/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderTab = () => {
    const navigation = useNavigation();
    const handleViewIncidents = () => {
        navigation.navigate('Incidents');
    }
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: '#FFFFFF' }}>
                <Text style={{ color: '#E90074', fontSize: 24, fontFamily: 'Samarkan' }}>
                    Dashabhuja
                </Text>
                <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Ubuntu-Regular' }}>
                    Empowerment & Protection for Women
                </Text>
            </View>
            <TouchableOpacity style={{ marginLeft: 'auto', marginTop: 10 }} onPress={handleViewIncidents}>
                <Bell color="#4A4947" size={28} />
            </TouchableOpacity>
        </View>
    )
}

export default HeaderTab

const styles = StyleSheet.create({})