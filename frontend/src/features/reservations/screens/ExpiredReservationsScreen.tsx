import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';



import { Ionicons } from '@expo/vector-icons';

import {
  useFocusEffect,
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import ReservationQueueCard from '@/features/reservations/components/ReservationQueueCard';

import {
  getReservations,
} from '@/features/reservations/services/reservationStore';

import type {
  ReservationRecord,
} from '@/features/reservations/types/reservation';

export default function ExpiredReservationsScreen() {
  const router = useRouter();

  const [
    reservations,
    setReservations,
  ] = useState<ReservationRecord[]>(
    () => getReservations(),
  );

  const [
    searchText,
    setSearchText,
  ] = useState('');

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  useFocusEffect(
    useCallback(() => {
      setReservations(
        getReservations(),
      );
    }, []),
  );

  const handleSearch = () => {
    setSearchQuery(
      searchText.trim(),
    );

    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchText('');
    setSearchQuery('');

    Keyboard.dismiss();
  };

  const expiredReservations =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      return reservations.filter(
        (reservation) => {
          const isExpired =
            reservation.status ===
            'expired';

          const matchesSearch =
            normalizedSearch === '' ||
            reservation.title
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            reservation.studentId
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            reservation.studentName
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            reservation.id
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          return (
            isExpired &&
            matchesSearch
          );
        },
      );
    }, [
      reservations,
      searchQuery,
    ]);

  const expiredBookCount =
    reservations.filter(
      (reservation) =>
        reservation.status ===
          'expired' &&
        reservation.kind === 'book',
    ).length;

  const expiredSeatCount =
    reservations.filter(
      (reservation) =>
        reservation.status ===
          'expired' &&
        reservation.kind === 'seat',
    ).length;

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <AppHeader
          rightAction="profile"
          sideMenu="staff"
        />

        {/* Title */}
        <View style={styles.titleRow}>
          <Pressable
            onPress={() =>
              router.replace(
                '/staff-dashboard' as Href,
              )
            }
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back to staff dashboard"
          >
            <Ionicons
              name="arrow-back-circle"
              size={30}
              color="#111111"
            />
          </Pressable>

          <View>
            <Text style={styles.title}>
              Expired Reservations
            </Text>

            <Text style={styles.subtitle}>
              Review expired book and
              seat reservations
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Ionicons
              name="book-outline"
              size={22}
              color="#1F3E72"
            />

            <View>
              <Text
                style={
                  styles.summaryValue
                }
              >
                {expiredBookCount}
              </Text>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                Books
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons
              name="grid-outline"
              size={22}
              color="#1F3E72"
            />

            <View>
              <Text
                style={
                  styles.summaryValue
                }
              >
                {expiredSeatCount}
              </Text>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                Seats
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <TextInput
              value={searchText}
              onChangeText={
                setSearchText
              }
              onSubmitEditing={
                handleSearch
              }
              placeholder="Search expired reservations"
              placeholderTextColor="#8A8A8A"
              returnKeyType="search"
              autoCorrect={false}
              style={[
                styles.searchInput,

                Platform.OS ===
                  'web' &&
                  ({
                    outlineStyle:
                      'none',
                    outlineWidth: 0,
                  } as any),
              ]}
            />

            {(searchText !== '' ||
              searchQuery !== '') && (
              <Pressable
                onPress={
                  handleClearSearch
                }
                style={
                  styles.clearButton
                }
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#777777"
                />
              </Pressable>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.searchButton,

              pressed &&
                styles.searchButtonPressed,
            ]}
            onPress={handleSearch}
            accessibilityRole="button"
            accessibilityLabel="Search expired reservations"
          >
            <Ionicons
              name="search"
              size={21}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >
          {expiredReservations.length >
          0 ? (
            expiredReservations.map(
              (reservation) => (
                <ReservationQueueCard
                  key={reservation.id}
                  reservation={
                    reservation
                  }
                  onPress={() =>
                    router.push(
                      `/reservation-details?id=${reservation.id}` as Href,
                    )
                  }
                />
              ),
            )
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="time-outline"
                size={46}
                color="#9CA3AF"
              />

              <Text style={styles.emptyTitle}>
                No expired reservations
              </Text>

              <Text style={styles.emptyText}>
                Expired book and seat
                reservations will appear
                here.
              </Text>
            </View>
          )}
        </ScrollView>

        <StaffBottomNav active="queues" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },

  phoneContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#F7F9FC',
  },

  titleRow: {
    paddingHorizontal: 15,
    paddingTop: 13,

    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 8,
  },

  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111111',
  },

  subtitle: {
    marginTop: 2,

    fontSize: 9,
    color: '#777777',
  },

  summaryRow: {
    marginTop: 16,

    paddingHorizontal: 15,

    flexDirection: 'row',

    gap: 10,
  },

  summaryCard: {
    flex: 1,

    minHeight: 68,

    paddingHorizontal: 13,

    borderRadius: 9,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    flexDirection: 'row',
    alignItems: 'center',

    gap: 11,
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: '800',

    color: '#111827',
  },

  summaryLabel: {
    marginTop: 1,

    fontSize: 9,

    color: '#6B7280',
  },

  searchSection: {
    marginTop: 15,

    paddingHorizontal: 15,

    flexDirection: 'row',

    gap: 7,
  },

  searchBox: {
    flex: 1,

    height: 43,

    paddingLeft: 12,
    paddingRight: 6,

    borderRadius: 6,

    borderWidth: 1,
    borderColor: '#8A8A8A',

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,

    height: '100%',

    borderWidth: 0,

    paddingHorizontal: 0,
    paddingVertical: 0,

    fontSize: 13,

    color: '#111111',

    backgroundColor: 'transparent',
  },

  clearButton: {
    width: 32,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButton: {
    width: 43,
    height: 43,

    borderRadius: 6,

    backgroundColor: '#08245B',

    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButtonPressed: {
    opacity: 0.8,
  },

  listScroll: {
    flex: 1,

    marginTop: 15,
  },

  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,

    gap: 10,
  },

  emptyState: {
    marginTop: 70,

    paddingHorizontal: 25,

    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 10,

    fontSize: 15,
    fontWeight: '700',

    color: '#4B5563',
  },

  emptyText: {
    marginTop: 5,

    fontSize: 11,
    lineHeight: 16,

    textAlign: 'center',

    color: '#9CA3AF',
  },
});