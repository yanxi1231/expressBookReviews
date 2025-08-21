const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.every(user => user.username !== username);
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

const app = express();
app.use(session({secret:"fingerpint"},resave=true,saveUninitialized=true));
app.use(express.json());

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (authenticatedUser(username, password)) {
        // Create JWT token
        const token = jwt.sign({ username }, 'access', { expiresIn: '1h' });

        // Save in session
        req.session.authorization = { token, username };

        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid login. Check username and password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not authenticated." });
    }
    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Add or update review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully." });
});

// deleting a book review under 
regd_users.delete("/auth/review/:isbn", (req, res) => {});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
