import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import Testments from './screens/Testments';
import Notes from './screens/Notes';
import Books from './screens/Books';
import Audio from './screens/Audio';
import Chapters from './screens/Chapters';
import Player from './screens/Player';
import ChapterDetails from './screens/ChapterDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Books" component={Books} />
    <Stack.Screen name="Audio" component={Audio} />
    <Stack.Screen name="Notes" component={Notes} />
    <Stack.Screen name="Chapters" component={Chapters} />
    <Stack.Screen name="Player" component={Player} />
    <Stack.Screen name="ChapterDetails" component={ChapterDetails} />
  </Stack.Navigator>
);

const TestmentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Testments" component={Testments} />
    <Stack.Screen name="Books" component={Books} />
    <Stack.Screen name="Audio" component={Audio} />
    <Stack.Screen name="Chapters" component={Chapters} />
    <Stack.Screen name="Player" component={Player} />
    <Stack.Screen name="ChapterDetails" component={ChapterDetails} />
  </Stack.Navigator>
);

const AudioStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Audio" component={Audio} />
    <Stack.Screen name="Chapters" component={Chapters} />
    <Stack.Screen name="Player" component={Player} />
    <Stack.Screen name="ChapterDetails" component={ChapterDetails} />
  </Stack.Navigator>
);

const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Notes" component={Notes} />
    <Stack.Screen name="Chapters" component={Chapters} />
    <Stack.Screen name="Player" component={Player} />
    <Stack.Screen name="ChapterDetails" component={ChapterDetails} />
  </Stack.Navigator>
);

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View>
      {children}
    </View>
  </TouchableOpacity>
);

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Ubugingo"
        component={HomeStack}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = route.state?.routes[route.state.index]?.name ?? 'Home';
            return routeName === 'Home' ? { display: 'none' } : styles.tabBar;
          })(route),
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="home-outline"
                size={24}
                color={focused ? '#ffffff' : '#ffffff'}
              />
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="Amasezerano"
        component={TestmentStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="book-outline"
                size={24}
                color={focused ? '#ffffff' : '#ffffff'}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Audio"
        component={AudioStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="musical-notes-outline"
                size={24}
                color={focused ? '#ffffff' : '#ffffff'}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Notes"
        component={NotesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome
                name="file-text-o"
                size={24}
                color={focused ? '#ffffff' : '#ffffff'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const App = () => {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
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
  tabBar: {
    position: 'absolute',
    bottom: 25,
    marginLeft: 10,
    marginRight: 10,
    elevation: 0,
    backgroundColor: '#f68c00',
    borderRadius: 15,
    height: 60,
    ...StyleSheet.create({
      shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
      },
    }).shadow,
  },
});

export default App;