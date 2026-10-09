import { supabase } from '@/lib/supabase';

import type {
  Book,
  BookSearchParams,
  BookStatus,
  WaitingListItem,
} from '../types/book';

/**
 * Convert a Supabase database row
 * into the Book type used by the app.
 */
function mapBook(row: any): Book {
  return {
    id: row.id,

    title: row.title,
    author: row.author,
    genre: row.genre,
    isbn: row.isbn ?? undefined,

    status: row.status as BookStatus,

    description: row.description ?? undefined,
    coverUrl: row.cover_url ?? undefined,
    location: row.location ?? undefined,

    totalCopies: row.total_copies,
    availableCopies: row.available_copies,
  };
}

/**
 * CREATE
 * Create a new book.
 *
 * Staff/admin users will use this later.
 */
export async function createBook(book: {
  title: string;
  author: string;
  genre: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  location?: string;
  status?: BookStatus;
  totalCopies?: number;
  availableCopies?: number;
}): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn ?? null,
      description: book.description ?? null,
      cover_url: book.coverUrl ?? null,
      location: book.location ?? null,
      status: book.status ?? 'Available',
      total_copies: book.totalCopies ?? 1,
      available_copies:
        book.availableCopies ?? book.totalCopies ?? 1,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create book: ${error.message}`);
  }

  return mapBook(data);
}

/**
 * READ
 * Get all books.
 */
export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch books: ${error.message}`);
  }

  return (data ?? []).map(mapBook);
}

/**
 * READ
 * Get a single book by ID.
 */
export async function getBookById(id: string): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch book: ${error.message}`);
  }

  return mapBook(data);
}

/**
 * SEARCH
 * Search books by title, author or ISBN.
 */
export async function searchBooks(
  params: BookSearchParams
): Promise<Book[]> {
  const search = params.search?.trim();
  const genre = params.genre?.trim();

  let query = supabase
    .from('books')
    .select('*');

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,author.ilike.%${search}%,isbn.ilike.%${search}%`
    );
  }

  if (genre) {
    query = query.eq('genre', genre);
  }

  query = query.order('created_at', {
    ascending: false,
  });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to search books: ${error.message}`);
  }

  return (data ?? []).map(mapBook);
}

/**
 * UPDATE
 * Update an existing book.
 *
 * Staff/admin users will use this later.
 */
export async function updateBook(
  id: string,
  updates: {
    title?: string;
    author?: string;
    genre?: string;
    isbn?: string;
    description?: string;
    coverUrl?: string;
    location?: string;
    status?: BookStatus;
    totalCopies?: number;
    availableCopies?: number;
  }
): Promise<Book> {
  const databaseUpdates: Record<string, unknown> = {};

  if (updates.title !== undefined) {
    databaseUpdates.title = updates.title;
  }

  if (updates.author !== undefined) {
    databaseUpdates.author = updates.author;
  }

  if (updates.genre !== undefined) {
    databaseUpdates.genre = updates.genre;
  }

  if (updates.isbn !== undefined) {
    databaseUpdates.isbn = updates.isbn;
  }

  if (updates.description !== undefined) {
    databaseUpdates.description = updates.description;
  }

  if (updates.coverUrl !== undefined) {
    databaseUpdates.cover_url = updates.coverUrl;
  }

  if (updates.location !== undefined) {
    databaseUpdates.location = updates.location;
  }

  if (updates.status !== undefined) {
    databaseUpdates.status = updates.status;
  }

  if (updates.totalCopies !== undefined) {
    databaseUpdates.total_copies = updates.totalCopies;
  }

  if (updates.availableCopies !== undefined) {
    databaseUpdates.available_copies =
      updates.availableCopies;
  }

  const { data, error } = await supabase
    .from('books')
    .update(databaseUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update book: ${error.message}`);
  }

  return mapBook(data);
}

/**
 * DELETE
 * Delete a book by ID.
 *
 * Staff/admin users will use this later.
 */
export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete book: ${error.message}`);
  }
}

//waiting list functions

/**
 * WAITING LIST
 * Check whether the current user is already
 * on the waiting list for a book.
 */
export async function isOnWaitingList(
  bookId: string
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('waiting_list')
    .select('id')
    .eq('book_id', bookId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to check waiting list: ${error.message}`
    );
  }

  return !!data;
}

/**
 * WAITING LIST
 * Add the current user to the waiting list.
 */
export async function joinWaitingList(
  bookId: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to join the waiting list.');
  }

  // Find the current last position for this book.
  const { data: lastEntry, error: positionError } =
    await supabase
      .from('waiting_list')
      .select('position')
      .eq('book_id', bookId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

  if (positionError) {
    throw new Error(
      `Failed to get waiting-list position: ${positionError.message}`
    );
  }

  const nextPosition = lastEntry
    ? lastEntry.position + 1
    : 1;

  const { error } = await supabase
    .from('waiting_list')
    .insert({
      book_id: bookId,
      user_id: user.id,
      position: nextPosition,
      status: 'Waiting',
    });

  if (error) {
    throw new Error(
      `Failed to join waiting list: ${error.message}`
    );
  }
}
/**
 * WAITING LIST
 * Get the current user's waiting-list entry for a book.
 */
export async function getWaitingListEntry(bookId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { data, error } = await supabase
    .from('waiting_list')
    .select('id, book_id, user_id, position, status, created_at')
    .eq('book_id', bookId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to get waiting-list entry: ${error.message}`
    );
  }

  return data;
}

/**
 * WAITING LIST
 * Remove the current user from a waiting list.
 */
export async function leaveWaitingList(
  bookId: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { error } = await supabase
    .from('waiting_list')
    .delete()
    .eq('book_id', bookId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to leave waiting list: ${error.message}`
    );
  }
}

/**
 * WAITING LIST
 * Get all waiting lists belonging to the current user.
 */
export async function getMyWaitingLists(): Promise<WaitingListItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { data, error } = await supabase
    .from('waiting_list')
    .select(`
      id,
      book_id,
      user_id,
      position,
      status,
      created_at,
      books (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(
      `Failed to fetch waiting lists: ${error.message}`
    );
  }

  return (data ?? []).map((row: any) => ({
    bookId: row.book_id,
    position: row.position,
    status: row.status as 'Waiting' | 'Ready',
    estimatedDays: undefined,
    collectBy: undefined,
    book: mapBook(row.books),
  }));
}

/**
 * RESERVATION
 * Reserve an available book for the current user.
 */
export async function reserveBook(bookId: string): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to reserve a book.');
  }

  const { data, error } = await supabase.rpc('reserve_book', {
    p_book_id: bookId,
  });

  if (error) {
    throw new Error(
      `Failed to reserve book: ${error.message}`
    );
  }

  return data;
}