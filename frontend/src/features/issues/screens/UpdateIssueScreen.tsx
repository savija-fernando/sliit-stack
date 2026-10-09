import { useState } from 'react';

import {
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
  useLocalSearchParams,
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import {
  getIssueById,
  updateIssue,
} from '@/features/issues/services/issueStore';

import type {
  IssueStatus,
} from '@/features/issues/types/issue';

export default function UpdateIssueScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      id?: string;
    }>();

  const issueId =
    typeof params.id === 'string'
      ? params.id
      : '';

  const issue =
    getIssueById(issueId);

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<IssueStatus>(
    issue?.status ?? 'open',
  );

  const [
    staffNote,
    setStaffNote,
  ] = useState(
    issue?.staffNote ?? '',
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

  const handleUpdate = () => {
    updateIssue(
      issueId,
      selectedStatus,
      staffNote.trim(),
    );

    router.replace(
      `/issue-details?id=${issueId}` as Href,
    );
  };

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
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={styles.titleRow}>
            <Pressable
              onPress={() =>
                router.replace(
                  `/issue-details?id=${issueId}` as Href,
                )
              }
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to issue details"
            >
              <Ionicons
                name="arrow-back-circle"
                size={30}
                color="#111827"
              />
            </Pressable>

            <View>
              <Text style={styles.pageTitle}>
                Update Issue
              </Text>

              <Text style={styles.pageSubtitle}>
                {issue.id}
              </Text>
            </View>
          </View>

          {/* Issue summary */}
          <View style={styles.issueCard}>
            <View style={styles.issueIcon}>
              <Ionicons
                name="warning-outline"
                size={27}
                color="#B91C1C"
              />
            </View>

            <View style={styles.issueInfo}>
              <Text style={styles.issueTitle}>
                {issue.title}
              </Text>

              <Text style={styles.studentText}>
                {issue.studentName}
              </Text>

              <Text style={styles.studentId}>
                {issue.studentId}
              </Text>
            </View>
          </View>

          {/* Current status */}
          <View style={styles.currentStatusCard}>
            <Text style={styles.currentStatusLabel}>
              Current Status
            </Text>

            <View
              style={[
                styles.currentStatusBadge,
                {
                  backgroundColor:
                    getStatusStyle(
                      issue.status,
                    ).background,
                },
              ]}
            >
              <Text
                style={[
                  styles.currentStatusText,
                  {
                    color:
                      getStatusStyle(
                        issue.status,
                      ).color,
                  },
                ]}
              >
                {
                  getStatusStyle(
                    issue.status,
                  ).label
                }
              </Text>
            </View>
          </View>

          {/* Status update */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Change Status
            </Text>

            <Text style={styles.sectionDescription}>
              Select the current progress of this
              issue.
            </Text>

            <View style={styles.statusCard}>
              <StatusOption
                label="Open"
                description="Issue requires staff attention"
                status="open"
                selectedStatus={
                  selectedStatus
                }
                onPress={
                  setSelectedStatus
                }
                color="#DC2626"
              />

              <StatusOption
                label="In Progress"
                description="Staff is currently working on the issue"
                status="in-progress"
                selectedStatus={
                  selectedStatus
                }
                onPress={
                  setSelectedStatus
                }
                color="#EA580C"
              />

              <StatusOption
                label="Resolved"
                description="Issue has been successfully handled"
                status="resolved"
                selectedStatus={
                  selectedStatus
                }
                onPress={
                  setSelectedStatus
                }
                color="#059669"
              />
            </View>
          </View>

          {/* Staff note */}
          <View style={styles.section}>
            <View style={styles.noteHeadingRow}>
              <Text style={styles.sectionTitle}>
                Staff Note
              </Text>

              <Text style={styles.optionalText}>
                Optional
              </Text>
            </View>

            <Text style={styles.sectionDescription}>
              Add a short note explaining what was
              done or what still needs attention.
            </Text>

            <TextInput
              value={staffNote}
              onChangeText={
                setStaffNote
              }
              placeholder="Enter staff note..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={300}
              textAlignVertical="top"
              style={styles.noteInput}
            />

            <Text style={styles.characterCount}>
              {staffNote.length}/300
            </Text>
          </View>

          {/* Update button */}
          <Pressable
            style={({ pressed }) => [
              styles.updateButton,

              pressed &&
                styles.updateButtonPressed,
            ]}
            onPress={handleUpdate}
            accessibilityRole="button"
            accessibilityLabel="Save issue update"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
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

function StatusOption({
  label,
  description,
  status,
  selectedStatus,
  onPress,
  color,
}: {
  label: string;
  description: string;
  status: IssueStatus;
  selectedStatus: IssueStatus;
  onPress: (
    status: IssueStatus,
  ) => void;
  color: string;
}) {
  const isSelected =
    status === selectedStatus;

  return (
    <Pressable
      onPress={() =>
        onPress(status)
      }
      style={[
        styles.statusOption,

        isSelected &&
          styles.statusOptionSelected,
      ]}
    >
      <View
        style={[
          styles.radioOuter,

          isSelected && {
            borderColor: color,
          },
        ]}
      >
        {isSelected ? (
          <View
            style={[
              styles.radioInner,
              {
                backgroundColor:
                  color,
              },
            ]}
          />
        ) : null}
      </View>

      <View style={styles.statusTextContainer}>
        <Text
          style={[
            styles.statusLabel,

            isSelected && {
              color,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={
            styles.statusDescription
          }
        >
          {description}
        </Text>
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
    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 8,
  },

  pageTitle: {
    fontSize: 19,
    fontWeight: '800',

    color: '#111827',
  },

  pageSubtitle: {
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
    width: 49,
    height: 49,

    borderRadius: 14,

    backgroundColor: '#FEF2F2',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  issueInfo: {
    flex: 1,
  },

  issueTitle: {
    fontSize: 13,
    lineHeight: 18,

    fontWeight: '800',

    color: '#111827',
  },

  studentText: {
    marginTop: 5,

    fontSize: 9,
    fontWeight: '600',

    color: '#475569',
  },

  studentId: {
    marginTop: 1,

    fontSize: 8,

    color: '#94A3B8',
  },

  currentStatusCard: {
    minHeight: 52,

    marginTop: 12,

    paddingHorizontal: 13,

    borderRadius: 9,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  currentStatusLabel: {
    fontSize: 10,
    fontWeight: '700',

    color: '#334155',
  },

  currentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 20,
  },

  currentStatusText: {
    fontSize: 8,
    fontWeight: '700',
  },

  section: {
    marginTop: 21,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',

    color: '#111827',
  },

  sectionDescription: {
    marginTop: 3,

    fontSize: 9,
    lineHeight: 14,

    color: '#94A3B8',
  },

  statusCard: {
    marginTop: 10,

    paddingHorizontal: 12,
    paddingVertical: 3,

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  statusOption: {
    minHeight: 65,

    paddingVertical: 10,

    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  statusOptionSelected: {
    backgroundColor: '#FAFCFF',
  },

  radioOuter: {
    width: 19,
    height: 19,

    borderRadius: 10,

    borderWidth: 2,
    borderColor: '#CBD5E1',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  radioInner: {
    width: 9,
    height: 9,

    borderRadius: 5,
  },

  statusTextContainer: {
    flex: 1,
  },

  statusLabel: {
    fontSize: 11,
    fontWeight: '700',

    color: '#475569',
  },

  statusDescription: {
    marginTop: 2,

    fontSize: 8,
    lineHeight: 12,

    color: '#94A3B8',
  },

  noteHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,
  },

  optionalText: {
    fontSize: 8,

    color: '#94A3B8',
  },

  noteInput: {
    height: 110,

    marginTop: 9,

    paddingHorizontal: 12,
    paddingVertical: 11,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: '#CBD5E1',

    backgroundColor: '#FFFFFF',

    fontSize: 11,

    color: '#111827',
  },

  characterCount: {
    marginTop: 4,

    textAlign: 'right',

    fontSize: 8,

    color: '#94A3B8',
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