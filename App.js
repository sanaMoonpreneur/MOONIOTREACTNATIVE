import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './Screens/LoginScreen';
import DeviceDetail from './Screens/DeviceDetail';
import DeviceControl from './Screens/DeviceControl';
import DeviceDetailsHelp from './Screens/DeviceDetailsHelp';
import DrawerScreen from './Navigation/Drawer';
import ChooseHardware from './Screens/ChooseHardware';
import AddDevice from './Screens/AddDevice';
import SensorControl from './Screens/SensorControl';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
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
        <Stack.Screen name="DeviceControl" component={DeviceControl} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="SensorControl" component={SensorControl} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="ChooseHardware" component={ChooseHardware} options={{ headerShown: false }}></Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  )
}