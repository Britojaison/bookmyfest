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

    //const results = await db.query("select  * from user")
    //console.log(results[0])
    const message = {
        content: "",
    };
    res.render("login.ejs", message);
    console.log("11223343");
});

app.get("/logo-home", async(req, res)=> {
    res.render("home.ejs");
});

app.get("/profile", async(req, res)=>{
    res.render("profile.ejs");
});

app.get("/about", (req,res)=>{
    res.render("aboutus.ejs");
});

app.post("/login", async (req, res) => {

    //console.log(req.body);
    const regno = req.body.loginRegisterNumber;
    const password = req.body.loginPassword;
    // console.log(password);


    try {
        const results = await db.query("select * from user where regno=?", [regno]);
        // console.log(results)
        if (results[0].length == 1) {
            const user = results[0][0];
            const storedpassword = user.password;
            //console.log(storedpassword);
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

app.post("/register", async (req, res) => {
    const regno = req.body.registerNumber;
    const password = req.body.password;
    const mobileNumber = req.body.mobileNumber;
    const email = req.body.email;
    const department = req.body.department;

    try {

        const results = await db.query("select * from user where regno=?", [regno]);

        if (results[0].length == 0) {
            let departmentid = await db.query("select deptid from department where dept_name=?", [department]);
            departmentid = departmentid[0][0].deptid;
            // console.log(departmentid);
            db.query("insert into user values(?,?,?,?,?)", [regno, password, mobileNumber, email, departmentid]);
            const message = {
                content: "",
            }
            res.render("login.ejs", message);
        } else {
            const message = {
                content: "<h3>Registration Failed! User already exists.</h3>",
            }

            res.render('login.ejs', message);
        }

    } catch (error) {
        console.log(error);
    }
});

app.get("/home", (req, res) => {
    res.render(__dirname + "/view/home.ejs");
});

app.get("/campusseemore", (req, res) => {
    res.render("school.ejs");
})
app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
})

// This piece of code is importtant and it belongs to the most amazing person i have ever known that is Nayana <3