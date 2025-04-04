import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { FontAwesome } from '@expo/vector-icons';

const Player = ({ route, navigation }) => {
    const { videoId, book = '', chapter = '', verses = '', title = '', chapters = [] } = route.params || {};
    const [playing, setPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(
        chapters.findIndex((ch) => ch.videoId === videoId)
    );

    useEffect(() => {
        if (videoId) {
            console.log('Navigating to Player with params:', {
                book,
                chapter,
                videoId,
                title,
                verses,
            });
        }
    }, [videoId, book, chapter, title, verses]);

    const onError = useCallback((error) => {
        console.log('Player error:', error);
    }, []);

    const onReady = useCallback(() => {
        console.log('Player is ready');
    }, []);

    const onStateChange = useCallback(
        (state) => {
            if (state === 'ended') {
                // Automatically play the next chapter
                const nextIndex = currentVideoIndex + 1;
                if (nextIndex < chapters.length) {
                    console.log(`Playing next chapter: ${chapters[nextIndex]?.title}`);
                    setCurrentVideoIndex(nextIndex);
                    setPlaying(true); // Start playing the next video
                } else {
                    console.log('No more chapters to play.');
                    setPlaying(false); // Stop playback if no more chapters
                }
            }
        },
        [currentVideoIndex, chapters]
    );

    useEffect(() => {
        if (currentVideoIndex >= 0 && currentVideoIndex < chapters.length) {
            navigation.setParams({
                videoId: chapters[currentVideoIndex].videoId,
                title: chapters[currentVideoIndex].title,
                chapter: chapters[currentVideoIndex].chapter,
                verses: chapters[currentVideoIndex].verses,
            });
        }
    }, [currentVideoIndex, chapters, navigation]);

    const renderChapterItem = ({ item, index }) => (
        <TouchableOpacity
            style={[
                styles.chapterItem,
                index === currentVideoIndex && styles.currentChapter,
            ]}
            onPress={() => {
                setCurrentVideoIndex(index);
                setPlaying(true);
            }}
        >
            <Text style={styles.chapterText}>
                {item.chapter}: {item.title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Video Player */}
            <View style={styles.videoContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <YoutubePlayer
                    height={300}
                    play={playing}
                    videoId={chapters[currentVideoIndex]?.videoId || videoId} // Fallback to initial videoId
                    onChangeState={onStateChange}
                    onReady={onReady}
                    onError={onError}
                    initialPlayerParams={{
                        preventFullScreen: false,
                        controls: 0,
                        modestbranding: true,
                        rel: 0,
                        origin: 'https://www.youtube.com',
                    }}
                />
            </View>

            {/* Current Chapter Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{chapters[currentVideoIndex]?.title}</Text>
                <Text style={styles.details}>Imirongo: {chapters[currentVideoIndex]?.verses}</Text>
            </View>

            {/* Chapter List */}
            <Text style={styles.chapterListTitle}>All Chapters</Text>
            <FlatList
                data={chapters}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderChapterItem}
                style={styles.chapterList}
            />
        </View>
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
    infoContainer: {
        padding: 15,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f68c00',
    },
    details: {
        fontSize: 16,
        color: '#666',
    },
    chapterListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 15,
        marginTop: 10,
    },
    chapterList: {
        flex: 1,
        marginTop: 10,
    },
    chapterItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    currentChapter: {
        backgroundColor: '#f68c00',
    },
    chapterText: {
        fontSize: 16,
        color: '#333',
    },
});

export default Player;
