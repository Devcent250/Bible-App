  import React, { useState, useEffect } from "react";
  import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ImageBackground, TextInput, SafeAreaView, Platform } from "react-native";
  import Icon from "react-native-vector-icons/FontAwesome";
  import { API_URL, API_TIMEOUT } from '../config';

  const BooksScreen = ({ navigation, route }) => {
    const { testament } = route.params || { testament: "Isezerano Rya Kera" };

    // Configure the navigation header
    React.useLayoutEffect(() => {
      navigation.setOptions({
        title: testament,
        headerStyle: {
          backgroundColor: '#f68c00',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      });
    }, [navigation, testament]);

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const defaultImage = require('../assets/book.png');

    // Memoize filtered books
    const filteredBooks = React.useMemo(() => {
      if (!searchQuery) return books;
      return books.filter(book =>
        book.book_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [searchQuery, books]);

    // Memoize fetchBooks function with timeout and retry logic
    const fetchBooks = React.useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const url = `${API_URL}/api/books/${encodeURIComponent(testament)}`;
        console.log('Fetching from URL:', url); // Debug log

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);

        // Provide more user-friendly error messages
        let errorMessage = 'Failed to fetch books. ';
        if (error.name === 'AbortError') {
          errorMessage += 'Request timed out. Please check your connection.';
        } else if (error.message.includes('Network request failed')) {
          errorMessage += 'Please check your internet connection and try again.';
        } else {
          errorMessage += error.message;
        }

        setError(errorMessage);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }, [testament]);

    useEffect(() => {
      fetchBooks();
    }, [fetchBooks]);

    // Memoize renderBook function
    const renderBook = React.useCallback(({ item }) => (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => navigation.navigate('MainChapters', {
          book: item.book_name,
          chapters: item.total_chapters,
          bookId: item.book_id
        })}
      >
        <ImageBackground
          source={item.book_cover ? { uri: item.book_cover } : defaultImage}
          style={styles.bookImage}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.overlay}>
            <Text style={styles.bookTitle}>{item.book_name}</Text>
            <Text style={styles.chapterCount}>{item.total_chapters} chapters</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    ), [navigation]);

    // Memoize keyExtractor
    const keyExtractor = React.useCallback((item) => item._id.toString(), []);

    // Memoize ListEmptyComponent
    const ListEmptyComponent = React.useMemo(() => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery ? `No books found matching "${searchQuery}"` : `No books found for ${testament}`}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBooks}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    ), [searchQuery, testament, fetchBooks]);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f68c00" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBooks}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#ffffff" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search books..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#ffffff"
            />
          </View>

          <FlatList
            data={filteredBooks}
            renderItem={renderBook}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={<View style={styles.footer} />}
            removeClippedSubviews={true}
            maxToRenderPerBatch={6}
            windowSize={5}
            initialNumToRender={6}
          />
        </View>
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(246, 140, 0, 0.51)',
      margin: 10,
      paddingHorizontal: 15,
      borderRadius: 25,
      height: 45,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 8,
      fontSize: 16,
      color: '#ffffff',
    },
    grid: {
      padding: 10,
      paddingBottom: 10,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    bookCard: {
      width: '48%',
      aspectRatio: 1,
      marginBottom: 15, // Increase margin between cards
      borderRadius: 10,
      overflow: 'hidden',
    },
    bookImage: {
      width: "100%",
      height: "100%",
    },
    backgroundImage: {
      borderRadius: 12,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(246, 140, 0, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    bookTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#ffffff",
      textAlign: "center",
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
      marginBottom: 5,
    },
    chapterCount: {
      fontSize: 14,
      color: "#ffffff",
      textAlign: "center",
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
    },
    retryButton: {
      backgroundColor: '#f68c00',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    retryText: {
      color: '#ffffff',
      fontSize: 16,
    },
    footer: {
      height: 10,
    },
  });

  export default BooksScreen;