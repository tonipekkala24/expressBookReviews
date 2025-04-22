const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // Check if both username and password are provided
    if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({username: username, password: password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json(books)
});
// Task 10 using axios with async/await
public_users.get('/fetch-books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(JSON.stringify(response.data));
    
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn

  return res.status(300).json(books[isbn]);
 });

// Task 11 using axios with async/await
public_users.get('/fetch-books-isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data[isbn]);
    
    return res.status(200).json(response.data[isbn]);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let bookKeys = Object.keys(books);
  const booksByAuthor = [];

  bookKeys.map(key => {
    if (books[key]["author"] === author) {
        booksByAuthor.push(books[key]);
    };
  });
  return res.status(300).json(booksByAuthor);
});

//Task 12 using axios with async/await
public_users.get('/fetch-books-author/:author', async (req, res) => {
  const author = req.params.author
  const booksByAuthor = [];
  try {
    const response = await axios.get('http://localhost:5000/');
    let bookKeys = Object.keys(response.data);
    bookKeys.map(key => {
      if (books[key]["author"] === author) {
          booksByAuthor.push(books[key]);
      };
    });
    console.log("Books by author:", booksByAuthor);
    return res.status(200).json(booksByAuthor);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bookKeys = Object.keys(books);
    const booksByTitle = [];
    
    bookKeys.map(key => {
        if (books[key]["title"] === title) {
            booksByTitle.push(books[key]);
        };
    });
  return res.status(300).json(booksByTitle);
});

// Task 13 using axios with async/await
public_users.get('/fetch-books-title/:title', async (req, res) => {
  const title = req.params.title
  const booksByTitle = [];
  try {
    const response = await axios.get('http://localhost:5000/');
    let bookKeys = Object.keys(response.data);
    bookKeys.map(key => {
      if (response.data[key]["title"] === title) {
          booksByTitle.push(books[key]);
      };
    });
    console.log("Books by title:", booksByTitle);
    return res.status(200).json(booksByTitle);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn]["reviews"]);
});

module.exports.general = public_users;
