import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    return (
        <ImageBackground source={require('../images/chs.png')} style={styles.background}>
            <View style={styles.container}>
                {/* Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image source={require('../images/a1.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <Text style={styles.title}>Privacy Policy</Text>

                {/* Content */}
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} >
                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>
                            This policy is in accordance with the U.S. Children’s Online Privacy Protection Act (COPPA) and outlines our practices in the United States and Latin America regarding children’s personal information.
                        </Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>
                            We’ll review this Privacy Policy from time to time to make sure it is up-to-date. If you are just a visitor make sure please review this Policy periodically.
                        </Text>
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>
                            If you are our registered user, we will notify you before we make changes to this Policy and give you the opportunity to review the revised Policy before you choose to continue using our services.
                        </Text>
                    </View>
                    <View >
                        {/* Website Link */}
                        <TouchableOpacity onPress={() => Linking.openURL('https://moonpreneur.com/resources/privacy-policy/')} style={styles.linkButton}>
                            <Text style={styles.linkText}>Visit Moonpreneur Website</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
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
        marginBottom: 20,
    },
    contentContainer: {
        maxWidth: '90%',
        alignSelf: 'center',
        borderRadius: 20,
        flexGrow: 0,
        marginTop: 10,
        padding: 15,
        backgroundColor: 'white',
    },
    text: {
        color: 'black',
        fontSize: 16,
        textAlign: 'justify',
        marginBottom: 10,
    },
    linkButton: {
        marginTop: 15,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f5837a',
        borderRadius: 20,
        marginBottom: 10,
        elevation: 5,
    },
    linkText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PrivacyPolicyScreen;