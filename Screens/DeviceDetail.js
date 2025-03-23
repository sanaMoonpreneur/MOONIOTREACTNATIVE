import React, { useState, useEffect } from "react";
import { ImageBackground, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

const DeviceDetail = ({ navigation, route }) => {
    const { screenName, device1 } = route.params;

    const [screen, setScreen] = useState(screenName);
    const [devicesResponse, setDevicesResponse] = useState([]);
    const [token, setToken] = useState('');

    const device = screen === 'AddDevice' ? devicesResponse : device1;

    useEffect(() => {
        fetchToken();
    }, []);

    const fetchToken = async () => {
        try {
            const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
            if (storedLoginResponse) {
                const parsedResponse = JSON.parse(storedLoginResponse);
                const newToken = parsedResponse.result[0].token;
                setToken(newToken);
            }
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
        }
    };

    const copyToClipboard = (token) => {
        Clipboard.setStringAsync(token);
    };

    const handleDelete = async () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this device?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const response = await axios.post(
                                `https://test.moonr.com/LMSService/api/IOT/DeleteDeviceById?user_device_id=${device.user_device_id}`,
                                {},
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            if (response.status === 200) {
                                navigation.navigate('Drawer');
                            }
                        } catch (error) {
                            console.error('Error during device deletion:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <ImageBackground source={require('../images/chs.png')} style={styles.imageBackground}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Drawer', { screen: 'Home' })} style={styles.backButton}>
                    <Image source={require('../images/a1.png')} style={styles.backIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.deviceTitle}>{device.user_device_name}</Text>
            </View>
            <View style={styles.deviceDetailContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.deviceName}>Device Details</Text>

                    <Text style={styles.connectionType}>{device.connection_type}</Text>

                    <View style={styles.connectionStatusContainer}>
                        <View style={[styles.statusIndicator, { backgroundColor: device.device_status === "Connected" ? "green" : "red" }]} />
                        <Text style={styles.connectionType}>{device.device_status}</Text>
                    </View>

                    <Text style={styles.tokenTitle}>Device Token :</Text>
                    <View style={styles.copyClipboardView}>
                        <Text style={styles.deviceTokenText}>{device.device_token}</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(device.device_token)}>
                            <Ionicons name="copy" size={18} color="#345c74" />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity style={styles.dynamicButton} onPress={handleDelete}>
                        <Text style={styles.deleteTextStyle}>Delete Device</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.controlScreenIconStyle} onPress={() => navigation.navigate("DeviceDetailsHelp", { device })}>
                        <Ionicons name="help-outline" size={26} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.helpIconStyle} onPress={() => navigation.navigate("DeviceControl", { device, items: device1, dToken: device.device_token })}>
                        <Ionicons name="arrow-forward" size={26} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    imageBackground: { width: "100%", height: "100%" },
    headerContainer: { flexDirection: "row", width: "100%", paddingHorizontal: 20, marginTop: 20, justifyContent: 'space-between' },
    backButton: { paddingHorizontal: 10, paddingVertical: 13, borderRadius: 10, marginTop: 30, backgroundColor: "#d1a0a7" },
    backIcon: { width: 20, height: 15 },
    titleContainer: { width: '100%', height: '20%' },
    deviceTitle: { color: "white", fontSize: 35, fontWeight: "bold", textAlign: "center", marginTop: 30 },
    deviceDetailContainer: { backgroundColor: 'white', borderRadius: 40, margin: 10 },
    contentContainer: { marginTop: 20, padding: 20, borderRadius: 50, paddingHorizontal: 20 },
    deviceName: { fontSize: 25, fontWeight: "bold", color: '#345c74' },
    connectionType: { fontSize: 16, fontWeight: "400", color: '#345c74' },
    connectionStatusContainer: { flexDirection: "row", marginBottom: 10 },
    statusIndicator: { borderRadius: 50, width: 15, height: 15, margin: 5 },
    tokenTitle: { fontSize: 22, fontWeight: "bold", color: '#345c74', marginBottom: 10 },
    copyClipboardView: { flexDirection: "row", alignItems: "center", backgroundColor: "#ecf0f1", borderRadius: 10, borderColor: "#5A5A5A", borderWidth: 1, padding: 10 },
    deviceTokenText: { fontSize: 14, fontWeight: "400", color: '#345c74' },
    dynamicButton: { backgroundColor: "#F18C8E", padding: 10, borderRadius: 15, alignItems: "center", marginTop: 20 },
    deleteTextStyle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    footerContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: 20 },
    controlScreenIconStyle: { backgroundColor: "#F18C8E", borderRadius: 10, alignItems: "center", justifyContent: "center", width: 65, height: 65 },
    helpIconStyle: { backgroundColor: "#F18C8E", borderRadius: 10, alignItems: "center", justifyContent: "center", width: 65, height: 65 },
});

export default DeviceDetail;