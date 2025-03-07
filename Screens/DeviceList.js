import React from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, Dimensions, RefreshControl } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { LogBox } from 'react-native';
import { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function DeviceList({ route, navigation }) {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);
    const [refreshing, setRefreshing] = useState(false);
    const { param1, param2 } = route.params;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

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
                justifyContent: 'space-between',


            }}>
                <TouchableOpacity onPress={() => {

                    navigation.navigate('Drawer')

                }}

                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 13,
                        borderRadius: 10,
                        marginTop: 30,
                        backgroundColor: "#d1a0a7"
                    }}
                >
                    <Image
                        source={require('../images/a1.png')}
                        style={{ width: 20, height: 15 }}
                    />
                </TouchableOpacity>

            </View>
            <View style={{ width: '100%', height: '20%', }}>
                <Text style={{
                    color: "white",
                    fontSize: 35,
                    fontWeight: "bold",
                    width: 200,
                    alignSelf: "center",
                    textAlign: "center",
                    marginTop: 30

                }}>
                    IOT Devices
                </Text>
            </View>

            <Modalize
                handleStyle={{
                    marginTop: 30,
                    backgroundColor: "#e9e9e9",
                    width: 80,

                }}
                modalStyle={{
                    borderTopLeftRadius: 60,
                    borderTopRightRadius: 60
                }}
                alwaysOpen={500}
            >



                <View style={{ marginTop: 30, maxHeight: Dimensions.get('window').height - 40, paddingBottom: 250 }}>
                    <FlatList
                        data={param1}
                        renderItem={param2}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </Modalize>

        </ImageBackground>
    )
}
