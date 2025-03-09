import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { WebView } from 'react-native-web-webview';
import { FontAwesome } from '@expo/vector-icons';

const Notes = () => {
  const [videos, setVideos] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);


  const screenWidth = Dimensions.get('window').width;
  const videoHeight = (screenWidth * 9) / 16;


  useEffect(() => {
    const fetchVideos = async () => {
      const videoData = [
        { title: 'ITANGIRIRO  1', videoId: '84WIaK3bl_s', time: '120min', verses: 150 },
        { title: 'ITANGIRIRO 2', videoId: 'dQw4w9WgXcQ', time: '60min', verses: 100 },
        { title: 'ITANGIRIRO 3', videoId: '3JZ_D3ELwOQ', time: '20min', verses: 50 },
      ];
      setVideos(videoData);
    };
    fetchVideos();
  }, []);


  const togglePlayPause = () => {
    setPlaying((prev) => !prev);
  };


  const goToPrevious = () => {
    if (videoIndex > 0) {
      setVideoIndex(videoIndex - 1);
      setPlaying(false);
    }
  };


  const goToNext = () => {
    if (videoIndex < videos.length - 1) {
      setVideoIndex(videoIndex + 1);
      setPlaying(false);
    }
  };


  const renderVideo = () => {
    if (Platform.OS === 'web') {
      return (
        <WebView
          source={{
            html: `<iframe width="${screenWidth}" height="${videoHeight}" src="https://www.youtube.com/embed/${videos[videoIndex]?.videoId}?autoplay=${playing ? 1 : 0}" frameborder="0" allowfullscreen></iframe>`,
          }}
          style={{ width: screenWidth, height: videoHeight }}
        />
      );
    }
    return (
      <YoutubePlayer
        height={videoHeight}
        width={screenWidth}
        play={playing}
        videoId={videos[videoIndex]?.videoId}
        onError={(e) => console.log('YouTube Error:', e)}
      />
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.videoContainer}>
        {renderVideo()}
        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          <FontAwesome name={playing ? 'pause' : 'play'} size={40} color="white" />
        </TouchableOpacity>
      </View>


      <Text style={styles.title}>{videos[videoIndex]?.title}</Text>


      <View style={styles.controls}>
        <TouchableOpacity onPress={goToPrevious} disabled={videoIndex === 0}>
          <FontAwesome name="backward" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNext} disabled={videoIndex === videos.length - 1}>
          <FontAwesome name="forward" size={30} color="white" />
        </TouchableOpacity>
      </View>


      <FlatList
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.videoItem}
            onPress={() => {
              setVideoIndex(index);
              setPlaying(false);
            }}
          >
            <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.thumbnail} />
            <View>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.videoDetails}>Imirongo: {item.verses}</Text>
              <Text style={styles.videoDetails}>Time: {item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
    padding: 0,
    margin: 0,
  },
  videoContainer: {

    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  videoItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2d3748',
  },

  thumbnail: {
    width: 100,
    height: 100,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  videoDetails: {
    color: 'gray',
  },
  list: {
    flex: 1, 
  }, 
});

export default Notes;