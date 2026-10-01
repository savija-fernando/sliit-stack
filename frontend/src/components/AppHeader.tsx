import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
};

export default function AppHeader({
  onMenuPress,
  onProfilePress,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Menu */}
      <Pressable
        onPress={onMenuPress}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.iconButtonPressed,
        ]}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
      >
        <Ionicons name="menu-outline" size={24} color="#111827" />
      </Pressable>

      {/* Logo + App name */}
      <View style={styles.brandContainer}>
        {/* Replace this with your actual logo */}
        <Image
          source={require('@/assets/images/sliit_stack.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brandText}>SLIITStack</Text>
      </View>

      {/* Profile */}
      <Pressable
        onPress={onProfilePress}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.iconButtonPressed,
        ]}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
      >
        <Ionicons name="person-circle-outline" size={26} color="#111827" />
      </Pressable>
    </View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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
});