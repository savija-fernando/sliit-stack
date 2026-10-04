import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import BackRow from '../components/BackRow';
import {
  getMyWaitingLists,
  leaveWaitingList,
} from '../services/bookService';
import type { WaitingListItem } from '../types/book';

function formatEstimate(days?: number) {
  if (days === undefined) return 'Est. available soon';
  if (days < 14) return `Est. available in ${days} ${days === 1 ? 'day' : 'days'}`;
  return `Est. available in ${Math.round(days / 7)} weeks`;
}

export default function MyWaitingListsScreen() {
  const router = useRouter();

  const [items, setItems] = useState<WaitingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      getMyWaitingLists()
        .then((result) => {
          if (!cancelled) setItems(result);
        })
        .catch((error) => console.error('Failed to load waiting lists:', error))
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleLeave = (bookId: string) => {
    setItems((previous) => previous.filter((item) => item.bookId !== bookId));
    // Connect the Supabase waiting list later.
    leaveWaitingList(bookId);
  };

  const handleReserveNow = async (bookId: string) => {
    // The waiting list spot turns into a reservation.
    await leaveWaitingList(bookId);
    setItems((previous) => previous.filter((item) => item.bookId !== bookId));

    // Connect the Supabase reservation later.
    const reference = `BR-${Math.floor(1000 + Math.random() * 9000)}`;

    router.push({
      pathname: '/books/confirmation',
      params: { reference },
    });
  };

  const renderLeaveAction = () => (
    <View style={styles.leaveAction}>
      <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
      <Text style={styles.leaveActionText}>Leave</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AppHeader />

        <BackRow onPress={() => router.back()} />

        <Text style={styles.heading}>My waiting lists</Text>

        {loading ? (
          <ActivityIndicator style={styles.loader} color="#2563EB" />
        ) : items.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>No waiting lists</Text>
            <Text style={styles.emptyText}>
              Books you join a waiting list for will show up here.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {items.map((item) => {
              const ready = item.status === 'Ready';

              return (
                <ReanimatedSwipeable
                  key={item.bookId}
                  renderRightActions={renderLeaveAction}
                  rightThreshold={60}
                  overshootRight={false}
                  friction={2}
                  containerStyle={styles.swipeable}
                  onSwipeableOpen={() => handleLeave(item.bookId)}
                >
                  <View style={styles.card}>
                    <View style={styles.cover}>
                      <Ionicons name="book" size={30} color="#080B13" />
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.bookTitle} numberOfLines={2}>
                        {item.book.title}
                      </Text>
                      <Text style={styles.author} numberOfLines={1}>
                        {item.book.author}
                      </Text>

                      <View style={styles.metaRow}>
                        <Ionicons
                          name={ready ? 'time-outline' : 'calendar-outline'}
                          size={14}
                          color="#111827"
                        />
                        <Text style={styles.metaText}>
                          {ready
                            ? `Collect by ${item.collectBy}`
                            : formatEstimate(item.estimatedDays)}
                        </Text>
                      </View>

                      {ready && (
                        <Pressable
                          onPress={() => handleReserveNow(item.bookId)}
                          accessibilityRole="button"
                          style={({ pressed }) => [
                            styles.reserveButton,
                            pressed && styles.reserveButtonPressed,
                          ]}
                        >
                          <Text style={styles.reserveButtonText}>
                            Reserve now
                          </Text>
                        </Pressable>
                      )}
                    </View>

                    {ready ? (
                      <View style={styles.readyBadge}>
                        <Text style={styles.readyBadgeText}>Ready</Text>
                      </View>
                    ) : (
                      <View style={styles.positionBadge}>
                        <Text style={styles.positionBadgeText}>
                          #{item.position}
                        </Text>
                      </View>
                    )}
                  </View>
                </ReanimatedSwipeable>
              );
            })}
          </ScrollView>
        )}

        {items.length > 0 && (
          <Text style={styles.hint}>Swipe a book to leave its waiting list</Text>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },

  loader: {
    marginTop: 60,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 40,
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

  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },

  swipeable: {
    borderRadius: 12,
  },

  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    minHeight: 104,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },

  cover: {
    width: 52,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
    minWidth: 0,
    gap: 3,
    paddingRight: 44,
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  author: {
    fontSize: 13,
    color: '#374151',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },

  metaText: {
    fontSize: 12,
    color: '#111827',
    flexShrink: 1,
  },

  reserveButton: {
    alignSelf: 'flex-start',
    minWidth: 120,
    height: 32,
    marginTop: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reserveButtonPressed: {
    opacity: 0.85,
  },

  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  readyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#16A34A',
  },

  readyBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  positionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6B7280',
    backgroundColor: '#FFFFFF',
  },

  positionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },

  leaveAction: {
    width: 96,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  leaveActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#DC2626',
    paddingVertical: 14,
  },
});