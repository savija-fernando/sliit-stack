import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useRouter,
  type Href,
} from 'expo-router';

type StaffSideMenuProps = {
  visible: boolean;
  onClose: () => void;
};

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function StaffSideMenu({
  visible,
  onClose,
}: StaffSideMenuProps) {
  const router = useRouter();

  const navigate = (route: Href) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Side panel */}
        <View style={styles.menu}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.appName}>
                SLIITStack
              </Text>

              <Text style={styles.subtitle}>
                Staff Menu
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed &&
                  styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            >
              <Ionicons
                name="close"
                size={24}
                color="#111827"
              />
            </Pressable>
          </View>

          <View style={styles.divider} />

          {/* Navigation */}
          <View style={styles.navigation}>
            <MenuItem
              icon="grid-outline"
              label="Dashboard"
              onPress={() =>
                navigate(
                  '/staff-dashboard' as Href,
                )
              }
            />

            <MenuItem
              icon="list-outline"
              label="Reservation Queues"
              onPress={() =>
                navigate(
                  '/staff-queues?type=book' as Href,
                )
              }
            />

            <MenuItem
              icon="time-outline"
              label="Expired Reservations"
              disabled
            />

            <MenuItem
              icon="warning-outline"
              label="Open Issues"
              disabled
            />

            <MenuItem
              icon="person-outline"
              label="Profile"
              disabled
            />
          </View>

          <View style={styles.spacer} />

          <View style={styles.divider} />

          {/* Logout */}
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={() =>
              navigate('/login' as Href)
            }
          >
            <Ionicons
              name="log-out-outline"
              size={21}
              color="#DC2626"
            />

            <Text style={styles.logoutText}>
              Logout
            </Text>
          </Pressable>
        </View>

        {/* Close menu when clicking outside */}
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  disabled = false,
}: MenuItemProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,

        disabled &&
          styles.disabledItem,

        pressed &&
          !disabled &&
          styles.buttonPressed,
      ]}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={icon}
          size={21}
          color={
            disabled
              ? '#9CA3AF'
              : '#1F3E72'
          }
        />

        <Text
          style={[
            styles.menuItemText,

            disabled &&
              styles.disabledText,
          ]}
        >
          {label}
        </Text>
      </View>

      {disabled ? (
        <Text style={styles.comingSoon}>
          Soon
        </Text>
      ) : (
        <Ionicons
          name="chevron-forward"
          size={17}
          color="#9CA3AF"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor:
      'rgba(0, 0, 0, 0.35)',
  },

  menu: {
    width: 285,
    maxWidth: '82%',
    height: '100%',

    backgroundColor: '#FFFFFF',

    paddingTop: 20,
    paddingHorizontal: 16,

    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,

    shadowOffset: {
      width: 3,
      height: 0,
    },

    elevation: 10,
  },

  backdrop: {
    flex: 1,
  },

  header: {
    minHeight: 60,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  appName: {
    fontSize: 20,
    fontWeight: '800',

    color: '#08245B',
  },

  subtitle: {
    marginTop: 2,

    fontSize: 11,

    color: '#6B7280',
  },

  closeButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,

    backgroundColor: '#E5E7EB',
  },

  navigation: {
    marginTop: 14,

    gap: 4,
  },

  menuItem: {
    minHeight: 48,

    paddingHorizontal: 11,

    borderRadius: 8,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,
  },

  menuItemText: {
    fontSize: 13,
    fontWeight: '600',

    color: '#1F2937',
  },

  disabledItem: {
    opacity: 0.75,
  },

  disabledText: {
    color: '#9CA3AF',
  },

  comingSoon: {
    fontSize: 9,
    fontWeight: '600',

    color: '#9CA3AF',
  },

  spacer: {
    flex: 1,
  },

  logoutButton: {
    minHeight: 54,

    marginBottom: 20,

    paddingHorizontal: 11,

    borderRadius: 8,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,
  },

  logoutText: {
    fontSize: 13,
    fontWeight: '700',

    color: '#DC2626',
  },

  buttonPressed: {
    backgroundColor: '#F1F5F9',
  },
});