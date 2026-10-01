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
    <View style={styles.container}>
      {searches.map((search) => (
        <Pressable
          key={search}
          onPress={() => onSelectSearch(search)}
          style={styles.item}
        >
          <Text style={styles.text}>{search}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },

  item: {
    paddingVertical: 8,
  },

  text: {
    fontSize: 12,
    color: '#374151',
  },
});