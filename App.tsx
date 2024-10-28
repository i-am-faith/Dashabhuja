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

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }}/>
        <Stack.Screen name="Splash" component={Splash}  options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup}  options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }}/>
        <Stack.Screen name="ReportingIncidents" component={ReportIncidents}  options={{ headerShown: false }}/>
        <Stack.Screen name="SOSAlertSettings" component={SOSAlertSettings} options={{ headerShown: false }} />
        <Stack.Screen name="Shop" component={Shop} options={{ headerShown: false }} />
        <Stack.Screen name="Community" component={Community} options={{ headerShown: false }} />
        <Stack.Screen name="NewPost" component={NewPost} options={{ headerShown: false }} />
        <Stack.Screen name="Incidents" component={Incidents} options={{ headerShown: false }} />
        <Stack.Screen name="ViewPost" component={ViewPost} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
