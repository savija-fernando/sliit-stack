import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type BackRowProps = {
  label?: string;
  onPress: () => void;
};

export default function BackRow({ label, onPress }: BackRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label ?? 'Back'}
      style={styles.row}
    >
      <View style={styles.circle}>
        <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
      </View>
      {label ? <Text style={styles.text}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0B2B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});