export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  description?: string;
  coverUrl?: string;
  location?: string;
  totalCopies: number;
  availableCopies: number;
};