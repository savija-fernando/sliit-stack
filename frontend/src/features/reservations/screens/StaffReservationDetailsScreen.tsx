import {
  useCallback,
  useState,
} from 'react';
import { supabase } from '@/lib/supabase';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import {
  getReservationById,
} from '@/features/reservations/services/reservationStore';

import type {
  ReservationRecord,
  ReservationStatus,
} from '@/features/reservations/types/reservation';

import {
  getAdminBookReservationById,
  getAdminSeatReservationById,
} from '@/features/reservations/services/adminBookReservationService';
import { ActivityIndicator } from 'react-native';

export default function ReservationDetailsScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      id?: string;
    }>();

  const reservationId =
    typeof params.id === 'string'
      ? params.id
      : '';

  const [
    reservation,
    setReservation,
  ] =
    useState<
      ReservationRecord | undefined
    >(() =>
      getReservationById(
        reservationId,
      ),
    );
const [loadingBook, setLoadingBook] = useState(false);
const [bookError, setBookError] = useState('');

useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const loadReservation = async () => {
      setBookError('');

      // First, check the existing store.
      const localReservation =
        getReservationById(reservationId);

// Preserve existing local reservations.
if (localReservation?.kind === 'seat') {
  setReservation(localReservation);
  setLoadingBook(false);
  return;
}

setLoadingBook(true);

try {
  // Try loading a seat reservation from Supabase first.
  const seatReservation =
    await getAdminSeatReservationById(reservationId);

  if (!isActive) return;

  if (seatReservation) {
    const { data: booking, error: bookingError } = await supabase
      .from('seat_bookings')
      .select('date, start_time, end_time')
      .eq('reservation_id', reservationId)
      .maybeSingle();

    if (bookingError) {
      throw new Error(
        `Failed to load seat booking: ${bookingError.message}`,
      );
    }

    const mappedSeatReservation: ReservationRecord = {
      id: seatReservation.id,
      title: seatReservation.seat_name,
      author: 'Library Seating Area',
      published: booking
        ? `${booking.start_time} - ${booking.end_time}`
        : 'Not available',
      studentId: seatReservation.user_id,
      universityId: seatReservation.university_id,
      studentName: 'Student',
      dateText: booking?.date ?? 'Date unavailable',
      reservedOn: seatReservation.reserved_at
        ? new Date(seatReservation.reserved_at).toLocaleString()
        : 'Date unavailable',
      pickupDate: booking?.date ?? 'Date unavailable',
      dueDate: booking?.end_time ?? 'Not available',
      status:
        seatReservation.status.toLowerCase() === 'approved'
          ? 'approved'
          : seatReservation.status.toLowerCase() === 'rejected'
            ? 'rejected'
            : seatReservation.status.toLowerCase() === 'returned'
              ? 'returned'
              : seatReservation.status.toLowerCase() === 'expired'
                ? 'expired'
                : 'pending',
      kind: 'seat',
    };

    setReservation(mappedSeatReservation);
    return;
  }

  // If it's not a seat reservation, continue with the existing book flow.
  const bookReservation =
    await getAdminBookReservationById(reservationId);

        if (!isActive) return;

        if (!bookReservation) {
          setReservation(localReservation);
          return;
        }

        const mappedReservation: ReservationRecord = {
          id: bookReservation.id,
          title: bookReservation.title,
          author: bookReservation.author,
          published: 'Not specified',
          studentId: bookReservation.user_id,
          universityId: bookReservation.university_id,
          studentName: 'Student',
          dateText: bookReservation.reserved_at
            ? new Date(bookReservation.reserved_at)
                .toLocaleDateString()
            : 'Date unavailable',
          reservedOn: bookReservation.reserved_at
            ? new Date(bookReservation.reserved_at)
                .toLocaleString()
            : 'Date unavailable',
          pickupDate: 'Not assigned',
          dueDate: 'Not assigned',
          status:
            bookReservation.status.toLowerCase() === 'approved'
              ? 'approved'
              : bookReservation.status.toLowerCase() === 'rejected'
                ? 'rejected'
                : bookReservation.status.toLowerCase() === 'returned'
                  ? 'returned'
                  : bookReservation.status.toLowerCase() === 'expired'
                    ? 'expired'
                    : 'pending',
          kind: 'book',
        };

        setReservation(mappedReservation);
      } catch (error) {
        if (!isActive) return;

        setBookError(
          error instanceof Error
            ? error.message
            : 'Failed to load book reservation.',
        );

        setReservation(localReservation);
      } finally {
        if (isActive) {
          setLoadingBook(false);
        }
      }
    };

    loadReservation();

    return () => {
      isActive = false;
    };
  }, [reservationId]),
);

