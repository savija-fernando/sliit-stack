import {
  useState,
} from 'react';

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
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

import {
  getStaffProfile,
  updateStaffProfile,
  type StaffProfile,
} from '@/features/profile/services/staffProfileStore';

export default function StaffProfileScreen() {
  const router = useRouter();

  const [
    profile,
    setProfile,
  ] = useState<StaffProfile>(
    () => getStaffProfile(),
  );

  const [
    draft,
    setDraft,
  ] = useState<StaffProfile>(
    () => getStaffProfile(),
  );

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const handleEdit = () => {
    setDraft({
      ...profile,
    });

    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft({
      ...profile,
    });

    setIsEditing(false);
  };

  const handleSave = () => {
    const cleanedProfile: StaffProfile = {
      ...draft,

      name: draft.name.trim(),
      email: draft.email.trim(),
      staffId: draft.staffId.trim(),
      department:
        draft.department.trim(),
    };

    if (
      !cleanedProfile.name ||
      !cleanedProfile.email ||
      !cleanedProfile.staffId ||
      !cleanedProfile.department
    ) {
      return;
    }

    const savedProfile =
      updateStaffProfile(
        cleanedProfile,
      );

    setProfile(savedProfile);
    setDraft(savedProfile);

    setIsEditing(false);
  };

  const updateField = (
    field: keyof StaffProfile,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleLogout = () => {
    router.replace(
      '/login' as Href,
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
          {/* Heading */}
          <View style={styles.titleRow}>
            <Pressable
              onPress={() =>
                router.replace(
                  '/staff-dashboard' as Href,
                )
              }
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back-circle"
                size={30}
                color="#111827"
              />
            </Pressable>

            <View style={styles.titleContent}>
              <Text style={styles.pageTitle}>
                Staff Profile
              </Text>

              <Text style={styles.pageSubtitle}>
                Manage your account information
              </Text>
            </View>

            {!isEditing && (
              <Pressable
                style={styles.editButton}
                onPress={handleEdit}
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color="#1D4ED8"
                />

                <Text style={styles.editText}>
                  Edit
                </Text>
              </Pressable>
            )}
          </View>

          {/* Profile overview */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={38}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.staffName}>
              {profile.name}
            </Text>

            <Text style={styles.staffEmail}>
              {profile.email}
            </Text>

            <View style={styles.roleBadge}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color="#1D4ED8"
              />

              <Text style={styles.roleText}>
                {profile.role} Account
              </Text>
            </View>
          </View>

          {/* Edit form */}
          {isEditing ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Edit Profile
              </Text>

              <View style={styles.formCard}>
                <ProfileInput
                  label="Full Name"
                  value={draft.name}
                  placeholder="Enter full name"
                  onChangeText={(value) =>
                    updateField(
                      'name',
                      value,
                    )
                  }
                />

                <ProfileInput
                  label="Staff ID"
                  value={draft.staffId}
                  placeholder="Enter staff ID"
                  onChangeText={(value) =>
                    updateField(
                      'staffId',
                      value,
                    )
                  }
                />

                <ProfileInput
                  label="Email"
                  value={draft.email}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  onChangeText={(value) =>
                    updateField(
                      'email',
                      value,
                    )
                  }
                />

                <ProfileInput
                  label="Department"
                  value={draft.department}
                  placeholder="Enter department"
                  onChangeText={(value) =>
                    updateField(
                      'department',
                      value,
                    )
                  }
                />

                <View style={styles.roleField}>
                  <Text style={styles.inputLabel}>
                    Role
                  </Text>

                  <View style={styles.readOnlyInput}>
                    <Text
                      style={
                        styles.readOnlyText
                      }
                    >
                      {draft.role}
                    </Text>

                    <Ionicons
                      name="lock-closed-outline"
                      size={15}
                      color="#94A3B8"
                    />
                  </View>

                  <Text style={styles.helperText}>
                    Staff role cannot be changed here.
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text
                      style={
                        styles.cancelText
                      }
                    >
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.saveButton}
                    onPress={handleSave}
                  >
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text style={styles.saveText}>
                      Save Changes
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            <>
              {/* Account information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Account Information
                </Text>

                <View style={styles.infoList}>
                  <ProfileRow
                    icon="id-card-outline"
                    label="Staff ID"
                    value={profile.staffId}
                  />

                  <ProfileRow
                    icon="mail-outline"
                    label="Email"
                    value={profile.email}
                  />

                  <ProfileRow
                    icon="briefcase-outline"
                    label="Role"
                    value={profile.role}
                  />

                  <ProfileRow
                    icon="business-outline"
                    label="Department"
                    value={
                      profile.department
                    }
                  />
                </View>
              </View>

              {/* Account status */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Account Status
                </Text>

                <View style={styles.statusCard}>
                  <View style={styles.statusLeft}>
                    <Ionicons
                      name="checkmark-circle"
                      size={23}
                      color="#059669"
                    />

                    <View>
                      <Text
                        style={
                          styles.statusTitle
                        }
                      >
                        Active Account
                      </Text>

                      <Text
                        style={
                          styles.statusDescription
                        }
                      >
                        Your staff account is active
                      </Text>
                    </View>
                  </View>

                  <View style={styles.activeBadge}>
                    <Text
                      style={
                        styles.activeBadgeText
                      }
                    >
                      Active
                    </Text>
                  </View>
                </View>
              </View>

              {/* Security */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Security
                </Text>

                <View style={styles.securityCard}>
                  <View style={styles.securityIcon}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={21}
                      color="#1F3E72"
                    />
                  </View>

                  <View
                    style={
                      styles.securityContent
                    }
                  >
                    <Text
                      style={
                        styles.securityTitle
                      }
                    >
                      Password
                    </Text>

                    <Text
                      style={
                        styles.securityText
                      }
                    >
                      Password management will be
                      connected with Supabase
                      authentication later.
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {!isEditing && (
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,

                pressed &&
                  styles.logoutButtonPressed,
              ]}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#DC2626"
              />

              <Text style={styles.logoutText}>
                Logout
              </Text>
            </Pressable>
          )}
        </ScrollView>

        <StaffBottomNav active="profile" />
      </View>
    </SafeAreaView>
  );
}

function ProfileInput({
  label,
  value,
  placeholder,
  keyboardType = 'default',
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?:
    | 'default'
    | 'email-address';
  onChangeText: (
    value: string,
  ) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        autoCapitalize={
          keyboardType ===
          'email-address'
            ? 'none'
            : 'sentences'
        }
        style={styles.input}
      />
    </View>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={styles.infoIcon}>
          <Ionicons
            name={icon}
            size={18}
            color="#1F3E72"
          />
        </View>

        <Text style={styles.infoLabel}>
          {label}
        </Text>
      </View>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
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
    paddingBottom: 28,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 16,
  },

  backButton: {
    marginRight: 8,
  },

  titleContent: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 19,
    fontWeight: '800',

    color: '#111827',
  },

  pageSubtitle: {
    marginTop: 2,

    fontSize: 9,

    color: '#64748B',
  },

  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,

    borderRadius: 8,

    backgroundColor: '#EFF6FF',

    flexDirection: 'row',
    alignItems: 'center',

    gap: 4,
  },

  editText: {
    fontSize: 9,
    fontWeight: '700',

    color: '#1D4ED8',
  },

  profileCard: {
    paddingVertical: 24,
    paddingHorizontal: 16,

    borderRadius: 18,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    alignItems: 'center',

    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 7,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  avatar: {
    width: 78,
    height: 78,

    borderRadius: 39,

    backgroundColor: '#08245B',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 5,
    borderColor: '#E0EAFF',
  },

  staffName: {
    marginTop: 13,

    fontSize: 19,
    fontWeight: '800',

    color: '#111827',
  },

  staffEmail: {
    marginTop: 3,

    fontSize: 10,

    color: '#64748B',
  },

  roleBadge: {
    marginTop: 11,

    paddingHorizontal: 11,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: '#EFF6FF',

    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,
  },

  roleText: {
    fontSize: 9,
    fontWeight: '700',

    color: '#1D4ED8',
  },

  section: {
    marginTop: 21,
  },

  sectionTitle: {
    marginBottom: 9,

    fontSize: 14,
    fontWeight: '800',

    color: '#111827',
  },

  formCard: {
    padding: 14,

    borderRadius: 12,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    gap: 14,
  },

  inputGroup: {
    gap: 6,
  },

  inputLabel: {
    fontSize: 9,
    fontWeight: '700',

    color: '#475569',
  },

  input: {
    height: 43,

    paddingHorizontal: 11,

    borderWidth: 1,
    borderColor: '#CBD5E1',

    borderRadius: 8,

    backgroundColor: '#FFFFFF',

    fontSize: 11,

    color: '#111827',
  },

  roleField: {
    gap: 6,
  },

  readOnlyInput: {
    height: 43,

    paddingHorizontal: 11,

    borderWidth: 1,
    borderColor: '#E2E8F0',

    borderRadius: 8,

    backgroundColor: '#F8FAFC',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  readOnlyText: {
    fontSize: 11,

    color: '#64748B',
  },

  helperText: {
    fontSize: 8,

    color: '#94A3B8',
  },

  actionRow: {
    marginTop: 4,

    flexDirection: 'row',

    gap: 8,
  },

  cancelButton: {
    flex: 1,
    height: 43,

    borderRadius: 8,

    borderWidth: 1,
    borderColor: '#CBD5E1',

    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 10,
    fontWeight: '700',

    color: '#475569',
  },

  saveButton: {
    flex: 1.4,
    height: 43,

    borderRadius: 8,

    backgroundColor: '#08245B',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,
  },

  saveText: {
    fontSize: 10,
    fontWeight: '700',

    color: '#FFFFFF',
  },

  infoList: {
    gap: 8,
  },

  infoRow: {
    minHeight: 55,

    paddingHorizontal: 13,

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 9,
  },

  infoIcon: {
    width: 33,
    height: 33,

    borderRadius: 9,

    backgroundColor: '#EEF4FF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '700',

    color: '#475569',
  },

  infoValue: {
    maxWidth: '47%',

    fontSize: 9,

    textAlign: 'right',

    color: '#64748B',
  },

  statusCard: {
    minHeight: 72,

    paddingHorizontal: 13,

    borderRadius: 11,

    backgroundColor: '#ECFDF5',

    borderWidth: 1,
    borderColor: '#D1FAE5',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 9,
  },

  statusTitle: {
    fontSize: 11,
    fontWeight: '700',

    color: '#065F46',
  },

  statusDescription: {
    marginTop: 2,

    fontSize: 8,

    color: '#047857',
  },

  activeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,

    borderRadius: 20,

    backgroundColor: '#D1FAE5',
  },

  activeBadgeText: {
    fontSize: 8,
    fontWeight: '700',

    color: '#047857',
  },

  securityCard: {
    padding: 13,

    borderRadius: 11,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  securityIcon: {
    width: 38,
    height: 38,

    borderRadius: 10,

    backgroundColor: '#EEF4FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 11,
    fontWeight: '700',

    color: '#334155',
  },

  securityText: {
    marginTop: 3,

    fontSize: 8,
    lineHeight: 12,

    color: '#94A3B8',
  },

  logoutButton: {
    height: 48,

    marginTop: 24,

    borderRadius: 10,

    borderWidth: 1,
    borderColor: '#FECACA',

    backgroundColor: '#FEF2F2',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,
  },

  logoutButtonPressed: {
    opacity: 0.8,
  },

  logoutText: {
    fontSize: 12,
    fontWeight: '700',

    color: '#DC2626',
  },
});