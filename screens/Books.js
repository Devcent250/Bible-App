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
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
};

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
  },
  searchIcon: {
    marginRight: 10,
  },
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