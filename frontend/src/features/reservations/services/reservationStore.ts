import type {
  ReservationRecord,
  ReservationStatus,
} from '@/features/reservations/types/reservation';

let reservations: ReservationRecord[] = [
  // BOOK RESERVATIONS
  {
    id: 'B123S45091',
    title: 'Introduction to Programming',
    studentId: 'IT23546789',
    studentName: 'J.C.P Jayasooriya',
    dateText: '30th August 2026',
    status: 'pending',
    kind: 'book',

    author: 'J.H Bernard',
    published: '21st June 2016',
    reservedOn: '30th August 2026 - 10.15am',
    pickupDate: '31st August 2026',
    dueDate: '07th September 2026',
  },

  {
    id: 'B123S45092',
    title: 'Fundamentals of Human Resource',
    studentId: 'IT23539068',
    studentName: 'A.L.S Silva',
    dateText: '07th September 2026',
    status: 'pending',
    kind: 'book',

    author: 'Library Collection',
    published: 'Not specified',
    reservedOn: '07th September 2026 - 09.30am',
    pickupDate: '08th September 2026',
    dueDate: '15th September 2026',
  },

  {
    id: 'B123S45093',
    title: 'Basics of DevOPS',
    studentId: 'IT23445489',
    studentName: 'Nimmaka K.A.T.R',
    dateText: '07th September 2026',
    status: 'pending',
    kind: 'book',

    author: 'Library Collection',
    published: 'Not specified',
    reservedOn: '07th September 2026 - 01.20pm',
    pickupDate: '08th September 2026',
    dueDate: '15th September 2026',
  },

  {
    id: 'B123S45094',
    title: 'Human Biology',
    studentId: 'IT23456789',
    studentName: 'J.C.P Jayasooriya',
    dateText: '08th September 2026',
    status: 'pending',
    kind: 'book',

    author: 'Library Collection',
    published: 'Not specified',
    reservedOn: '08th September 2026 - 11.10am',
    pickupDate: '09th September 2026',
    dueDate: '16th September 2026',
  },

  {
    id: 'B123S45095',
    title: 'Database Systems',
    studentId: 'IT23542111',
    studentName: 'M.K. Fernando',
    dateText: '09th September 2026',
    status: 'approved',
    kind: 'book',

    author: 'Library Collection',
    published: 'Not specified',
    reservedOn: '09th September 2026 - 08.45am',
    pickupDate: '10th September 2026',
    dueDate: '17th September 2026',
  },

  {
    id: 'B123S45096',
    title: 'Software Engineering',
    studentId: 'IT23540011',
    studentName: 'S.N. Perera',
    dateText: '09th September 2026',
    status: 'rejected',
    kind: 'book',

    author: 'Library Collection',
    published: 'Not specified',
    reservedOn: '09th September 2026 - 02.05pm',
    pickupDate: '10th September 2026',
    dueDate: '17th September 2026',
  },

  // SEAT RESERVATIONS
  {
    id: 'S123S45001',
    title: 'Library Seat A-12',
    studentId: 'IT23540112',
    studentName: 'K.D. Perera',
    dateText: '10th September 2026',
    status: 'pending',
    kind: 'seat',

    // Temporary reuse of existing fields
    author: 'Main Library - Level 01',
    published: '09:00 AM - 11:00 AM',
    reservedOn: '09th September 2026 - 03.15pm',
    pickupDate: '10th September 2026',
    dueDate: '11:00 AM',
  },

  {
    id: 'S123S45002',
    title: 'Library Seat B-07',
    studentId: 'IT23539068',
    studentName: 'A.L.S Silva',
    dateText: '10th September 2026',
    status: 'pending',
    kind: 'seat',

    author: 'Main Library - Level 02',
    published: '01:00 PM - 03:00 PM',
    reservedOn: '09th September 2026 - 04.05pm',
    pickupDate: '10th September 2026',
    dueDate: '03:00 PM',
  },

  {
    id: 'S123S45003',
    title: 'Study Area Seat C-15',
    studentId: 'IT23445489',
    studentName: 'Nimmaka K.A.T.R',
    dateText: '11th September 2026',
    status: 'pending',
    kind: 'seat',

    author: 'Study Area - Level 03',
    published: '10:00 AM - 12:00 PM',
    reservedOn: '10th September 2026 - 08.30am',
    pickupDate: '11th September 2026',
    dueDate: '12:00 PM',
  },

  {
    id: 'S123S45004',
    title: 'Library Seat D-04',
    studentId: 'IT23548821',
    studentName: 'R.M. Fernando',
    dateText: '11th September 2026',
    status: 'approved',
    kind: 'seat',

    author: 'Main Library - Level 01',
    published: '02:00 PM - 04:00 PM',
    reservedOn: '10th September 2026 - 09.40am',
    pickupDate: '11th September 2026',
    dueDate: '04:00 PM',
  },

  {
    id: 'S123S45005',
    title: 'Study Area Seat A-09',
    studentId: 'IT23543301',
    studentName: 'S.N. Perera',
    dateText: '12th September 2026',
    status: 'rejected',
    kind: 'seat',

    author: 'Study Area - Level 02',
    published: '08:00 AM - 10:00 AM',
    reservedOn: '11th September 2026 - 10.20am',
    pickupDate: '12th September 2026',
    dueDate: '10:00 AM',
  },

  {
    id: 'S123S45006',
    title: 'Library Seat C-02',
    studentId: 'IT23541235',
    studentName: 'D.M. Silva',
    dateText: '12th September 2026',
    status: 'expired',
    kind: 'seat',

    author: 'Main Library - Level 02',
    published: '11:00 AM - 01:00 PM',
    reservedOn: '11th September 2026 - 01.10pm',
    pickupDate: '12th September 2026',
    dueDate: '01:00 PM',
    },
];

export function getReservations() {
  return reservations.map(
    (reservation) => ({
      ...reservation,
    }),
  );
}

export function getReservationById(
  id: string,
) {
  const reservation =
    reservations.find(
      (item) => item.id === id,
    );

  return reservation
    ? { ...reservation }
    : undefined;
}

export function updateReservation(
  id: string,
  status: ReservationStatus,
  note?: string,
) {
  const index =
    reservations.findIndex(
      (item) => item.id === id,
    );

  if (index === -1) {
    return undefined;
  }

  reservations[index] = {
    ...reservations[index],
    status,
    note,
  };

  return {
    ...reservations[index],
  };
}