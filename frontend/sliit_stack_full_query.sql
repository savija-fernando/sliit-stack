SELECT * FROM public.books;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'books'
ORDER BY ordinal_position;

GRANT SELECT ON TABLE public.books TO authenticated;


SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'books';


SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'books'
ORDER BY grantee, privilege_type;

SELECT
  u.id,
  u.email,
  p.role
FROM auth.users AS u
LEFT JOIN public.profiles AS p ON p.id = u.id;

SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'books'
  AND grantee IN ('anon', 'authenticated');










  INSERT INTO public.books (
  title,
  author,
  genre,
  isbn,
  description,
  cover_url,
  location,
  status,
  total_copies,
  available_copies
)
VALUES (
  'React Native',
  'Robert C. Martin',
  'Academic',
  '9780132350884',
  'A handbook of agile software craftsmanship.',
  'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL.jpg',
  'Library - Floor 1',
  'Available',
  3,
  3
);



CREATE OR REPLACE FUNCTION public.cancel_reservation(
  p_reservation_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_book_id uuid;
  v_reservation_type text;
  v_status text;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be logged in.';
  END IF;

  -- Get the user's reservation
  SELECT
    reservation_type,
    book_id,
    status
  INTO
    v_reservation_type,
    v_book_id,
    v_status
  FROM public.reservations
  WHERE id = p_reservation_id
    AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found.';
  END IF;

  IF v_status = 'Cancelled' THEN
    RAISE EXCEPTION 'This reservation is already cancelled.';
  END IF;

  -- Cancel the reservation
  UPDATE public.reservations
  SET
    status = 'Cancelled',
    updated_at = now()
  WHERE id = p_reservation_id
    AND user_id = v_user_id;

  -- If it is a book reservation,
  -- make the book available again.
  IF v_reservation_type = 'BOOK'
     AND v_book_id IS NOT NULL THEN

    UPDATE public.books
    SET
      status = 'Available',
      available_copies = 1,
      updated_at = now()
    WHERE id = v_book_id
      AND status = 'Reserved';
  END IF;
END;
$$;



GRANT EXECUTE
ON FUNCTION public.cancel_reservation(uuid)
TO authenticated;


SELECT
  routine_name,
  routine_schema
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'cancel_reservation';


  SELECT
  has_function_privilege(
    'authenticated',
    'public.cancel_reservation(uuid)',
    'EXECUTE'
  );



  SELECT
  id,
  reference,
  user_id,
  reservation_type,
  book_id,
  status
FROM public.reservations
WHERE user_id = 'c7c331bb-5e3c-4c8e-8ad1-03b5ce18dc3c'
ORDER BY created_at DESC;



CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id uuid NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  reservation_id uuid
    REFERENCES public.reservations(id)
    ON DELETE CASCADE,

  type text NOT NULL DEFAULT 'RESERVATION',

  message text NOT NULL,

  read boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

GRANT SELECT, UPDATE
ON public.notifications
TO authenticated;


CREATE OR REPLACE FUNCTION public.create_reservation_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_book_title text;
  v_message text;
BEGIN

  IF NEW.reservation_type = 'BOOK' AND NEW.book_id IS NOT NULL THEN

    SELECT title
    INTO v_book_title
    FROM public.books
    WHERE id = NEW.book_id;

    v_message :=
      'Your reservation for ' ||
      COALESCE(v_book_title, 'the book') ||
      ' has been confirmed.';

  ELSIF NEW.reservation_type = 'SEAT' THEN

    v_message :=
      'Your seat reservation has been confirmed.';

  ELSIF NEW.reservation_type = 'ROOM' THEN

    v_message :=
      'Your room reservation has been confirmed.';

  ELSE

    v_message :=
      'Your reservation has been confirmed.';

  END IF;

  INSERT INTO public.notifications (
    user_id,
    reservation_id,
    type,
    message,
    read
  )
  VALUES (
    NEW.user_id,
    NEW.id,
    'RESERVATION',
    v_message,
    false
  );

  RETURN NEW;
END;
$$;



DROP TRIGGER IF EXISTS reservation_created_notification
ON public.reservations;

CREATE TRIGGER reservation_created_notification
AFTER INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.create_reservation_notification();


SELECT *
FROM public.profiles
LIMIT 5;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;


SELECT
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';




  SELECT
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND event_object_table = 'users';



  SELECT pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'handle_new_user'
  AND n.nspname = 'public';



  
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS university_id TEXT UNIQUE;




CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    university_id
  )
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    'student',
    NULLIF(
      new.raw_user_meta_data ->> 'university_id',
      ''
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$function$;




SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    table_name ILIKE '%reserv%'
    OR table_name ILIKE '%book%'
  )