if (loadingBook) {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <ActivityIndicator size="large" color="#08245B" />
        <Text>Loading reservation...</Text>
      </View>
    </SafeAreaView>
  );
}


  if (!reservation) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.phoneContainer}>
          <AppHeader
            rightAction="profile"
            sideMenu="staff"
          />

          <View style={styles.notFound}>
            <Ionicons
              name="alert-circle-outline"
              size={44}
              color="#9CA3AF"
            />

            <Text style={styles.notFoundTitle}>
              Reservation not found
            </Text>

            <Pressable
              style={
                styles.backToQueueButton
              }
              onPress={() =>
                router.replace(
                  '/staff-queues' as Href,
                )
              }
            >
              <Text
                style={
                  styles.backToQueueText
                }
              >
                Back to Queue
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isBook =
    reservation.kind === 'book';

  const statusStyle =
    getStatusStyle(
      reservation.status,
    );

  const handleBackToQueue = () => {
    router.replace(
      `/staff-queues?type=${reservation.kind}` as Href,
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <AppHeader
          rightAction="profile"
          sideMenu="staff"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <View style={styles.titleRow}>
            <Pressable
              onPress={
                handleBackToQueue
              }
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to reservation queue"
            >
              <Ionicons
                name="arrow-back-circle"
                size={30}
                color="#111111"
              />
            </Pressable>

            <Text style={styles.pageTitle}>
              {isBook
                ? 'Book Reservation Details'
                : 'Seat Reservation Details'}
            </Text>
          </View>

          <View style={styles.resourceCard}>
            <View
              style={[
                styles.resourceIcon,
                !isBook &&
                  styles.seatIcon,
              ]}
            >
              {isBook ? (
                <Ionicons
                  name="book"
                  size={32}
                  color="#FFFFFF"
                />
              ) : (
                <MaterialCommunityIcons
                  name="seat"
                  size={34}
                  color="#FFFFFF"
                />
              )}
            </View>

            <View style={styles.resourceInfo}>
              <Text
                style={
                  styles.resourceTitle
                }
              >
                {reservation.title}
              </Text>

              {isBook ? (
                <>
                  <Text
                    style={
                      styles.resourceMeta
                    }
                  >
                    By {reservation.author}
                  </Text>

                  <Text
                    style={
                      styles.resourceMeta
                    }
                  >
                    Published on{' '}
                    {
                      reservation.published
                    }
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.resourceMeta
                    }
                  >
                    Location:{' '}
                    {reservation.author}
                  </Text>

                  <Text
                    style={
                      styles.resourceMeta
                    }
                  >
                    Time Slot:{' '}
                    {
                      reservation.published
                    }
                  </Text>
                </>
              )}

              <View
                style={[
                  styles.resourceTypeBadge,
                  !isBook &&
                    styles.seatTypeBadge,
                ]}
              >
                <Text
                  style={
                    styles.resourceTypeText
                  }
                >
                  {isBook
                    ? 'Available'
                    : 'Seat Reservation'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <InfoRow
              label="Reservation ID"
              value={reservation.id}
            />

            <InfoRow
              label="Student ID"
              value={
                reservation.studentId
              }
            />

            <InfoRow
              label="Student Name"
              value={
                reservation.studentName
              }
            />
            <InfoRow
              label="University ID"
              value={reservation.universityId ?? 'Not available'}
            />

            <InfoRow
              label="Reserved On"
              value={
                reservation.reservedOn
              }
            />

            <InfoRow
              label={
                isBook
                  ? 'Pick-up Date'
                  : 'Reservation Date'
              }
              value={
                reservation.pickupDate
              }
            />

            <InfoRow
              label={
                isBook
                  ? 'Due Date'
                  : 'End Time'
              }
              value={
                reservation.dueDate
              }
            />

            <View style={styles.statusRow}>
              <Text style={styles.infoLabel}>
                Reservation Status
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      statusStyle.backgroundColor,
                  },
                ]}
              >
                <Text
                  style={
                    styles.statusText
                  }
                >
                  {statusStyle.label}
                </Text>
              </View>
            </View>

            {reservation.note ? (
              <InfoRow
                label="Staff Note"
                value={reservation.note}
              />
            ) : null}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.updateButton,
              pressed &&
                styles.updateButtonPressed,
            ]}
            onPress={() =>
              router.push(
                `/update-reservation?id=${reservation.id}` as Href,
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.updateButtonText
              }
            >
              Update Reservation
            </Text>
          </Pressable>
        </ScrollView>

        <StaffBottomNav active="queues" />
      </View>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

function getStatusStyle(
  status: ReservationStatus,
) {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        backgroundColor: '#16A34A',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        backgroundColor: '#DC2626',
      };

    case 'returned':
      return {
        label: 'Returned',
        backgroundColor: '#2563EB',
      };

    case 'expired':
      return {
        label: 'Expired',
        backgroundColor: '#7C3AED',
      };

    default:
      return {
        label: 'Pending',
        backgroundColor: '#F59E0B',
      };
  }
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

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 15,
    paddingTop: 13,
    paddingBottom: 25,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  backButton: {
    marginRight: 7,
  },

  pageTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },

  resourceCard: {
    padding: 14,

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  resourceIcon: {
    width: 48,
    height: 56,

    borderRadius: 6,

    backgroundColor: '#111827',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  seatIcon: {
    backgroundColor: '#1F3E72',
  },

  resourceInfo: {
    flex: 1,
  },

  resourceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },

  resourceMeta: {
    marginTop: 3,
    fontSize: 10,
    color: '#555555',
  },

  resourceTypeBadge: {
    marginTop: 7,

    alignSelf: 'flex-start',

    paddingHorizontal: 10,
    paddingVertical: 3,

    borderRadius: 4,

    backgroundColor: '#16A34A',
  },

  seatTypeBadge: {
    backgroundColor: '#345A9C',
  },

  resourceTypeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  detailsCard: {
    marginTop: 18,
    gap: 9,
  },

  infoRow: {
    minHeight: 52,

    paddingHorizontal: 13,
    paddingVertical: 12,

    borderRadius: 8,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },

  infoValue: {
    maxWidth: '60%',
    fontSize: 10,
    color: '#555555',
    textAlign: 'right',
  },

  statusRow: {
    minHeight: 52,

    paddingHorizontal: 13,
    paddingVertical: 12,

    borderRadius: 8,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusBadge: {
    minWidth: 72,

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 5,

    alignItems: 'center',
  },

  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  updateButton: {
    height: 47,

    marginTop: 18,

    borderRadius: 8,

    backgroundColor: '#08245B',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,
  },

  updateButtonPressed: {
    opacity: 0.85,
  },

  updateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  notFound: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 20,
  },

  notFoundTitle: {
    marginTop: 10,

    fontSize: 16,
    fontWeight: '700',

    color: '#4B5563',
  },

  backToQueueButton: {
    marginTop: 18,

    paddingHorizontal: 20,
    paddingVertical: 10,

    borderRadius: 7,

    backgroundColor: '#08245B',
  },

  backToQueueText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '700',
  },
});
