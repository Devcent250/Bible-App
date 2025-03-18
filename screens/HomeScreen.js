import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Amasezerano', { screen: 'Testments' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/ubugingo.png')} style={styles.ubugingo} />
        <Text style={styles.logoText}>UBUGINGO</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f68c00',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
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
