import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

// Import screens
import Home from '../screens/HomeScreen';
import Books from '../screens/Books';
import Testments from '../screens/Testments';
import Notes from '../screens/Notes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={Home} />
    <Stack.Screen name="Books" component={Books} />
  </Stack.Navigator>
);

// Testaments Stack
const TestmentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TestamentsMain" component={Testments} />
  </Stack.Navigator>
);

// Notes Stack
const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotesMain" component={Notes} />
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
          shadowColor: '#7F5DF0',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        },
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home-outline" size={24} />
          ),
        }}
      />

      {/* Testaments Tab */}
      <Tab.Screen
        name="Testments"
        component={TestmentStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="book" size={24} color={focused ? '#ffffff' : '#ffffff'} />
          ),
        }}
      />

      {/* Notes Tab */}
      <Tab.Screen
        name="Notes"
        component={NotesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="book-outline" size={24} color={focused ? '#A93341' : '#748c94'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
