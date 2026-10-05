import {
  useCallback,
  useState,
} from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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

import {
  getReservationById,
} from './reservationStore';

import type {
  ReservationRecord,
  ReservationStatus,
} from '../../../types/reservation';

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

  useFocusEffect(
    useCallback(() => {
      setReservation(
        getReservationById(
          reservationId,
        ),
      );
    }, [reservationId]),
  );

  if (!reservation) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.phoneContainer}>
          <AppHeader rightAction="profile" />

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
              style={styles.backToQueueButton}
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

  const statusStyle =
    getStatusStyle(
      reservation.status,
    );

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <AppHeader rightAction="profile" />

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
              onPress={() =>
                router.replace(
                  '/staff-queues' as Href,
                )
              }
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back-circle"
                size={30}
                color="#111111"
              />
            </Pressable>

            <Text style={styles.pageTitle}>
              Reservation Details
            </Text>
          </View>

          <View style={styles.bookCard}>
            <View style={styles.bookIcon}>
              <Ionicons
                name="book"
                size={32}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>
                {reservation.title}
              </Text>

              <Text style={styles.bookMeta}>
                By {reservation.author}
              </Text>

              <Text style={styles.bookMeta}>
                Published on{' '}
                {reservation.published}
              </Text>

              <View style={styles.availableBadge}>
                <Text style={styles.availableText}>
                  Available
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
              label="Reserved On"
              value={
                reservation.reservedOn
              }
            />

            <InfoRow
              label="Pick-up Date"
              value={
                reservation.pickupDate
              }
            />

            <InfoRow
              label="Due Date"
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
                <Text style={styles.statusText}>
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

            <Text style={styles.updateButtonText}>
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
        backgroundColor:
          '#16A34A',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        backgroundColor:
          '#DC2626',
      };

    case 'returned':
      return {
        label: 'Returned',
        backgroundColor:
          '#2563EB',
      };

    case 'expired':
      return {
        label: 'Expired',
        backgroundColor:
          '#7C3AED',
      };

    default:
      return {
        label: 'Pending',
        backgroundColor:
          '#F59E0B',
      };
  }
}

const styles =
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor:
        '#E5E7EB',
      alignItems: 'center',
    },

    phoneContainer: {
      flex: 1,

      width: '100%',
      maxWidth: 390,

      backgroundColor:
        '#F7F9FC',
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
      fontSize: 19,
      fontWeight: '800',

      color: '#111111',
    },

    bookCard: {
      padding: 14,

      borderRadius: 10,

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',
      alignItems: 'center',

      borderWidth: 1,
      borderColor: '#E5E7EB',
    },

    bookIcon: {
      width: 48,
      height: 56,

      borderRadius: 6,

      backgroundColor:
        '#111827',

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 12,
    },

    bookInfo: {
      flex: 1,
    },

    bookTitle: {
      fontSize: 14,
      fontWeight: '800',

      color: '#111111',
    },

    bookMeta: {
      marginTop: 3,

      fontSize: 10,

      color: '#555555',
    },

    availableBadge: {
      marginTop: 7,

      alignSelf: 'flex-start',

      paddingHorizontal: 10,
      paddingVertical: 3,

      borderRadius: 4,

      backgroundColor:
        '#16A34A',
    },

    availableText: {
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

      backgroundColor:
        '#FFFFFF',

      borderWidth: 1,
      borderColor: '#E5E7EB',

      flexDirection: 'row',
      justifyContent:
        'space-between',
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

      backgroundColor:
        '#FFFFFF',

      borderWidth: 1,
      borderColor: '#E5E7EB',

      flexDirection: 'row',
      justifyContent:
        'space-between',
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

      backgroundColor:
        '#08245B',

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

      backgroundColor:
        '#08245B',
    },

    backToQueueText: {
      color: '#FFFFFF',

      fontSize: 12,
      fontWeight: '700',
    },
  });