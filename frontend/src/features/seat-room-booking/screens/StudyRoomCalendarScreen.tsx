import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';

import AppHeader from '@/components/AppHeader';
import {
  ALL_TIME_SLOTS,
  getAvailableSlotsForRoom,
} from '../services/studyRoomPickerService';

/* ─── Helpers ─────────────────────────────────────────────── */

function getDateString(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function getTodayString() {
  return getDateString(new Date());
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/* ─── Component ───────────────────────────────────────────── */

type SlotState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; slots: typeof ALL_TIME_SLOTS }
  | { status: 'error'; message: string };

export default function StudyRoomCalendarScreen() {
  const router = useRouter();
  const { roomId, roomName, roomLocation } = useLocalSearchParams<{
    roomId?: string;
    roomName?: string;
    roomLocation?: string;
  }>();

  const today = getTodayString();

  /* ── selected date ── */
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /* ── available slots state ── */
  const [slotState, setSlotState] = useState<SlotState>({ status: 'idle' });

  /* ── selected time slot ── */
  const [selectedSlot, setSelectedSlot] = useState<
    (typeof ALL_TIME_SLOTS)[number] | null
  >(null);

  /* ── slot panel animation ── */
  const panelY = useRef(new Animated.Value(20)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;

  /* ── fetch slots when date changes ── */
  useEffect(() => {
    if (!selectedDate || !roomId) return;

    setSelectedSlot(null);
    setSlotState({ status: 'loading' });

    // animate panel out, then back in
    Animated.timing(panelOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    let cancelled = false;

    getAvailableSlotsForRoom(roomId, selectedDate)
      .then((slots) => {
        if (cancelled) return;
        setSlotState({ status: 'loaded', slots });

        Animated.parallel([
          Animated.timing(panelOpacity, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.spring(panelY, {
            toValue: 0,
            friction: 7,
            tension: 60,
            useNativeDriver: true,
          }),
        ]).start();
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setSlotState({
          status: 'error',
          message:
            err instanceof Error
              ? err.message
              : 'Could not load available slots.',
        });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, roomId]);

  /* ── calendar marked dates ── */
  const markedDates: Record<
    string,
    {
      disabled?: boolean;
      disableTouchEvent?: boolean;
      marked?: boolean;
      selected?: boolean;
      selectedColor?: string;
      selectedTextColor?: string;
      dotColor?: string;
    }
  > = {};

  // disable today (must book at least 1 day ahead)
  markedDates[today] = { disabled: true, disableTouchEvent: true };

  // highlight the selected date
  if (selectedDate) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: '#7C3AED',
      selectedTextColor: '#FFFFFF',
    };
  }

  /* ── handlers ── */
  const handleDateSelect = (day: DateData) => {
    // Prevent selecting past dates or today
    if (day.dateString <= today) {
      Alert.alert('Date unavailable', 'Please select a future date.');
      return;
    }
    setSelectedDate(day.dateString);
  };

  const handleContinue = () => {
    if (!selectedDate) {
      Alert.alert('Select a date', 'Please select a date from the calendar.');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Select a time slot', 'Please choose an available time slot.');
      return;
    }
    if (!roomId) {
      Alert.alert('Room unavailable', 'Please select a room before continuing.');
      return;
    }

    router.push({
      pathname: '/rules',
      params: {
        roomId,
        roomName: roomName ?? '',
        roomLocation: roomLocation ?? '',
        date: selectedDate,
        time: selectedSlot.label,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      },
    });
  };

  /* ── render ── */
  const availableSlots =
    slotState.status === 'loaded' ? slotState.slots : [];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#1F2937"
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Select Date & Time</Text>
            <Text style={styles.subtitle}>
              Pick a date to see what's available.
            </Text>
          </View>
        </View>

        {/* ── Room info banner ── */}
        {roomName && (
          <View style={styles.roomBanner}>
            <View style={styles.roomBannerIcon}>
              <MaterialCommunityIcons
                name="door-open"
                size={20}
                color="#7C3AED"
              />
            </View>
            <View style={styles.roomBannerText}>
              <Text style={styles.roomBannerLabel}>BOOKING FOR</Text>
              <Text style={styles.roomBannerName}>{roomName}</Text>
              {roomLocation && (
                <Text style={styles.roomBannerLocation}>{roomLocation}</Text>
              )}
            </View>
          </View>
        )}

        {/* ── Calendar ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a date</Text>
          <Text style={styles.sectionSubtitle}>
            Tap a date to load available time slots.
          </Text>

          <View style={styles.calendarCard}>
            <Calendar
              minDate={today}
              current={selectedDate ?? today}
              onDayPress={handleDateSelect}
              markedDates={markedDates}
              enableSwipeMonths
              firstDay={1}
              theme={{
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#64748B',
                selectedDayBackgroundColor: '#7C3AED',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#7C3AED',
                dayTextColor: '#0F172A',
                textDisabledColor: '#CBD5E1',
                monthTextColor: '#0F172A',
                arrowColor: '#7C3AED',
                textDayFontWeight: '600',
                textMonthFontWeight: '800',
                textDayHeaderFontWeight: '700',
                textDayFontSize: 14,
                textMonthFontSize: 17,
                textDayHeaderFontSize: 11,
              }}
            />
          </View>
        </View>

        {/* ── Selected date box ── */}
        {selectedDate && (
          <View style={styles.selectedDateBox}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={22}
              color="#7C3AED"
            />
            <View>
              <Text style={styles.selectedDateLabel}>SELECTED DATE</Text>
              <Text style={styles.selectedDateValue}>
                {formatDate(selectedDate)}
              </Text>
            </View>
          </View>
        )}

        {/* ── Time slots panel ── */}
        {selectedDate && (
          <Animated.View
            style={[
              styles.slotsPanel,
              { opacity: panelOpacity, transform: [{ translateY: panelY }] },
            ]}
          >
            <Text style={styles.sectionTitle}>Available time slots</Text>
            <Text style={styles.sectionSubtitle}>
              Green slots are free; grey ones are already booked.
            </Text>

            {/* Loading */}
            {slotState.status === 'loading' && (
              <View style={styles.slotsLoading}>
                <ActivityIndicator color="#7C3AED" />
                <Text style={styles.slotsLoadingText}>
                  Checking availability…
                </Text>
              </View>
            )}

            {/* Error */}
            {slotState.status === 'error' && (
              <View style={styles.slotsError}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={18}
                  color="#B91C1C"
                />
                <Text style={styles.slotsErrorText}>{slotState.message}</Text>
              </View>
            )}

            {/* Slots grid */}
            {slotState.status === 'loaded' && (
              <View style={styles.slotsGrid}>
                {ALL_TIME_SLOTS.map((slot) => {
                  const isAvailable = availableSlots.some(
                    (s) => s.label === slot.label,
                  );
                  const isSelected = selectedSlot?.label === slot.label;

                  return (
                    <SlotButton
                      key={slot.label}
                      slot={slot}
                      available={isAvailable}
                      selected={isSelected}
                      onPress={() => {
                        if (!isAvailable) {
                          Alert.alert(
                            'Slot unavailable',
                            'This time slot is already booked. Please choose another.',
                          );
                          return;
                        }
                        setSelectedSlot(isSelected ? null : slot);
                      }}
                    />
                  );
                })}
              </View>
            )}

            {/* No slots available message */}
            {slotState.status === 'loaded' && availableSlots.length === 0 && (
              <View style={styles.noSlots}>
                <MaterialCommunityIcons
                  name="calendar-remove-outline"
                  size={22}
                  color="#94A3B8"
                />
                <Text style={styles.noSlotsText}>
                  All slots are booked for this date. Try another day.
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* ── Continue ── */}
        <Pressable
          onPress={handleContinue}
          disabled={!selectedDate || !selectedSlot}
          style={({ pressed }) => [
            styles.continueButton,
            (!selectedDate || !selectedSlot) && styles.continueButtonDisabled,
            pressed && selectedDate && selectedSlot && styles.continueButtonPressed,
          ]}
        >
          <Text style={styles.continueText}>Continue</Text>
          <MaterialCommunityIcons name="arrow-right" size={21} color="#FFFFFF" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Slot button ─────────────────────────────────────────── */

type SlotButtonProps = {
  slot: (typeof ALL_TIME_SLOTS)[number];
  available: boolean;
  selected: boolean;
  onPress: () => void;
};

function SlotButton({ slot, available, selected, onPress }: SlotButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.slotButton,
        !available && styles.slotButtonBooked,
        selected && styles.slotButtonSelected,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${slot.label} – ${available ? 'available' : 'booked'}`}
      accessibilityState={{ selected, disabled: !available }}
    >
      <MaterialCommunityIcons
        name={
          !available
            ? 'close-circle-outline'
            : selected
            ? 'check-circle'
            : 'clock-outline'
        }
        size={17}
        color={
          !available ? '#94A3B8' : selected ? '#7C3AED' : '#64748B'
        }
      />
      <Text
        style={[
          styles.slotText,
          !available && styles.slotTextBooked,
          selected && styles.slotTextSelected,
        ]}
      >
        {slot.label}
      </Text>
      {!available && (
        <Text style={styles.slotBookedTag}>Booked</Text>
      )}
    </Pressable>
  );
}

/* ─── Styles ──────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 18,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 4,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: { flex: 1 },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 5,
    lineHeight: 20,
  },

  /* Room banner */
  roomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },

  roomBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  roomBannerText: { flex: 1 },

  roomBannerLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8B5CF6',
    marginBottom: 2,
  },

  roomBannerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E0E4B',
  },

  roomBannerLocation: {
    fontSize: 11,
    color: '#7C3AED',
    marginTop: 2,
  },

  /* Sections */
  section: { gap: 4 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 10,
  },

  /* Calendar */
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },

  /* Selected date box */
  selectedDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },

  selectedDateLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#8B5CF6',
  },

  selectedDateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E0E4B',
    marginTop: 2,
  },

  /* Slots panel */
  slotsPanel: { gap: 4 },

  slotsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  slotsLoadingText: {
    color: '#64748B',
    fontSize: 13,
  },

  slotsError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  slotsErrorText: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 12,
    lineHeight: 18,
  },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  noSlots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  noSlotsText: {
    flex: 1,
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
  },

  /* Slot button */
  slotButton: {
    width: '47%',
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    borderRadius: 13,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },

  slotButtonBooked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },

  slotButtonSelected: {
    backgroundColor: '#F5F3FF',
    borderColor: '#7C3AED',
    borderWidth: 1.8,
  },

  slotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    flexShrink: 1,
    textAlign: 'center',
  },

  slotTextBooked: {
    color: '#94A3B8',
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },

  slotTextSelected: {
    color: '#7C3AED',
    fontWeight: '800',
  },

  slotBookedTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Continue */
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    marginTop: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },

  continueButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },

  continueButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
