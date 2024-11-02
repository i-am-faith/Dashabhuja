/* eslint-disable react-native/no-inline-styles */
import { ActivityIndicator, Image, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import HeaderTab from './HeaderTab';
import { useNavigation } from '@react-navigation/native';
import { AlertTriangle } from 'lucide-react-native';

const Incidents = () => {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  const getIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://siddharthapro.in/app4/api/v1/incident/get');
      console.log(response.data);
      setIncidents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // Function to handle refresh action
  const onRefresh = async () => {
    setRefreshing(true);
    await getIncidents();
    setRefreshing(false);
  };

  useEffect(() => {
    getIncidents();
  }, []);

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderTab />

      <View style={{ backgroundColor: '#000000', height: 1, marginTop: 5 }}></View>
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
            {incidents.map((incident) => (
              <View key={incident._id} style={{
                padding: 10,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                marginVertical: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: '#FFF',
                  }}
                  onPress={() => navigation.navigate('ViewPost', { post:incident })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AlertTriangle color="#E90074" size={28} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{
                        color: '#000000',
                        fontSize: 18,
                        fontFamily: 'Ubuntu-Bold',
                        marginBottom: 4,
                      }}>
                        New Incident Reported: {incident.title}
                      </Text>
                      <Text style={{
                        color: '#606060',
                        fontSize: 14,
                        fontFamily: 'Ubuntu-Light',
                        marginTop: 2,
                      }}
                        numberOfLines={7} // Limits description to 2 lines
                        ellipsizeMode="tail" // Adds ellipsis if text exceeds 2 lines
                      >
                        {incident.description}
                      </Text>
                    </View>
                  </View>

                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: 10,
                  }}>
                    <Text style={{
                      color: '#909090',
                      fontSize: 12,
                      fontFamily: 'Ubuntu-Light',
                    }}>
                      {new Date(incident.reportedDate).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }).replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/g, '$3-$2-$1 $4:$5')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )
      }
    </SafeAreaView>
  )
}

export default Incidents

const styles = StyleSheet.create({})