ORDER BY table_name, ordinal_position;


SELECT pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'reserve_book'
  AND n.nspname = 'public';



  SELECT
  id,
  user_id,
  book_id,
  reference,
  reservation_type,
  status,
  created_at
FROM public.reservations
ORDER BY created_at DESC;





SELECT
  reservation_type,
  status,

  COUNT(*) AS total
FROM public.reservations
GROUP BY reservation_type, status
ORDER BY reservation_type, status;





SELECT
  r.id,
  r.reference,
  r.status,
  b.title AS book_title
FROM public.reservations r
LEFT JOIN public.books b
  ON b.id = r.book_id
WHERE r.reservation_type = 'BOOK'
ORDER BY r.created_at DESC;


SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'reservations'
  AND privilege_type = 'SELECT';



SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;



SELECT
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;



SELECT DISTINCT role
FROM public.profiles
ORDER BY role;


CREATE POLICY "Staff can view all reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'staff'
  )
);




CREATE POLICY "Staff can update all reservations"
ON public.reservations
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'staff'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'staff'
  )
);




SELECT
  conname,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.reservations'::regclass
  AND conname = 'reservations_status_check';



  ALTER TABLE public.reservations
DROP CONSTRAINT reservations_status_check;

ALTER TABLE public.reservations
ADD CONSTRAINT reservations_status_check
CHECK (
  status IN (
    'Active',
    'Cancelled',
    'Completed',
    'Approved',
    'Rejected',
    'Returned',
    'Expired'
  )
);



SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'books'
ORDER BY ordinal_position;



SELECT pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = 'reserve_book';


  SELECT
  id,
  title,
  status,
  total_copies,
  available_copies
FROM public.books
ORDER BY title;



SELECT
  b.title,
  b.total_copies,
  b.available_copies,
  r.status AS reservation_status,
  COUNT(r.id) AS reservation_count
FROM public.books b
LEFT JOIN public.reservations r
  ON r.book_id = b.id
  AND r.reservation_type = 'BOOK'
  AND r.status IN ('Active', 'Approved')
GROUP BY
  b.id,
  b.title,
  b.total_copies,
  b.available_copies,
  r.status
ORDER BY b.title;




SELECT
  b.title,
  r.id AS reservation_id,
  r.reference,
  r.status,
  r.reserved_at,
  r.updated_at
FROM public.books b
LEFT JOIN public.reservations r
  ON r.book_id = b.id
  AND r.reservation_type = 'BOOK'
WHERE b.title IN ('React Native', 'The Hobbit')
ORDER BY b.title, r.created_at DESC;









CREATE OR REPLACE FUNCTION public.update_book_reservation_status(
  p_reservation_id uuid,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_book_id uuid;
  v_current_status text;
  v_available_copies integer;
  v_total_copies integer;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'staff'
  ) THEN
    RAISE EXCEPTION 'Only staff can update book reservations.';
  END IF;

  IF p_status NOT IN ('Approved', 'Rejected', 'Returned', 'Expired') THEN
    RAISE EXCEPTION 'Invalid reservation status.';
  END IF;

  SELECT book_id, status
  INTO v_book_id, v_current_status
  FROM public.reservations
  WHERE id = p_reservation_id
    AND reservation_type = 'BOOK'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book reservation not found.';
  END IF;

  IF v_current_status = p_status THEN
    RETURN;
  END IF;

  IF v_current_status IN ('Rejected', 'Returned', 'Expired', 'Cancelled') THEN
    RAISE EXCEPTION 'This reservation is already closed.';
  END IF;

  IF p_status IN ('Rejected', 'Expired') THEN
    SELECT available_copies, total_copies
    INTO v_available_copies, v_total_copies
    FROM public.books
    WHERE id = v_book_id
    FOR UPDATE;

    UPDATE public.books
    SET
      available_copies = LEAST(
        COALESCE(v_available_copies, 0) + 1,
        v_total_copies
      ),
      status = CASE
        WHEN LEAST(
          COALESCE(v_available_copies, 0) + 1,
          v_total_copies
        ) > 0 THEN 'Available'
        ELSE 'Reserved'
      END,
      updated_at = now()
    WHERE id = v_book_id;
  END IF;

  UPDATE public.reservations
  SET status = p_status,
      updated_at = now()
  WHERE id = p_reservation_id
    AND reservation_type = 'BOOK';
