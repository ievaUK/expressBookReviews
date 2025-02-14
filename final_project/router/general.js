const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //res.send(books);

  // Promise example
  let getBooks = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(res.send(JSON.stringify(books, null, 4)))
    },6000)})

    getBooks.catch(error =>  res.send(error))

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let reqBook = req.params.isbn;
  let filterBook = books[reqBook];
  //return res.status(300).send(filterBook);

  // Promise example
  let getReqBook = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(res.send(JSON.stringify(filterBook, null, 4)))
    },6000)})

    getReqBook.catch(error =>  res.send(error))
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let reqAuthor = req.params.author.toLowerCase();
  let keys = Object.values(books);
  console.log(keys)
  let filterAuth = keys.filter(book => book.author.toLocaleLowerCase() === reqAuthor);

  //return res.status(300).send(filterAuth);

  // Promise example
  let getReqAuthor = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(res.send(JSON.stringify(filterAuth)))
    },6000)})

    getReqAuthor.catch(error =>  res.send(error))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let reqTitle = req.params.title.toLowerCase();
  let keys = Object.values(books);
  console.log(keys)
  let filterTitle = keys.filter(book => book.title.toLocaleLowerCase().includes(reqTitle));

  //return res.status(300).send(filterTitle);

  // With Promise
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(res.send(JSON.stringify(filterTitle)))
    },6000)})

    myPromise.catch(error =>  res.send(error))

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let reqNum = parseInt(req.params.isbn);
  let filteredBook = books[reqNum];

  return res.status(200).send(filteredBook.reviews);
});

module.exports.general = public_users;
