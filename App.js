import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp from './Screens/SignUp';
import SignIn from './Screens/Signin';
import LoginScreen from './Screens/LoginScreen';
import DeviceList from './Screens/DeviceList';
import DeviceDetail from './Screens/DeviceDetail';
import DC1 from './Screens/DC1';
import DeviceDetailsHelp from './Screens/DeviceDetailsHelp';
import DrawerScreen from './Navigation/Drawer';
import ChooseHardware from './Screens/ChooseHardware';
import AddDevice from './Screens/AddDevice';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
        if (storedLoginResponse) {
          const parsedResponse = JSON.parse(storedLoginResponse);
          const newToken = parsedResponse.result[0].token;
          setTokenExist(true)
        }
      } catch (error) {
        // console.error('Error retrieving token from AsyncStorage:', error);
      }
    };

    fetchToken();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        {/* <Stack.Screen name="SignUp" component={SignUp}></Stack.Screen>
          <Stack.Screen name="SignIn" component={SignIn}></Stack.Screen> */}
        <Stack.Screen name="LogIn" component={LoginScreen} options={{
          title: "LogIn",
          headerShown: false,
        }}></Stack.Screen>
        <Stack.Screen name="AddDevice" component={AddDevice} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="DeviceDetail" component={DeviceDetail} options={{
          title: "DeviceDetail",
          headerShown: false,
        }}></Stack.Screen>
        <Stack.Screen name="DeviceDetailsHelp" component={DeviceDetailsHelp} options={{
          title: "DeviceDetailsHelp",
          headerShown: false,
        }}></Stack.Screen>
        <Stack.Screen name="Drawer" component={DrawerScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="DC1" component={DC1} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="ChooseHardware" component={ChooseHardware} options={{ headerShown: false }}></Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  )
}