const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// In-memory storage for books
let books = [];

// Root route (GET /)
app.get('/', (req, res) => {
    res.send('Welcome to the Library Management API!');
});

// Create a new book (POST /books)
app.post('/books', (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;
    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ message: 'All book attributes are required' });
    }
    if (books.find(book => book.book_id === book_id)) {
        return res.status(400).json({ message: 'Book ID must be unique' });
    }
    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    res.status(201).json({ message: 'Book added successfully', book: newBook });
});

// Retrieve all books (GET /books)
app.get('/books', (req, res) => {
    res.json({ message: 'Returning all books', books });
});

// Retrieve a specific book by ID (GET /books/:id)
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id == req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book found', book });
});

// Update book information (PUT /books/:id)
app.put('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id == req.params.id);
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }
    books[bookIndex] = { ...books[bookIndex], ...req.body };
    res.json({ message: 'Book updated successfully', book: books[bookIndex] });
});

// Delete a book (DELETE /books/:id)
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id == req.params.id);
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }
    books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});