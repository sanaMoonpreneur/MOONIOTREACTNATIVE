import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, ActivityIndicator, Clipboard, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const ProfileScreen = () => {
    const [name, setName] = useState('N/A');
    const [email, setEmail] = useState('N/A');
    const [mobile, setMobile] = useState('N/A');
    const [securityToken, setSecurityToken] = useState('N/A');
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        fetchToken().then((value) => {
            if (value) {
                fetchUserProfile(value);
            }
        });
        loadProfileFromStorage();
    }, []);

    const loadProfileFromStorage = async () => {
        try {
            const storedName = await AsyncStorage.getItem('UserName') || 'N/A';
            const storedEmail = await AsyncStorage.getItem('Email') || 'N/A';
            const storedMobile = await AsyncStorage.getItem('Mobile') || 'N/A';
            const storedSecurityToken = await AsyncStorage.getItem('securityToken') || 'N/A';

            setName(storedName);
            setEmail(storedEmail);
            setMobile(storedMobile);
            setSecurityToken(storedSecurityToken);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const fetchToken = async () => {
        try {
            const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
            if (!storedLoginResponse) return null;

            const parsedResponse = JSON.parse(storedLoginResponse);
            const newToken = parsedResponse?.result?.[0]?.token;

            setToken(newToken);
            return newToken;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const fetchUserProfile = async (token) => {
        if (!token) return;

        try {
            const url = 'https://test.moonr.com/LMSService/api/IOT/UserProfile';
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.status === 200) {
                const data = await response.json();
                const userProfile = data?.result?.[0];

                setName(userProfile?.name || 'N/A');
                setEmail(userProfile?.email || 'N/A');
                setMobile(userProfile?.mobile || 'N/A');
                setSecurityToken(userProfile?.security_token || 'N/A');
                setIsLoading(false);
            } else {
                console.error('Failed to fetch profile:', response.status);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const copyToClipboard = () => {
        Clipboard.setString(securityToken);
        Alert.alert('Copied!', 'Security Token has been copied to clipboard.');
    };

    return (
        <ImageBackground
            source={require('../images/chs.png')}
            style={{ width: '100%', height: '100%' }}
        >
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image source={require('../images/a1.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.profile}>Profile</Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <View style={styles.container}>
                        <View style={styles.box}><Text style={styles.Text}>Name:</Text><Text style={styles.desc}>{name}</Text></View>
                        <View style={styles.box}><Text style={styles.Text}>Email:</Text><Text style={styles.desc}>{email}</Text></View>
                        <View style={styles.box}><Text style={styles.Text}>Mobile:</Text><Text style={styles.desc}>{mobile}</Text></View>
                        <View style={styles.tokenContainer}>
                            <Text style={styles.Text}>Security Token:</Text>
                            <TouchableOpacity onPress={copyToClipboard}>
                                <Text style={styles.tokenText}>{securityToken}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 20,
        justifyContent: 'space-between'
    },
    backButton: {
        paddingHorizontal: 10,
        paddingVertical: 13,
        borderRadius: 10,
        marginTop: 30,
        backgroundColor: "#d1a0a7"
    },
    backIcon: {
        width: 20,
        height: 15
    },
    profile: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        width: 200,
        alignSelf: "center",
        textAlign: "center",
        marginBottom: 20
    },
    box: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20,
        width: '85%',
        shadowColor: '#000',
        marginTop: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    Text: {
        color: 'black',
        fontSize: 18,
    },
    desc: {
        color: 'black',
        alignSelf: "center",
        textAlign: "center",
        flexWrap: 'wrap',
    },
    tokenContainer: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginTop: 20,
        width: '85%',
        borderRadius: 20,
    },
    tokenText: {
        color: 'green',
        fontSize: 18,
        textDecorationLine: 'underline'
    }
});

export default ProfileScreen;