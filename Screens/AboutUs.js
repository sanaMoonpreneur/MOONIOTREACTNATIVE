import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AboutUsScreen = () => {
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
                <Text style={styles.title}>About Us</Text>

                {/* Content */}
                <ScrollView style={styles.contentContainer}>
                    <Text style={styles.text}>
                        Moonpreneur was founded in 2020 to bridge the gap in the traditional education system and prepare children for college admissions and the future workplace.
                    </Text>
                    <Text style={styles.text}>
                        K-12 education does not include teaching innovation and entrepreneurship, leaving students unaware of their passions until later in life.
                    </Text>
                    <Text style={styles.text}>
                        The conventional education system is therefore not adequately preparing students for the future. Moonpreneur Inc is addressing this gap by kindling an innovative and entrepreneurial spirit in children.
                    </Text>
                    <Text style={styles.text}>
                        It leverages that instinctive human spirit for entrepreneurship to create a learning environment for 7-16-year-olds in Tech, STEM, and soft-skills.
                    </Text>

                    {/* Website Link */}
                    <TouchableOpacity onPress={() => Linking.openURL('https://moonpreneur.com/home/about-us')} style={styles.linkButton}>
                        <Text style={styles.linkText}>Visit Moonpreneur Website</Text>
                    </TouchableOpacity>
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
        maxWidth: '85%',
        alignSelf: 'center',
        flexShrink: 1,
        borderRadius: 20,
        flexGrow: 0,
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

export default AboutUsScreen;