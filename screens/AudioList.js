import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../config';

const Audio = ({ navigation }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`${API_URL}/api/audio/Kuva/1`);
                const data = await response.json();
                console.log('Video data:', data);
                if (data && data.url) {
                    // Use the videoId from the database if available
                    const videoId = data.videoId || data.url;
                    setVideos([{
                        _id: data._id || '1',
                        book: 'Kuva',
                        chapter: 1,
                        verses: data.verses || 40,
                        url: videoId
                    }]);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, []);

    const handlePlayVideo = (video) => {
        console.log('Playing video with ID:', video.url);
        navigation.navigate('Player', {
            videoId: video.url,
            book: video.book,
            chapter: video.chapter,
            verses: video.verses,
            title: `${video.book} ${video.chapter}`
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={videos}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.videoItem}
                        onPress={() => handlePlayVideo(item)}
                    >
                        <View style={styles.thumbnailContainer}>
                            <FontAwesome name="youtube-play" size={32} color="#f68c00" />
                        </View>
                        <View style={styles.videoInfo}>
                            <Text style={styles.videoTitle}>{item.book} {item.chapter}</Text>
                            <Text style={styles.videoDetails}>Imirongo: {item.verses}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    videoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    thumbnailContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    videoInfo: {
        flex: 1,
        marginLeft: 15,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    videoDetails: {
        fontSize: 14,
        color: '#666',
    },
});

export default Audio;