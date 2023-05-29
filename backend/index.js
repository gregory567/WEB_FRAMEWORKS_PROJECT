
// import the express library
const express = require("express");
const app = express();
// import the cors library 
const cors = require("cors");
// auth token generation
const { generateAuthToken } = require("./helpers");
// library for password hashing
const bcrypt = require("bcrypt");
// save the port that the server operates on
const port = 3000;

// we use the following middlewares in order to be able to use json and urlencoded data
// To parse the incoming requests with JSON payloads
// https://stackoverflow.com/questions/66525078/bodyparser-is-deprecated
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// inmemory-DB
// users array with username / password
let users = [
    { username: "patrick102@gmail.com", password: "12345678" },
    { username: "jennifer99@gmail.com", password: "abcdefgh" },
    { username: "michael34@gmail.com", password: "qwertyui" },
    { username: "emily85@gmail.com", password: "p@ssw0rd" },
    { username: "david76@gmail.com", password: "98765432" }
];

// tokens array with auth-tokens
let tokens = [
    { token: "admintoken", user: "admin" },
    { token: "token1", user: "patrick102@gmail.com" },
    { token: "token2", user: "jennifer99@gmail.com" },
    { token: "token3", user: "michael34@gmail.com" },
    { token: "token4", user: "emily85@gmail.com" },
    { token: "token5", user: "david76@gmail.com" }
];

// array with highscores
let highScores = [
    { user: "patrick102@gmail.com", score: 150 },
    { user: "jennifer99@gmail.com", score: 200 },
    { user: "michael34@gmail.com", score: 100 },
    { user: "emily85@gmail.com", score: 300 },
    { user: "david76@gmail.com", score: 250 }
];

// allow request from Angular app (and others) to the resources of the backend server
app.use(cors());

// classic cors way, which allows to finetune the specifications...
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");      // or more strict: "http://localhost:4200"
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, PATCH");
//     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
//     next();
// });


// test the middleware functionality 
app.use("*", function(req, res, next){
    console.log(new Date(), "Request on:" + req.originalUrl);
    next();
});

/*
app.use("*", function(req, res){
    res.send("Middleware finished.");
});
*/

// Authentication middleware
function authenticate(req, res, next) {
    const token = req.headers.authorization ?? "";
    const authUser = tokens.find((t) => "Bearer " + t.token === token);
  
    if (authUser) {
      req.user = authUser.user;
      next();
    } else {
      res.status(401).json({ message: "Not allowed.", code: 401 });
    }
}

// request to the homepage
app.get("/", function(req, res){
    res.status(200).json("Backend works!");
});

// Return users array only with valid auth token
app.get("/users", authenticate, function (req, res) {
    try {
        if (users.length === 0) {
          return res.status(404).json({ message: "No users found.", code: 404 });
        }
    
        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Internal server error.", code: 500 });
    }
});


app.post("/users", function(req, res) {
    console.log("Post: ", req.body);
    const { username, password } = req.body;
  
    // Check if the username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required.", code: 400 });
    }
  
    // Check if the username is already taken
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists.", code: 409 });
    }
  
    // Add the new user to the users array
    users.push({ username, password });
  
    res.status(201).json({ message: "User created successfully.", code: 201 });
});


app.post("/login", async function(req, res) {

    const loginData = JSON.stringify(req.body);
    console.log(loginData);
    const { username, password } = req.body;
  
    // Check if the username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required.", code: 400 });
    }
  
    // Find the user with the given username
    const user = users.find((user) => user.username === username);
  
    // Check if the user exists and the password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password.", code: 401 });
    }

    // Generate a random auth token of length 32
    const authToken = generateAuthToken(32);

    // Add the token to the tokens array
    tokens.push({ token: authToken, user: username });
  
    res.status(200).json({ message: "Login successful.", code: 200, authToken });
});


app.delete("/tokens", authenticate, function(req, res) {
    const token = req.headers.authorization ?? "";
    const authUserIndex = tokens.findIndex((t) => "Bearer " + t.token === token);
  
    if (authUserIndex !== -1) {
      // Remove the authentication token from the tokens array
      tokens.splice(authUserIndex, 1);
      res.status(200).json({ message: "Logged out successfully.", code: 200 });
    } else {
      res.status(404).json({ message: "Token not found.", code: 404 });
    }
});

app.post("/logout", authenticate, function(req, res) {
    const token = req.headers.authorization ?? "";
    const authUserIndex = tokens.findIndex((t) => "Bearer " + t.token === token);
  
    if (authUserIndex !== -1) {
      // Remove the authentication token from the tokens array
      tokens.splice(authUserIndex, 1);
      
      console.log("Token destroyed:", token);
      
      res.status(200).json({ message: "Logged out successfully.", code: 200 });
    } else {
      res.status(404).json({ message: "Token not found.", code: 404 });
    }
});
  

app.post("/signup", function (req, res, next) {

    const signupData = JSON.stringify(req.body);
    console.log(signupData);

    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required.", code: 400 });
    }
  
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists.", code: 409 });
    }
  
    // Hash the password
    bcrypt.hash(password, 10, function (err, hashedPassword) {
      if (err) {
        return res.status(500).json({ message: "Error hashing password.", code: 500 });
      }
  
      // Add the new user to the users array with the hashed password
      users.push({ username, password: hashedPassword });
  
      res.status(200).json({ message: "User registered successfully.", code: 200 });
    });
});


app.post("/highscores", authenticate, function(req, res) {
    const highscoreData = JSON.stringify(req.body);
    console.log(highscoreData);
  
    const { username, score } = req.body;
  
    // Check if the username or score is missing
    if (!username || !score) {
      return res.status(400).json({ message: "Username and score are required.", code: 400 });
    }
  
    // Find the existing highscore entry for the user
    const existingHighscoreIndex = highScores.findIndex(entry => entry.user === username);
  
    if (existingHighscoreIndex !== -1) {
      // Update the existing highscore entry with the new score
      highScores[existingHighscoreIndex].score = score;
    } else {
      // Add the new highscore to the highScores array
      highScores.push({ user: username, score: score });
    }
  
    res.status(200).json({ message: "Highscore submitted successfully.", code: 200 });
});
  

app.get("/highscores", authenticate, function (req, res) {
    try {
      if (highScores.length === 0) {
        return res.status(404).json({ message: "No highscores found.", code: 404 });
      }
  
      res.status(200).json(highScores);
    } catch (error) {
      console.error("Error retrieving highscores:", error);
      res.status(500).json({ message: "Internal server error.", code: 500 });
    }
});

  
app.listen(port, () => {
    console.log("Backend server started on port:", port);
});

module.exports = app;

