import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FIRST_LAUNCH_KEY = 'isFirstLaunch';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        checkFirstLaunch();
    }, []);

    const checkFirstLaunch = async () => {
        try {
            const isFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);

            if (isFirstLaunch === null) {
                // This is the first launch
                await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
                // Show splash for 2 seconds then navigate
                setTimeout(() => {
                    navigation.replace('MainTabs');
                }, 2000);
            } else {
                // Not first launch, navigate immediately
                navigation.replace('MainTabs');
            }
        } catch (error) {
            // In case of error, default to showing splash
            setTimeout(() => {
                navigation.replace('MainTabs');
            }, 2000);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/ubugingo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.appName}>UBUGINGO</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f68c00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: SCREEN_WIDTH * 0.4,
        height: SCREEN_WIDTH * 0.4,
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default SplashScreen; 