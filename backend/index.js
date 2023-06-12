
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

// Import the Mongoose models
import { User } from './userdata.js';
import { Token } from './tokendata.js';
import { HighScore } from './highscoredata.js';

const db = require("./db.js");
db.connect();



// we use the following middlewares in order to be able to use json and urlencoded data
// To parse the incoming requests with JSON payloads
// https://stackoverflow.com/questions/66525078/bodyparser-is-deprecated
app.use(express.urlencoded({extended: true}));
app.use(express.json());



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

// Middleware for authentication
async function authenticate(req, res, next) {
  const token = req.headers.authorization ?? "";

  try {
    const existingToken = await Token.findOne({ token: token });

    if (existingToken) {
      req.user = existingToken.user;
      next();
    } else {
      res.status(401).json({ message: "401 Unauthorized", code: 401 });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal server error.", code: 500 });
  }
}

// request to the homepage
app.get("/", function(req, res){
    res.status(200).json("Backend works!");
});

// Get all users
app.get("/users", authenticate, async function (req, res) {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found.", code: 404 });
    }
    res.status(200).json({ message: "Users retrieved successfully.", users: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Internal server error.", code: 500 });
  }
});

app.post("/signup", async (req, res) => {

    const signupData = JSON.stringify(req.body);
    console.log(signupData);

    const { username, password, city, street, postalCode } = req.body;

    try {
      if (!username || !password || !city || !street || !postalCode) {
        return res.status(400).json({ message: "All fields are required.", code: 400 });
      }
  
      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists.", code: 409 });
      }
  
      // Hash the password
      bcrypt.hash(password, 10, async function (err, hashedPassword) {
        if (err) {
          return res.status(500).json({ message: "Error hashing password.", code: 500 });
        }
  
        const newUser = new User({
          username: username,
          password: hashedPassword,
          city: city,
          street: street,
          postalCode: postalCode
        });
  
        try {
          await newUser.save();
          res.status(201).json({ message: "User created successfully.", code: 201 });
        } catch (error) {
          res.status(500).json({ message: "Error saving user.", code: 500 });
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Server error.", code: 500 });
    }
});


app.post("/login", async function (req, res) {
  const loginData = JSON.stringify(req.body);
  console.log(loginData);
  const { username, password } = req.body;

  // Check if the username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required.", code: 400 });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ username: username });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid username.", code: 401 });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({ message: "Error comparing passwords.", code: 500 });
      }

      // If the passwords match, generate an authentication token
      if (result) {
        const authToken = generateAuthToken(32);

        // Create a new token and store it in the database
        const newToken = new Token({
          user: user.username,
          token: authToken,
        });

        newToken.save(function (err) {
          if (err) {
            return res.status(500).json({ message: "Error saving token.", code: 500 });
          }

          // Return the authentication token along with a success message
          res.status(200).json({ message: "Login successful.", token: authToken });
        });
      } else {
        // Passwords don't match
        res.status(401).json({ message: "Password does not match.", code: 401 });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", code: 500 });
  }
});


// User logout
app.post("/logout", authenticate, async function (req, res) {
  try {
    const token = req.headers.authorization;

    // Check if the token exists
    const existingToken = await Token.findOne({ token: token });
    if (!existingToken) {
      return res.status(404).json({ message: "Token not found.", code: 404 });
    }

    // Delete the token from the database
    await Token.deleteOne({ token: token });

    res.status(200).json({ message: "User logged out successfully.", code: 200 });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error.", code: 500 });
  }
});


// Add a new high score
app.post("/highscores", authenticate, async function (req, res) {
  try {
    const { user, score } = req.body;

    if (!user || !score) {
      return res.status(400).json({ message: "User and score are required.", code: 400 });
    }

    const newHighScore = new HighScore({
      user: user,
      score: score,
    });

    await newHighScore.save();
    res.status(201).json({ message: "Highscore submitted successfully.", code: 201 });
  } catch (error) {
    console.error("Error adding high score:", error);
    res.status(500).json({ message: "Internal server error.", code: 500 });
  }
});


// Get all high scores
app.get("/highscores", authenticate, async function (req, res) {
  try {
    const highScores = await HighScore.find();
    if (highScores.length === 0) {
      return res.status(404).json({ message: "No high scores found.", code: 404 });
    }
    res.status(200).json(highScores);
  } catch (error) {
    console.error("Error retrieving high scores:", error);
    res.status(500).json({ message: "Internal server error.", code: 500 });
  }
});

  
app.listen(port, () => {
    console.log("Backend server started on port:", port);
});

module.exports = app;

