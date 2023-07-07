const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let usersWithSameName = users.some(user => user.username === username);
  return !usersWithSameName;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUser = users.some(user => user.username === username && user.password === password);
  return validUser;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error Loging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username
    }
    return res.send("User Successfully Logged in")
  } else {
    return res.status(208).json({message: "Invalid Login. Verify username and password enter"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const summary = req.query.summary;
  const deduction = req.query.deduction;
  const user = req.session.authorization.username;

  const reviews = books[req.params.isbn].reviews;

  const userFound = reviews[user];

  if (!userFound) {
    reviews[user] = {
      summary, deduction
    };
    return res.send("Review successfully added");
  }

  reviews[user].summary = summary;
  reviews[user].deduction = deduction;

  return res.send("Review successfully updated");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const reviews = books[req.params.isbn].reviews;
  delete reviews[user];
  return res.send("Review deleted successfully")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
