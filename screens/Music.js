import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '../config';

const MusicScreen = () => {
    const [audioTracks, setAudioTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sound, setSound] = useState(null);
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        loadAudioTracks();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const loadAudioTracks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/audio/Itangiriro`);
            if (!response.ok) {
                throw new Error('Failed to fetch audio tracks');
            }
            const data = await response.json();
            setAudioTracks(data);
        } catch (error) {
            console.error('Error loading audio tracks:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayPause = async (track) => {
        try {
            if (sound && currentlyPlaying?.id === track.id) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                if (sound) {
                    await sound.unloadAsync();
                }
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: track.url },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setCurrentlyPlaying(track);
                setIsPlaying(true);

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                    }
                });
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setError('Error playing audio: ' + error.message);
        }
    };

    const renderAudioTrack = ({ item }) => (
        <TouchableOpacity
            style={styles.trackContainer}
            onPress={() => handlePlayPause(item)}
        >
            <View style={styles.trackInfo}>
                <Text style={styles.trackName}>{item.book}</Text>
                <Text style={styles.verseCount}>Imirongo: {item.verses}</Text>
                <Text style={styles.duration}>Time: {item.length}</Text>
            </View>
            <View style={styles.playButtonContainer}>
                <Icon
                    name={currentlyPlaying?.id === item.id && isPlaying ? 'pause-circle' : 'play-circle'}
                    size={40}
                    color="#f68c00"
                />
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#f68c00" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadAudioTracks}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={audioTracks}
                renderItem={renderAudioTrack}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    listContainer: {
        padding: 16,
    },
    trackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    trackInfo: {
        flex: 1,
        marginRight: 16,
    },
    trackName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f68c00',
        marginBottom: 4,
    },
    verseCount: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    duration: {
        fontSize: 14,
        color: '#666',
    },
    playButtonContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#f68c00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    retryText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default MusicScreen; 