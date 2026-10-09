import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';

import { getMyReservations } from '../services/reservationService';
import type { Reservation } from '../services/reservationService';

export default function MyReservationsScreen() {
  const [selectedTab, setSelectedTab] = useState<
    'All' | 'Books' | 'Seats'
  >('All');

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // IDs of cancelled reservations the user has swiped away
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const handleRemove = (id: string) => {
    setDismissedIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    // Optional: call your backend here so it stays removed permanently
    // await deleteReservation(id);
  };

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getMyReservations();

      setReservations(result);
    } catch (error) {
      console.error('Failed to load reservations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [loadReservations])
  );

  const filteredReservations = reservations.filter(
    (reservation) => {
      if (selectedTab === 'All') {
        return true;
      }

      if (selectedTab === 'Books') {
        return reservation.reservationType === 'BOOK';
      }

      return reservation.reservationType === 'SEAT';
    }
  );

  const visibleReservations = filteredReservations.filter(
    (reservation) => !dismissedIds.includes(reservation.id)
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>My Reservations</Text>

        <Text style={styles.subtitle}>
          View and manage your current book and seat reservations.
        </Text>

        {/* Filter tabs */}
        <View style={styles.tabs}>
          {(['All', 'Books', 'Seats'] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Waiting List */}
        <Pressable
          style={styles.waitingListButton}
          onPress={() =>
            router.push('/reservations/waiting-list-status')
          }
        >
          <View style={styles.waitingTextArea}>
            <Text style={styles.waitingTitle}>
              Waiting List Status
            </Text>

            <Text style={styles.waitingSubtitle}>
              Check your position and estimated waiting time
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        {/* Reservations */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={visibleReservations}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isBook =
                item.reservationType === 'BOOK';

              const title = isBook
                ? item.book?.title ?? 'Book reservation'
                : item.seatId
                  ? 'Seat reservation'
                  : item.roomId
                    ? 'Room reservation'
                    : 'Reservation';

              const location = isBook
                ? item.book?.location ?? 'Library'
                : 'Reservation location';

              const typeLabel = isBook
                ? 'Book'
                : item.reservationType === 'SEAT'
                  ? 'Seat'
                  : 'Room';

              const status = item.status;

              const isCancelled =
                String(status).toLowerCase() === 'cancelled' ||
                String(status).toLowerCase() === 'canceled';

              const card = (
                <Pressable
                  style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() =>
                    router.push({
                      pathname:
                        '/reservations/reservation-details',
                      params: {
                        id: item.id,
                      },
                    })
                  }
                >
                  {/* Type + Status */}
                  <View style={styles.cardTop}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>
                        {typeLabel}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        status === 'Active'
                          ? styles.activeStatus
                          : styles.expiredStatus,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          status === 'Active'
                            ? styles.activeStatusText
                            : styles.expiredStatusText,
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                  </View>

                  {/* Reservation title */}
                  <Text style={styles.cardTitle}>
                    {title}
                  </Text>

                  {/* Location */}
                  <Text style={styles.location}>
                    {location}
                  </Text>

                  {/* Reference */}
                  <View style={styles.dateContainer}>
                    <Text style={styles.smallLabel}>
                      Reservation reference
                    </Text>

                    <Text style={styles.dateText}>
                      {item.reference}
                    </Text>
                  </View>

                  {/* Footer */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.viewDetails}>
                      View Details
                    </Text>

                    <Text style={styles.detailsArrow}>
                      ›
                    </Text>
                  </View>
                </Pressable>
              );

              // Only cancelled reservations can be swiped away
              if (!isCancelled) {
                return card;
              }

              return (
                <Swipeable
                  overshootRight={false}
                  onSwipeableOpen={() => handleRemove(item.id)}
                  renderRightActions={() => (
                    <Pressable
                      style={styles.removeAction}
                      onPress={() => handleRemove(item.id)}
                    >
                      <Text style={styles.removeText}>
                        Remove
                      </Text>
                    </Pressable>
                  )}
                >
                  {card}
                </Swipeable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                  No reservations found
                </Text>

                <Text style={styles.emptyText}>
                  You currently have no reservations in this
                  category.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
    </GestureHandlerRootView>
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

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },

  activeTabButton: {
    backgroundColor: '#2563EB',
  },

  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  waitingListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 14,
    padding: 15,
    marginBottom: 18,
  },

  waitingTextArea: {
    flex: 1,
  },

  waitingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
    marginBottom: 3,
  },

  waitingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },

  arrow: {
    fontSize: 25,
    color: '#2563EB',
  },

  loader: {
    marginTop: 40,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 14,
  },

  cardPressed: {
    opacity: 0.75,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  typeBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  typeText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 12,
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  activeStatus: {
    backgroundColor: '#DCFCE7',
  },

  expiredStatus: {
    backgroundColor: '#FEE2E2',
  },

  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },

  activeStatusText: {
    color: '#166534',
  },

  expiredStatusText: {
    color: '#B91C1C',
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  location: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },

  dateContainer: {
    marginBottom: 14,
  },

  smallLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 3,
  },

  dateText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewDetails: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },

  detailsArrow: {
    color: '#2563EB',
    fontSize: 22,
  },

  emptyContainer: {
    paddingTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  removeAction: {
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 16,
    marginBottom: 14,
    marginLeft: 8,
  },

  removeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});