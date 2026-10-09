
import { supabase } from '@/lib/supabase';

export type AdminBookReservationStatus =
  | 'Active'
  | 'Approved'
  | 'Rejected'
  | 'Returned'
  | 'Expired';

export type AdminBookReservation = {
  id: string;
  reference: string;
  status: AdminBookReservationStatus;
  reserved_at: string | null;
  book_id: string;
  user_id: string;
  title: string;
  author: string;
  cover_url: string | null;
};

export async function getAdminBookReservations(): Promise<AdminBookReservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      reference,
      status,
      reserved_at,
      book_id,
      user_id
    `)
    .eq('reservation_type', 'BOOK')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load book reservations: ${error.message}`);
  }

  const rows = data ?? [];

  const bookIds = [...new Set(rows.map((row) => row.book_id).filter(Boolean))];

  let booksById: Record<string, { title: string; author: string; cover_url: string | null }> = {};

  if (bookIds.length > 0) {
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, title, author, cover_url')
      .in('id', bookIds);

    if (booksError) {
      throw new Error(`Failed to load reserved books: ${booksError.message}`);
    }

    booksById = Object.fromEntries(
      (books ?? []).map((book) => [book.id, book])
    );
  }

  return rows.map((row) => {
    const book = row.book_id ? booksById[row.book_id] : undefined;

    return {
      id: row.id,
      reference: row.reference,
      status: row.status as AdminBookReservationStatus,
      reserved_at: row.reserved_at,
      book_id: row.book_id,
      user_id: row.user_id,
      title: book?.title ?? 'Unknown book',
      author: book?.author ?? 'Unknown author',
      cover_url: book?.cover_url ?? null,
    };
  });
}






export async function updateAdminBookReservationStatus(
  reservationId: string,
  status: 'Approved' | 'Rejected' | 'Returned' | 'Expired',
): Promise<void> {
  const { error } = await supabase.rpc(
    'update_book_reservation_status',
    {
      p_reservation_id: reservationId,
      p_status: status,
    },
  );

  if (error) {
    console.error('BOOK RESERVATION UPDATE ERROR:', error);
    throw new Error(
      `Failed to update book reservation: ${error.message}`,
    );
  }
}


export async function getAdminBookReservationById(
  reservationId: string,
): Promise<AdminBookReservation | null> {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      reference,
      status,
      reserved_at,
      book_id,
      user_id,
      books (
        title,
        author,
        cover_url
      )
    `)
    .eq('id', reservationId)
    .eq('reservation_type', 'BOOK')
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load reservation details: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const book = Array.isArray(data.books)
    ? data.books[0]
    : data.books;

  return {
    id: data.id,
    reference: data.reference,
    status: data.status as AdminBookReservationStatus,
    reserved_at: data.reserved_at,
    book_id: data.book_id,
    user_id: data.user_id,
    title: book?.title ?? 'Unknown book',
    author: book?.author ?? 'Unknown author',
    cover_url: book?.cover_url ?? null,
  };
}

