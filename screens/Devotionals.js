import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const Devotionals = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Devotionals</Text>

        </View>
    );
}

export default Devotionals;

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