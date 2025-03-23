import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

const FAQ_DATA = [
  { id: '1', question: 'What is this IoT app, and what can I do with it?', answer: 'This app allows you to manage and control IoT devices, monitor real-time data, and automate tasks for your connected devices.' },
  { id: '2', question: 'How is this app different from other IoT apps?', answer: 'It provides an intuitive interface, supports a wide range of components, and offers easy integration with popular platforms like Arduino and MicroPython.' },
  { id: '3', question: 'Who can use this app?', answer: 'Anyone interested in IoT, from hobbyists to professionals, can use the app to manage and control IoT devices.' },
  { id: '4', question: 'Do I need coding experience to use the app?', answer: 'No, the app is designed to be user-friendly and requires no coding experience to set up and use.' }
];
const Stack = createStackNavigator();

const FAQScreen = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ImageBackground source={require('../images/chs.png')} style={{ width: '100%', height: '100%' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 20,
          marginTop: 20,
          justifyContent: 'space-between'
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{
            paddingHorizontal: 10,
            paddingVertical: 13,
            borderRadius: 10,
            marginTop: 30,
            backgroundColor: '#d1a0a7'
          }}>
            <Image source={require('../images/a1.png')} style={{ width: 20, height: 15 }} />
          </TouchableOpacity>
        </View>

        <Text style={{
          color: 'white', fontSize: 35, fontWeight: "bold", width: 200, alignSelf: 'center', textAlign: 'center', marginTop: 30, marginBottom: 20
        }}>FAQs</Text>

        <View style={{ flex: 1, alignItems: 'center',padding:10 }}>
          <FlatList
            data={FAQ_DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  padding: 15,
                  marginVertical: 10,
                  borderRadius: 10,
                }}
                onPress={() => toggleExpand(item.id)}
              >
                <Text style={{ color: 'black', fontSize: 18,}}>{item.question}</Text>
                {expandedId === item.id && (
                  <Text style={{ color: 'gray', fontSize: 16, marginTop: 10,}}>{item.answer}</Text>
                )}
                <MaterialIcons
                  name={expandedId === item.id ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="black"
                  style={{ position: 'absolute', bottom: 10, right: 10 }}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default FAQScreen;