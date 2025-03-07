import React, { useState, useEffect } from "react";
import { View, PanResponder, Animated, TouchableOpacity, Text } from "react-native";
import { Entypo } from '@expo/vector-icons'; // Importing Entypo icon from Expo vector icons
import AsyncStorage from '@react-native-async-storage/async-storage';

import ButtonComponent from "./ButtonComponent";
import TextLabelComponent from "./TextLabelComponent";
import SwitchComponent from "./SwitchComponent";

const SelectedComponent = ({ itemType, mode, navigation, device_id }) => {
  const [components, setComponents] = useState([]);
  const [currentComponentPosition, setCurrentComponentPosition] = useState({ x: 0, y: 0 });
  //console.log(components)

  useEffect(() => {
    if (itemType) {
      addComponent(itemType);

    }
    getData()
  }, [itemType]);

  const storeData = async (components) => {
    try {
      const jsonValue = JSON.stringify(components);

      await AsyncStorage.setItem('my-key', jsonValue);


    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('my-key');
      // return jsonValue != null ? JSON.parse(jsonValue) : null;
      // console.log(components)
      if (jsonValue !== null) {
        // We have data!!
        console.log('jsonValue')
        console.log(JSON.parse(jsonValue));
      }
    } catch (e) {
      // error reading value
    }
  };

  const addComponent = (componentType) => {
    setComponents(prevComponents => {
      const id = generateUniqueId();
      const position = new Animated.ValueXY();
      const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
          position.setValue({ x: gestureState.dx, y: gestureState.dy });
          setCurrentComponentPosition({ x: gestureState.dx, y: gestureState.dy });
        },
        onPanResponderRelease: () => { },
        onPanResponderGrant: (event, gestureState) => {
          if (mode && gestureState.numberActiveTouches === 1) {
            // Additional handling if needed
          }
        },
      });
      console.log('components')
      storeData();
      return [...prevComponents, { id, type: componentType, position, panResponder }];
    });
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const deleteComponent = (id) => {
    setComponents(prevComponents => prevComponents.filter(component => component.id !== id));
  };

  return (
    <View style={{ flex: 1 }}>
      {components.map((component) => (
        <Animated.View
          key={component.id}
          style={{
            position: "absolute",
            transform: [{ translateX: component.position.x }, { translateY: component.position.y }],
          }}
          {...(mode ? component.panResponder.panHandlers : null)}
        >
          {component.type === "Button" && <ButtonComponent device_id={device_id} mode={mode} x={currentComponentPosition.x} y={currentComponentPosition.y} />}
          {component.type === "Text Label" && <TextLabelComponent mode={mode} />}
          {component.type === "Switch" && <SwitchComponent />}

          {mode && (
            <TouchableOpacity
              style={{ position: "absolute", top: -10, right: -10 }}
              onPress={() => deleteComponent(component.id)}
            >
              <Entypo name="circle-with-cross" size={24} color="red" />
            </TouchableOpacity>
          )}
        </Animated.View>

      ))}
      {/* Display the position of the current component */}
      <Text style={{ position: "absolute", bottom: 20, }}> x={currentComponentPosition.x}, y={currentComponentPosition.y}
      </Text>
    </View>
  );
};

export default SelectedComponent;
