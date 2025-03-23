import React, { useEffect, useState } from 'react';
import { View, TextInput, Switch, ActivityIndicator, TouchableOpacity, Image, ImageBackground, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SensorControl = ({ route }) => {
    const navigation = useNavigation();
    const { component, device } = route.params;

    const [desc, setDesc] = useState('');
    const [text, setText] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComponentDetails();
    }, []);

    const fetchComponentDetails = async () => {
        try {
            const apiUrl = `https://test.moonr.com/LMSService/api/IOTDevice/GetComponentStatus?device_component_id=${component.device_component_id}&device_token=${device.device_token}`;
            console.log("Fetching Data from:", apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'user-token': device.securityToken,
                    'device-token': device.device_token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Data:", data);

                if (data.result && data.result.length > 0) {
                    const componentData = data.result[0];

                    setDesc(componentData.component_desc || '');
                    setText(componentData.component_text || '');
                    setIsEnabled(componentData.device_status === "True");
                }
            } else {
                console.error("Error fetching component details:", response.status);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const newStatus = isEnabled ? true : false;

        const requestBody = {
            device_component_id: String(component.device_component_id),
            device_token: String(device.device_token),
            status: newStatus,
            component_desc: desc,
            component_text: text,
        };

        console.log("Update Request:", JSON.stringify(requestBody));

        try {
            const response = await fetch('https://test.moonr.com/LMSService/api/IOTDevice/UpdateComponentStatus', {
                method: 'POST',
                headers: {
                    'user-token': device.securityToken,
                    'device-token': device.device_token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                console.log("Component updated successfully");
                navigation.goBack();
            } else {
                console.error('Error updating sensor:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../images/chs.png')} style={{ width: '100%', height: '100%' }}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 20, marginTop: 20, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.crossButton}>
                        <Image source={require('../images/a1.png')} style={{ width: 20, height: 15 }} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.header}>Sensor</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <>
                        <View style={{ padding: 20 }}>
                            <Text style={styles.statusText}>Component Description:</Text>
                            <TextInput style={styles.input} value={desc} onChangeText={setDesc} />

                            <Text style={styles.statusText}>Component Text:</Text>
                            <TextInput style={styles.input} value={text} onChangeText={setText} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.statusText}>Status:</Text>
                                <Switch value={isEnabled} onValueChange={() => setIsEnabled((prev) => !prev)} />
                            </View>

                            <TouchableOpacity style={styles.save} onPress={handleSave}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    header: { fontSize: 35, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 15, backgroundColor: 'white' },
    save: { backgroundColor: 'white', padding: 12, borderRadius: 25, alignItems: 'center', marginTop: 10 },
    saveText: { color: '#EC8588', fontSize: 16, fontWeight: 'bold' },
    cancelButton: { backgroundColor: 'gray', padding: 12, borderRadius: 25, alignItems: 'center', marginTop: 10 },
    cancelButtonText: { color: '#fff', fontSize: 16 },
    statusText: { fontSize: 16, marginTop: 10, fontWeight: 'bold', marginBottom: 10 },
    crossButton: { paddingHorizontal: 10, paddingVertical: 13, borderRadius: 10, marginTop: 30, backgroundColor: '#d1a0a7' },
});

export default SensorControl;
