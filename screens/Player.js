import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16;

const Player = ({ route, navigation }) => {
    const { videoId, book = '', chapter = '', verses = '', title = '' } = route.params || {};
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(true);
    const [upNextChapters, setUpNextChapters] = useState([]);
    const [currentVideoId, setCurrentVideoId] = useState(videoId);
    const [currentChapter, setCurrentChapter] = useState(chapter);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allChapters, setAllChapters] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (videoId) {
            console.log('Player mounted with params:', {
                book,
                chapter,
                videoId,
                title,
                verses,
            });
            setCurrentVideoId(videoId);
            setCurrentChapter(chapter);
            fetchAllChapters();


            saveToRecentlyPlayed();
        }
    }, []);

    useEffect(() => {
        if (currentVideoId) {
            setPlaying(true);


            if (currentChapter !== chapter) {
                saveToRecentlyPlayed();
            }
        }
    }, [currentVideoId, currentChapter]);

    useEffect(() => {
        if (playerRef.current) {
            // Periodically fetch the current time
            const interval = setInterval(async () => {
                const time = await playerRef.current?.getCurrentTime();
                setCurrentTime(time || 0);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [playerRef]);

    const onVideoEnd = (event) => {
        console.log('Video has finished playing');
        // You can trigger any function here
    };



    // Function to save recently played chapters
    const saveToRecentlyPlayed = async () => {
        try {
            // Create a new entry for the recently played list
            const newEntry = {
                bookId: book, // Using book name as ID
                bookName: book,
                chapterNumber: currentChapter || chapter,
                videoId: currentVideoId || videoId,
                verses: verses,
                lastPlayed: new Date().toISOString(),
                thumbnail: `https://img.youtube.com/vi/${currentVideoId || videoId}/default.jpg`
            };

            // Get existing recently played data
            const existingData = await AsyncStorage.getItem('recentlyPlayed');
            let recentlyPlayed = existingData ? JSON.parse(existingData) : [];

            // Check if this chapter is already in the list
            const existingIndex = recentlyPlayed.findIndex(
                item => item.bookId === newEntry.bookId &&
                    item.chapterNumber === newEntry.chapterNumber
            );

            // If it exists, remove it (we'll add it to the top)
            if (existingIndex !== -1) {
                recentlyPlayed.splice(existingIndex, 1);
            }

            // Add the new entry to the beginning
            recentlyPlayed.unshift(newEntry);

            // Keep only the last 20 entries
            if (recentlyPlayed.length > 20) {
                recentlyPlayed = recentlyPlayed.slice(0, 20);
            }

            // Save back to AsyncStorage
            await AsyncStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
            console.log('Saved to recently played:', newEntry);
        } catch (error) {
            console.error('Error saving recently played:', error);
        }
    };

    const fetchAllChapters = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching all chapters for book:', book);
            const response = await fetch(`${API_URL}/api/audio/${book}`);
            if (!response.ok) {
                throw new Error('Failed to fetch chapters');
            }
            const data = await response.json();

            // Sort chapters by chapter number
            const sortedChapters = data.sort((a, b) => a.chapter - b.chapter);
            setAllChapters(sortedChapters);

            // Update up next chapters
            updateUpNextChapters(sortedChapters, chapter);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching chapters:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const updateUpNextChapters = (chapters, currentChapterNum) => {
        // Find the index of current chapter
        const currentIndex = chapters.findIndex(
            ch => ch.chapter === parseInt(currentChapterNum)
        );

        if (currentIndex === -1) {
            console.log('Current chapter not found in chapters list');
            return;
        }

        // Get next 4 chapters after current chapter
        const nextChapters = chapters.slice(currentIndex + 1, currentIndex + 5);
        console.log('Next chapters:', nextChapters);

        // Map the chapters to our format
        const formattedChapters = nextChapters.map(ch => ({
            id: String(ch._id),
            chapter: ch.chapter,
            verses: ch.verses || 0,
            time: ch.length ? `${ch.length}` : '20',
            thumbnail: `https://img.youtube.com/vi/${ch.videoId || ch.url}/default.jpg`,
            videoId: ch.videoId || ch.url,
            title: `${book} ${ch.chapter}`
        }));

        setUpNextChapters(formattedChapters);
    };

    const playChapter = (chapterData) => {
        console.log('Playing chapter:', chapterData);

        // First set the new video ID and chapter
        setCurrentVideoId(chapterData.videoId || chapterData.url);
        setCurrentChapter(chapterData.chapter);

        // Ensure playing is set to true
        setPlaying(true);

        // Update navigation params
        navigation.setParams({
            chapter: chapterData.chapter,
            videoId: chapterData.videoId || chapterData.url,
            verses: chapterData.verses,
            title: `${book} ${chapterData.chapter}`,
            book: book
        });

        // Update up next chapters
        updateUpNextChapters(allChapters, chapterData.chapter);
    };
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        }
    }

    const playPreviousChapter = () => {
        const currentIndex = allChapters.findIndex(
            ch => ch.chapter === parseInt(currentChapter)
        );

        if (currentIndex > 0) {
            const previousChapter = allChapters[currentIndex - 1];
            playChapter(previousChapter);
        }
    };

    const playNextChapter = () => {
        console.log('Attempting to play next chapter');

        if (upNextChapters.length > 0) {
            console.log('Found next chapter in upNextChapters:', upNextChapters[0]);
            const nextChapter = upNextChapters[0];
            playChapter({
                ...nextChapter,
                videoId: nextChapter.videoId,
                chapter: nextChapter.chapter
            });
        } else {
            console.log('No more chapters in upNextChapters, checking allChapters');

            // If upNextChapters is empty, try to find the next chapter in allChapters
            const currentIndex = allChapters.findIndex(
                ch => ch.chapter === parseInt(currentChapter)
            );

            if (currentIndex !== -1 && currentIndex < allChapters.length - 1) {
                console.log('Found next chapter in allChapters:', allChapters[currentIndex + 1]);
                const nextChapter = allChapters[currentIndex + 1];
                playChapter(nextChapter);
            } else {
                console.log('No more chapters available');
                // Maybe show a message or navigate back
            }
        }
    };

    const handleUpNextPress = (nextChapter) => {
        playChapter({
            videoId: nextChapter.videoId,
            chapter: nextChapter.chapter,
            verses: nextChapter.verses
        });
    };

    const onStateChange = (state) => {
        console.log('Player state changed to:', state);
        if (state === 'ended') {
            onVideoEnd(); // Trigger your custom logic for video end
            playNextChapter(); // Automatically play the next chapter
        } else if (state === 'paused') {
            setPlaying(false);
        } else if (state === 'playing') {
            setPlaying(true);
        }
    };

    const onReady = () => {
        console.log('Video ready to play');
        setPlaying(true);

        // Fetch the video duration
        playerRef.current?.getDuration().then((duration) => {
            setDuration(duration || 0);
        });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <ScrollView style={styles.container}>
            {/* Video Player Section */}
            <View style={styles.videoContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>

                <YoutubePlayer
                    ref={playerRef}
                    key={currentVideoId}
                    height={VIDEO_HEIGHT}
                    play={true}
                    forceAndroidAutoplay={true}
                    webViewProps={{
                        allowsInlineMediaPlayback: true,
                        mediaPlaybackRequiresUserAction: false, // iOS
                    }}
                    videoId={currentVideoId}
                    onChangeState={onStateChange}
                    opts={opts}
                    onEnd={onVideoEnd}

                    onReady={onReady}
                    onError={(error) => {
                        console.log('Player error:', error);
                        setError('Error playing video: ' + error);
                    }}
                    initialPlayerParams={{
                        preventFullScreen: false,
                        modestbranding: true,
                        controls: 0, // Disable all controls except play/pause
                        rel: 0,
                        autoplay: 1,
                        playsinline: 1,
                        iv_load_policy: 3,
                        showinfo: 0
                    }}
                />
            </View>
    {/* Progress Bar Section */}
    <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progress,
                            { width: `${(currentTime / duration) * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.timeText}>{formatTime(duration - currentTime)}</Text>
            </View>
            {/* Title Section with Navigation Controls */}
            <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>IGICE {currentChapter}</Text>
                <View style={styles.chapterControls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={playPreviousChapter}
                    >
                        <FontAwesome name="step-backward" size={24} color="#f68c00" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={playNextChapter}
                    >
                        <FontAwesome name="step-forward" size={24} color="#f68c00" />
                    </TouchableOpacity>
                </View>
            </View>

        

            <View style={styles.upNextSection}>
                <Text style={styles.upNextTitle}>Up Next</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#f68c00" style={styles.loader} />
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : upNextChapters.length === 0 ? (
                    <Text style={styles.noChaptersText}>No more chapters available</Text>
                ) : (
                    upNextChapters.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.upNextItem}
                            onPress={() => handleUpNextPress(item)}
                        >
                            <Image
                                source={{ uri: item.thumbnail }}
                                style={styles.thumbnail}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <View style={styles.itemDetails}>
                                    <Text style={styles.detailText}>Imirongo: {item.verses}</Text>
                                    <Text style={styles.detailText}>Time: {item.time}</Text>
                                </View>
                            </View>
                            <View style={styles.playButton}>
                                <FontAwesome
                                    name="play-circle-o"
                                    size={32}
                                    color="#f68c00"
                                />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

// Styles remain the same
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    videoContainer: {
        width: '100%',
        backgroundColor: '#000',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 20,
    },
    titleSection: {
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    chapterControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        gap: 40,
    },
    controlButton: {
        padding: 10,
        borderRadius: 20,
    },
    upNextSection: {
        padding: 15,
    },
    upNextTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    upNextItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    thumbnail: {
        width: 100,
        height: 56,
        borderRadius: 4,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
        marginRight: 8,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    itemDetails: {
        flexDirection: 'row',
        gap: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
    playButton: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loader: {
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noChaptersText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    progressBar: {
        flex: 1,
        height: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginHorizontal: 10,
    },
    progress: {
        height: '100%',
        backgroundColor: '#f68c00',
        borderRadius: 5,
    },
    timeText: {
        fontSize: 12,
        color: '#333',
    },
});

export default Player;
