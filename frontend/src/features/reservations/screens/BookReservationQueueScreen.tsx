import {
  useCallback,
  useEffect,
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
  useLocalSearchParams,
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import ReservationQueueCard from '@/features/reservations/components/ReservationQueueCard';
import ReservationStatusTabs from '@/features/reservations/components/ReservationStatusTabs';
import ReservationTypeTabs from '@/features/reservations/components/ReservationTypeTabs';

import {
  getReservations,
} from '@/features/reservations/services/reservationStore';

import type {
  ReservationKind,
  ReservationRecord,
  ReservationStatus,
} from '@/features/reservations/types/reservation';


import {
  getAdminBookReservations,
  getAdminSeatReservations,
} from '@/features/reservations/services/adminBookReservationService';

type QueueStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'cancelled';

export default function BookReservationQueueScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      type?: string;
    }>();

  const [
    reservations,
    setReservations,
  ] = useState<ReservationRecord[]>(
    () => getReservations(),
  );
  const [loadingBooks, setLoadingBooks] =
  useState(false);

const [bookReservationError, setBookReservationError] =
  useState<string | null>(null);

  const [
    activeType,
    setActiveType,
  ] = useState<ReservationKind>(
    getReservationType(
      params.type,
    ),
  );

  const [
    activeStatus,
    setActiveStatus,
  ] = useState<QueueStatus>(
    'pending',
  );

  const [
    searchText,
    setSearchText,
  ] = useState('');

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  useEffect(() => {
    setActiveType(
      getReservationType(
        params.type,
      ),
    );

    setActiveStatus('pending');

    setSearchText('');
    setSearchQuery('');
  }, [params.type]);

  const loadAdminBookReservations = useCallback(
  async () => {
    setLoadingBooks(true);
    setBookReservationError(null);

    try {
      const bookReservations =
        await getAdminBookReservations();

        console.log(
  'ADMIN BOOK RESERVATIONS:',
  bookReservations
);

      const mappedReservations: ReservationRecord[] =
        bookReservations.map((item) => ({
          id: item.id,
          title: item.title,
          author: item.author,
          studentId: item.user_id,
          studentName: 'Student',
          dateText: item.reserved_at
            ? new Date(item.reserved_at).toLocaleDateString()
            : 'Date unavailable',
          status:
            item.status.toLowerCase() === 'active'
              ? 'pending'
              : item.status.toLowerCase() === 'approved'
                ? 'approved'
                : item.status.toLowerCase() === 'rejected'
                  ? 'rejected'
                  : item.status.toLowerCase() === 'returned'
                    ? 'returned'
                    : item.status.toLowerCase() === 'expired'
                      ? 'expired'
                      : item.status.toLowerCase() === 'cancelled'
                        ? 'cancelled'
                        : 'pending',
          kind: 'book',
          published: '',
          reservedOn: item.reserved_at ?? '',
          pickupDate: '',
          dueDate: '',
        }));
        console.log(
  'MAPPED BOOK RESERVATIONS:',
  mappedReservations.map((item) => ({
    title: item.title,
    status: item.status,
    kind: item.kind,
  }))
);

      setReservations((current) => [
        ...current.filter(
          (reservation) => reservation.kind !== 'book',
        ),
        ...mappedReservations,
      ]);
    } catch (error) {
      setBookReservationError(
        error instanceof Error
          ? error.message
          : 'Could not load book reservations.',
      );
    } finally {
      setLoadingBooks(false);
    }
  },
  [],
);


const loadAdminSeatReservations = useCallback(async () => {
  try {
    const seatReservations = await getAdminSeatReservations();

    const mappedReservations: ReservationRecord[] =
      seatReservations.map((item) => ({
        id: item.id,
        title: item.seat_name,
        author: '',
        studentId: item.user_id,
        studentName: 'Student',
        dateText: item.reserved_at
          ? new Date(item.reserved_at).toLocaleDateString()
          : 'Date unavailable',
        status:
          item.status.toLowerCase() === 'active'
            ? 'pending'
            : item.status.toLowerCase() as QueueStatus,
        kind: 'seat',
        published: '',
        reservedOn: item.reserved_at ?? '',
        pickupDate: '',
        dueDate: '',
      }));

    setReservations((current) => [
      ...current.filter((reservation) => reservation.kind !== 'seat'),
      ...mappedReservations,
    ]);
  } catch (error) {
    console.error('Failed to load seat reservations:', error);
  }
}, []);


