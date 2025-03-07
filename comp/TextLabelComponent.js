import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from 'axios'; 
import { useNavigation } from "@react-navigation/native";

const TextLabelComponent = ({ mode }) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!mode) {
      fetchData();
    }
  }, [mode]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://16afeef2-403c-4657-abaf-0a9328b9dcf7-00-9l04p6ib2ebl.picard.replit.dev/send-sensor-data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePress = () => {
    if (mode) {
      navigation.navigate('EnterCompDetai');
    }
  };

  return (
    <View style={styles.container}>
      {mode ? (
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.text}>Text Label</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.text}>Temp : {data.temperature} Humidity :{data.humidity}</Text>
        
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default TextLabelComponent;
