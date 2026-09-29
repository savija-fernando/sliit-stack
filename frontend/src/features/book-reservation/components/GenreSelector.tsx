import { Pressable, StyleSheet, Text, View } from 'react-native';

type GenreSelectorProps = {
  selectedGenre: string | null;
  onSelectGenre: (genre: string) => void;
};

const genres = [
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
            onPress={() => onSelectGenre(genre)}
            style={[
              styles.genreButton,
              selected && styles.selectedGenreButton,
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
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },

  selectedGenreButton: {
    backgroundColor: '#2563EB',
  },

  genreText: {
    fontSize: 11,
    color: '#374151',
  },

  selectedGenreText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});