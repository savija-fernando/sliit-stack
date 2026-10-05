import type {
  ReservationRecord,
  ReservationStatus,
} from '@/features/reservations/types/reservation';

let reservations: ReservationRecord[] = [
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