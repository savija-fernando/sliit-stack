import { useState } from 'react';

import {
  Alert,
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

const bookDetails = {
  title: 'Introduction to Programming',
  author: 'J.H Bernard',
  published: '21st June 2016',
};

export default function UpdateReservationScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const reservationId =
    typeof params.id === 'string'
      ? params.id
      : 'B123S45091';

  const [selectedStatus, setSelectedStatus] =
    useState<ReservationUpdateStatus>('approved');

  const [note, setNote] =
    useState('');

  const handleUpdate = () => {
    Alert.alert(
      'Reservation Updated',
      `Reservation ${reservationId} has been updated to ${selectedStatus}.`,
      [
        {
          text: 'OK',
          onPress: () =>
            router.replace(
              `/reservation-details?id=${reservationId}&status=${selectedStatus}` as Href,
            ),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <AppHeader rightAction="profile" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
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
              Update Reservation Details
            </Text>
          </View>

          {/* Book details */}
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
                {bookDetails.title}
              </Text>

              <Text style={styles.bookMeta}>
                By {bookDetails.author}
              </Text>

              <Text style={styles.bookMeta}>
                Published on {bookDetails.published}
              </Text>

              <View style={styles.availableBadge}>
                <Text style={styles.availableText}>
                  Available
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
              {reservationId}
            </Text>
          </View>

          {/* Status section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Change Status
            </Text>

            <View style={styles.statusCard}>
              {statusOptions.map((option) => {
                const isSelected =
                  selectedStatus === option.value;

                return (
                  <Pressable
                    key={option.value}
                    style={styles.statusOption}
                    onPress={() =>
                      setSelectedStatus(option.value)
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
                          style={styles.radioInner}
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
              })}
            </View>
          </View>

          {/* Note */}
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

  bookIcon: {
    width: 48,
    height: 56,

    borderRadius: 6,

    backgroundColor: '#111827',

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

    backgroundColor: '#16A34A',
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
});