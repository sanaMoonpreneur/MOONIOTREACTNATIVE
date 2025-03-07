import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ImageBackground, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const SETTINGS_OPTIONS = [
  { id: '1', title: 'Profile', screen: 'Profile' },
  { id: '2', title: 'About Us', screen: 'AboutUs' },
  { id: '3', title: 'Privacy Policy', screen: 'PrivacyPolicy' },
  { id: '4', title: 'FAQ', screen: 'FAQ' },
];

const SettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../images/chs.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../images/a1.png')} style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Settings</Text>

        <View style={styles.flatListContainer}>
          <FlatList
            data={SETTINGS_OPTIONS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate(item.screen)}>
                <Text style={styles.optionText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Separator Line */}
        <View style={styles.separator} />

        {/* Logout Button */}
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.clear();
            navigation.navigate('LogIn');
          }}
          style={styles.logoutButton}
        >
          <MaterialIcons name="logout" size={24} color="#f58084" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 30,
    backgroundColor: "#d1a0a7",
  },
  backIcon: {
    width: 20,
    height: 15,
  },
  title: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  flatListContainer: {
    width: '80%',
    alignSelf: 'center',
    flexGrow: 0,
  },
  optionButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  optionText: {
    color: 'black',
    fontWeight: "600",
    fontSize: 18,
  },
  separator: {
    width: '80%',
    height: 2,
    backgroundColor: 'black',
    marginVertical: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutText: {
    fontWeight: "bold",
    marginLeft: 5,
    color: '#f58084',
    fontSize: 16,
  },
});

export default SettingsScreen;
