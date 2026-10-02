import type { Book, BookSearchParams } from '../types/book';

// Dummy data. Replace with the Supabase query later.
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Design patterns',
    author: 'Gamma, Helm, Johnson, Vlissides',
    genre: 'Academic',
    status: 'Available',
    location: 'Shelf B4, 2nd floor',
    totalCopies: 3,
    availableCopies: 2,
  },
  {
    id: '2',
    title: 'Clean code',
    author: 'Robert C. Martin',
    genre: 'Academic',
    status: 'Issued',
    location: 'Library - Shelf A3',
    totalCopies: 4,
    availableCopies: 0,
  },
  {
    id: '3',
    title: 'Pragmatic programmer',
    author: 'Hunt & Thomas',
    genre: 'Academic',
    status: 'Reserved',
    location: 'Library - Shelf B1',
    totalCopies: 2,
    availableCopies: 0,
  },
  {
    id: '4',
    title: 'Refactoring',
    author: 'Martin Fowler',
    genre: 'Reference',
    status: 'Unavailable',
    location: 'Reference section',
    totalCopies: 1,
    availableCopies: 0,
  },
];

export async function searchBooks({
  search = '',
  genre = '',
}: BookSearchParams): Promise<Book[]> {
  // Simulates network delay so the loading state can be seen.
  await new Promise((resolve) => setTimeout(resolve, 300));

  const query = search.trim().toLowerCase();

  return mockBooks.filter((book) => {
    const matchesSearch =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);

    const matchesGenre = !genre || book.genre === genre;

    return matchesSearch && matchesGenre;
  });
}

export async function getBookById(id: string): Promise<Book | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockBooks.find((book) => book.id === id) ?? null;
}

// Later, something like:
// export async function searchBooks({ search, genre }: BookSearchParams) {
//   let query = supabase.from('books').select('*');
//   if (search) query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
//   if (genre) query = query.eq('genre', genre);
//   const { data, error } = await query;
//   if (error) throw error;
//   return data as Book[];
// }