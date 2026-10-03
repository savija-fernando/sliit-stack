import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import { searchBooks } from '../services/bookService';
import type { Book, BookStatus } from '../types/book';

const statusColors: Record<BookStatus, string> = {
  Available: '#16A34A',
  Issued: '#D97706',
  Reserved: '#2563EB',
  Unavailable: '#DC2626',
};

export default function BookResultsScreen() {
  const params = useLocalSearchParams<{ search?: string; genre?: string }>();
  const search = params.search ?? '';
  const genre = params.genre ?? '';
  const router = useRouter();

  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    searchBooks({ search, genre })
      .then((books) => {
        if (!cancelled) setResults(books);
      })
      .catch((error) => console.error('Book search failed:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, genre]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Results</Text>

        {loading ? (
          <ActivityIndicator style={styles.loader} color="#2563EB" />
        ) : results.length > 0 ? (
          results.map((book) => (
            <Pressable
              key={book.id}
              onPress={() =>
                    router.push({
                        pathname: '/books/reserve',
                        params: { id: book.id },
                    })
                    }
              accessibilityRole="button"
              accessibilityLabel={`${book.title}, ${book.author}, ${book.status}`}
              style={({ pressed }) => [
                styles.bookRow,
                pressed && styles.bookRowPressed,
              ]}
            >
              <View style={styles.cover}>
                <Ionicons name="book" size={32} color="#080B13" />
              </View>

              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {book.title}
                </Text>
                <Text style={styles.author} numberOfLines={1}>
                  {book.author}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColors[book.status] },
                ]}
              >
                <Text style={styles.statusText}>{book.status}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={36} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptyText}>
              Try another title, author, or genre.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  loader: {
    marginTop: 48,
  },
  bookRow: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  bookRowPressed: {
    backgroundColor: '#F8FAFC',
  },
  cover: {
    width: 56,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  author: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    minWidth: 76,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});