END;
$function$;



SELECT
  r.id AS reservation_id,
  r.reference,
  r.status AS reservation_status,
  b.title AS book_title,
  b.total_copies,
  b.available_copies,
  b.status AS book_status
FROM public.reservations r
JOIN public.books b ON b.id = r.book_id
WHERE r.reservation_type = 'BOOK'
ORDER BY r.created_at DESC
LIMIT 10;


SELECT pg_get_functiondef(
  'public.update_book_reservation_status(uuid,text)'::regprocedure
);




CREATE OR REPLACE FUNCTION public.update_book_reservation_status(
  p_reservation_id uuid,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_book_id uuid;
  v_current_status text;
  v_available_copies integer;
  v_total_copies integer;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'staff'
  ) THEN
    RAISE EXCEPTION 'Only staff can update book reservations.';
  END IF;

  IF p_status NOT IN ('Approved', 'Rejected', 'Returned', 'Expired') THEN
    RAISE EXCEPTION 'Invalid reservation status.';
  END IF;

  SELECT book_id, status
  INTO v_book_id, v_current_status
  FROM public.reservations
  WHERE id = p_reservation_id
    AND reservation_type = 'BOOK'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book reservation not found.';
  END IF;

  IF v_current_status = p_status THEN
    RETURN;
  END IF;

  IF v_current_status IN (
    'Rejected', 'Returned', 'Expired', 'Cancelled'
  ) THEN
    RAISE EXCEPTION 'This reservation is already closed.';
  END IF;

  IF p_status = 'Rejected' AND v_current_status <> 'Active' THEN
    RAISE EXCEPTION 'Only pending reservations can be rejected.';
  END IF;

  IF p_status = 'Expired' AND v_current_status <> 'Active' THEN
    RAISE EXCEPTION 'Only pending reservations can expire.';
  END IF;

  IF p_status = 'Returned' AND v_current_status <> 'Approved' THEN
    RAISE EXCEPTION 'Only approved reservations can be returned.';
  END IF;

  IF p_status = 'Rejected' THEN
    SELECT available_copies, total_copies
    INTO v_available_copies, v_total_copies
    FROM public.books
    WHERE id = v_book_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Book not found.';
    END IF;

    UPDATE public.books
    SET
      available_copies = LEAST(
        COALESCE(v_available_copies, 0) + 1,
        COALESCE(v_total_copies, 0)
      ),
      status = CASE
        WHEN LEAST(
          COALESCE(v_available_copies, 0) + 1,
          COALESCE(v_total_copies, 0)
        ) > 0 THEN 'Available'
        ELSE 'Reserved'
      END,
      updated_at = now()
    WHERE id = v_book_id;
  END IF;

  UPDATE public.reservations
  SET status = p_status,
      updated_at = now()
  WHERE id = p_reservation_id
    AND reservation_type = 'BOOK';
END;
$function$;



SELECT
  id,
  reference,
  status,
  book_id
FROM public.reservations
WHERE reservation_type = 'BOOK'
  AND status = 'Active'
ORDER BY created_at DESC;





CREATE OR REPLACE FUNCTION public.update_book_reservation_status(
  p_reservation_id uuid,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_book_id uuid;
  v_current_status text;
  v_available_copies integer;
  v_total_copies integer;
  v_new_available integer;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'staff'
  ) THEN
    RAISE EXCEPTION 'Only staff can update book reservations.';
  END IF;

  IF p_status NOT IN ('Approved', 'Rejected', 'Returned', 'Expired') THEN
    RAISE EXCEPTION 'Invalid reservation status.';
  END IF;

  SELECT book_id, status
  INTO v_book_id, v_current_status
  FROM public.reservations
  WHERE id = p_reservation_id
    AND reservation_type = 'BOOK'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book reservation not found.';
  END IF;

  IF v_current_status = p_status THEN
    RETURN;
  END IF;

  IF v_current_status IN ('Rejected', 'Returned', 'Expired', 'Cancelled') THEN
    RAISE EXCEPTION 'This reservation is already closed.';
  END IF;

  IF p_status = 'Rejected' AND v_current_status <> 'Active' THEN
    RAISE EXCEPTION 'Only pending reservations can be rejected.';
  END IF;

  IF p_status = 'Expired' AND v_current_status <> 'Active' THEN
    RAISE EXCEPTION 'Only pending reservations can expire.';
  END IF;

  IF p_status = 'Returned' AND v_current_status <> 'Approved' THEN
    RAISE EXCEPTION 'Only approved reservations can be returned.';
  END IF;

  IF p_status IN ('Rejected', 'Returned') THEN
    SELECT available_copies, total_copies
    INTO v_available_copies, v_total_copies
    FROM public.books
    WHERE id = v_book_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Book not found.';
    END IF;

    v_new_available := LEAST(
      COALESCE(v_available_copies, 0) + 1,
      COALESCE(v_total_copies, 0)
    );

    UPDATE public.books
    SET available_copies = v_new_available,
        status = CASE
          WHEN v_new_available > 0 THEN 'Available'
          ELSE 'Reserved'
        END,
        updated_at = now()
    WHERE id = v_book_id;
  END IF;

  UPDATE public.reservations
  SET status = p_status,
      updated_at = now()
  WHERE id = p_reservation_id
    AND reservation_type = 'BOOK';
