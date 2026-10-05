import { useMemo, useState } from 'react';

import {
  Keyboard,
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
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import ReservationQueueCard from '@/features/reservations/components/ReservationQueueCard';
import ReservationStatusTabs from './ReservationStatusTabs';

import type {
  ReservationQueueItem,
  ReservationStatus,
} from '../../../types/reservation';

const reservations: ReservationQueueItem[] = [
  {
    id: 'B123S45091',
    title: 'Introduction to Programming',
    studentId: 'IT23546789',
    studentName: 'J.C.P Jayasooriya',
    dateText: '30th August 2026',
    status: 'pending',
    kind: 'book',
  },
  {
    id: 'B123S45092',
    title: 'Fundamentals of Human Resource',
    studentId: 'IT23539068',
    studentName: 'A.L.S Silva',
    dateText: '07th September 2026',
    status: 'pending',
    kind: 'book',
  },
  {
    id: 'B123S45093',
    title: 'Basics of DevOPS',
    studentId: 'IT23445489',
    studentName: 'Nimmaka K.A.T.R',
    dateText: '07th September 2026',
    status: 'pending',
    kind: 'book',
  },
  {
    id: 'B123S45094',
    title: 'Human Biology',
    studentId: 'IT23456789',
    studentName: 'J.C.P Jayasooriya',
    dateText: '08th September 2026',
    status: 'pending',
    kind: 'book',
  },
  {
    id: 'B123S45095',
    title: 'Database Systems',
    studentId: 'IT23542111',
    studentName: 'M.K. Fernando',
    dateText: '09th September 2026',
    status: 'approved',
    kind: 'book',
  },
  {
    id: 'B123S45096',
    title: 'Software Engineering',
    studentId: 'IT23540011',
    studentName: 'S.N. Perera',
    dateText: '09th September 2026',
    status: 'rejected',
    kind: 'book',
  },
];

export default function BookReservationQueueScreen() {
  const router = useRouter();

  const [searchText, setSearchText] =
    useState('');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [
    activeStatus,
    setActiveStatus,
  ] = useState<ReservationStatus>(
    'pending',
  );

  const handleSearch = () => {
    setSearchQuery(
      searchText.trim(),
    );

    Keyboard.dismiss();
  };

  const handleStatusChange = (
    status: ReservationStatus,
  ) => {
    setActiveStatus(status);
  };

  const filteredReservations =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      return reservations.filter(
        (reservation) => {
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
            matchesStatus &&
            matchesSearch
          );
        },
      );
    }, [
      activeStatus,
      searchQuery,
    ]);

  return (
    <SafeAreaView style={styles.page}>
      <View
        style={
          styles.phoneContainer
        }
      >
        <AppHeader
          rightAction="profile"
        />

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
            Book Reservation
          </Text>
        </View>

        <View
          style={
            styles.searchSection
          }
        >
          <View
            style={
              styles.searchBox
            }
          >
            <TextInput
              value={searchText}
              onChangeText={
                setSearchText
              }
              onSubmitEditing={
                handleSearch
              }
              placeholder="Search"
              placeholderTextColor="#8A8A8A"
              style={
                styles.searchInput
              }
              returnKeyType="search"
              autoCorrect={false}
            />
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

        <View
          style={
            styles.tabsWrapper
          }
        >
          <ReservationStatusTabs
            activeStatus={
              activeStatus
            }
            onChange={
              handleStatusChange
            }
          />
        </View>

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
          {filteredReservations.length >
          0 ? (
            filteredReservations.map(
              (reservation) => (
                <ReservationQueueCard
                  key={
                    reservation.id
                  }
                  reservation={
                    reservation
                  }
                />
              ),
            )
          ) : (
            <View
              style={
                styles.emptyState
              }
            >
              <Ionicons
                name="file-tray-outline"
                size={40}
                color="#9CA3AF"
              />

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No reservations found
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Try another search or
                reservation status.
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

    paddingHorizontal: 12,

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
    fontSize: 13,
    color: '#111111',
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