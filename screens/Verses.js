import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Verses = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verses</Text>

        </View>
    );
};

export default Verses;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#8fcbbc",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },

});