END;
$function$;



SELECT
  r.reference,
  r.status AS reservation_status,
  b.title,
  b.total_copies,
  b.available_copies,
  b.status AS book_status
FROM public.reservations r
JOIN public.books b ON b.id = r.book_id
WHERE r.reservation_type = 'BOOK'
  AND r.status = 'Returned'
ORDER BY r.updated_at DESC
LIMIT 5;



SELECT
  id,
  title,
  total_copies,
  available_copies,
  status
FROM public.books
WHERE title = 'React Native';



UPDATE public.books
SET
  available_copies = 3,
  status = 'Available',
  updated_at = now()
WHERE id = '239e27a7-4fa6-4c15-9c27-ff980361ea84'
  AND available_copies = 1
  AND total_copies = 3;



  SELECT pg_get_functiondef(
  'public.cancel_reservation(uuid)'::regprocedure
);







CREATE OR REPLACE FUNCTION public.cancel_reservation(
  p_reservation_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_book_id uuid;
  v_reservation_type text;
  v_status text;
  v_available_copies integer;
  v_total_copies integer;
  v_new_available integer;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be logged in.';
  END IF;

  SELECT reservation_type, book_id, status
  INTO v_reservation_type, v_book_id, v_status
  FROM public.reservations
  WHERE id = p_reservation_id
    AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found.';
  END IF;

  IF v_status <> 'Active' THEN
    RAISE EXCEPTION 'Only active reservations can be cancelled.';
  END IF;

  IF v_reservation_type = 'BOOK' AND v_book_id IS NOT NULL THEN
    SELECT available_copies, total_copies
    INTO v_available_copies, v_total_copies
    FROM public.books
    WHERE id = v_book_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Book not found.';
    END IF;

    v_new_available := LEAST(
      COALESCE(v_available_copies, 0) + 1,
      COALESCE(v_total_copies, 0)
    );

    UPDATE public.books
    SET available_copies = v_new_available,
        status = CASE
          WHEN v_new_available > 0 THEN 'Available'
          ELSE 'Reserved'
        END,
        updated_at = now()
    WHERE id = v_book_id;
  END IF;

  UPDATE public.reservations
  SET status = 'Cancelled',
      updated_at = now()
  WHERE id = p_reservation_id
    AND user_id = v_user_id;
END;
$function$;




SELECT
  b.title,
  b.total_copies,
  b.available_copies,
  b.status
FROM public.books b
JOIN public.reservations r ON r.book_id = b.id
WHERE r.reference = 'BR-1044';



SELECT pg_get_functiondef(
  'public.cancel_reservation(uuid)'::regprocedure
);



SELECT
  r.reference,
  r.status AS reservation_status,
  b.title,
  b.total_copies,
  b.available_copies
FROM public.reservations r
JOIN public.books b ON b.id = r.book_id
WHERE r.reservation_type = 'BOOK'
  AND r.status = 'Cancelled'
ORDER BY r.updated_at DESC
LIMIT 5;





CREATE OR REPLACE FUNCTION public.update_book_reservation_status(
  p_reservation_id uuid,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_book_id uuid;
  v_reference text;
  v_book_title text;
  v_current_status text;
  v_available_copies integer;
  v_total_copies integer;
  v_new_available integer;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'staff'
  ) THEN
    RAISE EXCEPTION 'Only staff can update book reservations.';
  END IF;

  IF p_status NOT IN ('Approved', 'Rejected', 'Returned', 'Expired') THEN
    RAISE EXCEPTION 'Invalid reservation status.';
  END IF;

  SELECT user_id, book_id, reference, status
  INTO v_user_id, v_book_id, v_reference, v_current_status
  FROM public.reservations
  WHERE id = p_reservation_id
    AND reservation_type = 'BOOK'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book reservation not found.';
  END IF;

  IF v_current_status = p_status THEN
    RETURN;
  END IF;

  IF v_current_status IN ('Rejected', 'Returned', 'Expired', 'Cancelled') THEN
    RAISE EXCEPTION 'This reservation is already closed.';
  END IF;

  IF p_status = 'Rejected' AND v_current_status <> 'Active' THEN
    RAISE EXCEPTION 'Only pending reservations can be rejected.';
  END IF;

  IF p_status = 'Expired' AND v_current_status <> 'Active' THEN
    RAISE EXCEPTION 'Only pending reservations can expire.';
  END IF;

  IF p_status = 'Returned' AND v_current_status <> 'Approved' THEN
    RAISE EXCEPTION 'Only approved reservations can be returned.';
  END IF;

  IF p_status IN ('Rejected', 'Returned') THEN
    SELECT available_copies, total_copies
    INTO v_available_copies, v_total_copies
    FROM public.books
    WHERE id = v_book_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Book not found.';
    END IF;

    v_new_available := LEAST(
      COALESCE(v_available_copies, 0) + 1,
      COALESCE(v_total_copies, 0)
    );

    UPDATE public.books
    SET available_copies = v_new_available,
        status = CASE
          WHEN v_new_available > 0 THEN 'Available'
          ELSE 'Reserved'
        END,
        updated_at = now()
    WHERE id = v_book_id;
  END IF;

  UPDATE public.reservations
  SET status = p_status,
      updated_at = now()
  WHERE id = p_reservation_id
    AND reservation_type = 'BOOK';

  IF p_status = 'Rejected' THEN
    SELECT title
    INTO v_book_title
    FROM public.books
    WHERE id = v_book_id;

    INSERT INTO public.notifications (
      user_id,
      message,
      type,
      read,
      reservation_id
    )
    VALUES (
      v_user_id,
      'Your reservation for "' || COALESCE(v_book_title, 'a book')
        || '" (' || v_reference || ') has been rejected.',
      'reservation_rejected',
      false,
      p_reservation_id
    );
  END IF;
END;
$function$;






SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
      'reservations',
      'seat_bookings',
      'seats',
      'studyroom_bookings',
      'studyrooms'
  )
