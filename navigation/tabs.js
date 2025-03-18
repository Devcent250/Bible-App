import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

// Import screens
import Home from '../screens/HomeScreen';
import Books from '../screens/Books';
import Testments from '../screens/Testments';
import Audio from '../screens/Audio';
import Profile from '../screens/Profile';
import Notes from '../screens/Notes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Floating Button
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#A93341',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Books" component={Books} />
  </Stack.Navigator>
);

// Testaments Stack
const TestmentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TestmentsMain" component={Testments} />
  </Stack.Navigator>
);

// Notes Stack
const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotesMain" component={Notes} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={Profile} />
  </Stack.Navigator>
);

// Bottom Tab Navigator
const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          marginHorizontal: 10,
          borderRadius: 15,
          height: 60,
          elevation: 5,
          backgroundColor: '#ffffff',
          ...styles.shadow,
        },
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="home-outline"
                size={24}
                color={focused ? '#A93341' : '#748c94'}
              />
              <Text style={{ color: focused ? '#A93341' : '#748c94', fontSize: 10 }}>Home</Text>
            </View>
          ),
        }}
      />

      {/* Testaments Tab */}
      <Tab.Screen
        name="Testments"
        component={TestmentStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome
                name="book"
                size={24}
                color={focused ? '#A93341' : '#748c94'}
              />
              <Text style={{ color: focused ? '#A93341' : '#748c94', fontSize: 10 }}>Books</Text>
            </View>
          ),
        }}
      />


      <Tab.Screen
        name="Audio"
        component={Audio}
        options={{
          tabBarIcon: () => <MaterialIcons name="play-arrow" size={36} color="#fff" />,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />


      <Tab.Screen
        name="Notes"
        component={NotesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="book-outline"
                size={24}
                color={focused ? '#A93341' : '#748c94'}
              />
              <Text style={{ color: focused ? '#A93341' : '#748c94', fontSize: 10 }}>Notes</Text>
            </View>
          ),
        }}
      />


    </Tab.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 14,
  },
});

export default Tabs;
