export type BookStatus = 'Available' | 'Issued' | 'Reserved' | 'Unavailable';

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: BookStatus;
  description?: string;
  coverUrl?: string;
  location?: string;
  totalCopies: number;
  availableCopies: number;
  dueDate?: string; // ISO date, when an issued copy is due back
  waitingCount?: number; // people already on the waiting list
};

export type BookSearchParams = {
  search?: string;
  genre?: string;
};