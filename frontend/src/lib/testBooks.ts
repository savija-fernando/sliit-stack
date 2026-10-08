import {
  getBooks,
  getBookById,
} from '@/features/book-reservation/services/bookService';

export async function testBookService() {
  console.log('--- BOOK SERVICE TEST START ---');

  try {
    // Test 1: Get all books
    const books = await getBooks();

    console.log('GET BOOKS SUCCESS');
    console.log('Number of books:', books.length);
    console.log('Books:', books);

    // Test 2: Get one book
    if (books.length > 0) {
      const firstBook = await getBookById(books[0].id);

      console.log('GET BOOK BY ID SUCCESS');
      console.log('Book:', firstBook);
    } else {
      console.log(
        'No books found. Add a book in Supabase first.'
      );
    }

    console.log('--- BOOK SERVICE TEST END ---');
  } catch (error) {
    console.error('BOOK SERVICE TEST FAILED:', error);
  }
}