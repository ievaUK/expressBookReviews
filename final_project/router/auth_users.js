const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let reqNum = req.params.isbn;
  let reqBook = books[parseInt(reqNum)];
  let userAuthor = req.session.authorization.username;
  let review = req.body.text;

  let payload = {
      text: review,
      user: userAuthor
  }

  // check mandatory fields are not empty
  if(!reqNum) res.send('Provide a book that you wish to view');
  if(!review) res.send('You must enter a review');

  let reviewLength = Object.keys(reqBook.reviews).length
  let hasLeftReview = false;
  console.log(reviewLength, userAuthor, review)
  if(reviewLength < 1) {
      // add review to current reviews

      reqBook.reviews[reviewLength] = payload;
      res.send(`Review was added: ${payload}`)
  } else {
      // check if user already has left a review
      console.log('more than 1 review', reqBook.reviews)

      Object.values(reqBook.reviews).find(r => {
          if(r.user === userAuthor) {
              r.text = review;
              hasLeftReview = true
              return res.send(`We have added your review ${userAuthor}, ${review}`)
          }
      })

      if(!hasLeftReview) {
        reqBook.reviews[reviewLength] = payload
        return res.send(`We have added your review ${userAuthor}, ${review}`)
    }
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const reqNum = parseInt(req.params.isbn);
    let userAuthor = req.session.authorization.username;
    let reqBook = books[reqNum];

    if (!reqNum){
        res.send(`Provide book for which you would like the review to be deleted`)
    }

    let reviewLength = Object.keys(reqBook.reviews).length;
    let hasLeftReview = false;

    if(reviewLength < 1) {
        res.send(`There are no reviews for this book`);
    }

    Object.keys(reqBook.reviews).forEach(review => {
        console.log(review, 'rev num')
        Object.values(reqBook.reviews).find(r => {
            if(r.user === userAuthor) {
                //delete the review
                console.log(r)
                delete reqBook.reviews[review]
                hasLeftReview = true
                return res.send(`Review was deleted`)
            }
        })
    })

    if(!hasLeftReview) {
        return res.send(`You have not left a review!`)
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
