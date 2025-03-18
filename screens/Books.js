<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const BooksScreen = ({ navigation, route }) => {
  const { testament } = route.params || { testament: "Isezerano Rya Kera" };
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, [testament]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.18.1:5000/api/books/${encodeURIComponent(testament)}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("Chapters", { book: item.book_name, chapters: item.total_chapters })}
    >
      <ImageBackground
        source={{ uri: item.book_cover || "https://via.placeholder.com/150" }}
        style={styles.bookImage}
        imageStyle={styles.bookImageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.bookTitle}>{item.book_name}</Text>
          <Text style={styles.chapterText}>{item.total_chapters} Chapters</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f68c00" />
      </View>
    );
=======
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
>>>>>>> 3cb776eb26be4f35f50eea2a22ee0844748fbfb0
  }

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#f68c00" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{testament}</Text>
      </View>
      <View style={styles.searchBar}>
        <Icon name="search" size={15} color="#ffffff" style={styles.searchIcon} />
      </View>
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.emptyText}>No books found for {testament}</Text>}
      />
=======
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
>>>>>>> 3cb776eb26be4f35f50eea2a22ee0844748fbfb0
    </View>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f68c00",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(246, 140, 0, 0.51)",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
=======
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
>>>>>>> 3cb776eb26be4f35f50eea2a22ee0844748fbfb0
  },
  searchIcon: {
    marginRight: 10,
  },
<<<<<<< HEAD
  grid: {
    paddingHorizontal: 15,
  },
  row: {
    justifyContent: "space-between",
  },
  bookCard: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    height: 150,
  },
  bookImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bookImageStyle: {
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: "rgba(246, 140, 0, 0.51)",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  chapterText: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#f68c00",
  },
});

export default BooksScreen;
=======
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
>>>>>>> 3cb776eb26be4f35f50eea2a22ee0844748fbfb0
