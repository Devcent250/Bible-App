import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library

const books = [
  { id: "1", title: "Matayo", chapters: 28, verses: 1071 },
  { id: "2", title: "Mariko", chapters: 16, verses: 678 },
  { id: "3", title: "Luka", chapters: 24, verses: 1151 },
  { id: "4", title: "Yohana", chapters: 21, verses: 879 },
  { id: "5", title: "Ibyakozwe n’Intumwa", chapters: 28, verses: 1007 },
  { id: "6", title: "Abaroma", chapters: 16, verses: 433 },
  { id: "7", title: "Abakorinto 1", chapters: 16, verses: 437 },
  { id: "8", title: "Abakorinto 2", chapters: 13, verses: 257 },
  { id: "9", title: "Abagalatiya", chapters: 6, verses: 149 },
  { id: "10", title: "Abefeso", chapters: 6, verses: 155 },
  { id: "11", title: "Abafilipi", chapters: 20, verses: 232 },
];

const Books = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter books based on search
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render book row
  const renderRow = (rowBooks) => (
    <View style={styles.row}>
      {rowBooks.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.bookItem}
          onPress={() => navigation.navigate("Chapters", { book: item.title })}
        >
          {/* Bible Icon on Top of Each Book */}
          <Icon name="book" size={24} color="#ccc" style={styles.bookIcon} />
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookDetails}>
            Ibice: {item.chapters} | Imirongo: {item.verses}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const rows = [];
  for (let i = 0; i < filteredBooks.length; i += 2) {
    rows.push(filteredBooks.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#ccc" style={styles.searchIcon} /> {/* Search icon */}
        <TextInput
          style={styles.searchInput}
          placeholder="Shaka igitabo..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Book List */}
      <ScrollView style={styles.scrollView}>
        {rows.length > 0 ? (
          rows.map((row, index) => <View key={index}>{renderRow(row)}</View>)
        ) : (
          <Text style={styles.noResults}>Nta gitabo kibonetse</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Books;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282B34",
    alignItems: "center",
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: "#FFFFFF",
  },
  scrollView: {
    width: "100%",
  },
  bookItem: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    backgroundColor: "#3A3F4B", // Dark card background
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Position of shadow
    shadowOpacity: 0.3, // Shadow transparency
    shadowRadius: 5, // Shadow blur effect
    elevation: 6, // For Android shadow effect
  },
  bookIcon: {
    marginBottom: 10, // Space between icon and title
  },
  bookTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  bookDetails: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 5,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  noResults: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});