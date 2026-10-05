import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import BackRow from '../components/BackRow';
import {
  getBookById,
  isOnWaitingList,
  leaveWaitingList,
} from '../services/bookService';
import type { Book } from '../types/book';

const DAY_MS = 24 * 60 * 60 * 1000;

function formatAvailableIn(dueDate?: string) {
  if (!dueDate) return 'Not available';

  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / DAY_MS);

  if (days <= 0) return 'Today';
  if (days === 1) return 'In 1 day';
  return `In ${days} days`;
}

export default function WaitingListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [onList, setOnList] = useState(false);
  const [notify, setNotify] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getBookById(id), isOnWaitingList(id)])
      .then(([result, joined]) => {
        if (cancelled) return;
        setBook(result);
        setOnList(joined);
      })
      .catch((error) => console.error('Failed to load waiting list:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Your position is the people already waiting + you.
  const position = (book?.waitingCount ?? 0) + 1;

  const handleLeave = async () => {
    if (!book) return;

    // Connect the Supabase waiting list later.
    await leaveWaitingList(book.id);
    router.back();
  };

  const handleViewWaitingLists = () => {
    router.push('/books/my-waiting-lists');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <BackRow label="Back to details" onPress={() => router.back()} />

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#2563EB" />
      ) : !book || !onList ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>You're not on this waiting list</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Ionicons name="time-outline" size={30} color="#111827" />

          <View style={styles.titleBlock}>
            <Text style={styles.title}>You're on the waiting list</Text>
            <Text style={styles.title}>
              {book.title} — {book.author}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Your position</Text>
              <Text style={styles.value}>#{position}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Est. availability</Text>
              <Text style={styles.value}>
                {formatAvailableIn(book.dueDate)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Notify me</Text>
              <Switch
                value={notify}
                onValueChange={setNotify}
                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.buttons}>
            <Pressable
              onPress={handleViewWaitingLists}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                styles.viewButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>View my waiting lists</Text>
            </Pressable>

            <Pressable
              onPress={handleLeave}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                styles.leaveButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Leave waiting list</Text>
            </Pressable>
          </View>
        </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  titleBlock: {
    alignItems: 'center',
    marginTop: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 21,
  },

  card: {
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },

  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#6B7280',
  },

  label: {
    fontSize: 14,
    color: '#374151',
  },

  value: {
    fontSize: 14,
    color: '#111827',
  },

  buttons: {
    marginTop: 36,
    gap: 16,
    alignItems: 'center',
  },

  button: {
    width: '65%',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewButton: {
    backgroundColor: '#0B2B6B',
  },

  leaveButton: {
    backgroundColor: '#DC2626',
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});