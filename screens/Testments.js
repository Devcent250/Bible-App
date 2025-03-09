import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Devotionals = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* First Button (No Navigation) */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>ISEZERANO RYA KERA</Text>
      </TouchableOpacity>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Second Button (Navigates to 'Books' screen) */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Books")} // Navigates to the Books screen
      >
        <Text style={styles.buttonText}>ISEZERANO RISHYA</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Devotionals;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#282B34",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    width: "80%",
    height: 1,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
});