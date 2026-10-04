import type {
  Book,
  BookSearchParams,
  WaitingListEntry,
  WaitingListItem,
} from '../types/book';

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
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    waitingCount: 1,
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
  {
    id: '5',
    title: 'Clean architecture',
    author: 'Robert C. Martin',
    genre: 'Academic',
    status: 'Reserved',
    location: 'Library - Shelf A3',
    totalCopies: 2,
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

// Dummy waiting list state (replace with Supabase later).
const waitingListEntries = new Map<string, WaitingListEntry>([
  ['5', { bookId: '5', position: 1, status: 'Ready', collectBy: 'tomorrow, 5:00 pm' }],
  ['3', { bookId: '3', position: 2, status: 'Waiting', estimatedDays: 6 }],
  ['4', { bookId: '4', position: 3, status: 'Waiting', estimatedDays: 21 }],
]);

export async function joinWaitingList(bookId: string): Promise<void> {
  const book = mockBooks.find((item) => item.id === bookId);
  if (!book || waitingListEntries.has(bookId)) return;

  const estimatedDays = book.dueDate
    ? Math.max(
        0,
        Math.ceil((new Date(book.dueDate).getTime() - Date.now()) / 86400000)
      )
    : undefined;

  waitingListEntries.set(bookId, {
    bookId,
    position: (book.waitingCount ?? 0) + 1,
    status: 'Waiting',
    estimatedDays,
  });
}

export async function leaveWaitingList(bookId: string): Promise<void> {
  waitingListEntries.delete(bookId);
}

export async function isOnWaitingList(bookId: string): Promise<boolean> {
  return waitingListEntries.has(bookId);
}

export async function getMyWaitingLists(): Promise<WaitingListItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const items: WaitingListItem[] = [];

  waitingListEntries.forEach((entry) => {
    const book = mockBooks.find((item) => item.id === entry.bookId);
    if (book) items.push({ ...entry, book });
  });

  return items;
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