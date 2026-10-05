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

import { Ionicons } from '@expo/vector-icons';

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
} from './reservationStore';

type ReservationUpdateStatus =
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'expired';

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
  {
    label: 'Returned',
    value: 'returned',
  },
  {
    label: 'Expired',
    value: 'expired',
  },
];

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

  if (!reservation) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.phoneContainer}>
          <AppHeader rightAction="profile" />

          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>
              Reservation not found.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleRow}>
            <Pressable
              onPress={() =>
                router.replace(
                  `/reservation-details?id=${reservationId}` as Href,
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
              Update Reservation Details
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

            <View style={styles.bookInformation}>
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

          <View style={styles.reservationInfo}>
            <Text style={styles.infoLabel}>
              Reservation ID
            </Text>

            <Text style={styles.infoValue}>
              {reservation.id}
            </Text>
          </View>

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

          <Pressable
            style={({ pressed }) => [
              styles.updateButton,

              pressed &&
                styles.updateButtonPressed,
            ]}
            onPress={handleUpdate}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
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
      flex: 1,

      fontSize: 18,
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

    bookInformation: {
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

    reservationInfo: {
      minHeight: 52,

      marginTop: 14,

      paddingHorizontal: 13,
      paddingVertical: 12,

      borderRadius: 8,

      backgroundColor:
        '#FFFFFF',

      borderWidth: 1,
      borderColor: '#E5E7EB',

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
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

      backgroundColor:
        '#FFFFFF',

      borderWidth: 1,
      borderColor: '#E5E7EB',
    },

    statusOption: {
      minHeight: 45,

      flexDirection: 'row',
      alignItems: 'center',

      borderBottomWidth: 1,
      borderBottomColor:
        '#F0F2F5',
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

      backgroundColor:
        '#08245B',
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

      backgroundColor:
        '#FFFFFF',

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
    },

    notFoundText: {
      fontSize: 14,

      color: '#6B7280',
    },
  });