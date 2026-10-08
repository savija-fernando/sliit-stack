import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ReservationDetailsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>

        <Text style={styles.pageTitle}>Reservation Details</Text>

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📘</Text>
            </View>

            <View style={styles.titleArea}>
              <Text style={styles.title}>Database Systems</Text>

              <Text style={styles.location}>
                Main Library · Floor 2
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <DetailRow
            label="Reservation ID"
            value="RES-1025"
          />

          <DetailRow
            label="Reservation Type"
            value="Book"
          />

          <DetailRow
            label="Reservation Date"
            value="05 Oct 2026"
          />

          <DetailRow
            label="Collection Deadline"
            value="06 Oct 2026 · 4:00 PM"
          />

          <DetailRow
            label="Location"
            value="Main Library · Floor 2"
          />

          <DetailRow
            label="Status"
            value="Active"
          />
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push('/reservations/modify-reservation')
          }
        >
          <Text style={styles.primaryButtonText}>
            Modify Reservation
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() =>
            router.push('/reservations/cancel-reservation')
          }
        >
          <Text style={styles.cancelButtonText}>
            Cancel Reservation
          </Text>
        </Pressable>
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

  statusText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
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