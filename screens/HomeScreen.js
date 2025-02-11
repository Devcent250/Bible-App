import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="book-outline" size={40} color="blue" />
            <Text style={styles.title}> Bible App </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#8fcbbc",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        marginBottom: 20,
    },

});
