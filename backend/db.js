
const mongoose = require("mongoose");
const cred = require("./secret.json");

const db = {

    connect: function() {
        console.log("Connecting to database...");

        // we will need credentials in the connection link
        let conn = "mongodb+srv://localhost";

        mongoose.connect(conn)
            .then(()=>{
                console.log("Db connnection successful.");
            })
            .catch((err)=>{
                console.log("Db connection failed: ", err);
            });
    }
}

module.exports = db;
