import React from "react";
import { View, Text, Button, StyleSheet } from 'react-native';

const Profile = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

        </View>
    );
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8fcbbc'

    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },

});