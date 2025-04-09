import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../config';

const SCREEN_WIDTH = Dimensions.get('window').width;
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16; // 16:9 aspect ratio

const Player = ({ route, navigation }) => {
    const { videoId, book = '', chapter = '', verses = '', title = '' } = route.params || {};
    const [playing, setPlaying] = useState(true); // Start playing automatically
    const [upNextChapters, setUpNextChapters] = useState([]);
    const [currentVideoId, setCurrentVideoId] = useState(videoId);
    const [currentChapter, setCurrentChapter] = useState(chapter);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allChapters, setAllChapters] = useState([]); // Store all chapters

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
        }
    }, []);

    useEffect(() => {
        if (currentVideoId) {
            setPlaying(true);
        }
    }, [currentVideoId]);

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
        } catch (err) {
            console.error('Error fetching chapters:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUpNextChapters = (chapters, currentChapterNum) => {
        // Find the index of current chapter
        const currentIndex = chapters.findIndex(
            ch => ch.chapter === parseInt(currentChapterNum)
        );

        // Get next 4 chapters after current chapter
        const nextChapters = chapters.slice(currentIndex + 1, currentIndex + 5);

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
        setCurrentVideoId(chapterData.videoId || chapterData.url);
        setCurrentChapter(chapterData.chapter);
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
        if (upNextChapters.length > 0) {
            const nextChapter = upNextChapters[0];
            playChapter({
                ...nextChapter,
                videoId: nextChapter.videoId,
                chapter: nextChapter.chapter
            });
        }
    };

    const handleUpNextPress = (nextChapter) => {
        playChapter({
            videoId: nextChapter.videoId,
            chapter: nextChapter.chapter,
            verses: nextChapter.verses
        });
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
                    key={currentVideoId}
                    height={VIDEO_HEIGHT}
                    play={playing}
                    videoId={currentVideoId}
                    onChangeState={(state) => {
                        console.log('Player state:', state);
                        if (state === 'ended') {
                            playNextChapter();
                        } else if (state === 'playing') {
                            setPlaying(true);
                        }
                    }}
                    onReady={() => {
                        console.log('Video ready to play');
                        setPlaying(true);
                    }}
                    onError={(error) => {
                        console.log('Player error:', error);
                        setError('Error playing video: ' + error);
                    }}
                    initialPlayerParams={{
                        preventFullScreen: false,
                        modestbranding: true,
                        controls: true,
                        rel: 0,
                        autoplay: 1,
                        playsinline: 1,
                        iv_load_policy: 3,
                        showinfo: 0
                    }}
                />
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

            {/* Up Next Section */}
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
    }
});

export default Player;
