/* eslint-disable react-native/no-inline-styles */
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { PlusCircle } from 'lucide-react-native'
import HeaderTab from './HeaderTab';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const Community = (props) => {
  const { userdata } = props.route.params;
  const navigation = useNavigation();
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const getPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.29.15:3000/api/v1/community/get');
      console.log(response.data);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);
  const handleNavigatetoNewPost = () => {
    navigation.navigate('NewPost', { userdata });
  }
  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderTab />
      {
        loading ? (<>
          <View style={{ flexDirection: '', alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
            <ActivityIndicator size="large" color="#E90074" />
            <Text style={{ color: '#000000', fontSize: 16, fontFamily: 'Ubuntu-Regular', marginTop: 10 }}>
              Loading...
            </Text>
          </View>
        </>) : (<ScrollView>
          {posts.map((post) => (
            <View key={post._id} style={{ padding: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color: '#000000', fontSize: 16, fontFamily: 'Ubuntu-Regular' }}>
                  {post.title}
                </Text>
              </View>
              <Text style={{ color: '#000000', fontSize: 14, fontFamily: 'Ubuntu-Light' }}>
                {post.description}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity style={{ marginRight: 10 }}>
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={{ width: 390, height: 300, borderRadius: 8 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>)
      }
      <TouchableOpacity style={{ position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', bottom: 20, right: 20, backgroundColor: '#E90074', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 }}
        onPress={handleNavigatetoNewPost}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontFamily: 'Ubuntu-Regular', marginRight: 10 }}>
          New Post
        </Text>
        <PlusCircle color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Community

const styles = StyleSheet.create({})