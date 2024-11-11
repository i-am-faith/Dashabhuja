import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from './Screens/Home';
import SOSAlertSettings from './Screens/SOSAlertSettings';
import Splash from './Screens/Splash';
import Signup from './Screens/Signup';
import Login from './Screens/Login';
import ReportIncidents from './Screens/ReportIncidents';
import Shop from './Screens/Shop';
import Community from './Screens/Community';
import NewPost from './Screens/NewPost';
import Incidents from './Screens/Incidents';
import ViewPost from './Screens/ViewPost';
import Alert from './Screens/Alert';
import Yoga from './Screens/Yoga';
import Footprints from './Screens/Footprints';
import Checkout from './Screens/Checkout';
import Payment from './Screens/Payment';
import { Appearance } from 'react-native';


const Stack = createStackNavigator();

const App = () => {
  const colorScheme = Appearance.getColorScheme();
  console.log(colorScheme);
  if(colorScheme === 'dark'){
    Appearance.setColorScheme('light');
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={Splash}  options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup}  options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }}/>
        <Stack.Screen name="ReportingIncidents" component={ReportIncidents}  options={{ headerShown: false }}/>
        <Stack.Screen name="SOSAlertSettings" component={SOSAlertSettings} options={{ headerShown: false }} />
        <Stack.Screen name="Shop" component={Shop} options={{ headerShown: false }} />
        <Stack.Screen name="Community" component={Community} options={{ headerShown: false }} />
        <Stack.Screen name="NewPost" component={NewPost} options={{ headerShown: false }} />
        <Stack.Screen name="Incidents" component={Incidents} options={{ headerShown: false }} />
        <Stack.Screen name="ViewPost" component={ViewPost} options={{ headerShown: false }} />
        <Stack.Screen name="Alert" component={Alert} options={{ headerShown: false }} />
        <Stack.Screen name="Yoga" component={Yoga} options={{ headerShown: false }} />
        <Stack.Screen name="Footprints" component={Footprints} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
        <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
