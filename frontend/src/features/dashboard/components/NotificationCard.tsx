import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { AppNotification } from '../types/dashboard';

type NotificationCardProps = {
  notification: AppNotification;
};

export default function NotificationCard({
  notification,
}: NotificationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="notifications-outline" size={20} color="#2563EB" />
      </View>

      <View style={styles.info}>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{notification.time}</Text>
      </View>

      {notification.unread && <View style={styles.unreadDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
    gap: 3,
  },

  message: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  time: {
    fontSize: 12,
    color: '#6B7280',
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
});