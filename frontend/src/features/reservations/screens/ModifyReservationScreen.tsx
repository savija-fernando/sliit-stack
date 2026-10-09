import React, { useCallback, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [reservation, setReservation] =
    useState<Reservation | null>(null);


const [date, setDate] = useState('');
const [time, setTime] = useState('');
const [endTime, setEndTime] = useState('');
const [activeTimePicker, setActiveTimePicker] =
  useState<'start' | 'end' | null>(null);

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

      
if (data.reservationType === 'BOOK') {
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
  setEndTime(data.endTime?.slice(0, 5) ?? '');
} else {
  const dateValue = data.bookingDate;

  if (dateValue) {
    const [year, month, day] = dateValue.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    setDate(`${day} ${monthNames[Number(month) - 1]} ${year}`);
  } else {
    setDate('');
  }

  setTime(data.startTime?.slice(0, 5) ?? '');
}

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
  if (!reservation) return;

  try {
    setSaving(true);

    const parts = date.trim().split(' ');

    if (parts.length !== 3) {
      throw new Error(
        'Please enter the date in this format: 17 Oct 2026'
      );
    }

    const day = Number(parts[0]);
    const monthName =
      parts[1].charAt(0).toUpperCase() +
      parts[1].slice(1, 3).toLowerCase();
    const year = Number(parts[2]);

    const months: Record<string, string> = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };

    const month = months[monthName];

    if (
      !Number.isInteger(day) ||
      day < 1 ||
      day > 31 ||
      !Number.isInteger(year) ||
      !month
    ) {
      throw new Error('Invalid date. Use the format: 17 Oct 2026');
    }

    const bookingDate =
      `${year}-${month}-${String(day).padStart(2, '0')}`;

    // Validate that the date is a real calendar date.
    const checkDate = new Date(`${bookingDate}T12:00:00`);

    if (
      checkDate.getFullYear() !== year ||
      checkDate.getMonth() !== Number(month) - 1 ||
      checkDate.getDate() !== day
    ) {
      throw new Error('Please enter a valid calendar date.');
    }

    if (reservation.reservationType === 'BOOK') {
      const currentDate = new Date(reservation.reservedAt);
      currentDate.setFullYear(year, Number(month) - 1, day);

      await updateReservation(reservation.id, {
        reservedAt: currentDate.toISOString(),
      });
    } else {
      const timeMatch = time.trim().match(/^(\d{1,2}):(\d{2})$/);

      if (
        !timeMatch ||
        Number(timeMatch[1]) > 23 ||
        Number(timeMatch[2]) > 59
      ) {
        throw new Error('Enter the start time in 24-hour format, e.g. 14:00.');
      }

      const startTime =
        `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}:00`;

      
const endMatch = endTime.trim().match(/^(\d{1,2}):(\d{2})$/);

if (
  !endMatch ||
  Number(endMatch[1]) > 23 ||
  Number(endMatch[2]) > 59
) {
  throw new Error('Please select a valid end time.');
}

const formattedEndTime =
  `${endMatch[1].padStart(2, '0')}:${endMatch[2]}:00`;

if (formattedEndTime <= startTime) {
  throw new Error('End time must be later than start time.');
}

await updateReservation(reservation.id, {
  bookingDate,
  startTime,
  endTime: formattedEndTime,
});

    }

    Alert.alert(
      'Reservation Updated',
      'Your reservation has been updated successfully.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  } catch (error) {
    console.error('Failed to update reservation:', error);

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
    {reservation.reservationType === 'BOOK'
      ? reservation.book?.title ?? 'Book Reservation'
      : reservation.reservationType === 'SEAT'
        ? reservation.seat?.name ?? 'Seat Reservation'
        : reservation.room?.name ?? 'Study Room Reservation'}
  </Text>

  <Text style={styles.bookMeta}>
    {reservation.reservationType === 'BOOK'
      ? reservation.book?.location ?? 'Main Library'
      : reservation.reservationType === 'SEAT'
        ? 'Library Seating Area'
        : reservation.room?.location ?? 'Study Room'}
    {' · '}
    {reservation.reservationType === 'BOOK'
      ? 'Book Reservation'
      : reservation.reservationType === 'SEAT'
        ? 'Seat Reservation'
        : 'Room Reservation'}
  </Text>
</View>


        
<View style={styles.group}>
  <Text style={styles.label}>
    Reservation Date
  </Text>

  <Pressable
    style={styles.input}
    onPress={() => setShowDatePicker(true)}
  >
    <Text style={{ color: date ? '#111827' : '#9CA3AF', fontSize: 15 }}>
      {date || 'Select reservation date'}
    </Text>
  </Pressable>

  {showDatePicker && (
    <DateTimePicker
      value={
        date
          ? (() => {
              const [day, monthName, year] = date.split(' ');
              const months: Record<string, number> = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3,
                May: 4, Jun: 5, Jul: 6, Aug: 7,
                Sep: 8, Oct: 9, Nov: 10, Dec: 11,
              };
              return new Date(
                Number(year),
                months[monthName] ?? 0,
                Number(day),
                12
              );
            })()
          : new Date()
      }
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        setShowDatePicker(false);

        if (event.type === 'set' && selectedDate) {
          setDate(
            `${String(selectedDate.getDate()).padStart(2, '0')} ${
              selectedDate.toLocaleDateString('en-GB', {
                month: 'short',
              })
            } ${selectedDate.getFullYear()}`
          );
        }
      }}
    />
  )}
</View>


        
{reservation.reservationType !== 'BOOK' && (
  <>
    <View style={styles.group}>
      <Text style={styles.label}>Start Time</Text>

      <Pressable
        style={styles.input}
        onPress={() => setActiveTimePicker('start')}
      >
        <Text style={{ color: time ? '#111827' : '#9CA3AF', fontSize: 15 }}>
          {time || 'Select start time'}
        </Text>
      </Pressable>

      {activeTimePicker === 'start' && (
        <DateTimePicker
          value={(() => {
            const [hours, minutes] = (time || '08:00').split(':');
            const value = new Date();
            value.setHours(Number(hours), Number(minutes), 0, 0);
            return value;
          })()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setActiveTimePicker(null);

            if (event.type === 'set' && selectedTime) {
              setTime(
                `${String(selectedTime.getHours()).padStart(2, '0')}:${String(selectedTime.getMinutes()).padStart(2, '0')}`
              );
            }
          }}
        />
      )}
    </View>

    <View style={styles.group}>
      <Text style={styles.label}>End Time</Text>

      <Pressable
        style={styles.input}
        onPress={() => setActiveTimePicker('end')}
      >
        <Text style={{ color: endTime ? '#111827' : '#9CA3AF', fontSize: 15 }}>
          {endTime || 'Select end time'}
        </Text>
      </Pressable>

      {activeTimePicker === 'end' && (
        <DateTimePicker
          value={(() => {
            const [hours, minutes] = (endTime || '10:00').split(':');
            const value = new Date();
            value.setHours(Number(hours), Number(minutes), 0, 0);
            return value;
          })()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setActiveTimePicker(null);

            if (event.type === 'set' && selectedTime) {
              setEndTime(
                `${String(selectedTime.getHours()).padStart(2, '0')}:${String(selectedTime.getMinutes()).padStart(2, '0')}`
              );
            }
          }}
        />
      )}
    </View>
  </>
)}


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