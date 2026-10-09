
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
  university_id: string;
  title: string;
  author: string;
  cover_url: string | null;
};

export type AdminSeatReservation = {
  id: string;
  reference: string;
  status: string;
  reserved_at: string | null;
  seat_id: string | null;
  seat_name: string;
  user_id: string;
  university_id: string;
};

// Fetch university IDs for multiple students.
async function getUniversityIds(
  userIds: string[],
): Promise<Record<string, string>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];

  if (uniqueIds.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, university_id')
    .in('id', uniqueIds);

  if (error) {
    throw new Error(
      `Failed to load student university IDs: ${error.message}`,
    );
  }

  return Object.fromEntries(
    (data ?? []).map((profile) => [
      profile.id,
      profile.university_id ?? 'Not available',
    ]),
  );
}

// Fetch all book reservations.
export async function getAdminBookReservations(): Promise<
  AdminBookReservation[]
> {
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
    throw new Error(
      `Failed to load book reservations: ${error.message}`,
    );
  }

  const rows = data ?? [];

  const bookIds = [
    ...new Set(rows.map((row) => row.book_id).filter(Boolean)),
  ];

  let booksById: Record<
    string,
    { title: string; author: string; cover_url: string | null }
  > = {};

  if (bookIds.length > 0) {
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, title, author, cover_url')
      .in('id', bookIds);

    if (booksError) {
      throw new Error(
        `Failed to load reserved books: ${booksError.message}`,
      );
    }

    booksById = Object.fromEntries(
      (books ?? []).map((book) => [book.id, book]),
    );
  }

  const universityIds = await getUniversityIds(
    rows.map((row) => row.user_id),
  );

  return rows.map((row) => {
    const book = row.book_id
      ? booksById[row.book_id]
      : undefined;

    return {
      id: row.id,
      reference: row.reference,
      status: row.status as AdminBookReservationStatus,
      reserved_at: row.reserved_at,
      book_id: row.book_id,
      user_id: row.user_id,
      university_id:
        universityIds[row.user_id] ?? 'Not available',
      title: book?.title ?? 'Unknown book',
      author: book?.author ?? 'Unknown author',
      cover_url: book?.cover_url ?? null,
    };
  });
}

// Update book reservation status.
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

// Fetch one book reservation.
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

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('university_id')
    .eq('id', data.user_id)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      `Failed to load student university ID: ${profileError.message}`,
    );
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
    university_id: profile?.university_id ?? 'Not available',
    title: book?.title ?? 'Unknown book',
    author: book?.author ?? 'Unknown author',
    cover_url: book?.cover_url ?? null,
  };
}

// Fetch all seat reservations.
export async function getAdminSeatReservations(): Promise<
  AdminSeatReservation[]
> {
  const { data, error } = await supabase
    .from('reservations')
    .select('id, reference, status, reserved_at, seat_id, user_id')
    .eq('reservation_type', 'SEAT')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to load seat reservations: ${error.message}`,
    );
  }

  const rows = data ?? [];

  const seatIds = [
    ...new Set(
      rows
        .map((row) => row.seat_id)
        .filter((id): id is string => id !== null),
    ),
  ];

  let seatNames: Record<string, string> = {};

  if (seatIds.length > 0) {
    const { data: seats, error: seatsError } = await supabase
      .from('seats')
      .select('id, name')
      .in('id', seatIds);

    if (seatsError) {
      throw new Error(
        `Failed to load seat names: ${seatsError.message}`,
      );
    }

    seatNames = Object.fromEntries(
      (seats ?? []).map((seat) => [
        seat.id,
        seat.name ?? 'Unnamed Seat',
      ]),
    );
  }

  const universityIds = await getUniversityIds(
    rows.map((row) => row.user_id),
  );

  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    status: row.status,
    reserved_at: row.reserved_at,
    seat_id: row.seat_id,
    seat_name: row.seat_id
      ? seatNames[row.seat_id] ?? 'Unknown Seat'
      : 'Unknown Seat',
    user_id: row.user_id,
    university_id:
      universityIds[row.user_id] ?? 'Not available',
  }));
}

// Fetch one seat reservation.
export async function getAdminSeatReservationById(
  reservationId: string,
): Promise<AdminSeatReservation | null> {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      reference,
      status,
      reserved_at,
      seat_id,
      user_id
    `)
    .eq('id', reservationId)
    .eq('reservation_type', 'SEAT')
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load seat reservation: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('university_id')
    .eq('id', data.user_id)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      `Failed to load student university ID: ${profileError.message}`,
    );
  }

  let seatName = 'Unknown Seat';

  if (data.seat_id) {
    const { data: seat, error: seatError } = await supabase
      .from('seats')
      .select('name')
      .eq('id', data.seat_id)
      .maybeSingle();

    if (seatError) {
      throw new Error(
        `Failed to load seat name: ${seatError.message}`,
      );
    }

    seatName = seat?.name ?? 'Unknown Seat';
  }

  return {
    id: data.id,
    reference: data.reference,
    status: data.status,
    reserved_at: data.reserved_at,
    seat_id: data.seat_id,
    seat_name: seatName,
    user_id: data.user_id,
    university_id:
      profile?.university_id ?? 'Not available',
  };
}

// Update seat reservation status.
export async function updateAdminSeatReservationStatus(
  reservationId: string,
  status: 'Approved' | 'Rejected',
): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reservationId)
    .eq('reservation_type', 'SEAT');

  if (error) {
    throw new Error(
      `Failed to update seat reservation: ${error.message}`,
    );
  }
}
