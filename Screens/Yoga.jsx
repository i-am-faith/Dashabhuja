import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import {
  Camera,
  ActivitySquare,
  Shield,
  Award,
  ChevronRight,
  Play,
  Users,
  Clock
} from 'lucide-react-native';
import HeaderTab from './HeaderTab';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon: Icon, title, description }) => (
  <View style={styles.card}>
    <Icon size={48} color="#E90074" style={styles.cardIcon} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </View>
);

const StatBox = ({ icon: Icon, number, label }) => (
  <View style={styles.statBox}>
    <Icon size={48} color="#FFFFFF" style={styles.statIcon} />
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Yoga = () => {
  const features = [
    {
      icon: Camera,
      title: 'Real-Time Analysis',
      description: 'Get instant feedback on your poses using advanced AI technology'
    },
    {
      icon: Shield,
      title: 'Safe Practice',
      description: 'Prevent injuries with real-time posture correction and alerts'
    },
  ];

  const openLink = async () => {
    try {
      const url = 'https://dasabhuja.streamlit.app/';
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
    <SafeAreaView style={styles.container}>
        <HeaderTab />
      <ScrollView>
        {/* Hero Section */}
        <View style={styles.hero}>
          <LottieView 
            source={require('../Screens/Assets/Yoga.json')} 
            autoPlay 
            loop 
            style={{ width: 400, height: 400 }} 
          />
          <Text style={{ ...styles.heroTitle, fontFamily: 'Ubuntu-Regular' }}>
            Perfect Your Yoga with AI
          </Text>
          <Text style={{ ...styles.heroSubtitle, fontFamily: 'Ubuntu-Light' }}>
            Get real-time pose analysis and feedback using advanced computer vision technology.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={openLink}>
            <Text style={styles.ctaButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    padding: 14,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 48,
  },
  heroTitle: {
    fontSize: 30,
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#E90074',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaIcon: {
    marginLeft: 8,
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 72) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
  },
  statsSection: {
    backgroundColor: '#7C3AED',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statBox: {
    alignItems: 'center',
    marginVertical: 16,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#E9D5FF',
  },
  ctaSection: {
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default Yoga;