ORDER BY table_name, ordinal_position;






-- Check foreign keys for the booking-related tables
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON tc.constraint_name = ccu.constraint_name
   AND tc.constraint_schema = ccu.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
      'reservations',
      'seat_bookings',
      'studyroom_bookings'
  )
ORDER BY tc.table_name, kcu.column_name;




SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column,
  tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
  AND tc.constraint_schema = ccu.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'reservations',
    'seat_bookings',
    'studyroom_bookings'
  )
ORDER BY tc.table_name, kcu.column_name;





SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('seat_bookings', 'studyroom_bookings')
ORDER BY table_name, ordinal_position;




SELECT
  'seat_bookings' AS table_name,
  COUNT(*) AS total_rows
FROM public.seat_bookings

UNION ALL

SELECT
  'studyroom_bookings' AS table_name,
  COUNT(*) AS total_rows
FROM public.studyroom_bookings;






SELECT
  'seat_bookings' AS source_table,
  to_jsonb(sb) AS booking_record
FROM public.seat_bookings sb

UNION ALL

SELECT
  'studyroom_bookings' AS source_table,
  to_jsonb(rb) AS booking_record
FROM public.studyroom_bookings rb;




SELECT
  id,
  user_id,
  reservation_type,
  book_id,
  seat_id,
  room_id,
  reference,
  status,
  reserved_at
FROM public.reservations
ORDER BY created_at DESC;






SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'reservations',
    'seat_bookings',
    'studyroom_bookings'
  )
  AND column_name IN (
    'id',
    'user_id',
    'reservation_id',
    'seat_id',
    'study_room_id',
    'room_id',
    'reference',
    'status',
    'is-active'
  )
ORDER BY table_name, ordinal_position;






SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
  AND tc.constraint_schema = ccu.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND (
    (tc.table_name = 'seat_bookings'
      AND kcu.column_name = 'seat_id')
    OR
    (tc.table_name = 'studyroom_bookings'
      AND kcu.column_name = 'study_room_id')
    OR
    (tc.table_name = 'reservations'
      AND kcu.column_name IN ('seat_id', 'room_id'))
  )
