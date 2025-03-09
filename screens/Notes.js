import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe'; 
import { WebView } from 'react-native-web-webview';
import { FontAwesome } from '@expo/vector-icons';

const Notes = () => {
  const [videos, setVideos] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  
  const screenWidth = Dimensions.get('window').width;
  const videoHeight = (screenWidth * 9) / 16; 


  useEffect(() => {
    const fetchVideos = async () => {
      const videoData = [
        { title: 'ITANGIRIRO 1', videoId: '84WIaK3bl_s', time: '20min', verses: 50 },
        { title: 'ITANGIRIRO 2', videoId: 'dQw4w9WgXcQ', time: '20min', verses: 50 },
        { title: 'ITANGIRIRO 3', videoId: '3JZ_D3ELwOQ', time: '20min', verses: 50 },
      ];
      setVideos(videoData);
      setLoading(false);
    };
    fetchVideos();
  }, []);

  // // Toggle play/pause
  // const togglePlayPause = () => {
  //   setPlaying((prev) => !prev);
  // };

  
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
            html: `<iframe width="${screenWidth}" height="${videoHeight}" src="https://www.youtube.com/embed/${videos[videoIndex]?.videoId}?autoplay=${playing ? 1 : 0}&enablejsapi=1" frameborder="0" allowfullscreen></iframe>`,
          }}
          style={{ width: screenWidth, height: videoHeight }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {renderVideo()}
        {/* <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          <FontAwesome name={playing ? 'pause' : 'play'} size={40} color="white" />
        </TouchableOpacity> */}
      </View>

      
      <Text style={styles.nowListening}>Now Listening</Text>

  
      <Text style={styles.title}>{videos[videoIndex]?.title}</Text>

      
      <View style={styles.controls}>
        <TouchableOpacity onPress={goToPrevious} disabled={videoIndex === 0} style={styles.controlButton}>
          <FontAwesome name="backward" size={30} color="white" />
          <FontAwesome name="step-backward" size={20} color="white" style={styles.stepBackwardsIcon} />
        </TouchableOpacity>

        
        <TouchableOpacity onPress={goToNext} disabled={videoIndex === videos.length - 1} style={styles.controlButton}>
          <FontAwesome name="step-forward" size={20} color="white" style={styles.stepForwardsIcon} />
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
            <TouchableOpacity style={styles.playItemButton} onPress={() => {
              setVideoIndex(index);
              setPlaying(true);
            }}>
              <Image source={{ uri: `https://img.youtube.com/vi/${item.videoId}/0.jpg` }} style={styles.thumbnail} />
              <View style={styles.playOverlay}>
                <FontAwesome name="play" size={15} color="black" />
              </View>
            </TouchableOpacity>
            <View style={styles.videoInfo}>
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
    width: '100%',
    height: (Dimensions.get('window').width * 9) / 16, // Fixed height to prevent scrolling
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
  nowListening: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
    paddingHorizontal: 15,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepForwardsIcon: {
    marginRight: 10,  // Adjust the value as needed
  },
  stepBackwardsIcon: {
    marginLeft: 10,  // Adjust the value as needed
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
  },
  playItemButton: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 10, // Slight rounding to match the image
    overflow: 'hidden', // Ensure the image and overlay are contained
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 51, 51, 0.5)', // Red overlay with transparency
    borderRadius: 10,
  },
  videoInfo: {
    flex: 1,
    marginLeft: 10,
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
    flex: 1, // Allow list to take remaining space and scroll
  },
});

export default Notes;