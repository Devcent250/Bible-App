import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Testaments = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* First Button (Navigates to 'Books' screen with 'Isezerano Rya Kera') */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Books", { testament: "Isezerano Rya Kera" })}
      >
        <Text style={styles.buttonText}>ISEZERANO RYA KERA</Text>
      </TouchableOpacity>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Second Button (Navigates to 'Books' screen with 'Isezerano Rishya') */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Books", { testament: "Isezerano Rishya" })}
      >
        <Text style={styles.buttonText}>ISEZERANO RISHYA</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Testaments;

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
    backgroundColor: "#f68c00",
    borderRadius: 18,
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
