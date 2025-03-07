import React, { useState, useEffect } from "react";
import { ImageBackground, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from "expo-clipboard";
import { Modalize } from 'react-native-modalize'
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const DeviceDetail = ({ navigation, route, }) => {
    const { screenName, device1 } = route.params;

    const [screen, setScreen] = useState(screenName)
    const [user, setUser] = useState(null);
    const [devicesResponse, setDevicesResponse] = useState([]);
    const [token, setToken] = useState('');
    const [statusColor, setstatusColor] = useState('red');
    const [callingStatus, setCallingStatus] = useState(true);

    if (screen == 'AddDevice') {
        var device = devicesResponse
    } else {
        device = device1
    }

    useEffect(() => {
        fetchToken();
        fetchData();
    }, []);

    const fetchToken = async () => {
        try {
            const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
            if (storedLoginResponse) {
                const parsedResponse = JSON.parse(storedLoginResponse);
                const newToken = parsedResponse.result[0].token;
                setToken(newToken);
                return newToken;
                //console.log(newToken)
            }
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
        }
    };

    const fetchData = async () => {
        const newToken = await fetchToken();
        if (newToken) {
            fetchDevices(newToken);
        }
    };

    const fetchDevices = async (apiToken) => {
        try {
            const apiUrl = 'https://test.moonr.com/LMSService/api/IOT/GetDevices';

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                },
            });

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }

            const result = await response.json();

            if (result.statusCode === 200 && !result.isError) {
                setCallingStatus(false)
                arr = result.result
                setDevicesResponse(arr[arr.length - 1])
                console.log(arr[arr.length - 1])

            } else {
                console.error('Failed to fetch devices:', result.message);
            }
        } catch (error) {
            console.error('Error during fetching devices:', error);
        }

    };

    const copyToClipboard = (token) => {
        Clipboard.setStringAsync(token);
    };



    const handleDelete = async () => {
        console.log(device.device_id);
        console.log(token)
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this device?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {

                            const response = await axios.post(
                                `https://test.moonr.com/LMSService/api/IOT/DeleteDeviceById?user_device_id=
${device.user_device_id}`,
                                {},
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            if (response.status == 200) {
                                fetchDevices()
                                navigation.navigate('Drawer');

                                return;
                            } else {
                                console.error(`HTTP error! Status: ${response.status}`);
                                return;
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
        <ImageBackground
            source={require('../images/chs.png')}
            style={{ width: "100%", height: "100%" }}
        >

            <View style={{
                flexDirection: "row",
                width: "100%",
                paddingHorizontal: 20,
                marginTop: 20,
                justifyContent: 'space-between'
            }}>
                <TouchableOpacity onPress={() => {
                    fetchData()
                    navigation.navigate('Drawer', { screen: 'Home' })
                }}
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 13,
                        borderRadius: 10,
                        marginTop: 30,
                        backgroundColor: "#d1a0a7"
                    }}
                >
                    <Image
                        source={require('../images/a1.png')}
                        style={{ width: 20, height: 15 }}
                    />
                </TouchableOpacity>

            </View>

            <View style={{ width: '100%', height: '20%' }}>
                <Text style={{
                    color: "white", fontSize: 35, fontWeight: "bold", width: 250,
                    alignSelf: "center", textAlign: "center", marginTop: 30
                }}>{device.user_device_name}</Text>
            </View>

            <View style={{backgroundColor:'white',borderRadius:40,margin:10,}} >

                <View style={styles.contentContainer}>

                    <View>
                        <Text style={styles.deviceName}>Device Details</Text>
                        <Text style={styles.connectionType}>{device.connection_type}</Text>

                        <View>
                            {device.device_status == "Connected" ? (
                                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                                    <View
                                        style={{
                                            borderRadius: 50,
                                            backgroundColor: "green",
                                            width: 15,
                                            height: 15,
                                            margin: 5,
                                        }}
                                    ></View>
                                    <Text style={styles.connectionType}>{device.device_status}</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                                    <View
                                        style={{
                                            borderRadius: 50,
                                            backgroundColor: "red",
                                            width: 15,
                                            height: 15,
                                            margin: 5,
                                        }}
                                    ></View>
                                    <Text style={styles.connectionType}>{device.device_status}</Text>

                                </View>
                            )}
                        </View>

                        <Text style={styles.tokenTitle}>Device Token :</Text>
                        <View style={styles.copyClipboardView}>
                            <Text style={styles.deviceTokenText}>{device.device_token}</Text>

                            <TouchableOpacity
                                style={{ borderColor: '#345c74' }}
                                onPress={() => { copyToClipboard(device.device_token) }}
                            >
                                <Ionicons name="copy" size={18} color="#345c74" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.dynamicButton}
                            onPress={() => {
                                handleDelete()

                            }}
                        >
                            <Text style={styles.deleteTextStyle}>Delete Device</Text>

                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        style={styles.controlScreenIconStyle}
                        onPress={() => {
                            navigation.navigate("DeviceDetailsHelp", { device: device });
                        }}
                    >
                        <Ionicons name="help-outline" size={26} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.helpIconStyle}
                        onPress={() => {
                            navigation.navigate("DC1", { device: device, items: device1, dToken: device.device_token });
                        }}
                    >
                        <Ionicons name="arrow-forward" size={26} color="white" />
                    </TouchableOpacity>

                </View>
            </View>         

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#121212",

    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 50,
        backgroundColor: "pink",
    },

    dynamicButton: {
        backgroundColor: "#F18C8E",
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        margin: 10,
    },

    parentContainer: {
        position: "absolute",

        backgroundColor: "#ecf0f1",
    },
    additionalButton: {
        backgroundColor: "#3498db",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },

    helpIconStyle: {
        marginBottom: 30,
        marginRight: 20,
        backgroundColor: "#F18C8E",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: 65,
        height: 65,

    },


    controlScreenIconStyle: {
        marginBottom: 30,
        marginLeft: 20,
        backgroundColor: "#F18C8E",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: 65,
        height: 65,


    },

    deviceImage: {
        marginLeft: "25%",
        height: "40%",
        width: "50%",
        borderRadius: 20,

    },
    contentContainer: {
        marginTop: 20,
        padding: 20,
        borderRadius: 50,
        paddingHorizontal: 20,
    },
    copyClipboardView: {
        marginHorizontal: 5,
        marginBottom: 10,
        backgroundColor: "#ecf0f1",
        borderColor: "#5A5A5A",
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    deviceName: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#345c74'
    },
    tokenTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: '#345c74',
        marginBottom: 10,
    },
    connectionType: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: "400",
        color: '#345c74'
    },

    deviceTokenText: {
        fontSize: 14,
        margin: 10,
        fontWeight: "400",
        color: '#345c74'
    },

    deleteTextStyle: {
        color: "#fff",
        fontSize: 16,
        margin: 2,
        fontWeight: "bold",
    },

    status: {
        fontSize: 14,
        marginBottom: 20,
    },
    modeText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
    },
    label: {
        fontSize: 18,
        marginBottom: 20,
    },
    pickerInput: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 4,
        color: "black",
    },
});

export default DeviceDetail;