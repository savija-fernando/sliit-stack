import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  getReservationById,
  Reservation,
} from '../services/reservationService';

export default function ReservationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [loading, setLoading] = useState(true);

  const loadReservation = async () => {
    try {
      setLoading(true);

      if (!id) {
        throw new Error('Reservation ID is missing.');
      }

      const data = await getReservationById(id);

      if (!data) {
        Alert.alert(
          'Reservation Not Found',
          'This reservation could not be found.'
        );
        return;
      }

      setReservation(data);
    } catch (error) {
      console.error('Failed to load reservation:', error);

      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to load reservation.'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReservation();
    }, [id])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>
            Loading reservation...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!reservation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Reservation not found
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }


const displayTitle =
  reservation.reservationType === 'BOOK'
    ? reservation.book?.title ?? 'Book Reservation'
    : reservation.reservationType === 'SEAT'
      ? reservation.seat?.name ?? 'Seat Reservation'
      : reservation.room?.name ?? 'Study Room Reservation';

const displayLocation =
  reservation.reservationType === 'BOOK'
    ? reservation.book?.location ?? 'Main Library'
    : reservation.reservationType === 'SEAT'
      ? 'Library Seating Area'
      : reservation.room?.location ?? 'Study Room';


  const reservationType =
    reservation.reservationType === 'BOOK'
      ? 'Book'
      : reservation.reservationType === 'SEAT'
        ? 'Seat'
        : 'Room';


const dateToDisplay =
  reservation.bookingDate ?? reservation.reservedAt;

const formattedDate = new Date(
  `${dateToDisplay.slice(0, 10)}T12:00:00`
).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const formatTime = (time: string | null | undefined) => {
  if (!time) return null;

  const [hours, minutes] = time.split(':');
  const hour = Number(hours);

  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>

        <Text style={styles.pageTitle}>
          Reservation Details
        </Text>

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              {reservation.book?.coverUrl ? (
                <Image
                  source={{ uri: reservation.book.coverUrl }}
                  style={styles.coverImage}
                />
              ) : (
                <Text style={styles.icon}>📘</Text>
              )}
            </View>

            <View style={styles.titleArea}>
              <Text style={styles.title}>
  {displayTitle}
</Text>

<Text style={styles.location}>
  {displayLocation}
</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                reservation.status === 'Cancelled' &&
                  styles.cancelledBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  reservation.status === 'Cancelled' &&
                    styles.cancelledStatusText,
                ]}
              >
                {reservation.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <DetailRow
            label="Reservation ID"
            value={reservation.reference}
          />

          <DetailRow
            label="Reservation Type"
            value={reservationType}
          />

          <DetailRow
            label="Reservation Date"
            value={formattedDate}
          />
          
{reservation.reservationType !== 'BOOK' && (
  <>
    <DetailRow
      label="Start Time"
      value={formatTime(reservation.startTime) ?? 'Not available'}
    />

    <DetailRow
      label="End Time"
      value={formatTime(reservation.endTime) ?? 'Not available'}
    />
  </>
)}


          <DetailRow
  label="Location"
  value={displayLocation}
/>

          <DetailRow
            label="Status"
            value={reservation.status}
          />
        </View>

        {reservation.status === 'Active' && (
          <>
            <Pressable
              style={styles.primaryButton}
              onPress={() =>
                router.push({
                  pathname:
                    '/reservations/modify-reservation',
                  params: {
                    id: reservation.id,
                  },
                })
              }
            >
              <Text style={styles.primaryButtonText}>
                Modify Reservation
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() =>
                router.push({
                  pathname:
                    '/reservations/cancel-reservation',
                  params: {
                    id: reservation.id,
                  },
                })
              }
            >
              <Text style={styles.cancelButtonText}>
                Cancel Reservation
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>

      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  backButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  pageTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  coverImage: {
  width: '100%',
  height: '100%',
  borderRadius: 12,
  resizeMode: 'cover',
},

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 24,
  },

  titleArea: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  location: {
    fontSize: 13,
    color: '#6B7280',
  },

  statusBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },

  statusText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },

  cancelledStatusText: {
    color: '#B91C1C',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 18,
  },

  detailRow: {
    marginBottom: 16,
  },

  detailLabel: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 4,
  },

  detailValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '700',
  },
});