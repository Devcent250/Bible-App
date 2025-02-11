import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import Verses from '../screens/Verses';
import Devotionals from '../screens/Devotionals';
import Audio from '../screens/Audio';
import Profile from '../screens/Profile';
const Tab = createBottomTabNavigator();


const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow
        }}
        onPress={onPress}
    >
        <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#e32f45',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {children}
        </View>
    </TouchableOpacity>
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
                    ...styles.shadow
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Ionicons name="home-outline" size={24} color={focused ? '#e32f45' : '#748c94'} />
                            <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 10 }}>Home</Text>
                        </View>
                    )
                }}
            />


            <Tab.Screen
                name="Verses"
                component={Verses}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Ionicons name="book-outline" size={24} color={focused ? '#e32f45' : '#748c94'} />
                            <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 10 }}>Verses</Text>
                        </View>
                    )
                }}
            />


            <Tab.Screen
                name="Audio"
                component={Audio}
                options={{
                    tabBarIcon: () => (
                        <MaterialIcons name="play-arrow" size={36} color="#fff" />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    )
                }}
            />



            <Tab.Screen
                name="Devotionals"
                component={Devotionals}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <FontAwesome name="book" size={24} color={focused ? '#e32f45' : '#748c94'} />
                            <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 10 }}>Book</Text>
                        </View>
                    )
                }}
            />


            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Ionicons name="person-outline" size={24} color={focused ? '#e32f45' : '#748c94'} />
                            <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 10 }}>Profile</Text>
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    );
};


const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 14
    }
});

export default Tabs;
