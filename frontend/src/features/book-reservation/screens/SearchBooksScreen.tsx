
import { useState } from 'react';
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';

import BookSearchBar from '../components/BookSearchBar';
import GenreSelector from '../components/GenreSelector';
import RecentSearches from '../components/RecentSearches';
import AppHeader from '@/components/AppHeader';

export default function SearchBooksScreen() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Enable search if text is entered OR any genre is selected,
  // including "All".
  const canSearch =
    search.trim().length > 0 || selectedGenre !== null;

  const handleSearch = () => {
    const trimmedSearch = search.trim();

    // Stop only when the search field is empty and no genre is selected.
    if (!trimmedSearch && selectedGenre === null) {
      return;
    }

    Keyboard.dismiss();

    if (trimmedSearch) {
      setRecentSearches((previousSearches) => {
        const filteredSearches = previousSearches.filter(
          (item) =>
            item.toLowerCase() !== trimmedSearch.toLowerCase()
        );

        return [trimmedSearch, ...filteredSearches].slice(0, 5);
      });
    }

    // "All" means search across every genre.
    const genre =
      selectedGenre === null || selectedGenre === 'All'
        ? ''
        : selectedGenre;

    router.push({
      pathname: '/results',
      params: {
        search: trimmedSearch,
        genre,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Search books</Text>

        <BookSearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={handleSearch}
        />

        <Text style={styles.sectionTitle}>Genre</Text>

        <GenreSelector
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        <Pressable
          onPress={handleSearch}
          disabled={!canSearch}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSearch }}
          style={({ pressed }) => [
            styles.searchButton,
            !canSearch && styles.searchButtonDisabled,
            pressed && canSearch && styles.searchButtonPressed,
          ]}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>

        <Text style={[styles.sectionTitle, styles.recentTitle]}>
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
    paddingTop: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },

  recentTitle: {
    marginTop: 32,
    marginBottom: 4,
  },

  searchButton: {
    height: 48,
    marginTop: 24,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButtonDisabled: {
    opacity: 0.5,
  },

  searchButtonPressed: {
    opacity: 0.85,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
