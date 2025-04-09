import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from 'react-native-youtube-iframe';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16; // 16:9 aspect ratio

const CurrentlyPlaying = ({ navigation }) => {
    const [mostRecentVideo, setMostRecentVideo] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const playerRef = useRef(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadMostRecentVideo();
        } else {
            // Pause video when navigating away
            setPlaying(false);
        }
    }, [isFocused]);

    const loadMostRecentVideo = async () => {
        try {
            setLoading(true);
            setError(null);
            const recentlyPlayedData = await AsyncStorage.getItem('recentlyPlayed');

            if (recentlyPlayedData) {
                const parsedData = JSON.parse(recentlyPlayedData);

                if (parsedData.length > 0) {
                    setMostRecentVideo(parsedData[0]);
                } else {
                    setMostRecentVideo(null);
                }
            } else {
                setMostRecentVideo(null);
            }
        } catch (error) {
            console.error('Error loading most recent video:', error);
            setError('Failed to load recent video');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const navigateToAllAudio = () => {
        navigation.navigate('RecentlyPlayedTab');
    };

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#f68c00" />
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : !mostRecentVideo ? (
                <View style={styles.centerContent}>
                    <FontAwesome name="headphones" size={64} color="#f68c00" style={styles.emptyIcon} />
                    <Text style={styles.emptyText}>No Recently Played Audio</Text>
                    <Text style={styles.emptySubText}>Your recently played chapters will appear here</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={navigateToAllAudio}
                    >
                        <Text style={styles.browseButtonText}>Browse Audio Books</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text style={styles.headerTitle}>Continue Watching</Text>

                    {/* Video Player */}
                    <View style={styles.videoContainer}>
                        <YoutubePlayer
                            ref={playerRef}
                            height={VIDEO_HEIGHT}
                            play={playing}
                            videoId={mostRecentVideo.videoId}
                            onChangeState={(state) => {
                                if (state === 'playing') {
                                    setPlaying(true);
                                } else if (state === 'paused') {
                                    setPlaying(false);
                                }
                            }}
                            onReady={() => {
                                // Try to seek to the saved timestamp
                                if (mostRecentVideo.timestamp && mostRecentVideo.timestamp > 0 && playerRef.current) {
                                    playerRef.current.seekTo(mostRecentVideo.timestamp, true);
                                    console.log('Seeking to timestamp:', mostRecentVideo.timestamp);
                                }
                            }}
                            initialPlayerParams={{
                                preventFullScreen: false,
                                modestbranding: true,
                                controls: true,
                                rel: 0,
                                autoplay: 0,
                                playsinline: 1,
                                iv_load_policy: 3,
                                showinfo: 0
                            }}
                        />
                    </View>

                    {/* Video Info */}
                    <View style={styles.videoInfoContainer}>
                        <View>
                            <Text style={styles.videoTitle}>{mostRecentVideo.bookName} - Igice {mostRecentVideo.chapterNumber}</Text>
                            <Text style={styles.videoSubtitle}>Last played: {formatDate(mostRecentVideo.lastPlayed)}</Text>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingBottom: 50,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        padding: 16,
    },
    videoContainer: {
        width: '100%',
        backgroundColor: '#000',
    },
    videoInfoContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    videoSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyIcon: {
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    emptySubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 32,
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: '#f68c00',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        marginTop: 16,
    },
    browseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CurrentlyPlaying;
