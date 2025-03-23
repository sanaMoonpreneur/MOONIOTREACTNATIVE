import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChooseHardware = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [hardwaresResponse, setHardwaresResponse] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedLoginResponse = await AsyncStorage.getItem('loginResponse');
        if (storedLoginResponse) {
          const parsedResponse = JSON.parse(storedLoginResponse);
          return parsedResponse.result[0].token;
        }
      } catch (error) {
        console.error('Error retrieving token from AsyncStorage:', error);
      }
    };

    const fetchData = async () => {
      const apiToken = await fetchToken();
      if (!apiToken) return;

      try {
        const response = await fetch('https://moonhub.moonpreneur.com/LMSService/api/IOT/GetHardwares', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${apiToken}` },
        });

        const result = await response.json();
        if (result.statusCode === 200 && !result.isError) {
          setHardwaresResponse(result.result);
        } else {
          console.error('Failed to fetch devices:', result.message);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ImageBackground source={require('../images/chs.png')} style={styles.background}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../images/a1.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Choose Hardware</Text>

      {isLoading ? (
        <ActivityIndicator color={'white'} size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={hardwaresResponse}
          keyExtractor={(item) => item.hardware_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.hardwareItem}
              onPress={() => navigation.navigate('AddDevice', { data: item.hardware_name })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.hardware_image }} style={styles.hardwareImage} />
                <View style={styles.hardwareTextContainer}>
                  <Text style={styles.hardwareName}>{item.hardware_name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 30,
    backgroundColor: '#d1a0a7',
  },
  backIcon: { width: 20, height: 15 },
  title: {
    color: 'white',
    fontSize: 35,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  hardwareItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
  },
  hardwareImage: { width: 80, height: 80, marginRight: 15, borderRadius: 15, },
  hardwareTextContainer: { flex: 1 },
  hardwareName: { color: '#345c74', fontWeight: 'bold', fontSize: 20 },
  hardwareDesc: { color: '#f58084', fontSize: 14 },
});

export default ChooseHardware;
