import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import NotificationCard from '../components/NotificationCard';
import QuickActionCard from '../components/QuickActionCard';
import ReservationCard from '../components/ReservationCard';
import SectionHeader from '../components/SectionHeader';
import { getDashboardData } from '../services/dashboardService';
import type { DashboardData } from '../types/dashboard';

export default function HomeScreen() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    getDashboardData()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((error) => console.error('Failed to load dashboard:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = () => {
    const trimmed = search.trim();
    Keyboard.dismiss();

    if (!trimmed) {
      router.navigate('/books');
      return;
    }

    router.push({
      pathname: '/books/results',
      params: { search: trimmed, genre: '' },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        rightAction="notifications"
        notificationCount={data?.unreadCount ?? 0}
        onNotificationsPress={() => router.navigate('/notifications')}
      />

      {loading || !data ? (
        <ActivityIndicator style={styles.loader} color="#2563EB" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <View>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.name}>Hi, {data.userName} 👋</Text>
          </View>

          {/* Search */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              placeholder="Search books, seats, rooms..."
              placeholderTextColor="#9CA3AF"
              returnKeyType="search"
              autoCorrect={false}
              style={styles.searchInput}
              accessibilityLabel="Search books, seats, rooms"
            />
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <QuickActionCard
              label="Reserve a book"
              icon={<Ionicons name="book" size={26} color="#2563EB" />}
              onPress={() => router.navigate('/books')}
            />
            <QuickActionCard
              label="Book a seat"
              icon={
                <MaterialCommunityIcons name="seat" size={28} color="#2563EB" />
              }
              onPress={() => router.navigate('/seats')}
            />
          </View>

          {/* Active reservations */}
          <View style={styles.section}>
            <SectionHeader
              title="Active reservations"
              onSeeAll={() => router.navigate('/reservations')}
            />

            <View style={styles.list}>
              {data.activeReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onPress={() => router.navigate('/reservations')}
                />
              ))}
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <SectionHeader
              title="Notifications"
              onSeeAll={() => router.navigate('/notifications')}
            />

            <View style={styles.list}>
              {data.notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  loader: {
    marginTop: 60,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  welcome: {
    fontSize: 13,
    color: '#6B7280',
  },

  name: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },

  searchBar: {
    height: 48,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#111827',
  },

  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },

  section: {
    marginTop: 28,
  },

  list: {
    gap: 12,
  },
});