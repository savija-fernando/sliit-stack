export type BookStatus =
  | 'Available'
  | 'Issued'
  | 'Reserved'
  | 'Unavailable';

export type Book = {
  id: string;

  title: string;
  author: string;
  genre: string;
  isbn?: string;

  status: BookStatus;

  description?: string;
  coverUrl?: string;
  location?: string;

  totalCopies: number;
  availableCopies: number;

  // These will be used later with reservations/waiting lists.
  dueDate?: string;
  waitingCount?: number;
};

export type BookSearchParams = {
  search?: string;
  genre?: string;
};

export type WaitingListEntry = {
  bookId: string;
  position: number;
  status: 'Waiting' | 'Ready';
  estimatedDays?: number;
  collectBy?: string;
};

export type WaitingListItem = WaitingListEntry & {
  book: Book;
};