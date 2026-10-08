import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type NotificationItem = {
  id: string;
  message: string;
  time: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    message:
      'Your reservation for Database Systems has been confirmed.',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: '2',
    message:
      'Operating System Concepts is now available. You are first on the waiting list.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    message:
      'Reminder: collect your reserved book before 4:00 PM tomorrow.',
    time: '3 hours ago',
    read: false,
  },
  {
    id: '4',
    message:
      'Your Reading Room Seat A12 reservation is scheduled for 06 Oct 2026.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    message:
      'Your previous reservation has expired.',
    time: '02 Oct 2026',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [filter, setFilter] =
    useState<'Unread' | 'All'>('Unread');

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const visibleNotifications = useMemo(() => {
    if (filter === 'All') {
      return notifications;
    }

    return notifications.filter(
      (notification) => !notification.read
    );
  }, [filter, notifications]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButton}>‹ Back</Text>
          </Pressable>

          <Pressable onPress={markAllAsRead}>
            <Text style={styles.markAllText}>
              Mark all as read
            </Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Notifications</Text>

        <Text style={styles.subtitle}>
          Reservation reminders and important updates.
        </Text>

        <View style={styles.tabs}>
          {(['Unread', 'All'] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                filter === tab && styles.activeTab,
              ]}
              onPress={() => setFilter(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  filter === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={visibleNotifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.notificationCard,
                !item.read && styles.unreadCard,
              ]}
              onPress={() => markAsRead(item.id)}
            >
              <View style={styles.notificationRow}>
                <View style={styles.dotArea}>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>

                <View style={styles.messageArea}>
                  <Text
                    style={[
                      styles.message,
                      !item.read && styles.unreadMessage,
                    ]}
                  >
                    {item.message}
                  </Text>

                  <Text style={styles.time}>{item.time}</Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                You're all caught up
              </Text>

              <Text style={styles.emptyText}>
                You have no unread notifications.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  backButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },

  markAllText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },

  title: {
    fontSize: 25,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 12,
    marginBottom: 18,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#2563EB',
  },

  tabText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  list: {
    paddingBottom: 30,
  },

  notificationCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  unreadCard: {
    backgroundColor: '#F8FAFF',
    borderColor: '#DBEAFE',
  },

  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dotArea: {
    width: 18,
    alignItems: 'flex-start',
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },

  messageArea: {
    flex: 1,
  },

  message: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },

  unreadMessage: {
    color: '#111827',
    fontWeight: '600',
  },

  time: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  arrow: {
    fontSize: 22,
    color: '#9CA3AF',
    marginLeft: 8,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 70,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },

  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});