import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';

import BookSearchBar from '../components/BookSearchBar';
import GenreSelector from '../components/GenreSelector';
import RecentSearches from '../components/RecentSearches';

export default function SearchBooksScreen() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Clean code',
    'Data structures',
  ]);

  const handleSearch = () => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      return;
    }

    setRecentSearches((previousSearches) => {
      // Remove the search if it already exists
      const filteredSearches = previousSearches.filter(
        (item) => item.toLowerCase() !== trimmedSearch.toLowerCase()
      );

      // Add the newest search to the beginning
      return [trimmedSearch, ...filteredSearches].slice(0, 5);
    });

    console.log({
      search: trimmedSearch,
      genre: selectedGenre,
    });

    // Supabase search will be connected later.
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Search books</Text>

        <BookSearchBar
          value={search}
          onChangeText={setSearch}
        />

        <Text style={styles.sectionTitle}>
          Genre
        </Text>

        <GenreSelector
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        <Pressable
          onPress={handleSearch}
          style={styles.searchButton}
        >
          <Text style={styles.searchButtonText}>
            Search
          </Text>
        </Pressable>

        <Text style={styles.sectionTitle}>
          Recent searches
        </Text>

        <RecentSearches
          searches={recentSearches}
          onSelectSearch={setSearch}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 10,
  },

  searchButton: {
    height: 42,
    marginTop: 20,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});