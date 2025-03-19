const fs = require('fs');
const path = require('path');

const booksFilePath = path.join(__dirname, '../data/books.json');

// In-memory array to store users for authentication.
let users = [];

/**
 * Book Data Persistence Functions
 */
function readDatabase() {
  try {
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(booksFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
}

/**
 * Book Management Functions
 */
function getBooks() {
  return readDatabase();
}

function addBook({ title, author, category }) {
  const books = readDatabase();
  const newId = books.length > 0 ? (parseInt(books[books.length - 1].id) + 1).toString() : '1';
  const newBook = {
    id: newId,
    title,
    author,
    category,
    available: true,
    borrower: null,
    dueDate: null
  };
  books.push(newBook);
  return writeDatabase(books) ? newBook : null;
}

function lendBook(bookId, borrower, dueDate) {
  const books = readDatabase();
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return { success: false, message: 'Book not found' };
  }
  if (!book.available) {
    return { success: false, message: 'Book already lent out' };
  }
  book.available = false;
  book.borrower = borrower;
  book.dueDate = dueDate;
  return writeDatabase(books)
    ? { success: true, book }
    : { success: false, message: 'Failed to lend the book' };
}

function returnBook(bookId) {
  const books = readDatabase();
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return { success: false, message: 'Book not found' };
  }
  if (book.available) {
    return { success: false, message: 'Book is not lent out' };
  }
  book.available = true;
  book.borrower = null;
  book.dueDate = null;
  return writeDatabase(books)
    ? { success: true, book }
    : { success: false, message: 'Failed to return the book' };
}

function filterBorrowedBooks({ dueDate, category, borrower }) {
  const books = readDatabase();
  return books.filter(book => {
    if (book.available) return false;
    let match = true;
    if (dueDate && book.dueDate) {
      match = match && (new Date(book.dueDate) <= new Date(dueDate));
    }
    if (category) {
      match = match && (book.category === category);
    }
    if (borrower) {
      match = match && (book.borrower === borrower);
    }
    return match;
  });
}

/**
 * Reset Functions (for testing purposes)
 */
function resetBooks() {
  writeDatabase([]);
  // Also reset the users array for authentication tests.
  users = [];
}

/**
 * Simple Authentication Functions
 */
function registerUser(username, password, name) {
  // Check if a user with the same username already exists.
  const exists = users.find(u => u.username === username);
  if (exists) {
    return { success: false, message: 'Username already exists' };
  }
  const id = users.length > 0 ? (parseInt(users[users.length - 1].id) + 1).toString() : '1';
  const newUser = { id, username, password, name };
  users.push(newUser);
  return { success: true, user: newUser };
}

function authenticateUser(username, password) {
  const user = users.find(u => u.username === username);
  if (user && user.password === password) {
    return { success: true, user };
  }
  return { success: false, message: 'Invalid username or password' };
}

module.exports = {
  // Book functions
  getBooks,
  addBook,
  lendBook,
  returnBook,
  filterBorrowedBooks,
  resetBooks,
  // Authentication functions
  registerUser,
  authenticateUser
};
