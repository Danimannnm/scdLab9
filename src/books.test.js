const { 
    getBooks, 
    addBook, 
    lendBook, 
    returnBook, 
    filterBorrowedBooks, 
    resetBooks, 
    registerUser, 
    authenticateUser 
  } = require('./books');
  
  // Reset books and users before each test to ensure a clean state.
  beforeEach(() => {
    resetBooks();
  });
  
  describe('Book Management', () => {
    test('addBook should add a new book', () => {
      const book = addBook({ title: '1984', author: 'George Orwell', category: 'Fiction' });
      const books = getBooks();
      expect(books).toHaveLength(1);
      expect(books[0]).toEqual(book);
    });
  
    test('lendBook should lend a book correctly', () => {
      const book = addBook({ title: '1984', author: 'George Orwell', category: 'Fiction' });
      const result = lendBook(book.id, 'Alice', '2025-01-01');
      expect(result.success).toBe(true);
      const updatedBook = getBooks().find(b => b.id === book.id);
      expect(updatedBook.available).toBe(false);
      expect(updatedBook.borrower).toBe('Alice');
      expect(updatedBook.dueDate).toBe('2025-01-01');
    });
  
    test('returnBook should return a lent book correctly', () => {
      const book = addBook({ title: '1984', author: 'George Orwell', category: 'Fiction' });
      lendBook(book.id, 'Alice', '2025-01-01');
      const result = returnBook(book.id);
      expect(result.success).toBe(true);
      const updatedBook = getBooks().find(b => b.id === book.id);
      expect(updatedBook.available).toBe(true);
      expect(updatedBook.borrower).toBeNull();
      expect(updatedBook.dueDate).toBeNull();
    });
  
    test('filterBorrowedBooks should filter books correctly', () => {
      const book1 = addBook({ title: '1984', author: 'George Orwell', category: 'Fiction' });
      const book2 = addBook({ title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction' });
      lendBook(book1.id, 'Alice', '2025-01-01');
      lendBook(book2.id, 'Bob', '2025-02-01');
  
      const filteredByBorrower = filterBorrowedBooks({ borrower: 'Alice' });
      expect(filteredByBorrower).toHaveLength(1);
      expect(filteredByBorrower[0].id).toBe(book1.id);
  
      const filteredByCategory = filterBorrowedBooks({ category: 'Non-Fiction' });
      expect(filteredByCategory).toHaveLength(1);
      expect(filteredByCategory[0].id).toBe(book2.id);
  
      const filteredByDueDate = filterBorrowedBooks({ dueDate: '2025-01-15' });
      expect(filteredByDueDate).toHaveLength(1);
      expect(filteredByDueDate[0].id).toBe(book1.id);
    });
  });
  
  describe('User Authentication', () => {
    test('registerUser should register a new user', () => {
      const result = registerUser('john_doe', 'password123', 'John Doe');
      expect(result.success).toBe(true);
      expect(result.user).toHaveProperty('id');
      expect(result.user.username).toBe('john_doe');
    });
  
    test('registerUser should not allow duplicate usernames', () => {
      registerUser('john_doe', 'password123', 'John Doe');
      const result = registerUser('john_doe', 'anotherpass', 'John Doe');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Username already exists');
    });
  
    test('authenticateUser should authenticate valid user', () => {
      registerUser('john_doe', 'password123', 'John Doe');
      const authResult = authenticateUser('john_doe', 'password123');
      expect(authResult.success).toBe(true);
      expect(authResult.user).toHaveProperty('id');
      expect(authResult.user.username).toBe('john_doe');
    });
  
    test('authenticateUser should fail with invalid credentials', () => {
      registerUser('john_doe', 'password123', 'John Doe');
      const authResult = authenticateUser('john_doe', 'wrongpassword');
      expect(authResult.success).toBe(false);
      expect(authResult.message).toBe('Invalid username or password');
    });
  });
  