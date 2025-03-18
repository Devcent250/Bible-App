import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const Notes = () => {
  return (
    <View style={styles.container}>
      {/* Note 1 */}
      <View style={styles.noteContainer}>
        <View style={styles.audioContainer}>
          <Icon name="play-circle" size={24} color="#fff" />
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
          <Text style={styles.dateText}>2023-03-01</Text>
        </View>
        <Text style={styles.noteNumber}>1</Text>
        <View style={styles.noteTextContainer}>
          <Text style={styles.noteText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          <Text style={styles.noteText}>
            Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio.
          </Text>
          <Text style={styles.noteText}>
            Vitae scelerisque enim ligula venenatis dolor.
          </Text>
          <Text style={styles.noteText}>
            Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
          </Text>
        </View>
        <Text style={styles.noteFooter}>Itangiro 1</Text>
      </View>

      {/* Note 2 */}
      <View style={styles.noteContainer}>
        <View style={styles.audioContainer}>
          <Icon name="play-circle" size={24} color="#fff" />
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
          <Text style={styles.dateText}>2023-03-02</Text>
        </View>
        <Text style={styles.noteNumber}>5</Text>
        <View style={styles.noteTextContainer}>
          <Text style={styles.noteText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          <Text style={styles.noteText}>
            Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio.
          </Text>
          <Text style={styles.noteText}>
            Vitae scelerisque enim ligula venenatis dolor.
          </Text>
          <Text style={styles.noteText}>
            Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
          </Text>
        </View>
        <Text style={styles.noteFooter}>Matayo 1:2</Text>
      </View>
    </View>
  );
};

export default Notes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a202c",
    padding: 20,
  },
  noteContainer: {
    marginBottom: 40,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: "#4a5568",
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressBar: {
    width: "50%",
    height: "100%",
    backgroundColor: "#f68c00",
    borderRadius: 2,
  },
  dateText: {
    color: "#a0aec0",
    fontSize: 12,
    marginTop: 12,
  },
  noteNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#f68c00",
    marginBottom: 10,
  },
  noteTextContainer: {
    marginBottom: 10,
  },
  noteText: {
    color: "#e2e8f0",
    fontSize: 16,
    marginBottom: 5,
  },
  noteFooter: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "bold",
  },
});
