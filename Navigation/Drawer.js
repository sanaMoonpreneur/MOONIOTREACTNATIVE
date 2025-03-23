import { createDrawerNavigator, NavigationContainer } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from "@expo/vector-icons";
import HomeNew from '../Screens/Home';
import ChooseHardware from '../Screens/ChooseHardware';
import Profile from '../Screens/Profile';
import PrivacyPolicy from '../Screens/PrivacyPolicy';
import CustomDrawer from '../Components/CustomDrawer';
import Settings from '../Screens/Settings';
import FAQScreen from '../Screens/FAQ';
import AboutUsScreen from '../Screens/AboutUs';

const Drawer = createDrawerNavigator();

export default function DrawerScreen() {

    return (

        <Drawer.Navigator initialRouteName='Home' drawerContent={(props) => <CustomDrawer{...props} />}
            screenOptions={{
                drawerActiveBackgroundColor: '#f58084', drawerActiveTintColor: 'white',
                drawerInactiveTintColor: '#f58084', drawerLabelStyle: { marginLeft: -25, fontWeight: "bold", }
            }}
        >
            <Drawer.Screen name="Home" component={HomeNew} initialParams={{ initialRoute: true }} options={{
                headerShown: false,
                drawerIcon: ({ color }) => (<MaterialIcons name="home" size={24} color={color} />)
            }}></Drawer.Screen>
            <Drawer.Screen name="Add Device" component={ChooseHardware} options={{
                headerShown: false,
                drawerIcon: ({ color }) => (<MaterialIcons name="devices" size={24} color={color} />)
            }}></Drawer.Screen>
            <Drawer.Screen name="Settings" component={Settings} options={{
                headerShown: false,
                drawerIcon: ({ color }) => (<MaterialIcons name="settings" size={24} color={color} />)
            }}></Drawer.Screen>
            <Drawer.Screen name="Profile" component={Profile} options={{
                headerShown: false,
                drawerIcon: ({ color }) => (<MaterialIcons name="person" size={24} color={color} />)
            }}></Drawer.Screen>
            <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
                headerShown: false,
                drawerIcon: ({ color }) => (<MaterialIcons name="security" size={24} color={color} />)
            }}></Drawer.Screen>
            <Drawer.Screen name="FAQ" component={FAQScreen} options={{
                headerShown: false,
                drawerIcon: ({ color }) => (<MaterialIcons name="quiz" size={24} color={color} />)
            }}></Drawer.Screen>
            <Drawer.Screen name="AboutUs" component={AboutUsScreen} options={{
                headerShown: false,
                drawerIcon: ({ color }) => (<MaterialIcons name="info" size={24} color={color} />)
            }}></Drawer.Screen>


        </Drawer.Navigator>

    )
}
