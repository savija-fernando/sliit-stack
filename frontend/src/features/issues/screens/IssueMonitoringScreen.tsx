import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useFocusEffect,
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import {
  getIssues,
} from '@/features/issues/services/issueStore';

import type {
  IssueRecord,
  IssueStatus,
} from '@/features/issues/types/issue';

type FilterStatus =
  | 'open'
  | 'in-progress'
  | 'resolved';

export default function IssueMonitoringScreen() {
  const router = useRouter();

  const [
    issues,
    setIssues,
  ] = useState<IssueRecord[]>(
    () => getIssues(),
  );

  const [
    activeStatus,
    setActiveStatus,
  ] = useState<FilterStatus>('open');

  const [
    searchText,
    setSearchText,
  ] = useState('');

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  useFocusEffect(
    useCallback(() => {
      setIssues(getIssues());
    }, []),
  );

  const handleSearch = () => {
    setSearchQuery(
      searchText.trim(),
    );

    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchText('');
    setSearchQuery('');

    Keyboard.dismiss();
  };

  const filteredIssues =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      return issues.filter(
        (issue) => {
          const matchesStatus =
            issue.status ===
            activeStatus;

          const matchesSearch =
            normalizedSearch === '' ||
            issue.id
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            issue.title
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            issue.studentId
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            issue.studentName
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            issue.category
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          return (
            matchesStatus &&
            matchesSearch
          );
        },
      );
    }, [
      issues,
      activeStatus,
      searchQuery,
    ]);

  const openCount =
    issues.filter(
      (issue) =>
        issue.status === 'open',
    ).length;

  const inProgressCount =
    issues.filter(
      (issue) =>
        issue.status ===
        'in-progress',
    ).length;

  const resolvedCount =
    issues.filter(
      (issue) =>
        issue.status === 'resolved',
    ).length;

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <AppHeader
          rightAction="profile"
          sideMenu="staff"
        />

        {/* Title */}
        <View style={styles.titleRow}>
          <Pressable
            onPress={() =>
              router.replace(
                '/staff-dashboard' as Href,
              )
            }
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back to staff dashboard"
          >
            <Ionicons
              name="arrow-back-circle"
              size={30}
              color="#111111"
            />
          </Pressable>

          <View>
            <Text style={styles.title}>
              Issue Monitoring
            </Text>

            <Text style={styles.subtitle}>
              Review and manage reported
              student issues
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <SummaryCard
            value={openCount}
            label="Open"
            backgroundColor="#FEF2F2"
            valueColor="#DC2626"
          />

          <SummaryCard
            value={inProgressCount}
            label="In Progress"
            backgroundColor="#FFF7ED"
            valueColor="#EA580C"
          />

          <SummaryCard
            value={resolvedCount}
            label="Resolved"
            backgroundColor="#ECFDF5"
            valueColor="#059669"
          />
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <TextInput
              value={searchText}
              onChangeText={
                setSearchText
              }
              onSubmitEditing={
                handleSearch
              }
              placeholder="Search issues"
              placeholderTextColor="#8A8A8A"
              returnKeyType="search"
              autoCorrect={false}
              style={[
                styles.searchInput,

                Platform.OS ===
                  'web' &&
                  ({
                    outlineStyle:
                      'none',
                    outlineWidth: 0,
                  } as any),
              ]}
            />

            {(searchText !== '' ||
              searchQuery !== '') && (
              <Pressable
                onPress={
                  handleClearSearch
                }
                style={
                  styles.clearButton
                }
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#777777"
                />
              </Pressable>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.searchButton,

              pressed &&
                styles.searchButtonPressed,
            ]}
            onPress={handleSearch}
            accessibilityRole="button"
            accessibilityLabel="Search issues"
          >
            <Ionicons
              name="search"
              size={21}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Status filters */}
        <View style={styles.tabsContainer}>
          <StatusTab
            label="Open"
            status="open"
            activeStatus={activeStatus}
            onPress={setActiveStatus}
          />

          <StatusTab
            label="In Progress"
            status="in-progress"
            activeStatus={activeStatus}
            onPress={setActiveStatus}
          />

          <StatusTab
            label="Resolved"
            status="resolved"
            activeStatus={activeStatus}
            onPress={setActiveStatus}
          />
        </View>

        {/* Issue list */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >
          {filteredIssues.length >
          0 ? (
            filteredIssues.map(
              (issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onPress={() =>
                    router.push(
                      `/issue-details?id=${issue.id}` as Href,
                    )
                  }
                />
              ),
            )
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={46}
                color="#9CA3AF"
              />

              <Text style={styles.emptyTitle}>
                No issues found
              </Text>

              <Text style={styles.emptyText}>
                There are no issues under
                this status or search.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Correct active navigation item */}
        <StaffBottomNav active="monitoring" />
      </View>
    </SafeAreaView>
  );
}

