const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if username already exists
    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists. Please choose another." });
    }

    // Register the new user
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    myPromise.then(() => {return res.status(200).json(books)})
});

//Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})

public_users.get('/', function (req, res) {
    myPromise.then(() => {
        return res.status(200).json(books);
    }).catch((error) => {
        return res.status(500).json({ message: "Error fetching books", error });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        myPromise.then(() => {
            return res.status(200).json(books[isbn]);
        }).catch((error) => {
            return res.status(500).json({ message: "Error fetching books", error });
        });
        
    } else {
        return res.status(404).json({ message: "Book not found for this ISBN." });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];

    // Get all keys from the books object
    const bookKeys = Object.keys(books);
    // Loop through each book and check if the author matches
    for (let key of bookKeys) {
        const book = books[key];
        if (book.author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push({ isbn: key, ...book });
        }
    }
    
    if (matchingBooks.length > 0) {
        myPromise.then(() => {
            return res.status(200).json(matchingBooks);
        }).catch((error) => {
            return res.status(500).json({ message: "Error fetching books", error });
        });
    } else {
        return res.status(404).json({ message: "No books found by this author." });
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.trim().toLowerCase();
    const matchingBooks = [];

    for (const [key, book] of Object.entries(books)) {
        if (book.title.toLowerCase().includes(title)) {
            matchingBooks.push({ isbn: key, ...book });
        }
    }

    if (matchingBooks.length > 0) {
        myPromise.then(() => {
            return res.status(200).json(matchingBooks);
        }).catch((error) => {
            return res.status(500).json({ message: "Error fetching books", error });
        });
    } else {
        return res.status(404).json({ message: "No books found matching this title." });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
