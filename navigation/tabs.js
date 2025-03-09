import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import Home from '../screens/HomeScreen';
import Books from '../screens/Books';
import Testments from '../screens/Testments';
import Notes from '../screens/Notes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


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

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="Books"
      component={Books}
      options={{
        tabBarIcon: () => null,
        tabBarStyle: {
          display: 'none',
        },
      }}
    />
  </Stack.Navigator>
);

const Testment = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Books" component={Testments} />
  </Stack.Navigator>
);

const Verses = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Verses" component={Verses} />
  </Stack.Navigator>
);


const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          marginLeft: 10,
          marginRight: 10,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 60,
          ...styles.shadow,
        },
      }}
    >

      <Tab.Screen
        name="Ijambo"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="home-outline"
                size={24}
                color={focused ? '#A93341' : '#748c94'}
              />

            </View>
          ),
        }}
      />


      <Tab.Screen
        name="IBITABO"
        component={Testments}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome
                name="book"
                size={24}
                color={focused ? '#A93341' : '#748c94'}
              />

            </View>
          ),
        }}
      />




      <Tab.Screen
        name="Chapter 1 "
        component={Notes}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="book-outline"
                size={24}
                color={focused ? '#A93341' : '#748c94'}
              />


            </View>
          ),
        }}
      />

   
    </Tab.Navigator>
  );
};

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
