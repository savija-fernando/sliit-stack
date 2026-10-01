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
};

export type BookSearchParams = {
  search?: string;
  genre?: string;
};