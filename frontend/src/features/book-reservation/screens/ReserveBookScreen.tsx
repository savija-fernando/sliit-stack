import { useCallback, useEffect, useState } from 'react';
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
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import BackRow from '../components/BackRow';
import StatusBadge from '../components/StatusBadge';
import {
  getBookById,
  isOnWaitingList,
  joinWaitingList,
} from '../services/bookService';
import type { Book } from '../types/book';

const DAY_MS = 24 * 60 * 60 * 1000;

function formatDueIn(dueDate?: string) {
  if (!dueDate) return 'Due date not available';

  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / DAY_MS);

  if (days <= 0) return 'Due back today';
  if (days === 1) return 'Due back in 1 day';
  return `Due back in ${days} days`;
}

function formatWaiting(count = 0) {
  if (count === 0) return 'No one is waiting';
  if (count === 1) return '1 person already waiting';
  return `${count} people already waiting`;
}

// Shows "Reserve book" for available books and
// "Join waiting list" for issued books.
export default function ReserveBookScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  // Re-check when coming back from the waiting list screen
  useFocusEffect(
    useCallback(() => {
      isOnWaitingList(id).then(setJoined);
    }, [id])
  );

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

  const isIssued = book?.status === 'Issued';

  const canReserve =
    !!book && book.status === 'Available' && book.availableCopies > 0;

  const canPress = isIssued || canReserve;

  const handleReserve = () => {
    if (!book || !canReserve) return;

    // Connect the Supabase reservation later.
    const reference = `BR-${Math.floor(1000 + Math.random() * 9000)}`;

    router.replace({
      pathname: '/books/confirmation',
      params: { reference },
    });
  };

  const handleWaitingList = async () => {
    if (!book || !isIssued) return;

    if (!joined) {
      // Connect the Supabase waiting list later.
      await joinWaitingList(book.id);
      setJoined(true);
    }

    router.push({
      pathname: '/books/waiting-list',
      params: { id: book.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <BackRow label="Back to results" onPress={() => router.back()} />

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

              {!isIssued && (
                <Text style={styles.copies}>
                  {book.availableCopies}{' '}
                  {book.availableCopies === 1 ? 'copy' : 'copies'} available
                </Text>
              )}

              <View style={styles.badgeWrapper}>
                <StatusBadge status={book.status} />
              </View>
            </View>

            {/* Info rows */}
            {isIssued ? (
              <View style={styles.infoListCentered}>
                <View style={styles.infoRowCentered}>
                  <Ionicons name="calendar-outline" size={16} color="#111827" />
                  <Text style={styles.infoTextSmall}>
                    {formatDueIn(book.dueDate)}
                  </Text>
                </View>

                <View style={styles.infoRowCentered}>
                  <Ionicons name="people-outline" size={16} color="#111827" />
                  <Text style={styles.infoTextSmall}>
                    {formatWaiting(book.waitingCount)}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.infoList}>
                {book.location ? (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#111827"
                    />
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
            )}
          </ScrollView>

          {/* Pinned button */}
          <View style={styles.footer}>
            <Pressable
              onPress={isIssued ? handleWaitingList : handleReserve}
              disabled={!canPress}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canPress }}
              style={({ pressed }) => [
                styles.actionButton,
                !canPress && styles.actionButtonDisabled,
                pressed && canPress && styles.actionButtonPressed,
              ]}
            >
              <Text style={styles.actionButtonText}>
                {isIssued
                  ? joined
                    ? 'View waiting list'
                    : 'Join waiting list'
                  : 'Reserve book'}
              </Text>
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

  // Available layout (left aligned)
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

  // Issued layout (centered)
  infoListCentered: {
    marginTop: 24,
    gap: 8,
    alignItems: 'center',
  },

  infoRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  infoTextSmall: {
    fontSize: 13,
    color: '#111827',
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  actionButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButtonDisabled: {
    opacity: 0.5,
  },

  actionButtonPressed: {
    opacity: 0.85,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});