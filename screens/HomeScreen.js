import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        // First time launch
        await AsyncStorage.setItem('hasLaunched', 'true');
        // Wait 3 seconds then navigate
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs', params: { screen: 'Amasezerano' } }],
          });
        }, 3000);
      } else {
        // Not first launch, immediately go to Testments
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs', params: { screen: 'Amasezerano' } }],
        });
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.ubugingo}>
          <Text style={styles.logoText}>U</Text>
        </View>
        <Text style={styles.appName}>UBUGINGO</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  ubugingo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e32f45',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 12,
    borderColor: '#f68c00',
  },
});

export default HomeScreen;