ORDER BY tc.table_name, kcu.column_name;





SELECT pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = 'create_reservation_notification';





SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('seat_bookings', 'studyroom_bookings')
ORDER BY table_name, ordinal_position;




ALTER TABLE public.seat_bookings
  ADD COLUMN reservation_id uuid
  REFERENCES public.reservations(id) ON DELETE SET NULL;

ALTER TABLE public.studyroom_bookings
  ADD COLUMN reservation_id uuid
  REFERENCES public.reservations(id) ON DELETE SET NULL;






SELECT
  r.id AS reservation_id,
  r.reservation_type,
  r.reference,
  r.status AS reservation_status,
  sb.id AS seat_booking_id,
  sb.seat_id,
  sb.date,
  sb.reservation_id AS linked_reservation_id
FROM public.reservations r
JOIN public.seat_bookings sb
  ON sb.reservation_id = r.id
WHERE r.reservation_type = 'SEAT'
ORDER BY sb.created_at DESC
LIMIT 5;




SELECT
  r.id AS reservation_id,
  r.reservation_type,
  r.reference,
  r.status AS reservation_status,
  rb.id AS room_booking_id,
  rb.study_room_id,
  rb."Date" AS booking_date,
  rb.reservation_id AS linked_reservation_id
FROM public.reservations r
JOIN public.studyroom_bookings rb
  ON rb.reservation_id = r.id
WHERE r.reservation_type = 'ROOM'
ORDER BY rb.created_at DESC
LIMIT 5;





SELECT
  r.id AS reservation_id,
  r.user_id AS reservation_user_id,
  p.id AS profile_id,
  p.university_id
FROM public.reservations r
LEFT JOIN public.profiles p
  ON p.id = r.user_id
WHERE r.reservation_type IN ('BOOK', 'SEAT')
ORDER BY r.created_at DESC
LIMIT 10;



SELECT
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';



  SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;



SELECT DISTINCT role
FROM public.profiles
ORDER BY role;


CREATE POLICY "Staff can view student profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  role = 'student'
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS staff_profile
    WHERE staff_profile.id = (SELECT auth.uid())
      AND staff_profile.role = 'staff'
  )
);



-- Remove the policy that caused recursion
DROP POLICY IF EXISTS "Staff can view student profiles"
ON public.profiles;

-- Create a secure helper that checks the staff role
CREATE OR REPLACE FUNCTION public.is_staff_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'staff'
  );
$$;

-- Allow authenticated users to call the helper
REVOKE ALL ON FUNCTION public.is_staff_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff_user() TO authenticated;

-- Allow staff to read student profiles
CREATE POLICY "Staff can view student profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  role = 'student'
  AND public.is_staff_user()
);




SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'seat_bookings',
    'studyroom_bookings'
  )
ORDER BY table_name, ordinal_position;




-- Check seat reservation records
SELECT
  date,
  start_time,
  end_time,
  "is-active",
  seat_id,
  reservation_id
FROM public.seat_bookings
ORDER BY date DESC, start_time DESC
LIMIT 10;

-- Check study room reservation records
SELECT
  "Date",
  start_time,
  end_time,
  status,
  study_room_id,
  reservation_id
FROM public.studyroom_bookings
ORDER BY "Date" DESC, start_time DESC
LIMIT 10;





SELECT
  date,
  start_time,
  end_time,
  "is-active",
  seat_id,
  reservation_id
FROM public.seat_bookings
ORDER BY date DESC, start_time DESC
LIMIT 10;





CREATE OR REPLACE FUNCTION public.expire_finished_space_bookings()
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Expire finished seat bookings.
  UPDATE public.seat_bookings
  SET "is-active" = false
  WHERE "is-active" = true
    AND (date + end_time)
        < (now() AT TIME ZONE 'Asia/Colombo');

  -- Expire finished study room bookings.
  UPDATE public.studyroom_bookings
  SET status = 'expired'
  WHERE lower(status) = 'active'
    AND ("Date" + end_time)
        < (now() AT TIME ZONE 'Asia/Colombo');
END;
$$;




SELECT
  extname,
  extversion
FROM pg_extension
WHERE extname IN ('pg_cron', 'pg_net');



SELECT extname, extversion
FROM pg_extension
WHERE extname = 'pg_cron';

