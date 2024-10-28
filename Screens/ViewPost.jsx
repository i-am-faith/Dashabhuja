import { SafeAreaView, StyleSheet, Text, View, StatusBar, ScrollView, Image } from 'react-native'
import React from 'react'
import HeaderTab from './HeaderTab';

const ViewPost = (props) => {
    const { post } = props.route.params;
    console.log(post);
    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#FFFFFF' }}>
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
            <HeaderTab />
            <View style={{ backgroundColor: '#000000', height: 1, marginTop: 5 }}></View>
            <ScrollView>
                <View style={{ padding: 10 }}>
                    {post.imageUrl !== undefined && (
                        <Image source={{ uri: post.imageUrl }} style={{ width: '100%', height: 340, width: '100%', resizeMode: 'cover', borderRadius: 10 }} />
                    )}
                    <Text style={{ fontSize: 18, fontWeight: '', color: '#000000', fontFamily: 'Ubuntu-Bold', marginTop: 20, }}>{post.title}</Text>
                    <Text style={{ fontSize: 16, color: '#000000', fontFamily: 'Ubuntu-Light', marginTop: 10, }}>{post.description}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewPost

const styles = StyleSheet.create({})