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
seat?: {
    id: string;
    name: string | null;
    description: string | null;
  } | null;

  room?: {
    id: string;
    name: string | null;
    location: string | null;
    description: string | null;
  } | null;

  bookingDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
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

  let bookingDate: string | null = null;
  let startTime: string | null = null;
  let endTime: string | null = null;

  if (row.reservation_type === 'SEAT') {
    const { data: seatBooking, error: seatError } = await supabase
      .from('seat_bookings')
      .select('date, start_time, end_time')
      .eq('reservation_id', row.id)
      .maybeSingle();

    if (seatError) {
      throw new Error(
        `Failed to fetch seat booking: ${seatError.message}`
      );
    }

    bookingDate = seatBooking?.date ?? null;
    startTime = seatBooking?.start_time ?? null;
    endTime = seatBooking?.end_time ?? null;
  }

  if (row.reservation_type === 'ROOM') {
    const { data: roomBooking, error: roomError } = await supabase
      .from('studyroom_bookings')
      .select('"Date", start_time, end_time')
      .eq('reservation_id', row.id)
      .maybeSingle();

    if (roomError) {
      throw new Error(
        `Failed to fetch room booking: ${roomError.message}`
      );
    }

    bookingDate = roomBooking?.Date ?? null;
    startTime = roomBooking?.start_time ?? null;
    endTime = roomBooking?.end_time ?? null;
  }

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

    seat: row.seats
      ? {
          id: row.seats.id,
          name: row.seats.name,
          description: row.seats.description,
        }
      : null,

    room: row.studyrooms
      ? {
          id: row.studyrooms.id,
          name: row.studyrooms.name,
          location: row.studyrooms.location,
          description: row.studyrooms.description,
        }
      : null,

    bookingDate,
    startTime,
    endTime,
  } as Reservation;
}
/**
 * Modify the current user's reservation.
 */

/**
 * Modify the current user's reservation.
 */
export async function updateReservation(
  reservationId: string,
  updates: {
    reservedAt?: string;
    bookingDate?: string;
    startTime?: string;
    endTime?: string;
  }
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { data: reservation, error: fetchError } = await supabase
    .from('reservations')
    .select('id, reservation_type')
    .eq('id', reservationId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch reservation: ${fetchError.message}`);
  }

  if (!reservation) {
    throw new Error('Reservation not found.');
  }

  if (reservation.reservation_type === 'BOOK') {
    if (!updates.reservedAt) {
      throw new Error('A reservation date is required.');
    }

    const { error } = await supabase
      .from('reservations')
      .update({
        reserved_at: updates.reservedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reservationId)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to update reservation: ${error.message}`);
    }

    return;
  }

  if (!updates.bookingDate || !updates.startTime || !updates.endTime) {
    throw new Error('Booking date, start time, and end time are required.');
  }

  if (updates.endTime <= updates.startTime) {
    throw new Error('End time must be later than start time.');
  }

  const table =
    reservation.reservation_type === 'SEAT'
      ? 'seat_bookings'
      : 'studyroom_bookings';

  const dateColumn =
    reservation.reservation_type === 'SEAT' ? 'date' : 'Date';

  const { data: booking, error: bookingFetchError } = await supabase
    .from(table)
    .select('id')
    .eq('reservation_id', reservationId)
    .maybeSingle();

  if (bookingFetchError) {
    throw new Error(`Failed to fetch booking: ${bookingFetchError.message}`);
  }

  if (!booking) {
    throw new Error('The associated seat or room booking was not found.');
  }

  const bookingUpdates: Record<string, string> = {
    [dateColumn]: updates.bookingDate,
    start_time: updates.startTime,
    end_time: updates.endTime,
  };

  const { error: updateError } = await supabase
    .from(table)
    .update(bookingUpdates)
    .eq('id', booking.id);

  if (updateError) {
    throw new Error(`Failed to update booking: ${updateError.message}`);
  }

  const { error: reservationUpdateError } = await supabase
    .from('reservations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', reservationId)
    .eq('user_id', user.id);

  if (reservationUpdateError) {
    throw new Error(
      `Booking updated, but reservation timestamp failed: ${reservationUpdateError.message}`
    );
  }
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


export async function getAdminReservationById(
  reservationId: string
): Promise<Reservation | null> {
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
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to fetch reservation: ${error.message}`
    );
  }

  if (!data) return null;

  const row: any = data;

  let seat: Reservation['seat'] = null;
  let room: Reservation['room'] = null;
  let bookingDate: string | null = null;
  let startTime: string | null = null;
  let endTime: string | null = null;

  if (row.reservation_type === 'SEAT' && row.seat_id) {
    const { data: seatData, error: seatError } = await supabase
      .from('seats')
      .select('id, name, description')
      .eq('id', row.seat_id)
      .maybeSingle();

    if (seatError) {
      throw new Error(`Failed to fetch seat: ${seatError.message}`);
    }

    seat = seatData;
  }

  if (row.reservation_type === 'SEAT') {
    const { data: booking, error: bookingError } = await supabase
      .from('seat_bookings')
      .select('date, start_time, end_time')
      .eq('reservation_id', row.id)
      .maybeSingle();

    if (bookingError) {
      throw new Error(`Failed to fetch seat booking: ${bookingError.message}`);
    }

    bookingDate = booking?.date ?? null;
    startTime = booking?.start_time ?? null;
    endTime = booking?.end_time ?? null;
  }

  if (row.reservation_type === 'ROOM' && row.room_id) {
    const { data: roomData, error: roomError } = await supabase
      .from('studyrooms')
      .select('id, name, location, description')
      .eq('id', row.room_id)
      .maybeSingle();

    if (roomError) {
      throw new Error(`Failed to fetch room: ${roomError.message}`);
    }

    room = roomData;
  }

  if (row.reservation_type === 'ROOM') {
    const { data: booking, error: bookingError } = await supabase
      .from('studyroom_bookings')
      .select('"Date", start_time, end_time')
      .eq('reservation_id', row.id)
      .maybeSingle();

    if (bookingError) {
      throw new Error(`Failed to fetch room booking: ${bookingError.message}`);
    }

    bookingDate = booking?.Date ?? null;
    startTime = booking?.start_time ?? null;
    endTime = booking?.end_time ?? null;
  }

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
    seat,
    room,
    bookingDate,
    startTime,
    endTime,
  } as Reservation;
}
