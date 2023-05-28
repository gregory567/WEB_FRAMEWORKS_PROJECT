const express = require("express");
const app = express();
const port = 3000;

// allow requests from angular app (and others)
app.use(cors());

// classic cors way...


let users = [
    {id: 1, name: "John", birthDate: "01.01.1990"}, 
    {id: 2, name: "Mary", birthDate: "17.05.1990"}, 
    {id: 3, name: "Mike", birthDate: "12.12.1990"}
];

let tokens = [
    { token: 123456789, user: "admin"}
];


// To parse the incoming requests with JSON payloads
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 

app.use("*", function(req, res, next){
    console.log(new Date(), "Request on:" + req.originalUrl);
    next();
});

app.get("/", function(req, res){
    res.status(200).json("Backend works!");
});

app.get("/users", function(req, res){
    console.log(new Date(), "Request on:" + req.url);
    res.status(200).json(users);
});

app.post("/users", function(req, res){
    console.log("Post: ", req.body);

    users.push({id: users.length + 1, name: req.body.name, birthDate: req.body.birthDate});

    res.status(201).json("ok");
});

app.post("/users-secure", function(req, res){
    let token = req.headers.authorization ?? "";
    console.log(token);
    let authUser = tokens.find( t => {"Bearer " + t.token == token} );
    if(authUser !== undefined){
        res.status(200).json(users);
    } else {
        res.status(401).json("not allowed");
    }
});

app.listen(port, () => {
    console.log("Backend server started!");
});




