import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notificationService';

import type { NotificationItem } from '../services/notificationService';

export default function NotificationsScreen() {
  const [filter, setFilter] =
    useState<'Unread' | 'All'>('Unread');

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getMyNotifications();

      setNotifications(result);
    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const visibleNotifications = useMemo(() => {
    if (filter === 'All') {
      return notifications;
    }

    return notifications.filter(
      (notification) => !notification.read
    );
  }, [filter, notifications]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);

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
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );
    }
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

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginTop: 40 }}
          />
        ) : (
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
                    {!item.read && (
                      <View style={styles.unreadDot} />
                    )}
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

                    <Text style={styles.time}>
                      {formatNotificationTime(item.createdAt)}
                    </Text>
                  </View>

                  <Text style={styles.arrow}>›</Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                  {filter === 'Unread'
                    ? "You're all caught up"
                    : 'No notifications'}
                </Text>

                <Text style={styles.emptyText}>
                  {filter === 'Unread'
                    ? 'You have no unread notifications.'
                    : 'You have no notifications yet.'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function formatNotificationTime(
  dateString: string
) {
  const date = new Date(dateString);

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
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