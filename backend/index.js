const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

// we use the following middlewares in order to be able to use json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


let users = [ { id: 1, name: "John", birth: "01.01.1990" },
            { id: 2, name: "Mary", birth: "17.05.1993" },
            { id: 3, name: "Mike", birth: "12.12.2002" }];

// inmemory-DB
// todo: array with username / password
// todo: array with auth-tokens
// todo: array with highscores
let tokens = [ { token: "123456789", user: "admin" } ];

// allow request from Angular app (and others)
app.use(cors());

// classic cors way ...
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");      // or more strict: "http://localhost:4200"
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, PATCH");
//     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
//     next();
// });


// To parse the incoming requests with JSON payloads
// https://stackoverflow.com/questions/66525078/bodyparser-is-deprecated
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("*", function(req, res, next){
    console.log(new Date(), "Request on:" + req.originalUrl);
    next();
});

/*
app.use("*", function(req, res){
    res.send("Middleware finished.");
});
*/

app.get("/", function(req, res){
    res.status(200).json("Backend works!");
});

app.get("/users", function(req, res){
    res.status(200).json(users);
});

// return users array only with valid auth token
app.get("/users/secure", function(req, res) {
    let token = req.headers.authorization ?? "";
    let authUser = tokens.find(t => { return ("Bearer " +  t.token) == token} );

    if (authUser !== undefined) {
        res.status(200).json(users); 
    } else {
        res.status(401).json("not allowed"); 
    }
});


app.post("/users", function(req, res){
    console.log("Post: ", req.body);

    // users.push({ id: users.length,
    //             ...req.body });  
    users.push({
        id: users.length + 1, 
        name: req.body.name, 
        birthDate: req.body.birthDate
    });

    res.status(201).json("ok");
});


app.post("/login", function(req, res, next) {
    const loginData = JSON.stringify(req.body);
    console.log(loginData);

    // login logic, e.g. check against the in memory DB.....

    res.status(200).json({
        message: "Hello login from express.js"
    });

});

app.post("/logout", function(req, res, next) {
});


app.post("/signup", function(req, res, next) {
    const signupData = JSON.stringify(req.body);
    console.log(signupData);

    // signup logic, e.g. check against the in memory DB.....

    res.status(200).json({
        message: "Hello signup from express.js"
    });
});


app.listen(3000, () => {
    console.log("Backend server started!");
});

module.exports = app;