useFocusEffect(
  useCallback(() => {
    setReservations(getReservations());

    if (activeType === 'book') {
      loadAdminBookReservations();
    } else if (activeType === 'seat') {
      loadAdminSeatReservations();
    }
  }, [
    activeType,
    loadAdminBookReservations,
    loadAdminSeatReservations,
  ]),
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

  const handleTypeChange = (
    type: ReservationKind,
  ) => {
    setActiveType(type);

    setActiveStatus('pending');

    setSearchText('');
    setSearchQuery('');
  };

  const handleStatusChange = (
    status: ReservationStatus,
  ) => {
    if (
      status === 'pending' ||
      status === 'approved' ||
      status === 'rejected' ||
      (
        activeType === 'book' &&
        status === 'returned'
      )
    ) {
      setActiveStatus(
        status as QueueStatus,
      );
    }
  };

  const filteredReservations =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      return reservations.filter(
        (reservation) => {
          const matchesType =
            reservation.kind ===
            activeType;

          const matchesStatus =
            reservation.status ===
            activeStatus;

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
            matchesType &&
            matchesStatus &&
            matchesSearch
          );
        },
      );
    }, [
      reservations,
      activeType,
      activeStatus,
      searchQuery,
    ]);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        {/* Header */}
        <AppHeader
          rightAction="profile"
          sideMenu="staff"
        />

        {/* Page title */}
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

          <Text style={styles.title}>
            Reservation Queues
          </Text>
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
              placeholder={
                activeType === 'book'
                  ? 'Search book reservation'
                  : 'Search seat reservation'
              }
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
            accessibilityLabel="Search reservations"
          >
            <Ionicons
              name="search"
              size={21}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Book / Seat selector */}
        <ReservationTypeTabs
          activeType={activeType}
          onChange={
            handleTypeChange
          }
        />

        {/* Status tabs */}
        <View style={styles.tabsWrapper}>
          <ReservationStatusTabs
            activeStatus={
              activeStatus
            }
            reservationKind={
              activeType
            }
            onChange={
              handleStatusChange
            }
          />
        </View>

        {/* Reservation list */}
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
          {activeType === 'book' && loadingBooks ? (
            <Text style={{ textAlign: 'center', marginTop: 30 }}>
              Loading book reservations...
            </Text>
          ) : bookReservationError && activeType === 'book' ? (
            <Text style={{ textAlign: 'center', marginTop: 30, color: 'red' }}>
              {bookReservationError}
            </Text>
          ) : filteredReservations.length > 0 ? (
            filteredReservations.map(
              (reservation) => (
                <ReservationQueueCard
                  key={
                    reservation.id
                  }
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
                name={
                  activeType === 'book'
                    ? 'book-outline'
                    : 'grid-outline'
                }
                size={40}
                color="#9CA3AF"
              />

              <Text style={styles.emptyTitle}>
                No{' '}
                {activeType === 'book'
                  ? 'book'
                  : 'seat'}{' '}
                reservations found
              </Text>

              <Text style={styles.emptyText}>
                Try another search or reservation status.
              </Text>
            </View>
          )}
        </ScrollView>

        <StaffBottomNav active="queues" />
      </View>
    </SafeAreaView>
  );
}

function getReservationType(
  type: string | undefined,
): ReservationKind {
  if (type === 'seat') {
    return 'seat';
  }

  return 'book';
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

    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 2,
  },

  titleRow: {
    paddingHorizontal: 15,
    paddingTop: 13,

    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 7,
  },

  title: {
    fontSize: 19,
    fontWeight: '800',

    color: '#111111',
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

  tabsWrapper: {
    paddingHorizontal: 15,
  },

  listScroll: {
    flex: 1,

    marginTop: 13,
  },

  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,

    gap: 10,
  },

  emptyState: {
    marginTop: 55,

    alignItems: 'center',

    paddingHorizontal: 20,
  },

  emptyTitle: {
    marginTop: 10,

    fontSize: 14,
    fontWeight: '700',

    color: '#4B5563',
  },

  emptyText: {
    marginTop: 4,

    fontSize: 11,

    color: '#9CA3AF',

    textAlign: 'center',
  },
});