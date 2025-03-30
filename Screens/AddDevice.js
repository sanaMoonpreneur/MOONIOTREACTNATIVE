import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Platform, Alert, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const AddDevice = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const textName = route.params.data;

  const [token, setToken] = useState('');
  const [deviceName, setDeviceName] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
        if (storedLoginResponse) {
          const parsedResponse = JSON.parse(storedLoginResponse);
          setToken(parsedResponse.result[0].token);
        }
      } catch (error) {
        console.error('Error retrieving token from AsyncStorage:', error);
      }
    };
    fetchToken();
  }, []);

  const handleAddDevice = async () => {
    try {
      const apiUrl = 'https://test.moonr.com/LMSService/api/IOT/AddUpdateDevice';
      const data = {
        "device_id": 1,
        "user_device_id": 0,
        "user_device_name": deviceName,
        "connection_type_id": 1,
        "hardware_id": 3,
        "status": false,
        "is_active": 0,
        "roomids": "4,5",
        "room_no": 1,
        "start_bg_color": "",
        "end_bg_color": "",
        "lottie_bg": ""
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("HTTP error! Status:" + `${response.status}`);
        return;
      }

      const result = await response.json();
      if (!result.isError) {
        Alert.alert('Success', 'Device added successfully.');
        props.navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Failed to add device. Please try again.');
      }
    } catch (error) {
      console.error('Error during adding device:', error);
    }
  };

  return (
    <ImageBackground source={require('../images/chs.png')} style={styles.background}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../images/a1.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Add Device</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Device Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter device name"
          value={deviceName}
          onChangeText={setDeviceName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hardware</Text>
        <TextInput
          style={styles.input}
          placeholder="Device Hardware"
          value={textName}
          editable={false}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddDevice}>
        <Text style={styles.addButtonText}>Add Device</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 30,
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
  title: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 10,
    color: '#345c74',
  },
  input: {
    borderRadius: 30,
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    fontWeight: "400",
  },
  addButton: {
    marginTop: 15,
    alignSelf: 'center',
    paddingVertical: 10,
    height: 45,
    width: '50%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    marginBottom: 10,
    elevation: 5,
  },
  addButtonText: {
    color: '#EC8588',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: "500",
  }
});

export default AddDevice;
