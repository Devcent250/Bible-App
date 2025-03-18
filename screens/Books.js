import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const BooksScreen = ({ navigation, route }) => {
  const { testament } = route.params || { testament: "Isezerano Rya Kera" };
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredBooks = books.filter((book) =>
    book.book_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("Chapters", { book: item.book_name, chapters: item.total_chapters })}
    >
      <View style={styles.bookItem}>
        <Icon name="book" size={24} color="#ccc" style={styles.bookIcon} />
        <Text style={styles.bookTitle}>{item.book_name}</Text>
        <Text style={styles.bookDetails}>
          {item.total_chapters} Chapters
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f68c00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#f68c00" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{testament}</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#ccc" style={styles.searchIcon} />
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
        {filteredBooks.length > 0 ? (
          <FlatList
            data={filteredBooks}
            renderItem={renderBook}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
          />
        ) : (
          <Text style={styles.noResults}>Nta gitabo kibonetse</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282B34",
    alignItems: "center",
    padding: 20,
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
  bookCard: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    backgroundColor: "#3A3F4B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  bookIcon: {
    marginBottom: 10,
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
  grid: {
    paddingHorizontal: 15,
  },
  noResults: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});

export default BooksScreen;
