import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from 'mysql2'
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express()
const port = 3000;



const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sqlmakri',
    database: 'bmf'

}).promise()


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {

    const results = await db.query("select  * from user")
    //console.log(results[0])
    const message = {
        content: "",
    };
    res.render("login.ejs", message);
});

app.post("/login", async (req, res) => {

    const regno = req.body.loginRegisterNumber;
    const password = req.body.loginPassword;
    console.log(password);


    try {
        const results = await db.query("select * from user where regno=?", [regno]);

        if (results[0].length == 1) {
            const user = results[0][0];
            const storedpassword = user.password;
            console.log(storedpassword);
            if (storedpassword == password) {
                res.render("home.ejs");
            }
            else {
                const message = {
                    content: "<h3>Wrong Password</h3>",
                };
                res.render("login.ejs", message);
            }

        } else {
            const message = {
                content: "<h3>User not found</h3>",
            };
            res.render("login.ejs", message);
        }
    } catch (error) {
        console.log(error);
    }
});

app.get("/home", (req, res) => {
    res.render(__dirname + "/view/home.ejs");
});
app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
})