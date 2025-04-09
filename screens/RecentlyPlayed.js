import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const RecentlyPlayed = ({ navigation }) => {
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadRecentlyPlayed();
        }
    }, [isFocused]);

    const loadRecentlyPlayed = async () => {
        try {
            setLoading(true);
            const recentlyPlayedData = await AsyncStorage.getItem('recentlyPlayed');

            if (recentlyPlayedData) {
                const parsedData = JSON.parse(recentlyPlayedData);

                // Filter to only include items from the last 5 days
                const fiveDaysAgo = new Date();
                fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

                const filteredData = parsedData.filter(item => {
                    const playedDate = new Date(item.lastPlayed);
                    return playedDate >= fiveDaysAgo;
                });

                setRecentlyPlayed(filteredData);
            } else {
                setRecentlyPlayed([]);
            }
        } catch (error) {
            console.error('Error loading recently played:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAudio = (item) => {
        navigation.navigate('Player', {
            videoId: item.videoId,
            book: item.bookName,
            chapter: item.chapterNumber,
            verses: item.verses
        });
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

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handlePlayAudio(item)}
        >
            <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
            />
            <View style={styles.itemDetails}>
                <Text style={styles.bookName}>{item.bookName}</Text>
                <Text style={styles.chapterInfo}>Igice {item.chapterNumber}</Text>
                <Text style={styles.playedDate}>{formatDate(item.lastPlayed)}</Text>
            </View>
            <View style={styles.playButton}>
                <FontAwesome name="play-circle-o" size={32} color="#f68c00" />
            </View>
        </TouchableOpacity>
    );

    const navigateToAllAudio = () => {
        navigation.navigate('AudioList');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Recently Played</Text>
                <TouchableOpacity
                    style={styles.browseAllButton}
                    onPress={navigateToAllAudio}
                >
                    <Text style={styles.browseAllText}>Browse All</Text>
                    <FontAwesome name="angle-right" size={18} color="#f68c00" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#f68c00" />
                </View>
            ) : recentlyPlayed.length === 0 ? (
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
                <FlatList
                    data={recentlyPlayed}
                    keyExtractor={(item, index) => `${item.bookId}-${item.chapterNumber}-${index}`}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    browseAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    browseAllText: {
        color: '#f68c00',
        fontWeight: '600',
        marginRight: 4,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    thumbnail: {
        width: 80,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    bookName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    chapterInfo: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    playedDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    playButton: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50,
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
    listContent: {
        paddingBottom: 20,
    },
});

export default RecentlyPlayed;
