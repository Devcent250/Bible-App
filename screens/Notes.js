import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const Notes = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editedNoteText, setEditedNoteText] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadNotes();
    }
  }, [isFocused]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const notesData = await AsyncStorage.getItem('videoNotes');
      if (notesData) {
        const parsedNotes = JSON.parse(notesData);
        setNotes(parsedNotes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = (note) => {
    navigation.navigate('Player', {
      videoId: note.videoId,
      book: note.bookName,
      chapter: note.chapterNumber,
      timestamp: note.timestamp
    });
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setEditedNoteText(note.text);
    setEditModalVisible(true);
  };

  const saveEditedNote = async () => {
    if (!editedNoteText.trim()) {
      setEditModalVisible(false);
      return;
    }

    try {
      // Find and update the note
      const updatedNotes = notes.map(note => {
        if (note.id === selectedNote.id) {
          return {
            ...note,
            text: editedNoteText,
            updatedAt: new Date().toISOString()
          };
        }
        return note;
      });

      // Save back to AsyncStorage
      await AsyncStorage.setItem('videoNotes', JSON.stringify(updatedNotes));

      // Update state
      setNotes(updatedNotes);
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = (noteId) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedNotes = notes.filter(note => note.id !== noteId);
              await AsyncStorage.setItem('videoNotes', JSON.stringify(updatedNotes));
              setNotes(updatedNotes);
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          }
        }
      ]
    );
  };

  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderNoteItem = ({ item }) => (
    <View style={styles.noteItem}>
      <TouchableOpacity
        style={styles.noteContent}
        onPress={() => handlePlayVideo(item)}
      >
        <View style={styles.noteHeader}>
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
          />
          <View style={styles.noteInfo}>
            <Text style={styles.noteTitle}>{item.bookName} - Igice {item.chapterNumber}</Text>
            <Text style={styles.noteTimestamp}>
              At {formatTimestamp(item.timestamp)} • {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
        <Text style={styles.noteText}>{item.text}</Text>
      </TouchableOpacity>

      <View style={styles.noteActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditNote(item)}
        >
          <FontAwesome name="pencil" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteNote(item.id)}
        >
          <FontAwesome name="trash" size={18} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="sticky-note-o" size={64} color="#f68c00" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No Notes Yet</Text>
          <Text style={styles.emptySubText}>
            Your notes will appear here. Add notes while watching videos by tapping the "Add Note" button.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNoteItem}
          contentContainerStyle={styles.notesList}
        />
      )}

      {/* Edit Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Note</Text>
            {selectedNote && (
              <Text style={styles.modalSubtitle}>
                {selectedNote.bookName} - Igice {selectedNote.chapterNumber}
                (at {formatTimestamp(selectedNote.timestamp)})
              </Text>
            )}

            <TextInput
              style={styles.noteInput}
              multiline
              placeholder="Edit your note..."
              value={editedNoteText}
              onChangeText={setEditedNoteText}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEditedNote}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  notesList: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  noteContent: {
    padding: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  thumbnail: {
    width: 60,
    height: 45,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  noteInfo: {
    marginLeft: 12,
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  noteText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
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

export default Notes;
