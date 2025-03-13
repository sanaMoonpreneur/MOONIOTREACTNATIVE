import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const DC1 = ({ navigation, route }) => {
  const { device } = route.params;
  const isFocused = useIsFocused();

  const [componentName, setComponentName] = useState('');
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (isFocused) {
      fetchToken();
    }
  }, [isFocused]);

  const fetchToken = async () => {
    try {
      const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
      if (storedLoginResponse) {
        const parsedResponse = JSON.parse(storedLoginResponse);
        const newToken = parsedResponse.result[0].token;
        setToken(newToken);
        fetchComponents(newToken);
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  const fetchComponents = async (apiToken) => {
    try {
      const response = await fetch(`https://test.moonr.com/LMSService/api/IOT/GetDeviceComponents?user_device_id=${device.user_device_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
      const result = await response.json();
      if (result.statusCode === 200) {
        setComponents(result.result.filter(component => component.deleted === "Active"));
      }
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const saveComponent = async () => {
    if (!componentName || !selectedType) {
      Alert.alert('Error', 'Please provide a component name and type');
      return;
    }

    setIsLoading(true);

    let finalComponentPin = '';
    let component_id = 1;  // Make sure to pass the correct component_id, adjust based on your use case

    if (selectedType === 'Button') {
      finalComponentPin = 'Butt2'; // Update this pin if needed based on the button
    } else if (selectedType === 'Toggle') {
      finalComponentPin = 'Toggle1';  // Similarly, update for "Toggle" type
    } else {
      Alert.alert('Error', 'Invalid component type selected');
      setIsLoading(false);
      return;
    }

    const componentData = {
      user_device_id: device.user_device_id,
      device_component_id: 0,  // Use 0 for new component; update if needed
      device_component_name: componentName,
      component_id: component_id, // Include component_id here (use the proper ID based on your app)
      component_pin: finalComponentPin,
      is_active: 1,
    };

    console.log('Component Data to save:', JSON.stringify(componentData)); // Debugging the data

    try {
      const response = await fetch('https://test.moonr.com/LMSService/api/IOT/AddUpdateComponent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(componentData),
      });

      const result = await response.json();
      console.log('API Response:', result); // Debugging the API response

      // Check for validation errors
      if (result.isError) {
        // Log the validation errors
        console.log('Validation Errors:', result.responseException.validationErrors);
        const errorMessages = result.responseException.validationErrors
          .map(error => error.errorMessage)
          .join('\n');
        Alert.alert('Validation Error', errorMessages);
      }

      if (response.ok && result.statusCode === 200) {
        Alert.alert('Success', 'Component saved successfully');
        fetchComponents(token);  // Fetch updated list of components
        setBottomSheetVisible(false);  // Close the modal
      } else {
        Alert.alert('Error', result.message || 'Failed to save component');
      }
    } catch (error) {
      console.error('Error saving component:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);  // Hide loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Components</Text>
      <FlatList
        data={components}
        renderItem={({ item }) => (
          <View style={styles.componentItem}>
            <Text>{item.device_component_name} ({item.component_pin})</Text>
          </View>
        )}
        keyExtractor={(item) => item.device_component_id.toString()}
      />

      <TouchableOpacity style={styles.button} onPress={() => setBottomSheetVisible(true)}>
        <Text style={styles.buttonText}>Add Component</Text>
      </TouchableOpacity>

      <Modal visible={isBottomSheetVisible} animationType="slide" transparent>
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheet}>
            <Text style={styles.bottomSheetTitle}>Select Component Type</Text>
            <TextInput
              style={styles.input}
              placeholder="Component Name"
              value={componentName}
              onChangeText={setComponentName}
            />
            <TouchableOpacity
              style={[styles.optionButton, selectedType === 'Button' && styles.selectedOption]}
              onPress={() => setSelectedType('Button')}>
              <Text style={styles.optionText}>Button</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, selectedType === 'Toggle' && styles.selectedOption]}
              onPress={() => setSelectedType('Toggle')}>
              <Text style={styles.optionText}>Toggle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setBottomSheetVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={saveComponent} disabled={isLoading}>
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 50 },
  button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  componentItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  bottomSheetContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  bottomSheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  optionButton: { backgroundColor: '#f0f0f0', padding: 10, marginBottom: 10, borderRadius: 5, alignItems: 'center' },
  selectedOption: { backgroundColor: '#4CAF50' },
  optionText: { fontSize: 16 },
  cancelButton: { backgroundColor: 'gray', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: '#fff', fontSize: 16 },
});

export default DC1;






























// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert, ActivityIndicator, Modal } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useIsFocused } from '@react-navigation/native';
// import Slider from '@react-native-community/slider';

// const DC1 = ({ navigation, route }) => {
//   const { device } = route.params; // Get device details from the previous screen
//   const isFocused = useIsFocused();

//   const [componentName, setComponentName] = useState('');
//   const [components, setComponents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [token, setToken] = useState('');
//   const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
//   const [selectedType, setSelectedType] = useState('');
//   const [componentStatuses, setComponentStatuses] = useState({}); // To store the status of each component

//   useEffect(() => {
//     if (isFocused) {
//       fetchToken();
//     }
//   }, [isFocused]);

//   const fetchToken = async () => {
//     try {
//       const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
//       if (storedLoginResponse) {
//         const parsedResponse = JSON.parse(storedLoginResponse);
//         const newToken = parsedResponse.result[0].token;
//         setToken(newToken);
//         fetchComponents(newToken);
//       }
//     } catch (error) {
//       console.error('Error retrieving token:', error);
//     }
//   };

//   const fetchComponents = async (apiToken) => {
//     try {
//       const response = await fetch(`https://test.moonr.com/LMSService/api/IOT/GetDeviceComponents?user_device_id=${device.user_device_id}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${apiToken}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         console.error(`HTTP error! Status: ${response.status}`);
//         return;
//       }
//       const result = await response.json();
//       if (result.statusCode === 200) {
//         setComponents(result.result.filter(component => component.deleted === "Active"));
//       }
//     } catch (error) {
//       console.error('Error fetching components:', error);
//     }
//   };

//   // Fetch the current component status (on/off)
//   const fetchComponentStatus = async (componentId) => {
//     try {
//       const response = await fetch(`https://test.moonr.com/LMSService/api/IOTDevice/GetComponentStatus?device_component_id=${componentId}&device_token=${device.deviceToken}`, {
//         method: 'GET',
//         headers: {
//           'user-token': token,
//           'device-token': device.deviceToken,
//         },
//       });

//       const result = await response.json();

//       if (response.ok && result.statusCode === 200) {
//         const status = result.result[0]?.device_status === 'False' ? false : true;
//         return status;
//       } else {
//         console.error('Failed to fetch component status:', result.message || 'Unknown Error');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error fetching component status:', error);
//       return null;
//     }
//   };

//   // Fetch component status when a component is loaded
//   useEffect(() => {
//     const loadComponentStatuses = async () => {
//       const statuses = {};
//       for (let i = 0; i < components.length; i++) {
//         const status = await fetchComponentStatus(components[i].device_component_id);
//         statuses[components[i].device_component_id] = status ? 'True' : 'False';
//       }
//       setComponentStatuses(statuses); // Update the status state
//     };
//     if (components.length > 0) {
//       loadComponentStatuses(); // Trigger status fetching once components are loaded
//     }
//   }, [components]);

//   // Toggle component status based on slider value
//   const toggleComponentStatus = async (componentId, value) => {
//     const status = value === 1;
//     try {
//       const response = await fetch('https://test.moonr.com/LMSService/api/IOT/UpdateComponentStatus', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           device_component_id: componentId,
//           device_token: device.device_token,
//           status: status ? 'True' : 'False', // true/false for On/Off
//         }),
//       });

//       const result = await response.json();

//       if (response.ok && result.statusCode === 200) {
//         console.log('Component status updated successfully.');
//       } else {
//         console.log('Failed to update component status:', result.message);
//       }
//     } catch (error) {
//       console.error('Error updating component status:', error);
//     }
//   };

//   const saveComponent = async () => {
//     if (!componentName || !selectedType) {
//       Alert.alert('Error', 'Please provide a component name and type');
//       return;
//     }

//     setIsLoading(true);

//     let finalComponentPin = '';
//     let component_id = 1;

//     if (selectedType === 'Button') {
//       finalComponentPin = 'Butt2';
//     } else if (selectedType === 'Toggle') {
//       finalComponentPin = 'Toggle1';
//     } else {
//       Alert.alert('Error', 'Invalid component type selected');
//       setIsLoading(false);
//       return;
//     }

//     const componentData = {
//       user_device_id: device.user_device_id,
//       device_component_id: 0,
//       device_component_name: componentName,
//       component_id: component_id,
//       component_pin: finalComponentPin,
//       is_active: 1,
//     };

//     try {
//       const response = await fetch('https://test.moonr.com/LMSService/api/IOT/AddUpdateComponent', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(componentData),
//       });

//       const result = await response.json();

//       if (result.isError) {
//         const errorMessages = result.responseException.validationErrors
//           .map(error => error.errorMessage)
//           .join('\n');
//         Alert.alert('Validation Error', errorMessages);
//       }

//       if (response.ok && result.statusCode === 200) {
//         Alert.alert('Success', 'Component saved successfully');
//         fetchComponents(token);
//         setBottomSheetVisible(false);
//       } else {
//         Alert.alert('Error', result.message || 'Failed to save component');
//       }
//     } catch (error) {
//       console.error('Error saving component:', error);
//       Alert.alert('Error', 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Manage Components</Text>
//       <FlatList
//         data={components}
//         renderItem={({ item }) => {
//           const status = componentStatuses[item.device_component_id] === 'True' ? 1 : 0;

//           return (
//             <View style={styles.componentItem}>
//               <Text>{item.device_component_name} ({item.component_pin})</Text>

//               {/* Fetch the status and display the slider */}
//               <Slider
//                 style={styles.slider}
//                 minimumValue={0}
//                 maximumValue={1}
//                 step={1}
//                 value={status} // If 'True' set to 1, else 0
//                 onValueChange={async (value) => {
//                   toggleComponentStatus(item.device_component_id, value);
//                 }}
//               />
//               <Text style={styles.statusText}>
//                 Status: {status === 1 ? 'On' : 'Off'}
//               </Text>
//             </View>
//           );
//         }}
//         keyExtractor={(item) => item.device_component_id.toString()}
//       />

//       <TouchableOpacity style={styles.button} onPress={() => setBottomSheetVisible(true)}>
//         <Text style={styles.buttonText}>Add Component</Text>
//       </TouchableOpacity>

//       <Modal visible={isBottomSheetVisible} animationType="slide" transparent>
//         <View style={styles.bottomSheetContainer}>
//           <View style={styles.bottomSheet}>
//             <Text style={styles.bottomSheetTitle}>Select Component Type</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Component Name"
//               value={componentName}
//               onChangeText={setComponentName}
//             />
//             <TouchableOpacity
//               style={[styles.optionButton, selectedType === 'Button' && styles.selectedOption]}
//               onPress={() => setSelectedType('Button')}>
//               <Text style={styles.optionText}>Button</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.optionButton, selectedType === 'Toggle' && styles.selectedOption]}
//               onPress={() => setSelectedType('Toggle')}>
//               <Text style={styles.optionText}>Toggle</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.cancelButton} onPress={() => setBottomSheetVisible(false)}>
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.button} onPress={saveComponent} disabled={isLoading}>
//               {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   header: { fontSize: 20, fontWeight: 'bold', marginTop: 50 },
//   button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
//   buttonText: { color: '#fff', fontSize: 16 },
//   componentItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
//   bottomSheetContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
//   bottomSheet: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
//   bottomSheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
//   optionButton: { backgroundColor: '#f0f0f0', padding: 10, marginBottom: 10, borderRadius: 5, alignItems: 'center' },
//   selectedOption: { backgroundColor: '#4CAF50' },
//   optionText: { fontSize: 16 },
//   cancelButton: { backgroundColor: 'gray', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
//   cancelButtonText: { color: '#fff', fontSize: 16 },
//   statusText: { fontSize: 16, marginTop: 10 },
//   slider: { width: '80%', marginTop: 10 },
// });

// export default DC1;
