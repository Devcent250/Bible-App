import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Chapters = ({ route, navigation }) => {
  const { book, chapters } = route.params;
  const chaptersArray = Array.from({ length: chapters }, (_, i) => i + 1);

  const renderChapter = ({ item }) => (
    <TouchableOpacity
      style={styles.chapterCard}
      onPress={() => navigation.navigate('Audio', { book, chapter: item })}
    >
      <Text style={styles.chapterNumber}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#f68c00" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{book.toUpperCase()}</Text>
      </View>
      <FlatList
        data={chaptersArray}
        renderItem={renderChapter}
        keyExtractor={(item) => item.toString()}
        numColumns={6}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f68c00',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  chapterCard: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: 'rgba(217, 217, 217, 0.6)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumber: {
    fontSize: 18,
    color: 'rgba(246, 140, 0, 1)',
    fontWeight: 'bold',
  },
});

export default Chapters;