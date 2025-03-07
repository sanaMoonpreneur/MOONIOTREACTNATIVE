import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, Image, Text, BackHandler } from 'react-native';
import { useRef, useEffect } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


export default function CustomDrawer(props) {
  const refRBSheet = useRef();
  const navigation = useNavigation();
  const animation = useRef(null);
  useEffect(() => {
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF2F2' }}>
      <DrawerContentScrollView {...props}>
        <TouchableOpacity
          onPress={() => props.navigation.closeDrawer()}
          style={{
            width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 30,
            borderRadius: 10, margin: 10, backgroundColor: "#f58084",
          }}>
          <Ionicons name="arrow-back-outline" size={30} color={'white'}></Ionicons>
        </TouchableOpacity>
        <DrawerItemList {...props} />

      </DrawerContentScrollView>

      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 10 }} onPress={async () => {
          props.navigation.closeDrawer()
          AsyncStorage.clear();
          navigation.navigate('LogIn')
        }}>
          <MaterialIcons name="logout" size={24} color="#f58084" />
          <Text style={{ fontWeight: "bold",marginLeft: 5, color: '#f58084', marginTop: 3, fontSize: 14 }} >Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => refRBSheet.current.open()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="exit-to-app" size={24} color={'#f58084'} />
            <Text style={{ fontSize: 15, marginLeft: 5, color: '#f58084', fontWeight: "bold", }}>Exit</Text>
          </View>
        </TouchableOpacity>

        <RBSheet
          ref={refRBSheet}
          useNativeDriver={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              backgroundColor: "#f58084",
              borderTopRightRadius: 70,
              borderTopLeftRadius: 70,
              paddingVertical: 30,
              height: '50%',

            }
          }}
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}
          customAvoidingViewProps={{
            enabled: false,
          }}>
          <View style={{ alignItems: 'center' }}>

            <LottieView
              autoPlay
              ref={animation}
              source={require('../assets/images/exit.json')}
              style={{

                width: 200,
                height: 200,
              }}
            />
            <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text style={{ color: "white", fontSize: 17, fontWeight: "bold", }}>
                Are you sure you want to exit this app ?
              </Text>
              <TouchableOpacity style={{

                backgroundColor: "#FFF2F2",
                alignItems: "center",
                marginTop: 20,
                width: 100,
                paddingVertical: 10,
                borderRadius: 14,
                paddingHorizontal: 10
              }} onPress={() => {
                BackHandler.exitApp()
                console.log('sana')
              }
              }>
                <Text style={{
                  color: "#345c74",
                  fontWeight: "bold",
                  fontSize: 15
                }}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{

                backgroundColor: "#FFF2F2",
                alignItems: "center",
                marginTop: 20,
                width: 100,
                paddingVertical: 10,
                borderRadius: 14,
                paddingHorizontal: 10
              }}
                onPress={() => refRBSheet.current.close()}>
                <Text style={{
                  color: "#345c74",
                  fontWeight: "bold",
                  fontSize: 15
                }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
    </View>
  );
}