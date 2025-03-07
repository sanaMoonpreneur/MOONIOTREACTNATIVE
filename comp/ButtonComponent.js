import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, PanResponder} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const ButtonComponent = ({ mode, draggable, x, y, device_id,  }) => {
  const [panResponder, setPanResponder] = useState(null);
  const pan = useState(new Animated.ValueXY())[0];
  const navigation = useNavigation();
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    if (mode === false) {
      //fetchData();
    }

    if (draggable && mode) {
      const responder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          // Move the component
          Animated.event([null, { dx: pan.x, dy: pan.y }])(event, gesture);
        },
        onPanResponderRelease: () => {},
        // Prevent onPress from interfering with the drag
        onShouldBlockNativeResponder: () => false,
      });
      setPanResponder(responder);
    } else {
      setPanResponder(null);
    }
  }, [mode, draggable, pan]);
  
  const fetchData = async () => {
    try {
      // Retrieve the stored token from AsyncStorage
      const storedToken = await AsyncStorage.getItem('loginResponse');
      const parsedToken = JSON.parse(storedToken);
      const token = parsedToken.result[0].token;
  
      // Define the request body (parameters for the POST request)
      const requestBody = {
        "component_id": "2",
        "device_token": "50AEADE4-EA03-4ADA-8B12-E7F136EF9D45",
        "status": true
      };
  
      // Make a POST request to the new API endpoint
      const response = await axios.post(`https://thingproxy.freeboard.io/fetch/https://test.moonr.com/LMSService/api/IOT/UpdateComponentStatus`, 
        requestBody,
        {
          headers: {
            'security-key': 'X2DPR-RO1WTR-98007-PRS70-VEQ12Y',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      // Set the API response data (assuming you're using React's useState)
      setApiData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleButtonPress = () => {
    navigation.navigate('EnterCompDetai', { xPos: x, yPos: y, device_id: device_id });
    console.log(device_id)
  };

  return (
    <View>
      
      {mode ? (
        // Render UI when mode is true
        <View>
           
    <View style={styles.buttonText} >
        <Text style={styles.buttonText}>Button</Text>
        <Text  onPress={handleButtonPress}></Text>
        </View>
        </View>
       
      ) : (
        // Render UI fetched from API when mode is false
      <View></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#3498db",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  apiButton: {
    position: 'absolute',
    zIndex: 0,
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width:80
  },
  apiButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ButtonComponent;
