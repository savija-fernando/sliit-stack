import {
  useCallback,
  useState,
} from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import {
  getIssueById,
} from '@/features/issues/services/issueStore';

import type {
  IssuePriority,
  IssueRecord,
  IssueStatus,
} from '@/features/issues/types/issue';

export default function IssueDetailsScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      id?: string;
    }>();

  const issueId =
    typeof params.id === 'string'
      ? params.id
      : '';

  const [
    issue,
    setIssue,
  ] =
    useState<
      IssueRecord | undefined
    >(() =>
      getIssueById(issueId),
    );

  useFocusEffect(
    useCallback(() => {
      setIssue(
        getIssueById(issueId),
      );
    }, [issueId]),
  );

  if (!issue) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.phoneContainer}>
          <AppHeader
            rightAction="profile"
            sideMenu="staff"
          />

          <View style={styles.notFound}>
            <Ionicons
              name="alert-circle-outline"
              size={46}
              color="#94A3B8"
            />

            <Text style={styles.notFoundTitle}>
              Issue not found
            </Text>

            <Pressable
              style={styles.backButtonLarge}
              onPress={() =>
                router.replace(
                  '/issue-monitoring' as Href,
                )
              }
            >
              <Text
                style={
                  styles.backButtonLargeText
                }
              >
                Back to Monitoring
              </Text>
            </Pressable>
          </View>

          <StaffBottomNav active="monitoring" />
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle =
    getStatusStyle(issue.status);

  const priorityStyle =
    getPriorityStyle(
      issue.priority,
    );

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <AppHeader
          rightAction="profile"
          sideMenu="staff"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* Title */}
          <View style={styles.titleRow}>
            <Pressable
              onPress={() =>
                router.replace(
                  '/issue-monitoring' as Href,
                )
              }
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to issue monitoring"
            >
              <Ionicons
                name="arrow-back-circle"
                size={30}
                color="#111827"
              />
            </Pressable>

            <View style={styles.titleTextContainer}>
              <Text style={styles.pageTitle}>
                Issue Details
              </Text>

              <Text style={styles.issueId}>
                {issue.id}
              </Text>
            </View>
          </View>

          {/* Main issue card */}
          <View style={styles.issueCard}>
            <View style={styles.issueIcon}>
              <Ionicons
                name={getCategoryIcon(
                  issue.category,
                )}
                size={29}
                color="#1F3E72"
              />
            </View>

            <View style={styles.issueHeading}>
              <Text style={styles.issueTitle}>
                {issue.title}
              </Text>

              <Text style={styles.categoryText}>
                {formatCategory(
                  issue.category,
                )}
              </Text>
            </View>
          </View>

          {/* Status badges */}
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

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Issue Description
            </Text>

            <View style={styles.descriptionCard}>
              <Text style={styles.description}>
                {issue.description}
              </Text>
            </View>
          </View>

          {/* Student details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Reported By
            </Text>

            <View style={styles.detailsCard}>
              <InfoRow
                label="Student Name"
                value={issue.studentName}
              />

              <InfoRow
                label="Student ID"
                value={issue.studentId}
              />

              <InfoRow
                label="Category"
                value={formatCategory(
                  issue.category,
                )}
              />

              <InfoRow
                label="Reported On"
                value={issue.reportedOn}
              />
            </View>
          </View>

          {/* Staff note */}
          {issue.staffNote ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Staff Note
              </Text>

              <View style={styles.noteCard}>
                <Ionicons
                  name="document-text-outline"
                  size={19}
                  color="#64748B"
                />

                <Text style={styles.noteText}>
                  {issue.staffNote}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Update button */}
          <Pressable
            style={({ pressed }) => [
              styles.updateButton,

              pressed &&
                styles.updateButtonPressed,
            ]}
            onPress={() =>
              router.push(
                `/update-issue?id=${issue.id}` as Href,
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.updateButtonText}>
              Update Issue
            </Text>
          </Pressable>
        </ScrollView>

        <StaffBottomNav active="monitoring" />
      </View>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
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
  priority: IssuePriority,
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
        label: 'Medium Priority',
        background: '#FEF3C7',
        color: '#B45309',
      };

    default:
      return {
        label: 'Low Priority',
        background: '#E0F2FE',
        color: '#0369A1',
      };
  }
}

function getCategoryIcon(
  category: IssueRecord['category'],
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

function formatCategory(
  category: IssueRecord['category'],
) {
  return (
    category.charAt(0).toUpperCase() +
    category.slice(1)
  );
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

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 15,
    paddingTop: 13,
    paddingBottom: 25,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 16,
  },

  backButton: {
    marginRight: 8,
  },

  titleTextContainer: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },

  issueId: {
    marginTop: 1,

    fontSize: 9,
    fontWeight: '600',

    color: '#64748B',
  },

  issueCard: {
    padding: 14,

    borderRadius: 13,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'center',
  },

  issueIcon: {
    width: 50,
    height: 50,

    borderRadius: 14,

    backgroundColor: '#EEF4FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  issueHeading: {
    flex: 1,
  },

  issueTitle: {
    fontSize: 14,
    lineHeight: 19,

    fontWeight: '800',

    color: '#111827',
  },

  categoryText: {
    marginTop: 4,

    fontSize: 9,
    fontWeight: '600',

    color: '#64748B',
  },

  badgeRow: {
    marginTop: 10,

    flexDirection: 'row',

    gap: 7,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 20,
  },

  badgeText: {
    fontSize: 8,
    fontWeight: '700',
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    marginBottom: 8,

    fontSize: 14,
    fontWeight: '800',

    color: '#111827',
  },

  descriptionCard: {
    padding: 13,

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  description: {
    fontSize: 11,
    lineHeight: 17,

    color: '#475569',
  },

  detailsCard: {
    gap: 8,
  },

  infoRow: {
    minHeight: 50,

    paddingHorizontal: 13,
    paddingVertical: 11,

    borderRadius: 9,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '700',

    color: '#334155',
  },

  infoValue: {
    maxWidth: '62%',

    fontSize: 9,

    color: '#64748B',

    textAlign: 'right',
  },

  noteCard: {
    padding: 13,

    borderRadius: 10,

    backgroundColor: '#F8FAFC',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 9,
  },

  noteText: {
    flex: 1,

    fontSize: 10,
    lineHeight: 16,

    color: '#475569',
  },

  updateButton: {
    height: 47,

    marginTop: 22,

    borderRadius: 9,

    backgroundColor: '#08245B',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,
  },

  updateButtonPressed: {
    opacity: 0.85,
  },

  updateButtonText: {
    fontSize: 12,
    fontWeight: '700',

    color: '#FFFFFF',
  },

  notFound: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 20,
  },

  notFoundTitle: {
    marginTop: 10,

    fontSize: 16,
    fontWeight: '700',

    color: '#475569',
  },

  backButtonLarge: {
    marginTop: 18,

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 8,

    backgroundColor: '#08245B',
  },

  backButtonLargeText: {
    fontSize: 11,
    fontWeight: '700',

    color: '#FFFFFF',
  },
});