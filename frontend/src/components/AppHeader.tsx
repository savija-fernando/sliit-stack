import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import StaffSideMenu from '@/components/StaffSideMenu';

type AppHeaderProps = {
  onMenuPress?: () => void;
  onProfilePress?: () => void;

  rightAction?:
    | 'profile'
    | 'notifications';

  notificationCount?: number;

  onNotificationsPress?: () => void;

  sideMenu?: 'staff';
};

export default function AppHeader({
  onMenuPress,
  onProfilePress,
  rightAction = 'profile',
  notificationCount = 0,
  onNotificationsPress,
  sideMenu,
}: AppHeaderProps) {
  const [
    staffMenuVisible,
    setStaffMenuVisible,
  ] = useState(false);

  const handleMenuPress = () => {
    if (sideMenu === 'staff') {
      setStaffMenuVisible(true);
      return;
    }

    onMenuPress?.();
  };

  return (
    <>
      <View style={styles.container}>
        {/* Menu */}
        <Pressable
          onPress={handleMenuPress}
          style={({ pressed }) => [
            styles.iconButton,

            pressed &&
              styles.iconButtonPressed,
          ]}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Ionicons
            name="menu-outline"
            size={24}
            color="#111827"
          />
        </Pressable>

        {/* Logo + App name */}
        <View style={styles.brandContainer}>
          <Image
            source={require('@/assets/images/sliit_stack.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brandText}>
            SLIITStack
          </Text>
        </View>

        {/* Right action */}
        {rightAction ===
        'notifications' ? (
          <Pressable
            onPress={
              onNotificationsPress
            }
            style={({ pressed }) => [
              styles.iconButton,

              pressed &&
                styles.iconButtonPressed,
            ]}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons
              name="notifications"
              size={24}
              color="#F59E0B"
            />

            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text
                  style={
                    styles.badgeText
                  }
                >
                  {notificationCount >
                  9
                    ? '9+'
                    : notificationCount}
                </Text>
              </View>
            )}
          </Pressable>
        ) : (
          <Pressable
            onPress={onProfilePress}
            style={({ pressed }) => [
              styles.iconButton,

              pressed &&
                styles.iconButtonPressed,
            ]}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Ionicons
              name="person-circle-outline"
              size={26}
              color="#111827"
            />
          </Pressable>
        )}
      </View>

      {/* Staff side menu */}
      {sideMenu === 'staff' && (
        <StaffSideMenu
          visible={staffMenuVisible}
          onClose={() =>
            setStaffMenuVisible(false)
          }
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,

    paddingHorizontal: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#FFFFFF',

    borderBottomWidth:
      StyleSheet.hairlineWidth,

    borderBottomColor: '#E5E7EB',
  },

  iconButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButtonPressed: {
    backgroundColor: '#F1F5F9',
  },

  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  logo: {
    width: 26,
    height: 26,
  },

  brandText: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',

    color: '#111827',
  },

  badge: {
    position: 'absolute',

    top: 2,
    right: 2,

    minWidth: 16,
    height: 16,

    paddingHorizontal: 3,

    borderRadius: 8,

    backgroundColor: '#DC2626',

    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '700',
  },
});