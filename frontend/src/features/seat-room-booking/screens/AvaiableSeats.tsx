import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '@/components/AppHeader';

const COLUMNS = 7;
const ROWS = 8;

// Sample data. Replace with real availability from your database later.
const BOOKED_SEATS = new Set([6, 14, 18, 20, 34, 43, 48, 50]);

const seatLabel = (seat: number) =>
  `${String.fromCharCode(65 + Math.floor(seat / COLUMNS))}${(seat % COLUMNS) + 1}`;

export default function AvailableSeats() {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSeat = (seat: number) => {
    if (BOOKED_SEATS.has(seat)) return;
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const hasSelection = selected.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Title */}
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text style={styles.title}>Select your seat</Text>
        </View>

        {/* Info chips */}
        <View style={styles.infoRow}>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="map-marker-outline" size={15} color="#475569" />
            <Text style={styles.chipText}>Library 2nd floor</Text>
          </View>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="clock-outline" size={15} color="#475569" />
            <Text style={styles.chipText}>8.30am – 5.30pm</Text>
          </View>
        </View>

        {/* Seat map */}
        <View style={styles.seatMap}>
          {Array.from({ length: ROWS }, (_, row) => (
            <View key={row} style={styles.seatRow}>
              {Array.from({ length: COLUMNS }, (_, col) => {
                const seat = row * COLUMNS + col;
                const isBooked = BOOKED_SEATS.has(seat);
                const isSelected = selected.includes(seat);

                return (
                  <Pressable
                    key={seat}
                    onPress={() => toggleSeat(seat)}
                    disabled={isBooked}
                    accessibilityRole="button"
                    accessibilityLabel={`Seat ${seatLabel(seat)}, ${
                      isBooked ? 'booked' : isSelected ? 'selected' : 'available'
                    }`}
                    accessibilityState={{ selected: isSelected, disabled: isBooked }}
                    style={({ pressed }) => [
                      styles.seat,
                      isBooked && styles.booked,
                      isSelected && styles.selected,
                      pressed && !isBooked && styles.pressed,
                    ]}
                  >
                    {isSelected && (
                      <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <LegendItem color="#4ADE80" label="Available" />
          <LegendItem color="#F87171" label="Booked" />
          <LegendItem color="#2563EB" label="Selected" />
        </View>

        {/* Selected seats */}
        {hasSelection && (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              Selected:{' '}
              <Text style={styles.summarySeats}>
                {[...selected].sort((a, b) => a - b).map(seatLabel).join(', ')}
              </Text>
            </Text>
            <Pressable
              onPress={() => setSelected([])}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear selected seats"
            >
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          </View>
        )}

        {/* Continue */}
        <Pressable
          disabled={!hasSelection}
          onPress={() =>
            router.push({
              pathname: '/booking-confirmation',
              params: { seats: selected.join(',') },
            })
          }
          style={({ pressed }) => [
            styles.button,
            !hasSelection && styles.buttonDisabled,
            pressed && hasSelection && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {hasSelection ? `Continue (${selected.length})` : 'Continue'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 32 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },

  infoRow: { flexDirection: 'row', gap: 10, marginTop: 14, marginBottom: 22 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  chipText: { fontSize: 12, color: '#475569' },

  seatMap: {
    padding: 16,
    gap: 10,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  seatRow: { flexDirection: 'row', justifyContent: 'space-between' },
  seat: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ADE80',
  },
  booked: { backgroundColor: '#F87171', opacity: 0.55 },
  selected: { backgroundColor: '#2563EB' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.94 }] },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginVertical: 22,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 4 },
  legendText: { fontSize: 12, color: '#475569' },

  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
  },
  summaryText: { fontSize: 14, color: '#1E3A8A' },
  summarySeats: { fontWeight: '700' },
  clear: { fontSize: 13, fontWeight: '600', color: '#2563EB' },

  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#2563EB',
  },
  buttonDisabled: { backgroundColor: '#CBD5E1' },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
