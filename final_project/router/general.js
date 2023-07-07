const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({username, password});
      return res.json({message: "User was successfully registered. Please, log in now"});
    } else {
      return res.status(404).json({message: "User already registered"})
    }
    
  }

  res.status(404).json({message: "Unable to register user"})
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Uncomment next line to evaluate Task 1
  //return res.send(JSON.stringify(books, null, 4));

  //This will be used for the evaluation of Task 10.
  Promise.resolve(books)
    .then(result => res.send(JSON.stringify(result, null, 4)))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  //Uncomment next line to evaluate Task 2
  // return res.send(books[isbn]);

  //This will be used for the evaluation of Task 11.
  Promise.resolve(books)
    .then(result => res.send(result[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const key = bookKeys.filter(key => books[key].author.includes(author));
  //Uncomment next line to evaluate Task 3
  // return res.send(books[key]);

  //This will be used for the evaluation of Task 12.
  Promise.resolve(books)
    .then(result => res.send(result[key]));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const key = bookKeys.filter(key => books[key].title.includes(title));
  
  //Uncomment next line to evaluate Task 3
  // return res.send(books[key]);

  //This will be used for the evaluation of Task 13.
  Promise.resolve(books)
    .then(result => res.send(result[key]));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
