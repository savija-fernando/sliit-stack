import { useState } from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  useLocalSearchParams,
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import {
  getReservationById,
  updateReservation,
} from '@/features/reservations/services/reservationStore';

type ReservationUpdateStatus =
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'expired';

export default function UpdateReservationScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      id?: string;
    }>();

  const reservationId =
    typeof params.id === 'string'
      ? params.id
      : '';

  const reservation =
    getReservationById(
      reservationId,
    );

  const [
    selectedStatus,
    setSelectedStatus,
  ] =
    useState<ReservationUpdateStatus>(
      getInitialStatus(
        reservation?.status,
      ),
    );

  const [
    note,
    setNote,
  ] = useState(
    reservation?.note ?? '',
  );

  if (!reservation) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.phoneContainer}>
          <AppHeader
            rightAction="profile"
          />

          <View style={styles.notFound}>
            <Ionicons
              name="alert-circle-outline"
              size={44}
              color="#9CA3AF"
            />

            <Text style={styles.notFoundText}>
              Reservation not found.
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

  const isBook =
    reservation.kind === 'book';

  const statusOptions: {
    label: string;
    value: ReservationUpdateStatus;
  }[] = [
    {
      label: 'Approved',
      value: 'approved',
    },
    {
      label: 'Rejected',
      value: 'rejected',
    },
  ];

  if (isBook) {
    statusOptions.push({
      label: 'Returned',
      value: 'returned',
    });
  }

  statusOptions.push({
    label: 'Expired',
    value: 'expired',
  });

  const handleUpdate = () => {
    updateReservation(
      reservationId,
      selectedStatus,
      note.trim(),
    );

    router.replace(
      `/reservation-details?id=${reservationId}` as Href,
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <AppHeader
          rightAction="profile"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >
          {/* Page title */}
          <View style={styles.titleRow}>
            <Pressable
              onPress={() =>
                router.replace(
                  `/reservation-details?id=${reservationId}` as Href,
                )
              }
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to reservation details"
            >
              <Ionicons
                name="arrow-back-circle"
                size={30}
                color="#111111"
              />
            </Pressable>

            <Text style={styles.pageTitle}>
              Update{' '}
              {isBook
                ? 'Book'
                : 'Seat'}{' '}
              Reservation
            </Text>
          </View>

          {/* Book / Seat information */}
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

            <View
              style={
                styles.resourceInformation
              }
            >
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
                  styles.resourceBadge,
                  !isBook &&
                    styles.seatBadge,
                ]}
              >
                <Text
                  style={
                    styles.resourceBadgeText
                  }
                >
                  {isBook
                    ? 'Available'
                    : 'Seat Reservation'}
                </Text>
              </View>
            </View>
          </View>

          {/* Reservation ID */}
          <View style={styles.reservationInfo}>
            <Text style={styles.infoLabel}>
              Reservation ID
            </Text>

            <Text style={styles.infoValue}>
              {reservation.id}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Change Status
            </Text>

            <View style={styles.statusCard}>
              {statusOptions.map(
                (option) => {
                  const isSelected =
                    selectedStatus ===
                    option.value;

                  return (
                    <Pressable
                      key={option.value}
                      style={
                        styles.statusOption
                      }
                      onPress={() =>
                        setSelectedStatus(
                          option.value,
                        )
                      }
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected &&
                            styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && (
                          <View
                            style={
                              styles.radioInner
                            }
                          />
                        )}
                      </View>

                      <Text
                        style={[
                          styles.statusLabel,
                          isSelected &&
                            styles.statusLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>
          </View>

          {/* Staff note */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Add Note
            </Text>

            <Text style={styles.optionalText}>
              Optional
            </Text>

            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Enter a note about this reservation..."
              placeholderTextColor="#9CA3AF"
              style={styles.noteInput}
              multiline
              textAlignVertical="top"
              maxLength={250}
            />

            <Text style={styles.characterCount}>
              {note.length}/250
            </Text>
          </View>

          {/* Update button */}
          <Pressable
            style={({ pressed }) => [
              styles.updateButton,
              pressed &&
                styles.updateButtonPressed,
            ]}
            onPress={handleUpdate}
            accessibilityRole="button"
            accessibilityLabel="Update reservation"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
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

function getInitialStatus(
  status?: string,
): ReservationUpdateStatus {
  if (
    status === 'approved' ||
    status === 'rejected' ||
    status === 'returned' ||
    status === 'expired'
  ) {
    return status;
  }

  return 'approved';
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

  resourceInformation: {
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

  resourceBadge: {
    marginTop: 7,

    alignSelf: 'flex-start',

    paddingHorizontal: 10,
    paddingVertical: 3,

    borderRadius: 4,

    backgroundColor: '#16A34A',
  },

  seatBadge: {
    backgroundColor: '#345A9C',
  },

  resourceBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  reservationInfo: {
    minHeight: 52,

    marginTop: 14,

    paddingHorizontal: 13,
    paddingVertical: 12,

    borderRadius: 8,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },

  infoValue: {
    fontSize: 10,
    color: '#555555',
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  optionalText: {
    marginTop: 2,

    fontSize: 9,
    color: '#9CA3AF',
  },

  statusCard: {
    marginTop: 10,

    paddingHorizontal: 13,
    paddingVertical: 5,

    borderRadius: 9,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  statusOption: {
    minHeight: 45,

    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },

  radioOuter: {
    width: 18,
    height: 18,

    borderRadius: 9,

    borderWidth: 2,
    borderColor: '#9CA3AF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  radioOuterSelected: {
    borderColor: '#08245B',
  },

  radioInner: {
    width: 9,
    height: 9,

    borderRadius: 5,

    backgroundColor: '#08245B',
  },

  statusLabel: {
    fontSize: 12,
    color: '#4B5563',
  },

  statusLabelSelected: {
    fontWeight: '700',
    color: '#08245B',
  },

  noteInput: {
    height: 105,

    marginTop: 8,

    paddingHorizontal: 12,
    paddingVertical: 11,

    borderRadius: 8,

    borderWidth: 1,
    borderColor: '#D1D5DB',

    backgroundColor: '#FFFFFF',

    fontSize: 12,
    color: '#111827',
  },

  characterCount: {
    marginTop: 4,

    textAlign: 'right',

    fontSize: 9,
    color: '#9CA3AF',
  },

  updateButton: {
    height: 47,

    marginTop: 22,

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

  notFoundText: {
    marginTop: 10,

    fontSize: 14,
    color: '#6B7280',
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