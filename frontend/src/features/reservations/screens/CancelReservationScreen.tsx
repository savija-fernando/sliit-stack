import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function CancelReservationScreen() {
  const [reason, setReason] = useState('');

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
          onPress: () => {
            Alert.alert(
              'Reservation Cancelled',
              'Your reservation has been cancelled successfully.',
              [
                {
                  text: 'OK',
                  onPress: () =>
                    router.replace('/reservations'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Cancel Reservation</Text>

        <View style={styles.card}>
          <Text style={styles.bookTitle}>
            Database Systems
          </Text>

          <Text style={styles.meta}>
            Main Library
          </Text>

          <Text style={styles.meta}>
            Reservation ID: RES-1025
          </Text>
        </View>

        <View style={styles.warning}>
          <Text style={styles.warningTitle}>
            Are you sure you want to cancel?
          </Text>

          <Text style={styles.warningText}>
            Once cancelled, the reserved item will be released
            for another user. This action cannot be undone.
          </Text>
        </View>

        <Text style={styles.label}>
          Reason for cancellation{' '}
          <Text style={styles.optional}>(Optional)</Text>
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
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelText}>
            Cancel Reservation
          </Text>
        </Pressable>

        <Pressable
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackText}>Go Back</Text>
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