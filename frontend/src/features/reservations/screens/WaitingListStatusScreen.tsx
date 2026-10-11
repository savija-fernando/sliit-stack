
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import {
  getMyWaitingLists,
  leaveWaitingList as leaveWaitingListService,
} from '@/features/book-reservation/services/bookService';

type WaitingStatus = 'Waiting' | 'Ready';

type WaitingItem = {
  bookId: string;
  position: number;
  status: WaitingStatus;
  estimatedDays?: number;
  collectBy?: string;
  book: {
    title: string;
    author?: string;
  };
};

function getEstimatedWait(item: WaitingItem): string {
  if (item.status === 'Ready') {
    return 'Available now';
  }

  if (item.estimatedDays === undefined) {
    return 'Not available yet';
  }

  if (item.estimatedDays <= 0) {
    return 'Today';
  }

  return item.estimatedDays === 1
    ? '1 day'
    : `${item.estimatedDays} days`;
}

export default function WaitingListStatusScreen() {
  const [waitingLists, setWaitingLists] = useState<WaitingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingBookId, setLeavingBookId] = useState<string | null>(null);

  const loadWaitingLists = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getMyWaitingLists();

      setWaitingLists(result as WaitingItem[]);
    } catch (error) {
      console.error('Failed to load waiting lists:', error);

      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Could not load your waiting lists.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWaitingLists();
    }, [loadWaitingLists]),
  );

  const handleLeaveWaitingList = (bookId: string) => {
    Alert.alert(
      'Leave Waiting List',
      'Are you sure you want to leave this waiting list?',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setLeavingBookId(bookId);

              await leaveWaitingListService(bookId);

              setWaitingLists((current) =>
                current.filter((item) => item.bookId !== bookId),
              );
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error
                  ? error.message
                  : 'Could not leave the waiting list.',
              );
            } finally {
              setLeavingBookId(null);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Waiting List Status</Text>

        <Text style={styles.subtitle}>
          Track your book waiting-list positions and availability.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={waitingLists}
            keyExtractor={(item) => item.bookId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isReady = item.status === 'Ready';
              const isLeaving = leavingBookId === item.bookId;

              return (
                <View style={styles.card}>
                  <View style={styles.header}>
                    <View style={styles.titleArea}>
                      <Text style={styles.bookTitle}>
                        {item.book?.title ?? 'Book'}
                      </Text>

                      {item.book?.author ? (
                        <Text style={styles.author}>
                          {item.book.author}
                        </Text>
                      ) : null}

                      <Text style={styles.bookType}>
                        Book waiting list
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        isReady ? styles.readyBadge : styles.activeBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isReady ? styles.readyText : styles.activeText,
                        ]}
                      >
                        {isReady ? 'Ready' : 'Waiting'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoBox}>
                    <View style={styles.infoColumn}>
                      <Text style={styles.infoLabel}>
                        Your position
                      </Text>

                      <Text style={styles.position}>
                        #{item.position}
                      </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoColumn}>
                      <Text style={styles.infoLabel}>
                        Estimated wait
                      </Text>

                      <Text style={styles.infoValue}>
                        {getEstimatedWait(item)}
                      </Text>
                    </View>
                  </View>

                  {isReady && (
                    <View style={styles.readyMessage}>
                      <Text style={styles.readyMessageText}>
                        This book is ready for you. Check its availability
                        before making a reservation.
                      </Text>
                    </View>
                  )}

                  <Pressable
                    style={[
                      styles.leaveButton,
                      isLeaving && styles.disabledButton,
                    ]}
                    disabled={isLeaving}
                    onPress={() => handleLeaveWaitingList(item.bookId)}
                  >
                    {isLeaving ? (
                      <ActivityIndicator color="#DC2626" />
                    ) : (
                      <Text style={styles.leaveText}>
                        Leave Waiting List
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                  No waiting lists
                </Text>

                <Text style={styles.emptyText}>
                  You are not currently waiting for any books.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  backButtonContainer: {
    alignSelf: 'flex-start',
  },

  backButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  title: {
    color: '#111827',
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 5,
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  loader: {
    marginTop: 40,
  },

  list: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  titleArea: {
    flex: 1,
    marginRight: 10,
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  author: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },

  bookType: {
    fontSize: 13,
    color: '#6B7280',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  activeBadge: {
    backgroundColor: '#EFF6FF',
  },

  readyBadge: {
    backgroundColor: '#DCFCE7',
  },

  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },

  activeText: {
    color: '#2563EB',
  },

  readyText: {
    color: '#166534',
  },

  infoBox: {
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 14,
  },

  infoColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },

  infoLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
  },

  position: {
    color: '#2563EB',
    fontSize: 20,
    fontWeight: '700',
  },

  infoValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  readyMessage: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
  },

  readyMessageText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },

  leaveButton: {
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  leaveText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 70,
    paddingHorizontal: 12,
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },

  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
