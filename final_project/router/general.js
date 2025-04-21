const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  console.log(books["1"]["author"]);
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  return res.status(300).json(books[isbn]);
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

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn]["reviews"]);
});

module.exports.general = public_users;
