import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';

import * as Clipboard from 'expo-clipboard';


import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const DeviceDetailsHelp = ({ route, navigation }) => {
  const { device } = route.params;

  const imports = "#include <ESP8266WiFi.h> \n#include <ESP8266HTTPClient.h> \n#include <WiFiClientSecureBearSSL.h> \n#include <DHT.h>";

  const constants = "const char *ssid = wifiUsername; \nconst char *password = wifiPassword \nconst char *backendUrl = APIUrlToValidateDevice; \nconst char *username = lMSAccUsername; \nconst char *loginToken = loginToken; \nconst char *deviceToken = deviceToken;";


  const ledPinConstant = "const int ledPin1 = D1;";
  const initVariableConstant = "bool isLedOn1 = false;";

  const initializeWifiConstants = " Serial.begin(115200); \nWiFi.begin(ssid, password); \nWifi.status() //To check wifi connection status \npinMode(ledPin1, OUTPUT);";
  const getLEDStateConstant = "bool newLedState1 = getLedStateFromBackend(1);";

  const validateDeviceStatus = "validateDeviceStatus(deviceToken, loginToken, username);";

  const updateLEDStateConstant = "updateLedState(ledPin1, isLedOn1, newLedState1);";


  const copyToClipboard = (token) => {
    Clipboard.setStringAsync(token);
  };

  return (

    <ImageBackground
      source={require('../images/chs.png')}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={{
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 20,
        justifyContent: 'space-between'
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 13,
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "#d1a0a7"
          }}
        >
          <Image
            source={require('../images/a1.png')}
            style={{ width: 20, height: 15 }}
          />
        </TouchableOpacity>

      </View>
      <Text style={styles.deviceNameTitle}>{device.device_name}</Text>

      <View style={styles.container}>

        <ScrollView
          showsVerticalScrollIndicator={false} style={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          }}>



          <Text style={styles.deviceName}> Device Token :</Text>
          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{device.device_token}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(device.device_token)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>

          <Text style={styles.deviceName}>Follow below steps in Arduino IDE :</Text>


          <Text style={styles.stepsText}>Import Libraries listed below in arduino code.</Text>

          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{imports}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(imports)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>


          <Text style={styles.stepsText}>Define Constants and Copy the Device Token and create constant variable in arduino code.</Text>

          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{constants}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(constants)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>


          <Text style={styles.stepsText}>Create constants for ledPin configuration.</Text>

          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{ledPinConstant}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(ledPinConstant)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>


          <Text style={styles.stepsText}>Initialize Variables and Objects.</Text>

          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{initVariableConstant}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(initVariableConstant)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>

          <Text style={styles.deviceName}>Setup Function :</Text>

          <Text style={styles.stepsText}>WiFi Connection and Device Initialization</Text>

          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{initializeWifiConstants}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(initializeWifiConstants)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>


          <Text style={styles.stepsText}>Validate Device Token and Update Device Status.</Text>

          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{validateDeviceStatus}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(validateDeviceStatus)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>


          <Text style={styles.deviceName}>Loop Function :</Text>

          <Text style={styles.stepsText}>Get LED state.</Text>

          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{getLEDStateConstant}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(getLEDStateConstant)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>

          <Text style={styles.stepsText}>Update LED State.</Text>

          <View style={styles.copyClipboardView}>

            <Text style={styles.commandText}>{updateLEDStateConstant}</Text>

            <TouchableOpacity
              style={styles.copyIconStyle}
              onPress={
                copyToClipboard(updateLEDStateConstant)
              }
            >
              <Ionicons name="copy" size={18} color="#5A5A5A" />
            </TouchableOpacity>

          </View>


        </ScrollView>

      </View>
    </ImageBackground>





  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: '#FFF2F2',
    marginTop: 40,
    paddingTop: 15,
    borderTopRightRadius: 70,
    borderTopLeftRadius: 70,
    paddingHorizontal: 10,
    height: '80%'
  },

  copyClipboardView: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "#041014",
    borderColor: "#5A5A5A",
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center'
  },

  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,

  },

  deviceNameTitle: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    width: 200,
    alignSelf: "center",
    textAlign: "center",
    marginTop: 30

  },

  commandText: {
    fontSize: 14,
    margin: 10,
    color: "#90EE90"
  },


  stepsText: {
    fontSize: 16,
    margin: 10
  },

});

export default DeviceDetailsHelp;
