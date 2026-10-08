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

export default function ModifyReservationScreen() {
  const [date, setDate] = useState('06 Oct 2026');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  const handleUpdate = () => {
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Modify Reservation</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.bookTitle}>
            Database Systems
          </Text>

          <Text style={styles.bookMeta}>
            Main Library · Book Reservation
          </Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Reservation Date</Text>

          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Select reservation date"
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Reservation Time</Text>

          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            placeholder="Select reservation time"
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>
            Notes{' '}
            <Text style={styles.optional}>(Optional)</Text>
          </Text>

          <TextInput
            style={[styles.input, styles.notes]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add a note..."
            multiline
            textAlignVertical="top"
          />
        </View>

        <Pressable
          style={styles.updateButton}
          onPress={handleUpdate}
        >
          <Text style={styles.updateText}>
            Update Reservation
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

  optional: {
    color: '#9CA3AF',
    fontWeight: '400',
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

  notes: {
    minHeight: 105,
  },

  updateButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 12,
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