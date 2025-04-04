import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/HomeScreen';
import NotesScreen from '../screens/NotesScreen';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AudioStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AudioList" component={AudioList} />
            <Stack.Screen name="Player" component={Player} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Audio') {
                        iconName = 'music';
                    } else if (route.name === 'Notes') {
                        iconName = 'book';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#f68c00',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Audio" component={AudioStack} />
            <Tab.Screen name="Notes" component={NotesScreen} />
        </Tab.Navigator>
    );
};

export default AppNavigator; 