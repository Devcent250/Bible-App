import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

const SCREEN_WIDTH = Dimensions.get('window').width;
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16; // 16:9 aspect ratio

const Audio = ({ route, navigation }) => {
    const { book, chapter, videoId } = route.params;

    const upNextItems = [
        {
            id: '1',
            chapter: chapter + 1,
            thumbnail: 'https://img.youtube.com/vi/84WIaK3bl_s/default.jpg',
            verses: 50,
            time: '20min'
        },
        {
            id: '2',
            chapter: chapter + 2,
            thumbnail: 'https://img.youtube.com/vi/84WIaK3bl_s/default.jpg',
            verses: 45,
            time: '18min'
        },
        {
            id: '3',
            chapter: chapter + 3,
            thumbnail: 'https://img.youtube.com/vi/84WIaK3bl_s/default.jpg',
            verses: 55,
            time: '22min'
        }
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.videoContainer}>
                <View style={styles.videoWrapper}>
                    <YoutubePlayer
                        height={VIDEO_HEIGHT}
                        width={SCREEN_WIDTH}
                        videoId={videoId}
                        webViewProps={{
                            injectedJavaScript: `
                                var element = document.createElement('style');
                                element.innerHTML = 'body { background-color: black; margin: 0; padding: 0; }';
                                document.head.appendChild(element);
                            `
                        }}
                    />
                </View>
            </View>

            <View style={styles.titleSection}>
                <Text style={styles.subText}>Uri kumva</Text>
                <Text style={styles.mainTitle}>{book}</Text>
                <Text style={styles.chapterText}>IGICE {chapter}</Text>
            </View>

            <View style={styles.upNextSection}>
                <Text style={styles.upNextTitle}>Up Next</Text>
                {upNextItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.upNextItem}
                        onPress={() => navigation.setParams({
                            chapter: item.chapter,
                            videoId: videoId
                        })}
                    >
                        <Image
                            source={{ uri: item.thumbnail }}
                            style={styles.thumbnail}
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{book} {item.chapter}</Text>
                            <View style={styles.itemDetails}>
                                <Text style={styles.detailText}>Imirongo: {item.verses}</Text>
                                <Text style={styles.detailText}>Time: {item.time}</Text>
                            </View>
                        </View>
                        <FontAwesome name="play-circle-o" size={32} color="#f68c00" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerSection: {
        padding: 20,
    },
    headerText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    bookTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f68c00',
        marginBottom: 2,
    },
    chapterText: {
        fontSize: 14,
        color: '#666',
    },
    videoContainer: {
        width: SCREEN_WIDTH,
        height: VIDEO_HEIGHT,
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    videoWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
    },
    upNextSection: {
        padding: 20,
    },
    upNextTitle: {
        fontSize: 16,
        color: '#f68c00',
        marginBottom: 15,
        fontWeight: '500',
    },
    upNextItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    thumbnail: {
        width: 120,
        height: 68,
        borderRadius: 8,
        marginRight: 15,
    },
    itemInfo: {
        flex: 1,
        marginRight: 15,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f68c00',
        marginBottom: 4,
    },
    itemDetails: {
        flexDirection: 'row',
        gap: 15,
    },
    detailText: {
        fontSize: 13,
        color: '#666',
    },
    titleSection: {
        padding: 16,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    subText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
        textAlign: 'center',
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f68c00',
        marginBottom: 4,
        textAlign: 'center',
    },
    chapterText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
});

export default Audio;