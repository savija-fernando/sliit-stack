import { StyleSheet, Text, View } from 'react-native';

import type { BookStatus } from '../types/book';

export const statusColors: Record<BookStatus, string> = {
  Available: '#16A34A',
  Issued: '#D97706',
  Reserved: '#2563EB',
  Unavailable: '#DC2626',
};

type StatusBadgeProps = {
  status: BookStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: statusColors[status] }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 76,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});