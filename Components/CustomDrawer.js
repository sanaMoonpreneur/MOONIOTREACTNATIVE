import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, BackHandler, StyleSheet } from 'react-native';
import { useRef } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

export default function CustomDrawer(props) {
  const refRBSheet = useRef();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <TouchableOpacity
          onPress={() => props.navigation.closeDrawer()}
          style={styles.closeButton}>
          <Ionicons name="arrow-back-outline" size={30} color={'white'} />
        </TouchableOpacity>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.option} onPress={async () => {
          props.navigation.closeDrawer();
          AsyncStorage.clear();
          navigation.navigate('LogIn');
        }}>
          <MaterialIcons name="logout" size={24} color="#f58084" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => refRBSheet.current.open()}>
          <MaterialIcons name="exit-to-app" size={24} color={'#f58084'} />
          <Text style={styles.optionText}>Exit</Text>
        </TouchableOpacity>

        <RBSheet
          ref={refRBSheet}
          useNativeDriver={true}
          customStyles={{
            wrapper: { backgroundColor: 'transparent' },
            draggableIcon: { backgroundColor: '#000' },
            container: styles.rbSheetContainer,
          }}
          customModalProps={{ animationType: 'slide', statusBarTranslucent: true }}
          customAvoidingViewProps={{ enabled: false }}>
          <View style={styles.sheetContent}>
            <LottieView autoPlay source={require('../assets/images/exit.json')} style={styles.lottie} />
            <Text style={styles.exitText}>Are you sure you want to exit this app?</Text>
            <TouchableOpacity style={styles.button} onPress={() => BackHandler.exitApp()}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => refRBSheet.current.close()}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF2F2' },
  closeButton: {
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
    marginBottom: 30, borderRadius: 10, margin: 10, backgroundColor: "#f58084",
  },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' },
  option: { flexDirection: 'row', marginBottom: 10 },
  optionText: { fontWeight: "bold", marginLeft: 5, color: '#f58084', marginTop: 3, fontSize: 14 },
  rbSheetContainer: {
    backgroundColor: "#f58084", borderTopRightRadius: 70, borderTopLeftRadius: 70,
    paddingVertical: 30, height: '50%',
  },
  sheetContent: { alignItems: 'center' },
  lottie: { width: 200, height: 200 },
  exitText: { color: "white", fontSize: 17, fontWeight: "bold", textAlign: 'center' },
  button: {
    backgroundColor: "#FFF2F2", alignItems: "center", marginTop: 20, width: 100,
    paddingVertical: 10, borderRadius: 14, paddingHorizontal: 10,
  },
  buttonText: { color: "#345c74", fontWeight: "bold", fontSize: 15 },
});
