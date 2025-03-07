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
import ChooseHardware from '../Screens/ChooseHardware';


let arr = ["#fdddf3", "#fef8e3", "#fcf2ff", "#fff0ee"];

const bg = () => {
  color = (arr[(Math.floor(Math.random() * arr.length))]);
  return (color)
}

const HomeNew = (props) => {
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


    <TouchableOpacity style={{
      flexDirection: "row",
      backgroundColor: bg(),
      padding: 20,
      marginHorizontal: 20,
      borderRadius: 20,
      alignItems: "center",
      margin: 10,
      justifyContent: 'space-between',
      width: '90%'
    }}
      onPress={() => {
        props.navigation.navigate("DeviceDetail", { screenName: 'HomeNew', device1: item, param3: token });
        console.log(item)

      }}
    >

      <View style={{ flexDirection: 'row', width: '70%' }}>

        {device_hardware == "ardunino" ? (<Image
          style={{ width: 50, height: 50, borderRadius: 5 }}
          source={{ uri: 'https://moonhub.moonpreneur.com/mpdashboard/iot-images/Arduino.webp' }}
        />) : device_hardware == 'Arduino' ? (<Image
          style={{ width: 40, height: 40, borderRadius: 5 }}
          source={{ uri: 'https://moonhub.moonpreneur.com/mpdashboard/iot-images/RasberryPie.webp' }}
        />) : device_hardware == 'NodeMCU' ? (<Image
          style={{ width: 40, height: 40, borderRadius: 5 }}
          source={{ uri: 'https://moonhub.moonpreneur.com/mpdashboard/iot-images/NodeMCU.webp' }}
        />) : <Image
          style={{ width: 40, height: 40, borderRadius: 5 }}
          source={{ uri: 'https://imgs.search.brave.com/EX19lry8PZrFztT_V1Sr_ZE8PjhlEmwfUvbroIQSSZE/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9oYWNr/c3Rlci5pbWdpeC5u/ZXQvdXBsb2Fkcy9h/dHRhY2htZW50cy81/MDI2Mzcvcm9ib3Rf/Y2FyX0JvYk9xdnZS/cTEuanBnP2F1dG89/Y29tcHJlc3MsZm9y/bWF0Jnc9NDAwJmg9/MzAwJmZpdD1taW4' }}
        />}


        <View>
          <Text
            style={{
              color: "#345c74",
              fontWeight: "bold",
              fontSize: 15,
              paddingHorizontal: 20,
              width: 190
            }}
          >
            {user_device_name}
          </Text>
          <Text style={{
            color: "#345c74",
            fontWeight: "bold",
            fontSize: 13,
            paddingHorizontal: 20,
            width: 170
          }}>
            {device_connection_type}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >

            <Text style={{
              color: "#f58084",
              fontWeight: "bold",
              fontSize: 12,
              paddingHorizontal: 20
            }}>
              {lastConnected}
            </Text>

          </View>
        </View>
      </View>
      {device_status == "Connected" ? <View
        style={{

          borderRadius: 50,
          backgroundColor: 'green',
          width: 10,
          height: 10,
          //position:'absolute',
          bottom: 0,
          right: 0,
          margin: 20
        }}>


      </View> : <View
        style={{
          margin: 20,
          borderRadius: 50,
          backgroundColor: 'red',
          width: 10,
          height: 10,
          bottom: 0,
          right: 0,
        }}>


      </View>}

      <View style={{
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
      }}

      >
        <Image
          source={require('../images/pl.png')}
          style={{ width: 9, height: 9, resizeMode: 'contain' }}
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
      style={{ width: "100%", height: "100%" }}
    >

      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>

        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
          <View style={{ width: '85%', marginTop: 50 }}>
            <TouchableOpacity style={{
              width: '40',
              paddingHorizontal: 10,
              paddingVertical: 13,
              borderRadius: 10,
              backgroundColor: "#d1a0a7",
              alignSelf: 'flex-start',
              marginTop: 20,
              marginLeft: 10
            }}

              onPress={() => {
                navigation.openDrawer();
              }}

            >
              <Image
                source={require('../images/hum.png')}
                style={{ height: 15, width: 20 }}
              />
            </TouchableOpacity>

            <View style={{ width: "90%", marginTop: 20, marginLeft: 10 }}>
              <Text style={{
                fontSize: 33,

                fontWeight: "bold",
                color: "#FFF"
              }}>Welcome Home</Text>
              <Text style={{

                fontSize: 30,

                fontWeight: "bold",
                color: "#FFF"
              }}>{user}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryContainer}>
        </View>

        <Text style={{
          color: "yellow",
          fontWeight: "bold",
          fontSize: 20,
          paddingHorizontal: 22,
          marginTop: 20,
          marginBottom: 10
        }}>Added Devices</Text>

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
                <TouchableOpacity style={{
                  flexDirection: "row",
                  backgroundColor: "#f58084",
                  alignItems: "center",
                  marginTop: 20,
                  width: 130,
                  paddingVertical: 10,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  margin: 20
                }}
                  onPress={() => {
                    fetchData()
                    props.navigation.navigate("DeviceList", { param1: devicesResponse, param2: renderItem });

                  }}
                >
                  <Text style={{
                    color: "#FFF",
                    fontWeight: "bold",
                    fontSize: 12
                  }}>Show More</Text>
                  <Image
                    source={require('../images/a3.png')}
                    style={{ marginLeft: 20, width: 8, height: 8 }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{
                margin: 10,
                alignSelf: 'center',
              }}       >

                <Image source={require('../assets/images/nodataImage.png')} style={{ width: 300, height: 200, resizeMode: 'contain' }} />


                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('ChooseHardware');
                  }}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#f58084",
                    alignItems: "center",
                    marginTop: 20,
                    width: 120,
                    padding: 10,
                    borderRadius: 14,
                    alignSelf: "center",
                    marginBottom: 30,
                  }}
                >
                  <Text style={{
                    color: "#FFF",
                    fontWeight: "bold",
                    fontSize: 14,
                    textAlign: "center",
                    alignSelf: 'center',
                  }}>Add Device</Text>
                </TouchableOpacity>

              </View>
            )
          )}

      </ScrollView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000000"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,

    marginTop: 20,


  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#560CCE",
  },
  welcomeTextLight: {
    fontSize: 16,
    color: "#560CCE",
  },
  userName: {
    fontSize: 16,
    color: "#ecf0f1",
  },

  summaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 30
  },
  summaryGradient: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 10,
    overflow: "hidden",
    width: "95%",
    backgroundColor: 'white'
  },
  summaryItem: {
    alignItems: "center",
    padding: 8,
  },
  summaryIcon: {
    fontSize: 17,
    color: "#f58084",
    marginBottom: 8,
  },
});

export default HomeNew;