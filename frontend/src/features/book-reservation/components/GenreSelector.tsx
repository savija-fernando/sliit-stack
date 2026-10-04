import { Pressable, StyleSheet, Text, View } from 'react-native';

type GenreSelectorProps = {
  selectedGenre: string | null;
  // Tapping the selected chip again passes null (deselect)
  onSelectGenre: (genre: string | null) => void;
};

const genres = [
  'All',
  'Fiction',
  'Academic',
  'Reference',
  'Non-fiction',
];

export default function GenreSelector({
  selectedGenre,
  onSelectGenre,
}: GenreSelectorProps) {
  return (
    <View style={styles.container}>
      {genres.map((genre) => {
        const selected = selectedGenre === genre;

        return (
          <Pressable
            key={genre}
            onPress={() => onSelectGenre(selected ? null : genre)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              styles.genreButton,
              selected && styles.selectedGenreButton,
              pressed && !selected && styles.pressedGenreButton,
            ]}
          >
            <Text
              style={[
                styles.genreText,
                selected && styles.selectedGenreText,
              ]}
            >
              {genre}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  genreButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },

  pressedGenreButton: {
    backgroundColor: '#F1F5F9',
  },

  selectedGenreButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  genreText: {
    fontSize: 13,
    color: '#374151',
  },

  selectedGenreText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});