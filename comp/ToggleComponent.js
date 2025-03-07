import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Animated, PanResponder } from "react-native";
import BottomSheetComponent from "./ButtomSheetComponent";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useIsFocused } from "@react-navigation/native";

const ToggleComponent = ({ initialState = false, onSelect, mode, onModeChange, device_id, dToken }) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [panResponder, setPanResponder] = useState([]);
  const [draggableButtons, setDraggableButtons] = useState([]);
  const [buttonStatuses, setButtonStatuses] = useState({}); // Store button statuses
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [cstatus, setCstatus] = useState(null)
  const [componentIds, setComponentId] = useState(null);

  const ButtonCall = async (componentId, deviceToken, currentStatus) => {
    try {
      console.log('deviceToken:', deviceToken);  // Log the deviceToken
  
      const storedToken = await AsyncStorage.getItem('loginResponse');
      const parsedToken = JSON.parse(storedToken);
      const token = parsedToken.result[0].token;
      let newStatus
      currentStatus=='off'?newStatus=true:newStatus=false; 
      console.log(newStatus)
      console.log(componentId," ", dToken," ", newStatus)
      setComponentId(componentId)
      const requestBody = {
        "component_id": componentId,
        "device_token": dToken,  // Ensure this is correct
        "status": newStatus
      };
  
      const response = await axios.post(
        `https://thingproxy.freeboard.io/fetch/https://test.moonr.com/LMSService/api/IOT/UpdateComponentStatus`, 
        requestBody,
        {
          headers: {
            'security-key': 'X2DPR-RO1WTR-98007-PRS70-VEQ12Y',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response?.data?.statusCode === 200) {
        setButtonStatuses((prevStatuses) => ({
          ...prevStatuses,
          [componentId]: newStatus
        }));
        console.log('Status toggled successfully:', response.data);
      } else {
        console.error('Error toggling status:', response?.data?.message || 'Unexpected response structure');
      }
    } catch (error) {
      console.error('Error in ButtonCall:', error?.response?.data || error.message || error);
    }
   fetchData()
  };
  
  useEffect(() => {
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    if (mode) {
      loadPositionsFromStorage();
    } else {
      loadPositionsFromStorage();
    }
  }, [mode, apiData]);
 // Save statuses to AsyncStorage


   

  const fetchData =async()=>{
    try {
      const storedToken = await AsyncStorage.getItem('loginResponse');
      const parsedToken = JSON.parse(storedToken);
      const token = parsedToken.result[0].token;

      const response = await axios.get(`https://thingproxy.freeboard.io/fetch/https://test.moonr.com/LMSService/api/IOT/GetDeviceComponents?device_id=${device_id}`, {
        headers: {
          'security-key': 'X2DPR-RO1WTR-98007-PRS70-VEQ12Y',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const componentStatuses = response.data.result.reduce((acc, component) => {
        acc[component.component_id] = component.status; // Initialize statuses
        return acc;
      }, {});
      
      setButtonStatuses(componentStatuses); // Initialize button statuses
      setApiData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const initializePanResponder = (buttons) => {
    const responders = buttons.map((button, index) => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
          [null, { dx: button.pan.x, dy: button.pan.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: (e, gesture) => {
          button.pan.flattenOffset();
          savePositionToStorage(index, button.pan.x._value, button.pan.y._value);
        },
        onPanResponderGrant: () => {
          button.pan.setOffset({
            x: button.pan.x._value,
            y: button.pan.y._value
          });
          button.pan.setValue({ x: 0, y: 0 });
        },
      });
    });
    setPanResponder(responders);
  };

  const savePositionToStorage = async (index, x, y) => {
    try {
      const positions = await AsyncStorage.getItem('buttonPositions');
      const parsedPositions = positions ? JSON.parse(positions) : [];
      parsedPositions[index] = { x, y };
      await AsyncStorage.setItem('buttonPositions', JSON.stringify(parsedPositions));
    } catch (error) {
      console.error('Error saving position to storage:', error);
    }
  };

  const loadPositionsFromStorage = async () => {
    try {
      const positions = await AsyncStorage.getItem('buttonPositions');
      const parsedPositions = positions ? JSON.parse(positions) : [];
      if (apiData.result) {
        const buttons = apiData.result.map((responseData, index) => ({
          x: parsedPositions[index]?.x || parseFloat(responseData.component_xaxis) || 0,
          y: parsedPositions[index]?.y || parseFloat(responseData.component_yaxis) || 0,
          pan: new Animated.ValueXY({ x: parsedPositions[index]?.x || parseFloat(responseData.component_xaxis) || 0, y: parsedPositions[index]?.y || parseFloat(responseData.component_yaxis) || 0 }),
        }));
        setDraggableButtons(buttons);
        initializePanResponder(buttons);
      }
    } catch (error) {
      console.error('Error loading positions from storage:', error);
    }
  };
  // const fetchComponentStatus = async (componentId,deviceToken) => {
  //   console.log(componentId,deviceToken)
  //   const storedToken = await AsyncStorage.getItem('loginResponse');
  //   const parsedToken = JSON.parse(storedToken);
  //   const token = parsedToken.result[0].token;
  //   try {
  //     const response = await axios.get(
  //       `https://test.moonr.com/LMSService/api/IOT/GetComponentStatus?component_id=${componentId}&device_token=${deviceToken}`,
  //       {
  //         headers: {
  //           'security-key': 'X2DPR-RO1WTR-98007-PRS70-VEQ12Y',
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const status = response?.data?.result[0]?.device_status;
  //     setCstatus(status); // Update the button status based on the API response
    
  //   } catch (error) {
  //     console.error('Error fetching component status:', error);
  //   }
  // };

  // useEffect(() => {
  //   // Fetch data when component loads
  //   if (componentIds !== null) {
  //     fetchComponentStatus(componentIds,dToken);


      
  //   }
   

  //   // Optional: Poll the API every few seconds to keep the status updated
  //   const intervalId = setInterval(() => {
  //     fetchComponentStatus();
  //   }, 5000); // Fetch every 5 seconds

  //   // Cleanup on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);


  const handleAddPress = () => {
    setBottomSheetVisible(true);
  };

  const handleAdditionPress = () => {
    onModeChange(true);
  };

  const handleOperationPress = async() => {
    setBottomSheetVisible(false);
    onModeChange(false);

    // try {
    //   await fetchStatuses();
    //   console.log('Statuses fetched successfully');
    //   console.log(cstatus)
    // } catch (error) {
    //   console.error('Error fetching statuses:', error);
    // }
    loadStatusesFromStorage()
  
    
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false);
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            mode ? styles.selectedButton : null,
          ]}
          onPress={handleAdditionPress}
        >
          <Text style={styles.text}>Addition Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            !mode ? styles.selectedButton : null,
          ]}
          onPress={handleOperationPress}
        >
          <Text style={styles.text}>Operation Mode</Text>
        </TouchableOpacity>
      </View>

      {/* Addition Mode */}
      {mode && apiData && apiData.result && (
        <View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAddPress}
          >
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
          <View>
            {apiData.result.map((responseData, index) => {
              const button = draggableButtons[index];
              if (!button) return null;
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.apiButton,
                    { backgroundColor: responseData.component_bgcolor },
                    { transform: button.pan.getTranslateTransform() }
                  ]}
                  {...(mode ? panResponder[index]?.panHandlers : {})}
                >
                  <Text onPress={() => { navigation.navigate('EnterCompDetai',{device_id:device_id,id:responseData.component_id,pin:responseData.component_pin,name:responseData.component_name}) }} style={styles.apiButtonText}>{responseData.component_name}</Text>
                  {/* Small notification for component ID */}
                  <View style={styles.notificationIcon}>
                    <Text style={styles.notificationText}>id: {responseData.component_id}</Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </View>
      )}

      {/* Operation Mode */}
      {!mode && apiData && apiData.result && (
        <View>
          {apiData.result.map((responseData, index) => {
            const button = draggableButtons[index];
            if (!button) return null;
            const currentStatus = buttonStatuses[responseData.component_id];
            return (
              <TouchableOpacity
                key={index}
                onPress={() => ButtonCall(responseData.component_id, responseData.dToken, responseData.component_status)}
              >
                <Animated.View
                  style={[
                    styles.apiButton,
                    { backgroundColor: responseData.component_status=="off" ? 'red' : 'green' },
                    { transform: button.pan.getTranslateTransform() }
                  ]}
                  {...(mode ? panResponder[index]?.panHandlers : {})}
                >
                  <Text style={styles.apiButtonText}>{responseData.component_name}</Text>
                  <View style={styles.notificationIconO}>
                    <Text style={styles.notificationText}>{responseData.component_status}</Text>              
                     </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <BottomSheetComponent
        visible={bottomSheetVisible}
        onClose={handleBottomSheetClose}
        onSelect={onSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    width:150,
    justifyContent:'center',
    alignItems:'center'

  },
  selectedButton: {
    backgroundColor: '#0056b3',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  apiButton: {
    padding: 15,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    width:150
  },
  apiButtonText: {
    color: 'white',
    fontSize: 16,
  },
  iconButton: {
    position: 'absolute',
    top: 5,
    alignSelf:'center',
    backgroundColor: 'teal',
    
    borderRadius: 10,
    height:60,
    width:60,
    justifyContent:'center',
    alignItems:'center'
  },
  addIcon: {
    color: 'white',
    fontSize: 40,
    fontWeight:'bold'
  },
  notificationIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 50,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIconO: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'black',
    borderRadius: 10,
    width: 50,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
  }
});

export default ToggleComponent;
