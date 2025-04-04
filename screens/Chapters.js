import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { API_URL } from '../config';

const Chapters = ({ route, navigation }) => {
  const { book, chapters } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioData, setAudioData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: book,
      headerStyle: {
        backgroundColor: '#f68c00',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, book]);

  useEffect(() => {
    fetchAudioData();
  }, [book]);

  const fetchAudioData = async () => {
    try {
      setLoading(true);
      console.log('Fetching audio for book:', book);
      const response = await fetch(`${API_URL}/api/audio/${book}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audio data');
      }
      const data = await response.json();
      console.log('Raw audio data from API:', data);

      // Ensure data is always an array
      const dataArray = Array.isArray(data) ? data : [data];
      console.log('Data array:', dataArray);

      // Process the data to ensure video IDs are extracted and length is an integer
      const processedData = dataArray.map(audio => {
        // Convert length to integer if it's a string with 'min'
        let length = audio.length;
        if (typeof length === 'string') {
          length = parseInt(length.replace(/[^0-9]/g, ''), 10);
        }

        const processed = {
          ...audio,
          chapter: Number(audio.chapter), // Ensure chapter is a number
          videoId: audio.videoId || extractVideoId(audio.url),
          length: length || 0 // Ensure length is a number
        };
        console.log('Processed audio entry:', processed);
        return processed;
      });

      console.log('Final processed audio data:', processedData);
      setAudioData(processedData);
    } catch (error) {
      console.error('Error fetching audio data:', error);
      setError(error.message);
      setAudioData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    // Handle both full URLs and direct video IDs
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  const handleChapterPress = (chapter) => {
    // Find the audio data for this chapter
    const audioForChapter = audioData.find(audio => audio.chapter === chapter);

    if (!audioForChapter) {
      console.log('No audio available for chapter:', chapter);
      return;
    }

    console.log('Audio data for chapter:', audioForChapter);

    // Use the pre-extracted videoId or extract it again if needed
    const videoId = audioForChapter.videoId || extractVideoId(audioForChapter.url);
    console.log('Using video ID:', videoId);

    if (!videoId) {
      console.error('Invalid YouTube URL or video ID:', audioForChapter.url);
      return;
    }

    const params = {
      book: audioForChapter.book || book,
      chapter: audioForChapter.chapter || chapter,
      videoId: videoId,
      title: `${audioForChapter.book || book} ${audioForChapter.chapter || chapter}`,
      verses: audioForChapter.verses || 0,
      length: audioForChapter.length || 0 // Length is now an integer
    };

    console.log('Navigating to Player with params:', params);
    navigation.navigate('Player', params);
  };

  const renderChapter = ({ item }) => {
    const chapter = Number(item.chapter); // Ensure chapter is a number
    console.log('Rendering chapter:', chapter);
    console.log('Current audioData:', audioData);

    // Check if we have audio for this chapter
    const hasAudio = audioData.some(audio => {
      const audioChapter = Number(audio.chapter);
      const matches = audioChapter === chapter;
      console.log(`Comparing chapter ${chapter} with audio chapter ${audioChapter}: ${matches}`);
      return matches;
    });

    console.log(`Chapter ${chapter} has audio: ${hasAudio}`);

    return (
      <TouchableOpacity
        style={[
          styles.chapterCard,
          hasAudio ? styles.chapterCardWithAudio : styles.chapterCardNoAudio
        ]}
        onPress={() => hasAudio && handleChapterPress(chapter)}
        disabled={!hasAudio}
      >
        <Text style={[
          styles.chapterNumber,
          hasAudio ? styles.chapterNumberWithAudio : styles.chapterNumberNoAudio
        ]}>
          {chapter}
        </Text>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAudioData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const chaptersArray = Array.from({ length: chapters }, (_, i) => ({
    chapter: i + 1
  }));

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        <FlatList
          data={chaptersArray}
          renderItem={renderChapter}
          keyExtractor={(item) => item.chapter.toString()}
          numColumns={6}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        />
      </View>
    </View>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 20;
const CARD_MARGIN = 5;
const NUM_COLUMNS = 6;
const CARD_WIDTH = (SCREEN_WIDTH - (GRID_PADDING * 2) - (CARD_MARGIN * 2 * NUM_COLUMNS)) / NUM_COLUMNS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gridContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  grid: {
    paddingHorizontal: GRID_PADDING,
  },
  chapterCard: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    margin: CARD_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  chapterCardWithAudio: {
    backgroundColor: '#f68c00',
  },
  chapterCardNoAudio: {
    backgroundColor: '#D9D9D9',
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chapterNumberWithAudio: {
    color: '#ffffff',
  },
  chapterNumberNoAudio: {
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#f68c00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default Chapters;