// question 1
class Book {
    constructor(id, title, author, year) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
    }

    // question 2
    getDetails() {
        return `${this.title} par ${this.author} (${this.year})`;
    }
}

// question 3
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.borrowedBooks = [];
    }

    // question 4
    borrowBook(book) {
        const isAlreadyBorrowed = this.borrowedBooks.some((item) => item.id === book.id);
        if (!isAlreadyBorrowed) {
            this.borrowedBooks.push(book);
        }
    }

    // question 5
    returnBook(bookId) {
        this.borrowedBooks = this.borrowedBooks.filter((book) => book.id !== bookId);
    }
}

const defaultBooks = [
    { id: 1, title: 'Clean Code', author: 'Robert Martin', year: 2008 },
    { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', year: 1999 },
    { id: 3, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', year: 2018 }
];

const storageKey = 'library-books';
let books = loadBooks();
let editingBookId = null;

function loadBooks() {
    try {
        const savedBooks = JSON.parse(localStorage.getItem(storageKey));
        return Array.isArray(savedBooks) ? savedBooks : defaultBooks;
    } catch {
        return defaultBooks;
    }
}

function saveBooks() {
    localStorage.setItem(storageKey, JSON.stringify(books));
}

function nextBookId() {
    return books.reduce((highestId, book) => Math.max(highestId, book.id), 0) + 1;
}

function renderBooks(searchTerm = '') {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredBooks = books.filter((book) =>
        [book.title, book.author, String(book.year)].some((value) =>
            value.toLowerCase().includes(normalizedSearch)
        )
    );
    const list = document.querySelector('#book-list');
    const emptyState = document.querySelector('#empty-state');

    list.innerHTML = filteredBooks.map((book) => `
        <article class="book-row">
            <div class="book-cover" aria-hidden="true">${book.title.slice(0, 1).toUpperCase()}</div>
            <div class="book-info">
                <h3>${escapeHtml(book.title)}</h3>
                <p>${escapeHtml(book.author)} <span>·</span> ${book.year}</p>
            </div>
            <div class="book-actions">
                <button class="icon-button" type="button" data-action="edit" data-id="${book.id}" aria-label="Modifier ${escapeHtml(book.title)}">Modifier</button>
                <button class="icon-button danger" type="button" data-action="delete" data-id="${book.id}" aria-label="Supprimer ${escapeHtml(book.title)}">Supprimer</button>
            </div>
        </article>
    `).join('');

    emptyState.hidden = filteredBooks.length > 0;
    document.querySelector('#book-count').textContent = `${books.length} livre${books.length > 1 ? 's' : ''}`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;'
    })[character]);
}

function resetForm() {
    document.querySelector('#book-form').reset();
    document.querySelector('#form-title').textContent = 'Ajouter un livre';
    document.querySelector('#submit-book').textContent = 'Ajouter le livre';
    document.querySelector('#cancel-edit').hidden = true;
    editingBookId = null;
}

document.querySelector('#book-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const bookData = {
        title: formData.get('title').trim(),
        author: formData.get('author').trim(),
        year: Number(formData.get('year'))
    };

    if (editingBookId === null) {
        books.push({ id: nextBookId(), ...bookData });
    } else {
        books = books.map((book) => book.id === editingBookId ? { id: book.id, ...bookData } : book);
    }

    saveBooks();
    renderBooks(document.querySelector('#search').value);
    resetForm();
});

document.querySelector('#cancel-edit').addEventListener('click', resetForm);

document.querySelector('#search').addEventListener('input', (event) => {
    renderBooks(event.target.value);
});

document.querySelector('#book-list').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const bookId = Number(button.dataset.id);
    const book = books.find((item) => item.id === bookId);
    if (!book) return;

    if (button.dataset.action === 'delete') {
        books = books.filter((item) => item.id !== bookId);
        saveBooks();
        renderBooks(document.querySelector('#search').value);
        return;
    }

    editingBookId = bookId;
    document.querySelector('#form-title').textContent = 'Modifier le livre';
    document.querySelector('#submit-book').textContent = 'Enregistrer les changements';
    document.querySelector('#cancel-edit').hidden = false;
    document.querySelector('#title').value = book.title;
    document.querySelector('#author').value = book.author;
    document.querySelector('#year').value = book.year;
    document.querySelector('#title').focus();
});

renderBooks();