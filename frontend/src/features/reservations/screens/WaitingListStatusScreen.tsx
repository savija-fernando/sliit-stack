import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type WaitingStatus = 'Active' | 'Ready';

type WaitingItem = {
  id: string;
  title: string;
  position: number;
  estimatedWait: string;
  status: WaitingStatus;
};

const initialWaitingLists: WaitingItem[] = [
  {
    id: '1',
    title: 'Clean Code',
    position: 2,
    estimatedWait: '4 days',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Software Engineering',
    position: 4,
    estimatedWait: '7 days',
    status: 'Active',
  },
  {
    id: '3',
    title: 'Operating System Concepts',
    position: 1,
    estimatedWait: 'Available now',
    status: 'Ready',
  },
];

export default function WaitingListStatusScreen() {
  const [waitingLists, setWaitingLists] =
    useState(initialWaitingLists);

  const leaveWaitingList = (id: string) => {
    Alert.alert(
      'Leave Waiting List',
      'Are you sure you want to leave this waiting list?',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            setWaitingLists((current) =>
              current.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Waiting List Status</Text>

        <Text style={styles.subtitle}>
          Track your book waiting-list positions and estimated
          availability.
        </Text>

        <FlatList
          data={waitingLists}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.header}>
                <View style={styles.titleArea}>
                  <Text style={styles.bookTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.bookType}>
                    Book waiting list
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Ready'
                      ? styles.readyBadge
                      : styles.activeBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'Ready'
                        ? styles.readyText
                        : styles.activeText,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>
                    Your position
                  </Text>

                  <Text style={styles.position}>
                    #{item.position}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>
                    Estimated wait
                  </Text>

                  <Text style={styles.infoValue}>
                    {item.estimatedWait}
                  </Text>
                </View>
              </View>

              {item.status === 'Ready' && (
                <View style={styles.readyMessage}>
                  <Text style={styles.readyMessageText}>
                    This book is now available for reservation.
                  </Text>
                </View>
              )}

              <Pressable
                style={styles.leaveButton}
                onPress={() => leaveWaitingList(item.id)}
              >
                <Text style={styles.leaveText}>
                  Leave Waiting List
                </Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                No waiting lists
              </Text>

              <Text style={styles.emptyText}>
                You are not currently waiting for any books.
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

  backButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  title: {
    color: '#111827',
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 5,
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  titleArea: {
    flex: 1,
    marginRight: 10,
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  bookType: {
    fontSize: 13,
    color: '#6B7280',
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  activeBadge: {
    backgroundColor: '#EFF6FF',
  },

  readyBadge: {
    backgroundColor: '#DCFCE7',
  },

  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },

  activeText: {
    color: '#2563EB',
  },

  readyText: {
    color: '#166534',
  },

  infoBox: {
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 14,
  },

  infoColumn: {
    flex: 1,
    alignItems: 'center',
  },

  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },

  infoLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 5,
  },

  position: {
    color: '#2563EB',
    fontSize: 20,
    fontWeight: '700',
  },

  infoValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },

  readyMessage: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
  },

  readyMessageText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '600',
  },

  leaveButton: {
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  leaveText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 70,
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },

  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});