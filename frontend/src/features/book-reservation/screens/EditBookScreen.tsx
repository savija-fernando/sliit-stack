
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getBookById, updateBook } from '../services/bookService';
import type { Book } from '../types/book';

export default function EditBookScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [location, setLocation] = useState('');
  const [totalCopies, setTotalCopies] = useState('1');
  const [availableCopies, setAvailableCopies] = useState('1');

  useEffect(() => {
    const loadBook = async () => {
      try {
        if (!id) {
          throw new Error('Book ID is missing.');
        }

        const result = await getBookById(id);
        setBook(result);

        setTitle(result.title ?? '');
        setAuthor(result.author ?? '');
        setGenre(result.genre ?? '');
        setIsbn(result.isbn ?? '');
        setDescription(result.description ?? '');
        setCoverUrl(result.coverUrl ?? '');
        setLocation(result.location ?? '');
        setTotalCopies(String(result.totalCopies ?? 1));
        setAvailableCopies(String(result.availableCopies ?? 1));
      } catch (error) {
        Alert.alert(
          'Unable to load book',
          error instanceof Error ? error.message : 'Please try again.',
          [{ text: 'OK', onPress: () => router.back() }],
        );
      } finally {
        setLoading(false);
      }
    };

    void loadBook();
  }, [id, router]);

  const handleSave = async () => {
    if (!book) return;

    if (!title.trim() || !author.trim() || !genre.trim()) {
      Alert.alert('Missing information', 'Title, author, and genre are required.');
      return;
    }

    const total = Number(totalCopies);
    const available = Number(availableCopies);

    if (
      !Number.isInteger(total) ||
      !Number.isInteger(available) ||
      total < 1 ||
      available < 0 ||
      available > total
    ) {
      Alert.alert(
        'Invalid copies',
        'Total copies must be at least 1. Available copies must be between 0 and total copies.',
      );
      return;
    }

    setSaving(true);

    try {
      await updateBook(book.id, {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        isbn: isbn.trim() || undefined,
        description: description.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
        location: location.trim() || undefined,
        totalCopies: total,
        availableCopies: available,
      });

      Alert.alert('Success', 'Book updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        'Update failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.muted}>Loading book details...</Text>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.heading}>Book not found</Text>
        <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
          <Text style={styles.saveText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#111827" />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Edit Book</Text>
            <Text style={styles.muted}>Update the library book details</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Book Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
          />

          <Text style={styles.label}>Author *</Text>
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder="Enter author name"
          />

          <Text style={styles.label}>Genre *</Text>
          <TextInput
            style={styles.input}
            value={genre}
            onChangeText={setGenre}
            placeholder="Enter genre"
          />

          <Text style={styles.label}>ISBN</Text>
          <TextInput
            style={styles.input}
            value={isbn}
            onChangeText={setIsbn}
            placeholder="Enter ISBN"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter book description"
            multiline
          />

          <Text style={styles.label}>Cover Image URL</Text>
          <TextInput
            style={styles.input}
            value={coverUrl}
            onChangeText={setCoverUrl}
            placeholder="Enter image URL"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Shelf / Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter shelf or location"
          />

          <Text style={styles.label}>Total Copies *</Text>
          <TextInput
            style={styles.input}
            value={totalCopies}
            onChangeText={setTotalCopies}
            keyboardType="number-pad"
            placeholder="Total copies"
          />

          <Text style={styles.label}>Available Copies *</Text>
          <TextInput
            style={styles.input}
            value={availableCopies}
            onChangeText={setAvailableCopies}
            keyboardType="number-pad"
            placeholder="Available copies"
          />

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F8FAFC' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  heading: { fontSize: 22, fontWeight: '800', color: '#111827' },
  muted: { fontSize: 12, color: '#64748B', marginTop: 3 },
  form: { padding: 20, paddingBottom: 40 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  disabledButton: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
