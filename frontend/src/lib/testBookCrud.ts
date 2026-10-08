import {
  createBook,
  getBookById,
  updateBook,
  deleteBook,
} from '@/features/book-reservation/services/bookService';

export async function testBookCrud() {
  console.log('--- BOOK CRUD TEST START ---');

  try {
    // --------------------------------
    // CREATE
    // --------------------------------
    console.log('Testing CREATE...');

    const createdBook = await createBook({
      title: 'CRUD Test Book',
      author: 'Test Author',
      genre: 'Reference',
      isbn: 'CRUD-TEST-001',
      description: 'Temporary book used to test CRUD operations.',
      coverUrl: 'https://example.com/test-book.jpg',
      location: 'Library - Test Shelf',
      status: 'Available',
      totalCopies: 2,
      availableCopies: 2,
    });

    console.log('CREATE SUCCESS');
    console.log('Created book:', createdBook);

    // --------------------------------
    // READ
    // --------------------------------
    console.log('Testing READ...');

    const readBook = await getBookById(createdBook.id);

    console.log('READ SUCCESS');
    console.log('Read book:', readBook);

    // --------------------------------
    // UPDATE
    // --------------------------------
    console.log('Testing UPDATE...');

    const updatedBook = await updateBook(
      createdBook.id,
      {
        title: 'CRUD Test Book - Updated',
        availableCopies: 1,
      }
    );

    console.log('UPDATE SUCCESS');
    console.log('Updated book:', updatedBook);

    // --------------------------------
    // DELETE
    // --------------------------------
    console.log('Testing DELETE...');

    await deleteBook(createdBook.id);

    console.log('DELETE SUCCESS');
    console.log(
      'Temporary CRUD test book has been deleted.'
    );

    console.log('--- BOOK CRUD TEST COMPLETE ---');
  } catch (error) {
    console.error('BOOK CRUD TEST FAILED:', error);
  }
}