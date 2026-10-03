import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ActiveReservation } from '../types/dashboard';

type ReservationCardProps = {
  reservation: ActiveReservation;
  onPress?: () => void;
};

export default function ReservationCard({
  reservation,
  onPress,
}: ReservationCardProps) {
  const { type, title, subtitle, urgent } = reservation;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconBox}>
        {type === 'book' ? (
          <Ionicons name="book" size={26} color="#080B13" />
        ) : (
          <MaterialCommunityIcons name="seat" size={28} color="#080B13" />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.subtitleRow}>
          {urgent && <Ionicons name="time-outline" size={14} color="#DC2626" />}
          <Text
            style={[styles.subtitle, urgent && styles.subtitleUrgent]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  cardPressed: {
    backgroundColor: '#E2E8F0',
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  subtitle: {
    fontSize: 13,
    color: '#4B5563',
    flexShrink: 1,
  },

  subtitleUrgent: {
    color: '#DC2626',
    fontWeight: '500',
  },
});