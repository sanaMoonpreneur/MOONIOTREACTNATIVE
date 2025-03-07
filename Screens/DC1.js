import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image, Text, } from "react-native";
import ToggleComponent from "../comp/ToggleComponent";
import BottomSheetComponent from "../comp/ButtomSheetComponent";
import SelectedComponent from "../comp/SelectedComponent";
import { useRoute, useIsFocused } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Animated, { FadeIn, FadeInDown, Easing } from 'react-native-reanimated';
import { Video } from 'expo-av';

export default function DC1({ navigation }) {
  const AnimatedVideo = Animated.createAnimatedComponent(Video);
  const route = useRoute();
  const device_id = route.params.device.device_id;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [mode, setMode] = useState(true);
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isFocused) {
      // Reset the selected component when the screen gains focus
      setSelectedComponent(null);
      console.log("Device TOken: ", route.params.dToken)
    }
  }, [isFocused]);

  const handleSelectComponent = (componentType) => {
    setSelectedComponent(componentType);
    setBottomSheetVisible(false);
  };

  return (
    <ImageBackground
      source={require('../images/chs.png')}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={{ flex: 1, }}>
        < View style={styles.header} >
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={require('../images/a1.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <View style={{ width: 80, marginTop: 40 }}>
          </View>
        </View>
        <View style={styles.container}>
          <ToggleComponent
            onSelect={handleSelectComponent}
            mode={mode}
            onModeChange={setMode}
            device_id={device_id}
            dToken={route.params.dToken}
          />
          <BottomSheetComponent
            visible={bottomSheetVisible}
            onClose={() => setBottomSheetVisible(false)}
            onSelect={handleSelectComponent}
          />
          {selectedComponent && (
            <SelectedComponent
              navigation={navigation}
              itemType={selectedComponent}
              mode={mode}
              device_id={device_id}
            />
          )}

        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
    zIndex: 1
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    marginTop: 35,
    backgroundColor: "#d1a0a7",
  },
  backButtonImage: {
    width: 20,
    height: 15,
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: '100%',
    marginTop: 30,

  },
});

