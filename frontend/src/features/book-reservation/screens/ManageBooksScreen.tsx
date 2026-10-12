
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getBooks } from '../services/bookService';
import type { Book } from '../types/book';

export default function ManageBooksScreen() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBooks = useCallback(async () => {
    try {
      const result = await getBooks();
      setBooks(result);
    } catch (error) {
      Alert.alert(
        'Unable to load books',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadBooks();
    }, [loadBooks]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    void loadBooks();
  };

  const handleEdit = (book: Book) => {
    router.push({
      pathname: '/edit-book/[id]',
      params: { id: book.id },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.muted}>Loading books...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.heading}>Manage Books</Text>
          <Text style={styles.subtitle}>
            {books.length} book{books.length === 1 ? '' : 's'} in the library
          </Text>
        </View>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="library-outline" size={44} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.muted}>
              Add a book to see it here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            <View style={styles.bookIcon}>
              <Ionicons name="book-outline" size={26} color="#2563EB" />
            </View>

            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.detail}>{item.genre}</Text>
              <Text style={styles.detail}>
                Available: {item.availableCopies} / {item.totalCopies}
              </Text>
              <Text style={styles.status}>Status: {item.status}</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
              accessibilityLabel={`Edit ${item.title}`}
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    gap: 10,
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
  headerText: {
    flex: 1,
  },
  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  list: {
    padding: 16,
    paddingBottom: 35,
    flexGrow: 1,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 13,
    marginBottom: 12,
  },
  bookIcon: {
    width: 45,
    height: 55,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
    gap: 4,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  author: {
    fontSize: 12,
    color: '#475569',
  },
  detail: {
    fontSize: 11,
    color: '#64748B',
  },
  status: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 8,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 30,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  muted: {
    fontSize: 13,
    color: '#64748B',
  },
});
