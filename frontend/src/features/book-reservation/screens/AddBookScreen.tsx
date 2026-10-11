import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

// Update this import if your service file has a different name.
import { createBook } from '../services/bookService';

export default function AddBookScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [location, setLocation] = useState('');
  const [totalCopies, setTotalCopies] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleCreateBook = async () => {
    if (!title.trim() || !author.trim() || !genre.trim()) {
      Alert.alert(
        'Required fields',
        'Please enter the book title, author, and genre.',
      );
      return;
    }

    const copies = Number(totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      Alert.alert(
        'Invalid copies',
        'Enter a whole number of at least 1.',
      );
      return;
    }

    setLoading(true);

    try {
      await createBook({
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        isbn: isbn.trim() || undefined,
        description: description.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
        location: location.trim() || undefined,
        totalCopies: copies,
        availableCopies: copies,
      });

      Alert.alert('Success', 'Book added successfully.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Unable to add book',
        error instanceof Error
          ? error.message
          : 'Something went wrong.',
      );
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    placeholder: string,
    options?: {
      multiline?: boolean;
      keyboardType?: 'default' | 'numeric';
      required?: boolean;
    },
  ) => (
    <View style={styles.field} key={label}>
      <Text style={styles.label}>
        {label}
        {options?.required ? ' *' : ''}
      </Text>

      <TextInput
        style={[
          styles.input,
          options?.multiline && styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={options?.multiline}
        keyboardType={options?.keyboardType ?? 'default'}
        editable={!loading}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Add New Book</Text>
        <Text style={styles.subtitle}>
          Enter the book details to add it to the library.
        </Text>

        <View style={styles.form}>
          {renderField(
            'Book Title',
            title,
            setTitle,
            'Enter book title',
            { required: true },
          )}

          {renderField(
            'Author',
            author,
            setAuthor,
            'Enter author name',
            { required: true },
          )}

          {renderField(
            'Genre',
            genre,
            setGenre,
            'e.g. Technology',
            { required: true },
          )}

          {renderField(
            'ISBN',
            isbn,
            setIsbn,
            'Enter ISBN (optional)',
          )}

          {renderField(
            'Description',
            description,
            setDescription,
            'Enter book description',
            { multiline: true },
          )}

          {renderField(
            'Cover Image URL',
            coverUrl,
            setCoverUrl,
            'Enter image URL (optional)',
          )}

          {renderField(
            'Shelf / Location',
            location,
            setLocation,
            'e.g. Block A, Shelf 3',
          )}

          {renderField(
            'Total Copies',
            totalCopies,
            setTotalCopies,
            'Enter number of copies',
            { keyboardType: 'numeric', required: true },
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleCreateBook}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>
                Add Book
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 12,
  },
  backText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  heading: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 22,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  multiline: {
    minHeight: 95,
    textAlignVertical: 'top',
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
