import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type RecentSearchesProps = {
  searches: string[];
  onSelectSearch: (search: string) => void;
};

export default function RecentSearches({
  searches,
  onSelectSearch,
}: RecentSearchesProps) {
  return (
    <View>
      {searches.map((search, index) => (
        <Pressable
          key={search}
          onPress={() => onSelectSearch(search)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.item,
            index < searches.length - 1 && styles.divider,
            pressed && styles.itemPressed,
          ]}
        >
          <Ionicons name="time-outline" size={18} color="#9CA3AF" />
          <Text style={styles.text}>{search}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },

  itemPressed: {
    backgroundColor: '#F8FAFC',
  },

  text: {
    fontSize: 14,
    color: '#374151',
  },
});