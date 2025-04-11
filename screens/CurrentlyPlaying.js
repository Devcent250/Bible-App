import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
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

    // Add these state variables for note-taking
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [currentTime, setCurrentTime] = useState(0);

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

    // Add these functions for note-taking
    // Update the handleAddNote function
    const handleAddNote = async () => {
        if (!mostRecentVideo) {
            console.log("No recent video available");
            return;
        }

        console.log("Add note button pressed");

        // Set a default timestamp if we can't get it from the player
        let timestamp = 0;

        // Try to get current playback time
        if (playerRef.current) {
            try {
                timestamp = await playerRef.current.getCurrentTime();
                console.log("Current timestamp:", timestamp);
            } catch (error) {
                console.error('Error getting current time:', error);
                // Continue with timestamp = 0 if there's an error
            }
        } else {
            console.log("Player reference is not available");
        }

        // Set the current time and open the modal
        setCurrentTime(timestamp);
        setNoteModalVisible(true);
        setPlaying(false); // Pause the video
    };


    const saveNote = async () => {
        console.log("Attempting to save note");

        if (!noteText.trim() || !mostRecentVideo) {
            console.log("Note text is empty or no video selected");
            setNoteModalVisible(false);
            return;
        }

        try {
            console.log("Creating new note at timestamp:", currentTime);

            // Create a new note object
            const newNote = {
                id: Date.now().toString(),
                bookName: mostRecentVideo.bookName,
                chapterNumber: mostRecentVideo.chapterNumber,
                videoId: mostRecentVideo.videoId,
                timestamp: currentTime,
                text: noteText,
                createdAt: new Date().toISOString(),
                thumbnailUrl: `https://img.youtube.com/vi/${mostRecentVideo.videoId}/default.jpg`
            };

            console.log("New note object:", newNote);

            // Get existing notes
            const existingNotesData = await AsyncStorage.getItem('videoNotes');
            let notes = existingNotesData ? JSON.parse(existingNotesData) : [];

            console.log("Existing notes count:", notes.length);

            // Add the new note
            notes.unshift(newNote);

            // Save back to AsyncStorage
            await AsyncStorage.setItem('videoNotes', JSON.stringify(notes));

            console.log("Note saved successfully");

            // Clear the note text and close the modal
            setNoteText('');
            setNoteModalVisible(false);
            setPlaying(true); // Resume playing
        } catch (error) {
            console.error('Error saving note:', error);
        }
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
                                controls: 0, // Disable all controls except play/pause
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

                    {/* Add Note Button */}
                    <View style={styles.noteButtonContainer}>
                        <TouchableOpacity
                            style={styles.noteButton}
                            onPress={handleAddNote}
                        >
                            <FontAwesome name="pencil" size={18} color="#fff" />
                            <Text style={styles.noteButtonText}>Add Note</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Note Modal */}
            {/* Note Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={noteModalVisible}
                onRequestClose={() => {
                    console.log("Modal closed by back button");
                    setNoteModalVisible(false);
                    setPlaying(true); // Resume playing when closing
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Note</Text>
                        {mostRecentVideo && (
                            <Text style={styles.modalSubtitle}>
                                {mostRecentVideo.bookName} - Igice {mostRecentVideo.chapterNumber}
                                (at {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')})
                            </Text>
                        )}

                        <TextInput
                            style={styles.noteInput}
                            multiline
                            placeholder="Type your note here..."
                            value={noteText}
                            onChangeText={(text) => {
                                console.log("Note text changed");
                                setNoteText(text);
                            }}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    console.log("Cancel button pressed");
                                    setNoteModalVisible(false);
                                    setPlaying(true); // Resume playing when canceling
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={() => {
                                    console.log("Save button pressed");
                                    saveNote();
                                }}
                            >
                                <Text style={styles.saveButtonText}>Save Note</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    // Add these styles for note-taking
    noteButtonContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    noteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f68c00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    noteButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    noteInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        minHeight: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#f68c00',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#666',
    },
});

export default CurrentlyPlaying;
