import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Testaments = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Books", { testament: "Isezerano Rya Kera" })}
        >
          <Text style={styles.buttonText}>ISEZERANO RYA KERA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Books", { testament: "Isezerano Rishya" })}
        >
          <Text style={styles.buttonText}>ISEZERANO RISHYA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#f68c00',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Testaments;