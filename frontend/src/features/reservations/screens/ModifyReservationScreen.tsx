import React, { useCallback, useState } from 'react';
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
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import {
  getReservationById,
  updateReservation,
  Reservation,
} from '../services/reservationService';

export default function ModifyReservationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadReservation = async () => {
    try {
      setLoading(true);

      if (!id) {
        throw new Error('Reservation ID is missing.');
      }

      const data = await getReservationById(id);

      if (!data) {
        throw new Error('Reservation not found.');
      }

      setReservation(data);

      const reservationDate = new Date(data.reservedAt);

      setDate(
        reservationDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );

      setTime(
        reservationDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
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

const handleUpdate = async () => {
  if (!reservation) {
    return;
  }

  try {
    setSaving(true);

    const currentDate = new Date(reservation.reservedAt);

    const parts = date.trim().split(' ');

    if (parts.length !== 3) {
      throw new Error(
        'Please enter the date in this format: 06 Oct 2026'
      );
    }

    const day = Number(parts[0]);
    const monthName = parts[1];
    const year = Number(parts[2]);

    const months: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const month = months[monthName];

    if (
      Number.isNaN(day) ||
      Number.isNaN(year) ||
      month === undefined
    ) {
      throw new Error(
        'Invalid date. Please use: 06 Oct 2026'
      );
    }

    const updatedDate = new Date(currentDate);

    updatedDate.setFullYear(year);
    updatedDate.setMonth(month);
    updatedDate.setDate(day);

    await updateReservation(reservation.id, {
      reservedAt: updatedDate.toISOString(),
    });

    Alert.alert(
      'Reservation Updated',
      'Your reservation has been updated successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  } catch (error) {
    console.error(
      'Failed to update reservation:',
      error
    );

    Alert.alert(
      'Update Failed',
      error instanceof Error
        ? error.message
        : 'Failed to update reservation.'
    );
  } finally {
    setSaving(false);
  }
};

  if (loading) {
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

  if (!reservation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Reservation not found
          </Text>

          <Pressable
            style={styles.updateButton}
            onPress={() => router.back()}
          >
            <Text style={styles.updateText}>
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>
          Modify Reservation
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.bookTitle}>
            {reservation.book?.title ??
              'Book Reservation'}
          </Text>

          <Text style={styles.bookMeta}>
            {reservation.book?.location ??
              'Main Library'}{' '}
            · Book Reservation
          </Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>
            Reservation Date
          </Text>

          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Select reservation date"
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>
            Reservation Time
          </Text>

          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            placeholder="Select reservation time"
          />
        </View>

        <Pressable
          style={[
            styles.updateButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.updateText}>
              Update Reservation
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.goBackButton}
          onPress={() => router.back()}
          disabled={saving}
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
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },

  backButton: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 12,
  },

  title: {
    fontSize: 25,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 20,
  },

  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  bookMeta: {
    fontSize: 13,
    color: '#6B7280',
  },

  group: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111827',
  },

  updateButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 12,
  },

  disabledButton: {
    opacity: 0.6,
  },

  updateText: {
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