// server
import express from "express";
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2";
import bodyParser from "body-parser";
import { render } from "ejs";
import { isModuleNamespaceObject } from "util/types";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "uems",
  })
  .promise();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

async function homepage(req, res) {

  var results = await db.query("select eventid,eventname,poster,start_date from events where pan_campus=1");


  var n = results[0].length < 5 ? results[0].length : 5;
  // console.log(n);
  var eventid = [];
  for (let index = 0; index < n; index++) {
    eventid.push(results[0][index].eventid);
  }

  var eventname = [];
  for (let index = 0; index < n; index++) {
    eventname.push(results[0][index].eventname);
  }
  var poster = [];
  for (let index = 0; index < n; index++) {
    poster.push(results[0][index].poster);
  }
  var dates = [];
  for (let index = 0; index < n; index++) {
    dates.push(results[0][index].start_date);
  }

  // schoool events!!!!!!!!!!!!!!!!!!!!!!

  const userresults = await db.query(
    "select user.regno,user.dept_id,department.school_id from user inner join department on user.dept_id=department.deptid where regno=?;",
    [req.session.user]
  );
  const schoolresults = await db.query("select eventid,eventname,poster,start_date from events where schoolid=?", [userresults[0][0].school_id]);
  // console.log(schoolresults[0][0].eventid);
  var p = schoolresults[0].length;
  var schooleventid = [];
  for (let index = 0; index < p; index++) {
    schooleventid.push(schoolresults[0][index].eventid);
  }

  var schooleventname = [];
  for (let index = 0; index < p; index++) {
    schooleventname.push(schoolresults[0][index].eventname);
  }
  var schoolposter = [];
  for (let index = 0; index < p; index++) {
    schoolposter.push(schoolresults[0][index].poster);
  }
  var schooldates = [];
  for (let index = 0; index < p; index++) {
    schooldates.push(schoolresults[0][index].start_date);
  }
  const events = {
    campuseventid: eventid,
    campusevent: eventname,
    campusposters: poster,
    campusdate: dates,
    campuscount: n,

    schooleventid: schooleventid,
    schoolevent: schooleventname,
    schoolposters: schoolposter,
    schooldate: schooldates,
    schoolcount: p

  };

  res.render("home.ejs", events);
}

app.get("/", async (req, res) => {
  
  const message = {
    content: "",
  };
  res.render("login.ejs", message);
  console.log("11223343");
});

app.get("/logo-home", async (req, res) => {
  homepage(req, res);
});

app.get("/profile", async (req, res) => {
  console.log(req.session.user);
  res.render("profile.ejs");
});

app.get("/about", (req, res) => {
  res.render("aboutus.ejs");
});

app.post("/login", async (req, res) => {
  //console.log(req.body);
  const regno = req.body.loginRegisterNumber;
  const password = req.body.loginPassword;
  req.session.user = req.body.loginRegisterNumber;

  console.log(req.session.user);

  try {
    const results = await db.query("select * from user where regno=?", [regno]);
    // console.log(results)
    if (results[0].length == 1) {
      const user = results[0][0];
      const storedpassword = user.password;
      //console.log(storedpassword);
      if (storedpassword == password) {
        homepage(req, res);
      } else {
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
      let departmentid = await db.query(
        "select deptid from department where dept_name=?",
        [department]
      );
      departmentid = departmentid[0][0].deptid;
      // console.log(departmentid);
      db.query("insert into user values(?,?,?,?,?)", [
        regno,
        password,
        mobileNumber,
        email,
        departmentid,
      ]);
      const message = {
        content: "",
      };
      res.render("login.ejs", message);
    } else {
      const message = {
        content: "<h3>Registration Failed! User already exists.</h3>",
      };

      res.render("login.ejs", message);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/campus-seemore", async (req, res) => {
  try {
    const results = await db.query(
      "select eventid,eventname,poster,start_date from events where pan_campus=1"
    );

    var n = results[0].length;
    // console.log(n);
    var eventid = [];
    for (let index = 0; index < n; index++) {
      eventid.push(results[0][index].eventid);
    }

    var eventname = [];
    for (let index = 0; index < n; index++) {
      eventname.push(results[0][index].eventname);
    }
    var poster = [];
    for (let index = 0; index < n; index++) {
      poster.push(results[0][index].poster);
    }
    var dates = [];
    for (let index = 0; index < n; index++) {
      dates.push(results[0][index].start_date);
    }
    const campusevents = {
      eventid: eventid,
      event: eventname,
      posters: poster,
      date: dates,
      count: n,
    };

    console.log(campusevents);

    res.render("school.ejs", campusevents);
  } catch (error) {
    console.log(error);
  }
});

app.get("/seemore-schools", async (req, res) => {
  //console.log(req.session.user);
  try {
    const userresults = await db.query(
      "select user.regno,user.dept_id,department.school_id from user inner join department on user.dept_id=department.deptid where regno=?;",
      [req.session.user]
    );
    //console.log(userresults);
    const schoolresults = await db.query("select eventid,eventname,poster,start_date from events where schoolid=?", [userresults[0][0].school_id]);

    var p = schoolresults[0].length;
    var schooleventid = [];
    for (let index = 0; index < p; index++) {
      schooleventid.push(schoolresults[0][index].eventid);
    }

    var schooleventname = [];
    for (let index = 0; index < p; index++) {
      schooleventname.push(schoolresults[0][index].eventname);
    }
    var schoolposter = [];
    for (let index = 0; index < p; index++) {
      schoolposter.push(schoolresults[0][index].poster);
    }
    var schooldates = [];
    for (let index = 0; index < p; index++) {
      schooldates.push(schoolresults[0][index].start_date);
    }
    const events = {
      eventid: schooleventid,
      event: schooleventname,
      posters: schoolposter,
      date: schooldates,
      count: p

    };
    res.render("school.ejs",events);
  } catch (error) {
    console.log(error);
  }
    
})

app.get("/event/:id", (req, res) => {
  // console.log("event 1");
  const eventId = req.params;
  console.log(eventId);
  res.render("event.ejs");
});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
