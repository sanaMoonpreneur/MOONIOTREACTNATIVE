import React, { useRef, useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    Keyboard,
    Dimensions,
    TextInput,
    ActivityIndicator,
    Switch,
    ScrollView,
} from "react-native";
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emailValidator } from '../Helper/emailValidator';
import { passwordValidator } from '../Helper/passwordValidator';
import { nameValidator } from "../Helper/nameValidator";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useTheme } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const LoginScreen = (props) => {
    const [loaded, setLoaded] = useState(false);
    const navigation = useNavigation();
    const [username, setUsername] = useState({ value: 'neelesh.mb230828004', error: '' });
    const [password, setPassword] = useState({ value: 'A8qXeoFwTzsX', error: '' });

    const handleLogin = async () => {
        const emailError = nameValidator(username.value);
        const passwordError = passwordValidator(password.value);
        if (emailError || passwordError) {
            setUsername({ ...username, error: emailError });
            setPassword({ ...password, error: passwordError });
            return;
        }

        try {
            const apiUrl = 'https://test.moonr.com/LMSService/api/Account/getUserToken';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Security-key': 'X2DPR-RO1WTR-98007-PRS70-VEQ12Y',
                },
                body: JSON.stringify({
                    userName: username.value,
                    password: password.value,   
                    ipAddress: '127.0.0.1',
                    rememberMe: true,
                }),
            });

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }

            const result = await response.json();

            if (result.statusCode === 200 && result.result && result.result.length > 0) {
                await AsyncStorage.setItem('loginResponse', JSON.stringify(result));
                console.log(result);
                props.navigation.navigate("Drawer");
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const animation = useRef(null);
    useEffect(() => {
        // Animation effects or any setup on load
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.switchContainer}>
                {/* <Switch value={isDarkTheme} onChange={() => { }} /> */}
            </View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Login</Text>
                <LottieView
                    autoPlay
                    ref={animation}
                    source={require('../assets/images/loginAnime.json')}
                    style={styles.lottieAnimation}
                />
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={username.value}
                        onChangeText={(text) => setUsername({ value: text, error: '' })}
                        error={!!username.error}
                        errorText={username.error}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        returnKeyType="done"
                        value={password.value}
                        onChangeText={(text) => setPassword({ value: text, error: '' })}
                        error={!!password.error}
                        errorText={password.error}
                        secureTextEntry
                    />
                </View>

                <View style={styles.forgotPassword}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('ResetPasswordScreen')}>
                        <Text style={styles.forgot}>Forgot your password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.AddDevice} onPress={handleLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.row}>
                    <Text style={styles.signupText}>Don’t have an account? </Text>
                    <TouchableOpacity onPress={() => props.navigation.replace('RegisterScreen')}>
                        <Text style={styles.link}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    switchContainer: {
        marginTop: '15%',
        alignSelf: 'center',
    },
    headerContainer: {
        height: height * 0.35,
        width: '100%',
        alignItems: 'center',
    },
    headerText: {
        color: '#345c74',
        fontSize: 35,
        fontWeight: "bold",
        width: '50%',
        textAlign: 'center',
    },
    lottieAnimation: {
        width: 250,
        height: 250,
    },
    formContainer: {
        width: '100%',
        backgroundColor: 'white',
        height: '60%',
        paddingTop: '10%',
        paddingHorizontal: 20,
        borderTopRightRadius: 60,
        borderTopLeftRadius: 60,
        marginTop: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        color: '#345c74',
    },
    input: {
        borderRadius: 30,
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: '#ecf0f1',
        color: '#2c3e50',
        fontWeight: "500",
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgot: {
        fontSize: 13,
        color: "#345c74",
        fontWeight: "500",
    },
    AddDevice: {
        backgroundColor: '#F18C8E',
        width: '100%',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5,
    },
    loginText: {
        color: '#ecf0f1',
        fontSize: 23,
        fontWeight: "bold",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#345c74',
        fontWeight: "500",
    },
    link: {
        fontWeight: 'bold',
        color: "#345c74",
    },
});

export default LoginScreen;
