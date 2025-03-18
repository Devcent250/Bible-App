import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');

const Player = ({ route, navigation }) => {
  const { book, chapter } = route.params;
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const videoId = 'YOUR_YOUTUBE_VIDEO_ID';

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`${book} ${chapter}`}</Text>
      </View>

      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={width * 0.5625}
          play={playing}
          videoId={videoId}
          onChangeState={(state) => {
            if (state === 'ended') setPlaying(false);
          }}
        />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            minimumTrackTintColor="#e32f45"
            maximumTrackTintColor="#4a4a4a"
            thumbTintColor="#e32f45"
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Icon name="backward" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setPlaying(!playing)}
          >
            <Icon name={playing ? "pause" : "play"} size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Icon name="forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.additionalControls}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="thumbs-up" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="download" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>{`${book} Chapter ${chapter}`}</Text>
        <Text style={styles.channelName}>Bible Audio Channel</Text>
        <Text style={styles.viewCount}>10K views • 2 days ago</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282B34',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerContainer: {
    width: '100%',
    backgroundColor: '#000',
  },
  controlsContainer: {
    padding: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: '#e32f45',
    padding: 15,
    borderRadius: 50,
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#3A3F4B',
    paddingTop: 20,
  },
  iconButton: {
    padding: 10,
  },
  infoContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#3A3F4B',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  channelName: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 3,
  },
  viewCount: {
    color: '#999',
    fontSize: 12,
  },
});

export default Player;
