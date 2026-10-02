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
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import StatusBadge from '../components/StatusBadge';
import { getBookById } from '../services/bookService';
import type { Book } from '../types/book';

export default function ReserveBookScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getBookById(id)
      .then((result) => {
        if (!cancelled) setBook(result);
      })
      .catch((error) => console.error('Failed to load book:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const canReserve =
    !!book && book.status === 'Available' && book.availableCopies > 0;

const handleReserve = () => {
  if (!book || !canReserve) return;

  // Connect the Supabase reservation later.
  const reference = `BR-${Math.floor(1000 + Math.random() * 9000)}`;

  router.replace({
    pathname: '/confirmation',
    params: { reference },
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back to results"
        style={styles.backRow}
      >
        <View style={styles.backCircle}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
        </View>
        <Text style={styles.backText}>Back to results</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#2563EB" />
      ) : !book ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Book not found</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Cover */}
            <View style={styles.cover}>
              {book.coverUrl ? (
                <Image
                  source={{ uri: book.coverUrl }}
                  style={styles.coverImage}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="book" size={88} color="#080B13" />
              )}
            </View>

            {/* Title, author, copies, status */}
            <View style={styles.details}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
              <Text style={styles.copies}>
                {book.availableCopies}{' '}
                {book.availableCopies === 1 ? 'copy' : 'copies'} available
              </Text>
              <View style={styles.badgeWrapper}>
                <StatusBadge status={book.status} />
              </View>
            </View>

            {/* Info rows */}
            <View style={styles.infoList}>
              {book.location ? (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={18} color="#111827" />
                  <Text style={styles.infoText}>{book.location}</Text>
                </View>
              ) : null}

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={18} color="#111827" />
                <Text style={styles.infoText}>
                  Collect within 1 day of reserving
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Pinned button */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleReserve}
              disabled={!canReserve}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canReserve }}
              style={({ pressed }) => [
                styles.reserveButton,
                !canReserve && styles.reserveButtonDisabled,
                pressed && canReserve && styles.reserveButtonPressed,
              ]}
            >
              <Text style={styles.reserveButtonText}>Reserve book</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0B2B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  loader: {
    marginTop: 60,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },

  cover: {
    width: '50%',
    aspectRatio: 169 / 214,
    alignSelf: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  coverImage: {
    width: '100%',
    height: '100%',
  },

  details: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  author: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
  },

  copies: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  badgeWrapper: {
    marginTop: 8,
  },

  infoList: {
    marginTop: 32,
    gap: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  infoText: {
    fontSize: 14,
    color: '#111827',
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  reserveButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reserveButtonDisabled: {
    opacity: 0.5,
  },

  reserveButtonPressed: {
    opacity: 0.85,
  },

  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});