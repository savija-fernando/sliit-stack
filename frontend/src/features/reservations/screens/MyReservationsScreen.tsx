import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type ReservationType = 'Book' | 'Seat';

type ReservationStatus = 'Active' | 'Upcoming' | 'Expired';

type Reservation = {
  id: string;
  title: string;
  type: ReservationType;
  date: string;
  location: string;
  status: ReservationStatus;
};

const reservations: Reservation[] = [
  {
    id: '1',
    title: 'Database Systems',
    type: 'Book',
    date: '05 Oct 2026',
    location: 'Main Library · Floor 2',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Reading Room Seat A12',
    type: 'Seat',
    date: '06 Oct 2026',
    location: 'Reading Room · Level 1',
    status: 'Upcoming',
  },
  {
    id: '3',
    title: 'Human Computer Interaction',
    type: 'Book',
    date: '08 Oct 2026',
    location: 'Main Library · Floor 1',
    status: 'Active',
  },
  {
    id: '4',
    title: 'Reading Room Seat B07',
    type: 'Seat',
    date: '01 Oct 2026',
    location: 'Reading Room · Level 2',
    status: 'Expired',
  },
];

export default function MyReservationsScreen() {
  const [selectedTab, setSelectedTab] = useState<
    'All' | 'Books' | 'Seats'
  >('All');

  const filteredReservations = reservations.filter((reservation) => {
    if (selectedTab === 'All') {
      return true;
    }

    if (selectedTab === 'Books') {
      return reservation.type === 'Book';
    }

    return reservation.type === 'Seat';
  });

  const getStatusBackground = (status: ReservationStatus) => {
    if (status === 'Active') {
      return styles.activeStatus;
    }

    if (status === 'Upcoming') {
      return styles.upcomingStatus;
    }

    return styles.expiredStatus;
  };

  const getStatusText = (status: ReservationStatus) => {
    if (status === 'Active') {
      return styles.activeStatusText;
    }

    if (status === 'Upcoming') {
      return styles.upcomingStatusText;
    }

    return styles.expiredStatusText;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>My Reservations</Text>

        <Text style={styles.subtitle}>
          View and manage your current book and seat reservations.
        </Text>

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

        <FlatList
          data={filteredReservations}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                router.push('/reservations/reservation-details')
              }
            >
              <View style={styles.cardTop}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    getStatusBackground(item.status),
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      getStatusText(item.status),
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.location}>{item.location}</Text>

              <View style={styles.dateContainer}>
                <Text style={styles.smallLabel}>
                  Reservation date
                </Text>

                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.viewDetails}>
                  View Details
                </Text>

                <Text style={styles.detailsArrow}>›</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                No reservations found
              </Text>

              <Text style={styles.emptyText}>
                You currently have no reservations in this category.
              </Text>
            </View>
          }
        />
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

  upcomingStatus: {
    backgroundColor: '#FEF3C7',
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

  upcomingStatusText: {
    color: '#92400E',
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
});