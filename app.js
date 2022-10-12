// Book Class; repesent a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI class: Handel UI Task
class UI {
  static displayBooks() {
    const books = store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class ="btn btn-danger btn-sm delete">Delete Book</a></td>`;
    list.appendChild(row);
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Make disapper in 3 seconsds
    setTimeout(() => document.querySelector(".alert").remove(), 5000);
  }

  static clearFileds() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}
// Store class: handles Storage

class store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Events display Books

document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Prevent Default
  e.preventDefault();
  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  const book = new Book(title, author, isbn);
  // validate

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all the fields", "danger");
  } else {
    // Add book to list

    UI.addBookToList(book);

    // Add Book To store

    store.addBook(book);

    // Show Success message

    UI.showAlert("Book added Successfully", "success");

    // Clear fields
    UI.clearFileds();
  }
});
// Event: Remove A book

document.querySelector("#book-list").addEventListener("click", (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);
  UI.showAlert("Book Removed Successfully", "warning");

  // Remove Book from Store
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
