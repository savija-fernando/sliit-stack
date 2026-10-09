import { supabase } from '@/lib/supabase';

export type ReservationType = 'BOOK' | 'SEAT' | 'ROOM';

export type ReservationStatus =
  | 'Active'
  | 'Cancelled'
  | 'Completed';

export type Reservation = {
  id: string;
  userId: string;
  reservationType: ReservationType;
  bookId: string | null;
  seatId: string | null;
  roomId: string | null;
  reference: string;
  status: ReservationStatus;
  reservedAt: string;
  createdAt: string;
  updatedAt: string;

  book?: {
    id: string;
    title: string;
    author: string;
    location: string | null;
    coverUrl: string | null;
  } | null;
};

/**
 * Get all reservations belonging to the currently logged-in user.
 */
export async function getMyReservations(): Promise<Reservation[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  console.log('My Reservations - User ID:', user.id);
  console.log('My Reservations - Email:', user.email);

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      user_id,
      reservation_type,
      book_id,
      seat_id,
      room_id,
      reference,
      status,
      reserved_at,
      created_at,
      updated_at
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Reservation fetch error:', error);

    throw new Error(
      `Failed to fetch reservations: ${error.message}`
    );
  }

  console.log('My Reservations - Found:', data?.length ?? 0);
  console.log('My Reservations - Data:', data);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    reservationType: row.reservation_type,
    bookId: row.book_id,
    seatId: row.seat_id,
    roomId: row.room_id,
    reference: row.reference,
    status: row.status,
    reservedAt: row.reserved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    book: null,
  }));
}

/**
 * Get one reservation belonging to the currently logged-in user.
 */
export async function getReservationById(
  reservationId: string
): Promise<Reservation | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      user_id,
      reservation_type,
      book_id,
      seat_id,
      room_id,
      reference,
      status,
      reserved_at,
      created_at,
      updated_at,
      books (
        id,
        title,
        author,
        location,
        cover_url
      )
    `)
    .eq('id', reservationId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to fetch reservation: ${error.message}`
    );
  }

  if (!data) {
    return null;
  }

  const row: any = data;

  return {
    id: row.id,
    userId: row.user_id,
    reservationType: row.reservation_type,
    bookId: row.book_id,
    seatId: row.seat_id,
    roomId: row.room_id,
    reference: row.reference,
    status: row.status,
    reservedAt: row.reserved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    book: row.books
      ? {
          id: row.books.id,
          title: row.books.title,
          author: row.books.author,
          location: row.books.location,
          coverUrl: row.books.cover_url,
        }
      : null,
  };
}
/**
 * Modify the current user's reservation.
 */
export async function updateReservation(
  reservationId: string,
  updates: {
    reservedAt?: string;
  }
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const databaseUpdates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.reservedAt !== undefined) {
    databaseUpdates.reserved_at = updates.reservedAt;
  }

  const { data, error } = await supabase
    .from('reservations')
    .update(databaseUpdates)
    .eq('id', reservationId)
    .eq('user_id', user.id)
    .select('id, reserved_at, updated_at')
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to update reservation: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Reservation was not updated. Make sure you are updating your own reservation.'
    );
  }

  console.log('Reservation successfully updated:', data);
}

/**
 * Cancel the current user's reservation.
 */
export async function cancelReservation(
  reservationId: string
): Promise<void> {

  console.log('🚨 cancelReservation() CALLED');
  console.log('🚨 Reservation ID:', reservationId);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('🚨 Current user:', user?.id);

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { data, error } = await supabase.rpc(
    'cancel_reservation',
    {
      p_reservation_id: reservationId,
    }
  );

  console.log('🚨 RPC DATA:', data);
  console.log('🚨 RPC ERROR:', error);
  console.log('🚨 CANCELLATION RESULT:', { data, error });

  if (error) {
    throw new Error(
      `Failed to cancel reservation: ${error.message}`
    );
  }
}