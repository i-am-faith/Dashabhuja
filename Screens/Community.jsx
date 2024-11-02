/* eslint-disable react-native/no-inline-styles */
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react-native';
import HeaderTab from './HeaderTab';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Community = (props) => {
  const { userdata } = props.route.params;
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  const getPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://siddharthapro.in/app4/api/v1/community/get');
      console.log(response.data);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // Function to handle refresh action
  const onRefresh = async () => {
    setRefreshing(true);
    await getPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleNavigatetoNewPost = () => {
    navigation.navigate('NewPost', { userdata });
  };

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderTab />

      <View style={{backgroundColor:'#000000', height:1, marginTop:5}}></View>
      {
        loading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
            <ActivityIndicator size="large" color="#E90074" />
            <Text style={{ color: '#000000', fontSize: 16, fontFamily: 'Ubuntu-Regular', marginTop: 10 }}>
              Loading...
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ padding: 3 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {posts.map((post) => (
              <View key={post._id} style={{padding:7.5 ,borderBottomWidth: 1, borderBottomColor: '#DDDDDD', backgroundColor: '#FFFFFF', borderRadius:8 }}>
                <TouchableOpacity style={{ }} 
                  onPress={() => navigation.navigate('ViewPost', { post })}
                >
                  <View style={{ marginBottom: 10, justifyContent: 'center' }}>
                    <Text style={{ color: '#000000', fontSize: 18, fontFamily: 'Ubuntu-Bold' }}>
                      {post.title}
                    </Text>
                  </View>
                  <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Ubuntu-Light', }}>
                    {post.description.substring(0, 170) + "...."}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Image
                      source={{ uri: post.imageUrl }}
                      style={{ width: 390, height: 300, borderRadius: 8 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )
      }
      <TouchableOpacity
        style={{ position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 20, right: 20, backgroundColor: '#E90074', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10, elevation:8, shadowColor: "#000000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
        onPress={handleNavigatetoNewPost}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontFamily: 'Ubuntu-Regular', marginRight: 10 }}>
          New Post
        </Text>
        <PlusCircle color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({});
