import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Icon name="book" size={60} color="#fff" />
        <Text style={styles.logoText}>IJAMBO</Text>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#282B34',
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
playButton: {
  position: 'absolute',
  bottom: 80,
  backgroundColor: '#e32f45',
  padding: 15,
  borderRadius: 50,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 5,
},
});

export default HomeScreen;
