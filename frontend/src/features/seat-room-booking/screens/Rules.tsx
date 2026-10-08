import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppHeader from '@/components/AppHeader';
import { createStudyRoomBooking } from '../services/studyRoomPickerService';
import { createSeatBookings } from '../services/seatBookingService';

type Rule = {
  id: string;
  title: string;
  detail: string;
};

const RULES: Rule[] = [

  {
    id: 'Campus ID',
    title: 'I accept responsibility for my booking.',
    detail:
      'I understand that I should handover the students campus Id for counter and get those IDs when leaving the library. I understand that I am responsible for the space during my reservation and must follow all rules.',
  },
  {
    id: 'booking',
    title: 'I understand the booking conditions.',
    detail:
      'I confirm that my booking is subject to the library policies and the selected time slot.',
  },
  {
    id: 'arrival',
    title: 'I will arrive on time.',
    detail:
      'Late arrivals may result in automatic cancellation of the reserved seat or room.',
  },
  {
    id: 'respect',
    title: 'I agree to keep the space clean and respectful.',
    detail:
      'I will maintain a quiet, safe environment and avoid disturbing other users.Any food or drink consumption is subject to library rules and regulations.',
  },
  {
    id: 'responsibility',
    title: 'I accept responsibility for my booking.',
    detail:
      'I understand that I am responsible for the space during my reservation and must follow all rules.',
  },

];

export default function RulesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type?: string;
    roomId?: string;
    roomName?: string;
    roomLocation?: string;
    date?: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
    seats?: string;
    seatIds?: string;
  }>();
  const [accepted, setAccepted] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(RULES.map((rule) => [rule.id, false])),
  );
  const [submitting, setSubmitting] = useState(false);

  const allAccepted = useMemo(
    () => Object.values(accepted).every(Boolean),
    [accepted],
  );

  const toggleRule = (id: string) => {
    setAccepted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContinue = async () => {
    if (submitting) return;
    if (!allAccepted) {
      Alert.alert(
        'Please review the rules',
        'You must tick all the rules before continuing.',
      );
      return;
    }

    setSubmitting(true);
    try {
      if (params.type === 'seat') {
        const date = params.date;
        const startTime = params.startTime;
        const endTime = params.endTime;
        const seatIds = (params.seatIds ?? '')
          .split(',')
          .map((seatId) => seatId.trim())
          .filter(Boolean);

        if (!date || !startTime || !endTime || seatIds.length === 0) {
          Alert.alert(
            'Booking details missing',
            'Please select a date, time, and seat again.',
          );
          return;
        }

        await createSeatBookings({ seatIds, date, startTime, endTime });
        router.push({
          pathname: '/booking-confirmation' as any,
          params: {
            type: 'seat',
            date,
            time: params.time ?? '',
            duration: params.duration ?? '',
            seats: params.seats ?? '',
          },
        });
        return;
      }

      const roomId = params.roomId;
      const date = params.date;
      const startTime = params.startTime;
      const endTime = params.endTime;

      if (!roomId || !date || !startTime || !endTime) {
        Alert.alert(
          'Booking details missing',
          'Please select a room and time again.',
        );
        return;
      }

      await createStudyRoomBooking(roomId, date, `${startTime}:00`, `${endTime}:00`);

      router.push({
        pathname: '/booking-confirmation' as any,
        params: {
          type: 'room',
          roomId: roomId,
          roomName: params.roomName ?? '',
          date: date,
          time: params.time ?? '',
          startTime: startTime,
          endTime: endTime,
          duration: params.duration ?? '',
          seats: params.seats ?? '',
        },
      });
    } catch (err: unknown) {
      Alert.alert(
        'Booking failed',
        err instanceof Error
          ? err.message
          : 'Could not create your study room booking.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text style={styles.title}>Booking rules</Text>
        </View>

        <View style={styles.noticeBox}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={22}
            color="#2563EB"
          />
          <Text style={styles.noticeText}>
            Please read and tick each rule before continuing your reservation.
          </Text>
        </View>

        <View style={styles.ruleList}>
          {RULES.map((rule) => {
            const isChecked = !!accepted[rule.id];

            return (
              <Pressable
                key={rule.id}
                onPress={() => toggleRule(rule.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked }}
                style={({ pressed }) => [
                  styles.ruleCard,
                  pressed && styles.ruleCardPressed,
                  isChecked && styles.ruleCardSelected,
                ]}
              >
                <View style={styles.ruleLeft}>
                  <View
                    style={[
                      styles.checkbox,
                      isChecked && styles.checkboxChecked,
                    ]}
                  >
                    {isChecked && (
                      <MaterialCommunityIcons
                        name="check"
                        size={16}
                        color="#FFFFFF"
                      />
                    )}
                  </View>

                  <View style={styles.ruleTextWrap}>
                    <Text style={styles.ruleTitle}>{rule.title}</Text>
                    <Text style={styles.ruleDetail}>{rule.detail}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          disabled={!allAccepted || submitting}
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            !allAccepted && styles.continueButtonDisabled,
            submitting && styles.continueButtonDisabled,
            pressed && allAccepted && styles.continueButtonPressed,
          ]}
        >
          <Text style={styles.continueText}>Continue</Text>
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
    padding: 20,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  ruleList: {
    gap: 12,
  },
  ruleCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#F9FAFB',
  },
  ruleCardPressed: {
    opacity: 0.9,
  },
  ruleCardSelected: {
    borderColor: '#93C5FD',
    backgroundColor: '#F0F9FF',
  },
  ruleLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  ruleTextWrap: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ruleDetail: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },
  continueButton: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  continueButtonPressed: {
    opacity: 0.9,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
