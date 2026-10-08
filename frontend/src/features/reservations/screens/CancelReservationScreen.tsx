import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import {
  cancelReservation,
  getReservationById,
  Reservation,
} from '../services/reservationService';

export default function CancelReservationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [reason, setReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const loadReservation = async () => {
    try {
      if (!id) {
        throw new Error('Reservation ID is missing.');
      }

      const data = await getReservationById(id);

      if (!data) {
        throw new Error('Reservation not found.');
      }

      setReservation(data);
    } catch (error) {
      console.error(
        'Failed to load reservation:',
        error
      );

      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to load reservation.'
      );
    }
  };

  React.useEffect(() => {
    loadReservation();
  }, [id]);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Cancel Reservation',
          style: 'destructive',
          onPress: confirmCancellation,
        },
      ]
    );
  };

const confirmCancellation = async () => {
  console.log('🔥 CANCEL BUTTON PRESSED');

  if (!reservation) {
    console.log('❌ NO RESERVATION');
    Alert.alert(
      'Error',
      'Reservation information is not available.'
    );
    return;
  }

  try {
    console.log('🔥 Calling cancelReservation:', reservation.id);

    setCancelling(true);

    await cancelReservation(reservation.id);

    console.log('✅ cancelReservation finished');

    Alert.alert(
      'Reservation Cancelled',
      'Your reservation has been cancelled successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/reservations');
          },
        },
      ]
    );
  } catch (error) {
    console.error('❌ CANCEL ERROR:', error);

    Alert.alert(
      'Cancellation Failed',
      error instanceof Error
        ? error.message
        : 'Failed to cancel reservation.'
    );
  } finally {
    setCancelling(false);
  }
};

  if (!reservation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text style={styles.loadingText}>
            Loading reservation...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>
            ‹ Back
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Cancel Reservation
        </Text>

        <View style={styles.card}>
          <Text style={styles.bookTitle}>
            {reservation.book?.title ??
              'Book Reservation'}
          </Text>

          <Text style={styles.meta}>
            {reservation.book?.location ??
              'Main Library'}
          </Text>

          <Text style={styles.meta}>
            Reservation ID: {reservation.reference}
          </Text>
        </View>

        <View style={styles.warning}>
          <Text style={styles.warningTitle}>
            Are you sure you want to cancel?
          </Text>

          <Text style={styles.warningText}>
            Once cancelled, the reserved item will be
            released for another user. This action
            cannot be undone.
          </Text>
        </View>

        <Text style={styles.label}>
          Reason for cancellation{' '}
          <Text style={styles.optional}>
            (Optional)
          </Text>
        </Text>

        <TextInput
          style={styles.reasonInput}
          value={reason}
          onChangeText={setReason}
          placeholder="Tell us why you are cancelling..."
          multiline
          textAlignVertical="top"
        />

        <Pressable
          style={[
            styles.cancelButton,
            cancelling && styles.disabledButton,
          ]}
          onPress={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.cancelText}>
              Cancel Reservation
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.goBackButton}
          onPress={() => router.back()}
          disabled={cancelling}
        >
          <Text style={styles.goBackText}>
            Go Back
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
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

  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 12,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  meta: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 3,
  },

  warning: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
  },

  warningTitle: {
    color: '#9A3412',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  warningText: {
    color: '#7C2D12',
    fontSize: 14,
    lineHeight: 21,
  },

  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },

  optional: {
    color: '#9CA3AF',
    fontWeight: '400',
  },

  reasonInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    minHeight: 110,
    fontSize: 15,
    marginBottom: 22,
  },

  cancelButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },

  disabledButton: {
    opacity: 0.6,
  },

  cancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  goBackButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },

  goBackText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});