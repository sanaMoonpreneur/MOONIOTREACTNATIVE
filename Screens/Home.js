import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";

import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native-virtualized-view";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import ChooseHardware from './ChooseHardware';


let arr = ["#fdddf3", "#fef8e3", "#fcf2ff", "#fff0ee"];

const bg = () => {
  color = (arr[(Math.floor(Math.random() * arr.length))]);
  return (color)
}

const Home = (props) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [selectedColor, setSelectedColor] = useState("#414757");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [devicesResponse, setDevicesResponse] = useState(null);
  const [token, setToken] = useState('');
  const [statusColor, setstatusColor] = useState('red');
  const [refreshing, setRefreshing] = useState(false);
  const [callingStatus, setCallingStatus] = useState(false);


  useEffect(() => {
    if (isFocused) {
      fetchData();
      console.log('focused')
    }

  }, [isFocused]);

  const fetchToken = async () => {
    try {
      const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
      if (storedLoginResponse) {
        const parsedResponse = JSON.parse(storedLoginResponse);
        const newToken = parsedResponse.result[0].token;
        const name = parsedResponse.result[0].student_name;
        setToken(newToken);
        setUser(name)
        return newToken;

      }
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const fetchDevices = async (apiToken) => {
    try {
      const apiUrl = 'https://thingproxy.freeboard.io/fetch/https://test.moonr.com/LMSService/api/IOT/GetDevices';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active_filter: 1 }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);

        if (response.status === 401) {
          Alert.alert('Alert', 'You are logged out. Please login again', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => navigation.navigate('LogIn') },
          ]);
        }
      }

      const result = await response.json();

      if (result.statusCode === 200 && !result.isError) {
        setDevicesResponse(result.result);
      }
      else {
        console.error('Failed to fetch devices:', result.message);
      }
    } catch (error) {
      console.error('Error during fetching devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    const newToken = await fetchToken();
    console.log('Token below');
    console.log(newToken);
    if (newToken) {
      fetchDevices(newToken);
    }
  };

  const DeviceInfo = ({
    device_id,
    device_name,
    user_device_name,
    device_connection_type,
    device_hardware,
    lastConnected,
    item,
    device_status,
  }) => (

    <TouchableOpacity style={styles.deviceInfoContainer}
      onPress={() => {
        props.navigation.navigate("DeviceDetail", { screenName: 'HomeNew', device1: item, param3: token });
        console.log(item)

      }}
    >

      <View style={styles.deviceInfoContent}>

        {device_hardware == "ardunino" ? (<Image
          style={styles.deviceImage}
          source={{ uri: 'https://moonhub.moonpreneur.com/mpdashboard/iot-images/Arduino.webp' }}
        />) : device_hardware == 'Arduino' ? (<Image
          style={styles.deviceImage}
          source={{ uri: 'https://moonhub.moonpreneur.com/mpdashboard/iot-images/RasberryPie.webp' }}
        />) : device_hardware == 'NodeMCU' ? (<Image
          style={styles.deviceImage}
          source={{ uri: 'https://moonhub.moonpreneur.com/mpdashboard/iot-images/NodeMCU.webp' }}
        />) : <Image
          style={styles.deviceImage}
          source={{ uri: 'https://imgs.search.brave.com/EX19lry8PZrFztT_V1Sr_ZE8PjhlEmwfUvbroIQSSZE/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9oYWNr/c3Rlci5pbWdpeC5u/ZXQvdXBsb2Fkcy9h/dHRhY2htZW50cy81/MDI2Mzcvcm9ib3Rf/Y2FyX0JvYk9xdnZS/cTEuanBnP2F1dG89/Y29tcHJlc3MsZm9ybWF0Jnc9NDAwJmg9/MzAwJmZpdD1taW4' }}
        />}


        <View style={{justifyContent:'center',}}>
          <View>
          <Text style={styles.deviceNameText}>
            {user_device_name}
          </Text>


          <Text style={styles.deviceLastConnectedText}>
            {lastConnected}
          </Text>
          </View>

          <Text style={styles.deviceConnectionText}>
            {device_connection_type}
          </Text>

        </View>
      </View>
      {device_status == "Connected" ? <View
        style={styles.statusConnected}>

      </View> : <View
        style={styles.statusDisconnected}>

      </View>}

      <View style={styles.deviceActionIcon}>
        <Image
          source={require('../images/pl.png')}
          style={styles.deviceActionImage}
        />
      </View>

    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <DeviceInfo
      device_id={item.device_id}
      device_name={item.device_name}
      user_device_name={item.user_device_name}
      device_connection_type={item.connection_type}
      device_hardware={item.hardware_name}
      lastConnected={item.created_on}
      item={item}
      device_status={item.device_status}
    >

    </DeviceInfo>
  );

  return (

    <ImageBackground
      source={require('../images/Home.png')}
      style={styles.backgroundImage}
    >

      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>

        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.drawerButton}
              onPress={() => {
                navigation.openDrawer();
              }}

            >
              <Image
                source={require('../images/hum.png')}
                style={styles.drawerButtonImage}
              />
            </TouchableOpacity>

            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>
                Welcome Home
              </Text>
              <Text style={styles.userNameText}>
                {user}
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.addedDevicesHeaderContainer}>
        </View> */}
        <View style={{
          flexDirection: "row",
          backgroundColor: "#FFF2F2",
          marginTop: 35,
          marginHorizontal: 20,
          borderRadius: 20,
          paddingVertical: 35,
          paddingLeft: 30
        }}>
          <View>
            <Text style={{
              color: "#345c74",
              fontSize: 20,
              fontWeight: "bold",
              width: 250,
              paddingRight: 100
            }}>
              Start learning new Stuff
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Stuff');
              }}
              style={{
                flexDirection: "row",
                backgroundColor: "#f58084",
                alignItems: "center",
                marginTop: 20,
                width: 130,
                paddingVertical: 10,
                borderRadius: 14,
                paddingHorizontal: 10
              }}
            >
              <Text style={{
                color: "#FFF",
                fontWeight: "bold",
                fontSize: 12
              }}>IOT App</Text>
              <Image
                source={require('../images/a3.png')}
                style={{ marginLeft: 20, width: 8, height: 8 }}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={require('../images/undraw.png')}
            style={{ marginLeft: -80, marginTop: 35 }}
          />

        </View>

        <Text style={styles.addedDevicesText}>Added Devices</Text>

        {isLoading ?
          (<ActivityIndicator />

          ) : (
            devicesResponse && devicesResponse.length > 0 ? (

              <View>
                <FlatList
                  inverted={true}
                  data={devicesResponse.slice(0, 3)}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}

                />

              </View>
            ) : (
              <View style={styles.noDataContainer}>

                <Image source={require('../assets/images/nodataImage.png')} style={styles.noDataImage} />


                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('ChooseHardware');
                  }}
                  style={styles.addDeviceButton}
                >
                  <Text style={styles.addDeviceText}>Add Device</Text>
                </TouchableOpacity>

              </View>
            )
          )}

      </ScrollView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  headerContent: {
    width: '85%',
    marginTop: 50
  },
  drawerButton: {
    width: '40',
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#d1a0a7",
    alignSelf: 'flex-start',
    marginTop: 20,
    marginLeft: 10
  },
  drawerButtonImage: {
    height: 15,
    width: 20
  },
  welcomeTextContainer: {
    width: "90%",
    marginTop: 25,
    marginLeft: 10
  },
  welcomeText: {
    fontSize: 33,
    fontWeight: "bold",
    color: "#FFF"
  },
  userNameText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF"
  },
  addedDevicesHeaderContainer: {
    marginTop: 145,
  },
  addedDevicesText: {
    color: "#EC8588",
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 22,
    marginTop: 20,
    marginBottom: 10
  },
  deviceInfoContainer: {
    flexDirection: "row",
    backgroundColor: bg(),
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    margin: 10,
    justifyContent: 'space-between',
    width: '90%'
  },
  deviceInfoContent: {
    flexDirection: 'row',
    width: '70%'
  },
  deviceImage: {
    width: 60,
    height: 60,
    borderRadius: 5
  },
  deviceNameText: {
    color: "#345c74",
    fontWeight: "bold",
    justifyContent:'center',
    fontSize: 15,
    paddingHorizontal: 20,
    width: 190
  },
  deviceConnectionText: {
    color: "#345c74",
    fontWeight: "bold",
    fontSize: 13,
    paddingHorizontal: 20,
    width: 170
  },
  deviceLastConnectedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  deviceLastConnectedText: {
    color: "#f58084",
    fontWeight: "bold",
    fontSize: 12,
    paddingHorizontal: 20,
    marginRight:20
  },
  statusConnected: {
    borderRadius: 50,
    backgroundColor: 'green',
    width: 10,
    height: 10,
    bottom: 0,
    right: 0,
    margin: 20
  },
  statusDisconnected: {
    margin: 20,
    borderRadius: 50,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    bottom: 0,
    right: 0,
  },
  deviceActionIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    color: "f580084",
    shadowColor: "#FFF",
    bgColor: "#FFF",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 10
  },
  deviceActionImage: {
    width: 9,
    height: 9,
    resizeMode: 'contain'
  },
  showMoreButton: {
    flexDirection: "row",
    backgroundColor: "#f58084",
    alignItems: "center",
    marginTop: 20,
    width: 130,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 20
  },
  showMoreText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12
  },
  showMoreIcon: {
    marginLeft: 20,
    width: 8,
    height: 8
  },
  noDataContainer: {
    margin: 10,
    alignSelf: 'center',
  },
  noDataImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain'
  },
  addDeviceButton: {
    flexDirection: "row",
    backgroundColor: "#f58084",
    alignItems: "center",
    marginTop: 20,
    width: 120,
    padding: 10,
    borderRadius: 14,
    alignSelf: "center",
    marginBottom: 30,
  },
  addDeviceText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    alignSelf: 'center',
  }
});

export default Home;
