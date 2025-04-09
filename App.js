import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import SplashScreen from './screens/SplashScreen';

import HomeScreen from './screens/HomeScreen';
import Testments from './screens/Testments';
import Notes from './screens/Notes';
import Books from './screens/Books';
import Audio from './screens/Audio';
import AudioList from './screens/AudioList';
import Chapters from './screens/Chapters';
import Player from './screens/Player';
import RecentlyPlayed from './screens/RecentlyPlayed'; // Add this import

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#f68c00',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerBackTitleVisible: false,
  headerLeftContainerStyle: {
    paddingLeft: 15,
  },
};

const MainStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="Testments"
      component={Testments}
      options={{ title: 'UBUGINGO' }}
    />
    <Stack.Screen
      name="Books"
      component={Books}
      options={({ route }) => ({ title: route.params?.testament || 'Books' })}
    />
    <Stack.Screen
      name="MainChapters"
      component={Chapters}
      options={({ route }) => ({ title: route.params?.book || 'Chapters' })}
    />
    <Stack.Screen
      name="Player"
      component={Player}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AudioStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="RecentlyPlayed"  // Change the initial screen to RecentlyPlayed
        component={RecentlyPlayed}
        options={{
          title: 'Recently Played',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AudioList"
        component={AudioList}
        options={{
          title: 'All Audio Books',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AudioChapters"
        component={Chapters}
        options={({ route }) => ({
          title: route.params?.book || 'Chapters',
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="Player"
        component={Player}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const NotesStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="NotesMain"
      component={Notes}
      options={{ title: 'Notes' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Main"
        component={MainStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="home-outline"
                size={24}
                color="#ffffff"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AudioTab"
        component={AudioStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="musical-notes-outline"
                size={24}
                color="#ffffff"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notesrrr"
        component={NotesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome
                name="file-text-o"
                size={24}
                color="#ffffff"
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 14,
  },
  tabBar: {
    backgroundColor: '#f68c00',
    borderRadius: 15,
    height: 60,
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
