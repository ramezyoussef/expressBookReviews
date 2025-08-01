const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password=req.body.password;
   if (username && password) {
       if (!doesExist(username)) {
           users.push({"username":username,"password":password});
           return res.status(200).json({message:"User successfully registered. Now you can login"})
       }else{
          return res.status(404).json({message:"User already exists!"});
       }
       
   } return res.status(404).json({message:"Unable to register user."})
   
   });


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   
    let r=[];
    const author=req.params.author.toLowerCase();
    for (let isbn in books) {
    if (books[isbn].author.toLowerCase()===author) {
     r.push(books[isbn])
    }
     
    }
    if (r.length > 0) {
     res.send(r);
    }else{
     res.status(404).json({message:"not found"})
    }
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let isbncounter=1;
    const max=Object.keys(books).length;
    const title=req.params.title;
    while(isbncounter <= max){
             if (books[isbncounter].title==title) {
                return res.send(books[isbncounter]);
                 
             }
     isbncounter++;
    }    res.status(404).json({message:"not found"})
 
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    res.send(books[isbn].reviews);
});


public_users.get('/',async  function  (req, res) {
    
    try{
        const bookList = await  getBooksAsync();
                res.send(JSON.stringify(books,null,4));

    } catch(error){
        res.status(500).send("Failed to fetch books");
    }

});

function getBooksAsync(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000);


    });
}
public_users.get('/author/:author',async function (req, res) {
   try{
    const bookList = await getBooksAsync();
    let r=[];
    const author=req.params.author.toLowerCase();
    for (let isbn in books) {
    if (books[isbn].author.toLowerCase()===author) {
     r.push(books[isbn])
    }
     
    }
    if (r.length > 0) {
     res.send(r);
    }else{
     res.status(404).json({message:"not found"})
    }}catch(error){
        res.status(500).send("Failed to fetch books by title");
    }
 });
public_users.get('/title/:title', async function (req, res) {
    try{
        const bookList=await getBooksAsync();
    let isbncounter=1;
    const max=Object.keys(books).length;
    const title=req.params.title;
    while(isbncounter <= max){
             if (books[isbncounter].title==title) {
                return res.send(books[isbncounter]);
                 
             }
     isbncounter++;
    }    res.status(404).json({message:"not found"})}catch(error){
        res.status(500).send("Failed to fetch books by title");
    }
 
 });

public_users.get('/isbn/:isbn',async function (req, res) {
    try{
        const bookList = await getBooksAsync();
    const isbn=req.params.isbn;
    res.send(books[isbn]);}
    catch(error){
        res.status(500).send("Failed to fetch books Detes");
    }
   });



module.exports.general = public_users;