function SummaryCard({
  value,
  label,
  backgroundColor,
  valueColor,
}: {
  value: number;
  label: string;
  backgroundColor: string;
  valueColor: string;
}) {
  return (
    <View
      style={[
        styles.summaryCard,
        {
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.summaryValue,
          {
            color: valueColor,
          },
        ]}
      >
        {value}
      </Text>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>
    </View>
  );
}

function StatusTab({
  label,
  status,
  activeStatus,
  onPress,
}: {
  label: string;
  status: FilterStatus;
  activeStatus: FilterStatus;
  onPress: (
    status: FilterStatus,
  ) => void;
}) {
  const isActive =
    activeStatus === status;

  return (
    <Pressable
      onPress={() =>
        onPress(status)
      }
      style={[
        styles.statusTab,

        isActive &&
          styles.statusTabActive,
      ]}
    >
      <Text
        style={[
          styles.statusTabText,

          isActive &&
            styles.statusTabTextActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function IssueCard({
  issue,
  onPress,
}: {
  issue: IssueRecord;
  onPress: () => void;
}) {
  const priorityStyle =
    getPriorityStyle(
      issue.priority,
    );

  const statusStyle =
    getStatusStyle(
      issue.status,
    );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.issueCard,

        pressed &&
          styles.issueCardPressed,
      ]}
    >
      <View style={styles.cardTopRow}>
        <View
          style={
            styles.issueIconContainer
          }
        >
          <Ionicons
            name={getCategoryIcon(
              issue.category,
            )}
            size={21}
            color="#1F3E72"
          />
        </View>

        <View style={styles.issueHeader}>
          <Text style={styles.issueId}>
            {issue.id}
          </Text>

          <Text
            style={styles.issueTitle}
            numberOfLines={2}
          >
            {issue.title}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color="#94A3B8"
        />
      </View>

      <View style={styles.cardDetails}>
        <View>
          <Text
            style={
              styles.studentName
            }
          >
            {issue.studentName}
          </Text>

          <Text
            style={
              styles.studentId
            }
          >
            {issue.studentId}
          </Text>
        </View>

        <Text
          style={
            styles.reportedDate
          }
        >
          {issue.reportedOn}
        </Text>
      </View>

      <View style={styles.badgeRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                priorityStyle.background,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color:
                  priorityStyle.color,
              },
            ]}
          >
            {priorityStyle.label}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                statusStyle.background,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color:
                  statusStyle.color,
              },
            ]}
          >
            {statusStyle.label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function getStatusStyle(
  status: IssueStatus,
) {
  switch (status) {
    case 'resolved':
      return {
        label: 'Resolved',
        background: '#DCFCE7',
        color: '#15803D',
      };

    case 'in-progress':
      return {
        label: 'In Progress',
        background: '#FFEDD5',
        color: '#C2410C',
      };

    default:
      return {
        label: 'Open',
        background: '#FEE2E2',
        color: '#B91C1C',
      };
  }
}

function getPriorityStyle(
  priority:
    | 'low'
    | 'medium'
    | 'high',
) {
  switch (priority) {
    case 'high':
      return {
        label: 'High Priority',
        background: '#FEE2E2',
        color: '#B91C1C',
      };

    case 'medium':
      return {
        label: 'Medium',
        background: '#FEF3C7',
        color: '#B45309',
      };

    default:
      return {
        label: 'Low',
        background: '#E0F2FE',
        color: '#0369A1',
      };
  }
}

function getCategoryIcon(
  category:
    | 'book'
    | 'seat'
    | 'account'
    | 'system'
    | 'other',
): keyof typeof Ionicons.glyphMap {
  switch (category) {
    case 'book':
      return 'book-outline';

    case 'seat':
      return 'grid-outline';

    case 'account':
      return 'person-outline';

    case 'system':
      return 'settings-outline';

    default:
      return 'help-circle-outline';
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,

    backgroundColor: '#E5E7EB',

    alignItems: 'center',
  },

  phoneContainer: {
    flex: 1,

    width: '100%',
    maxWidth: 390,

    backgroundColor: '#F8FAFC',
  },

  titleRow: {
    paddingHorizontal: 15,
    paddingTop: 13,

    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 8,
  },

  title: {
    fontSize: 19,
    fontWeight: '800',

    color: '#111827',
  },

  subtitle: {
    marginTop: 2,

    fontSize: 9,

    color: '#64748B',
  },

  summaryRow: {
    marginTop: 16,

    paddingHorizontal: 15,

    flexDirection: 'row',

    gap: 8,
  },

  summaryCard: {
    flex: 1,

    minHeight: 68,

    borderRadius: 12,

    paddingHorizontal: 10,
    paddingVertical: 10,

    justifyContent: 'center',

    borderWidth: 1,

    borderColor:
      'rgba(148, 163, 184, 0.15)',
  },

  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
  },

  summaryLabel: {
    marginTop: 2,

    fontSize: 9,
    fontWeight: '600',

    color: '#64748B',
  },

  searchSection: {
    marginTop: 15,

    paddingHorizontal: 15,

    flexDirection: 'row',

    gap: 7,
  },

  searchBox: {
    flex: 1,

    height: 43,

    paddingLeft: 12,
    paddingRight: 6,

    borderRadius: 7,

    borderWidth: 1,
    borderColor: '#CBD5E1',

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,

    height: '100%',

    paddingHorizontal: 0,
    paddingVertical: 0,

    borderWidth: 0,

    backgroundColor: 'transparent',

    fontSize: 13,

    color: '#111827',
  },

  clearButton: {
    width: 32,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButton: {
    width: 43,
    height: 43,

    borderRadius: 7,

    backgroundColor: '#08245B',

    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButtonPressed: {
    opacity: 0.8,
  },

  tabsContainer: {
    marginTop: 14,
    marginHorizontal: 15,

    padding: 3,

    borderRadius: 8,

    backgroundColor: '#E2E8F0',

    flexDirection: 'row',
  },

  statusTab: {
    flex: 1,

    minHeight: 36,

    borderRadius: 6,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 3,
  },

  statusTabActive: {
    backgroundColor: '#08245B',
  },

  statusTabText: {
    fontSize: 9,
    fontWeight: '600',

    color: '#64748B',
  },

  statusTabTextActive: {
    color: '#FFFFFF',

    fontWeight: '700',
  },

  listScroll: {
    flex: 1,

    marginTop: 14,
  },

  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 22,

    gap: 10,
  },

  issueCard: {
    padding: 13,

    borderRadius: 12,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

  issueCardPressed: {
    opacity: 0.85,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  issueIconContainer: {
    width: 39,
    height: 39,

    borderRadius: 11,

    backgroundColor: '#EEF4FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  issueHeader: {
    flex: 1,
  },

  issueId: {
    fontSize: 8,
    fontWeight: '700',

    color: '#64748B',
  },

  issueTitle: {
    marginTop: 2,

    fontSize: 12,
    lineHeight: 16,

    fontWeight: '700',

    color: '#111827',
  },

  cardDetails: {
    marginTop: 11,

    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  studentName: {
    fontSize: 10,
    fontWeight: '600',

    color: '#334155',
  },

  studentId: {
    marginTop: 2,

    fontSize: 8,

    color: '#94A3B8',
  },

  reportedDate: {
    maxWidth: 125,

    fontSize: 8,

    textAlign: 'right',

    color: '#94A3B8',
  },

  badgeRow: {
    marginTop: 11,

    flexDirection: 'row',

    gap: 6,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 20,
  },

  badgeText: {
    fontSize: 8,
    fontWeight: '700',
  },

  emptyState: {
    marginTop: 65,

    paddingHorizontal: 20,

    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 10,

    fontSize: 15,
    fontWeight: '700',

    color: '#475569',
  },

  emptyText: {
    marginTop: 5,

    fontSize: 10,
    lineHeight: 15,

    textAlign: 'center',

    color: '#94A3B8',
  },
});