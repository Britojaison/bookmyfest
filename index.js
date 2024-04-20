// server
import express from "express";
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2";
import bodyParser from "body-parser";
import render from "ejs";
import { isModuleNamespaceObject } from "util/types";
import { count } from "console";
import bcrypt, { hash } from "bcrypt";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const saltround = 10;
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

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

async function adminpage(req, res) {
  const results = await db.query(
    "SELECT * FROM events WHERE hostid = ? AND end_date > CURDATE();",
    [req.session.user]
  );
  // console.log(results[0]);
  var n = results[0].length;
  // console.log(n);
  var eventid = [];
  for (let index = 0; index < n; index++) {
    eventid.push(results[0][index].eventID);
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

  const pastEventResults = await db.query(
    "SELECT * FROM events WHERE hostid = ? AND end_date < CURDATE();",
    [req.session.user]
  );
  //console.log(pastEventResults[0]);
  var n = pastEventResults.length;
  //n = n - 1;

  // console.log("itha ivde noku", req.session.user);
  // console.log(pastEventResults);
  var pasteventid = [];
  for (let index = 0; index < n; index++) {
    pasteventid.push(pastEventResults[0][index].eventID);
  }

  var pasteventname = [];
  for (let index = 0; index < n; index++) {
    pasteventname.push(pastEventResults[0][index].eventname);
  }
  var pastposter = [];
  for (let index = 0; index < n; index++) {
    pastposter.push(pastEventResults[0][index].poster);
  }

  const hostevents = {
    eventid: eventid,
    event: eventname,
    posters: poster,
    date: dates,
    count: n,

    pasteventid: pasteventid,
    pastevent: pasteventname,
    pastposters: pastposter,
    pastcount: n,
  };
  //console.log(hostevents);
  res.render("admin.ejs", hostevents);
}

async function homepage(req, res) {
  var results = await db.query(
    "SELECT eventID, eventname, poster, start_date FROM events WHERE pan_campus = 1 AND end_date > CURDATE();"
  );
  var n = results[0].length < 5 ? results[0].length : 5;
  //console.log(results);
  var campuseventid = [];
  for (let index = 0; index < n; index++) {
    campuseventid.push(results[0][index].eventID);
  }
  var campuseventname = [];
  for (let index = 0; index < n; index++) {
    campuseventname.push(results[0][index].eventname);
  }
  var campusposter = [];
  for (let index = 0; index < n; index++) {
    campusposter.push(results[0][index].poster);
  }
  var campusdates = [];
  for (let index = 0; index < n; index++) {
    campusdates.push(results[0][index].start_date);
  }

  //recommended events!!!!!!

  const userRecommended = await db.query(
    "SELECT e.* FROM events e INNER JOIN user u ON e.categoryID = u.categoryID WHERE u.regno = ? AND e.end_date > CURDATE();",
    [req.session.user]
  );
  // console.log(userRecommended[0]);
  var q = userRecommended[0].length;
  console.log(q, "recommended");
  var recommendeventid = [];
  for (let index = 0; index < q; index++) {
    recommendeventid.push(userRecommended[0][index].eventID);
  }

  var recommendeventname = [];
  for (let index = 0; index < q; index++) {
    recommendeventname.push(userRecommended[0][index].eventname);
  }
  var recommendposter = [];
  for (let index = 0; index < q; index++) {
    recommendposter.push(userRecommended[0][index].poster);
  }
  var recommenddates = [];
  for (let index = 0; index < q; index++) {
    recommenddates.push(userRecommended[0][index].start_date);
  }

  // upcpming events!!!!!!!!!!!!!!!!!!!!!!

  const Upresults = await db.query(
    "SELECT p.* FROM participated p INNER JOIN events e ON p.eventID = e.eventID WHERE p.regno = ? AND e.end_date > CURDATE(); ",
    [req.session.user]
  );
  var events = new Array();
  var l = Upresults[0].length;
  var t = l;

  console.log(t, "upcomming");
  while (0 < t) {
    // console.log("hello");
    var event = await db.query("select * from events where eventID=?", [
      Upresults[0][t - 1].eventID,
    ]);
    events.push(event[0][0]);
    t--;
  }
  // console.log(events);
  var eventid = [];
  for (let index = 0; index < l; index++) {
    eventid.push(events[index].eventID);
  }

  var eventname = [];
  for (let index = 0; index < l; index++) {
    eventname.push(events[index].eventname);
  }
  var poster = [];
  for (let index = 0; index < l; index++) {
    poster.push(events[index].poster);
  }
  const eventdetails = {
    campuseventid: campuseventid,
    campusevent: campuseventname,
    campusposters: campusposter,
    campusdate: campusdates,
    campuscount: n,

    schooleventid: eventid,
    schoolevent: eventname,
    schoolposters: poster,
    schoolcount: l,

    recommendeventid: recommendeventid,
    recommendevent: recommendeventname,
    recommendposters: recommendposter,
    recommenddate: recommenddates,
    recommendcount: q,
  };
  //  console.log(eventdetails);
  res.render("home.ejs", eventdetails);
}

app.get("/", async (req, res) => {
  const message = {
    content: "",
  };

  // Calculate the date 60 days ago
  const cutOffDate = new Date();
  cutOffDate.setDate(cutOffDate.getDate() - 60);

  try {
    // Execute the SQL query to delete events
    await db.query("DELETE FROM events WHERE end_date <= ?", [cutOffDate]);

    // Render the login page
    res.render("login.ejs", message);
    console.log(" alen  11223343 \n swo 1100001 pwd 78304923");
  } catch (error) {
    console.error("Error deleting events:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logo-home", async (req, res) => {
  homepage(req, res);
});

app.get("/admin-home", async (req, res) => {
  adminpage(req, res);
});

app.get("/profile", async (req, res) => {
  // console.log(req.session.user);
  try {
    //upcoming events

    const results = await db.query(
      "SELECT p.* FROM participated p JOIN events e ON p.eventID = e.eventID WHERE p.regno = ? AND e.end_date > CURDATE()",
      [req.session.user]
    );
    var events = new Array();
    var l = results[0].length;
    var t = l;
    console.log(t + "is the number for upcoming events");
    while (0 < t) {
      //console.log("hello");
      var event = await db.query("select * from events where eventID=?", [
        results[0][t - 1].eventID,
      ]);
      events.push(event[0][0]);
      t--;
    }
    // console.log(events);
    var eventid = [];
    for (let index = 0; index < l; index++) {
      eventid.push(events[index].eventID);
    }

    var eventname = [];
    for (let index = 0; index < l; index++) {
      eventname.push(events[index].eventname);
    }
    var poster = [];
    for (let index = 0; index < l; index++) {
      poster.push(events[index].poster);
    }

    // past events
    const pastEventResults = await db.query(
      "SELECT p.* FROM participated p JOIN events e ON p.eventID = e.eventID WHERE p.regno = ? AND e.end_date < CURDATE();",
      [req.session.user]
    );
    console.log(req.session.user);
    //  console.log(pastEventResults[0]);
    // console.log(pastEventResults[0]); !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // var n = pastEventResults.length;
    // n = n - 1;
    // console.log(pastEventResults);
    var events = new Array();
    var n = pastEventResults[0].length;
    var t = n;
    console.log(t, "is the number for past events");
    while (0 < t) {
      // console.log(pastEventResults[0][t -1].eventID);

      var event = await db.query("select * from events where eventID=?", [
        pastEventResults[0][t - 1].eventID,
      ]);
      events.push(event[0][0]);
      t--;
    }
    // console.log(events);

    var pasteventid = [];
    for (let index = 0; index < n; index++) {
      pasteventid.push(events[index].eventID);
    }

    var pasteventname = [];
    for (let index = 0; index < n; index++) {
      pasteventname.push(events[index].eventname);
    }
    var pastposter = [];
    for (let index = 0; index < n; index++) {
      pastposter.push(events[index].poster);
    }

    const eventsdetails = {
      user: req.session.user,
      eventid: eventid,
      event: eventname,
      posters: poster,
      count: l,

      pasteventid: pasteventid,
      pastevent: pasteventname,
      pastposters: pastposter,
      pastcount: n,
    };
    //  console.log(eventsdetails);

    res.render("profile.ejs", eventsdetails);
  } catch (error) {
    console.log(error);
  }
});

// school drop-down!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get("/school", async (req, res) => {
  const page = req.query.page; // Access page parameter from req.query
  // console.log("Selected page:", page);
  if (page) {
    const results = await db.query("select * from events where hostID=? ", [
      page,
    ]);
    // console.log(result[0]);
    var n = results[0].length;
    // console.log(n);
    var eventid = [];
    for (let index = 0; index < n; index++) {
      eventid.push(results[0][index].eventID);
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
    const school = {
      eventid: eventid,
      event: eventname,
      posters: poster,
      date: dates,
      count: n,
    };
    res.render("school.ejs", school);
  }
});

app.get("/categories", async (req, res) => {
  const page = req.query.page; // Access page parameter from req.query
  // console.log("Selected page:", page);
  if (page) {
    const results = await db.query("select * from events where categoryID=? ", [
      page,
    ]);
    // console.log(result[0]);
    var n = results[0].length;
    // console.log(n);
    var eventid = [];
    for (let index = 0; index < n; index++) {
      eventid.push(results[0][index].eventID);
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
    const school = {
      eventid: eventid,
      event: eventname,
      posters: poster,
      date: dates,
      count: n,
    };
    res.render("school.ejs", school);
  }
});

app.get("/about", (req, res) => {
  res.render("aboutus.ejs");
});

app.post("/login", async (req, res) => {
  //console.log(req.body);
  const regno = req.body.loginRegisterNumber;
  const loginPassword = req.body.loginPassword;
  req.session.user = req.body.loginRegisterNumber;

  console.log(req.session.user);

  try {
    const results = await db.query("select * from user where regno=?", [regno]);

    if (results[0].length == 1) {
      const user = results[0][0];
      const storedpassword = user.password;
      // console.log(storedpassword);
      bcrypt.compare(loginPassword, storedpassword, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          if (result) {
            if (user.role == "A") {
              adminpage(req, res);
            } else {
              homepage(req, res);
            }
          } else {
            const message = {
              content: "<h3>Wrong Password</h3>",
            };
            res.render("login.ejs", message);
          }
        }
      });
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
  //const school=req.body.school;
  const role = "S";
  const category = req.body.category;

  try {
    const results = await db.query("select * from user where regno=?", [regno]);

    if (results[0].length == 0) {
      let departmentid = await db.query(
        "select deptid from department where deptname=?",
        [department]
      );
      // console.log(departmentid[0]);
      departmentid = departmentid[0][0].deptid;
      // console.log(departmentid);

      // password hashing
      bcrypt.hash(password, saltround, (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          db.query("insert into user values(?,?,?,?,?,?,?)", [
            regno,
            hash,
            mobileNumber,
            email,
            departmentid,
            role,
            category,
          ]);
          const message = {
            content: "",
          };
          res.render("login.ejs", message);
        }
      });
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

// past events see more!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/past-seemore", async (req, res) => {
  try {
    const pastEventResults = await db.query(
      "SELECT e.* FROM events e JOIN participated p ON e.eventID = p.eventID WHERE p.regno = ? AND e.eventID = 8 AND e.end_date < CURDATE();",
      [req.session.user]
    );

    var n = pastEventResults.length;
    n = n - 1;

    var pasteventid = [];
    for (let index = 0; index < n; index++) {
      pasteventid.push(pastEventResults[0][index].eventID);
    }

    var pasteventname = [];
    for (let index = 0; index < n; index++) {
      pasteventname.push(pastEventResults[0][index].eventname);
    }
    var pastposter = [];
    for (let index = 0; index < n; index++) {
      pastposter.push(pastEventResults[0][index].poster);
    }

    var dates = [];
    for (let index = 0; index < n; index++) {
      dates.push(pastEventResults[0][index].start_date);
    }
    const campusevents = {
      eventid: pasteventid,
      event: pasteventname,
      posters: pastposter,
      date: dates,
      count: n,
    };

    // console.log(campusevents);

    res.render("school.ejs", campusevents);
  } catch (error) {
    console.log(error);
  }
});
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get("/campus-seemore", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT eventID, eventname, poster, start_date FROM events WHERE pan_campus = 1 AND end_date > CURDATE();"
    );

    var n = results[0].length;
    // console.log(n);
    var eventid = [];
    for (let index = 0; index < n; index++) {
      eventid.push(results[0][index].eventID);
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

    // console.log(campusevents);

    res.render("school.ejs", campusevents);
  } catch (error) {
    console.log(error);
  }
});

app.get("/seemore-upcomming", async (req, res) => {
  //console.log(req.session.user);
  try {
    const Upresults = await db.query(
      "SELECT p.* FROM participated p INNER JOIN events e ON p.eventID = e.eventID WHERE p.regno = ? AND e.end_date > CURDATE(); ",
      [req.session.user]
    );
    var events = new Array();
    var l = Upresults[0].length;
    var t = l;
    console.log(Upresults[0]);
    while (0 < t) {
      // console.log("hello");
      var event = await db.query("select * from events where eventID=?", [
        Upresults[0][t - 1].eventID,
      ]);
      events.push(event[0][0]);
      t--;
    }
    // console.log(events);
    var eventid = [];
    for (let index = 0; index < l; index++) {
      eventid.push(events[index].eventID);
    }

    var eventname = [];
    for (let index = 0; index < l; index++) {
      eventname.push(events[index].eventname);
    }
    var date = [];
    for (let index = 0; index < l; index++) {
      date.push(events[index].start_date);
    }
    var poster = [];
    for (let index = 0; index < l; index++) {
      poster.push(events[index].poster);
    }
    const eventss = {
      eventid: eventid,
      event: eventname,
      posters: poster,
      date: date,
      count: l,
    };
    res.render("school.ejs", eventss);
  } catch (error) {
    console.log(error);
  }
});

app.get("/recomm-seemore", async (req, res) => {
  try {
    const userRecommended = await db.query(
      "SELECT e.* FROM events e INNER JOIN user u ON e.categoryID = u.categoryID WHERE u.regno = ? AND e.end_date > CURDATE();",
      [req.session.user]
    );
    console.log(userRecommended[0]);
    var q = userRecommended[0].length;
    var recommendeventid = [];
    for (let index = 0; index < q; index++) {
      recommendeventid.push(userRecommended[0][index].eventID);
    }

    var recommendeventname = [];
    for (let index = 0; index < q; index++) {
      recommendeventname.push(userRecommended[0][index].eventname);
    }
    var recommendposter = [];
    for (let index = 0; index < q; index++) {
      recommendposter.push(userRecommended[0][index].poster);
    }
    var recommenddates = [];
    for (let index = 0; index < q; index++) {
      recommenddates.push(userRecommended[0][index].start_date);
    }
    const events = {
      eventid: recommendeventid,
      event: recommendeventname,
      posters: recommendposter,
      date: recommenddates,
      count: q,
    };
    console.log(events);
    res.render("school.ejs", events);
  } catch (error) {
    console.log(error);
  }
});

// event pagee

app.get("/event/:id", async (req, res) => {
  // console.log("event 1");
  const eventId = req.params;
  //console.log(eventId);
  try {
    const result = await db.query("select * from events where eventid=? ", [
      eventId.id,
    ]);
    //console.log(result[0]);
    const hostID = result[0][0].hostID;
    // console.log(hostID);
    const host = await db.query("select hostname from host where hostid=?", [
      result[0][0].hostID,
    ]);

    var eventdetails = result[0][0];
    eventdetails.host = host[0][0].hostname;
    //console.log(eventdetails);

    res.render("event.ejs", eventdetails);
  } catch (error) {
    console.log(error);
  }
});

// admin event page

app.get("/adminevent/:id", async (req, res) => {
  // console.log("event 1");
  const eventId = req.params;
  //console.log(eventId);
  try {
    const result = await db.query("select * from events where eventid=? ", [
      eventId.id,
    ]);
    //console.log(result[0]);
    const hostID = result[0][0].hostID;
    console.log(hostID);
    const host = await db.query("select hostname from host where hostid=?", [
      result[0][0].hostID,
    ]);

    var eventdetails = result[0][0];
    eventdetails.host = host[0][0].hostname;
    //console.log(eventdetails);

    res.render("adminevent.ejs", eventdetails);
  } catch (error) {
    console.log(error);
  }
});

app.get("/up_seemore_A", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT * FROM events WHERE hostid = ? AND end_date > CURDATE();",
      [req.session.user]
    );
    //console.log(results[0]);
    var n = results[0].length;
    // console.log(n);
    var eventid = [];
    for (let index = 0; index < n; index++) {
      eventid.push(results[0][index].eventID);
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

    const hostevents = {
      eventid: eventid,
      event: eventname,
      posters: poster,
      date: dates,
      count: n,
    };
    res.render("adminseemore.ejs", hostevents);
  } catch (error) {
    console.log(error);
  }
});

app.get("/past_seemore_A", async (req, res) => {
  try {
    const pastEventResults = await db.query(
      "SELECT * FROM events WHERE hostid = ? AND end_date < CURDATE();",
      [req.session.user]
    );
    //console.log(pastEventResults[0]);
    var n = pastEventResults.length;
    n = n - 1;

    var pasteventid = [];
    for (let index = 0; index < n; index++) {
      pasteventid.push(pastEventResults[0][index].eventID);
    }

    var pasteventname = [];
    for (let index = 0; index < n; index++) {
      pasteventname.push(pastEventResults[0][index].eventname);
    }
    var pastposter = [];
    for (let index = 0; index < n; index++) {
      pastposter.push(pastEventResults[0][index].poster);
    }
    var dates = [];
    for (let index = 0; index < n; index++) {
      dates.push(pastEventResults[0][index].start_date);
    }
    const hostevents = {
      eventid: pasteventid,
      event: pasteventname,
      posters: pastposter,
      date: dates,
      count: n,
    };
    res.render("adminseemore.ejs", hostevents);
  } catch (error) {
    console.log(error);
  }
});

app.get("/A-logo-home", (req, res) => {
  adminpage(req, res);
});

///////////// poster storage and event insertion

app.get("/createEvent", (req, res) => {
  res.render("createEvent.ejs");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/create", upload.single("poster"), async (req, res) => {
  const eventName = req.body.eventName;
  const campusWide = req.body.campusWide;
  let targeted = req.body.targeted;
  const eventDate = req.body.eventDate;
  const endDate = req.body.endDate;
  const eventTime = req.body.eventTime || null;
  const venue = req.body.venue;
  const registration = req.body.registration;
  let range = req.body.range || null;
  const desc = req.body.desc;
  const formlink = req.body.formlink || null;
  const attendance = req.body.attendance;
  const category = req.body.category;
  const hostid = req.session.user;

  const imagePath = "\\images\\" + req.file.filename;
  const poster = imagePath;

  if (campusWide == 1) {
    targeted = null;
  }
  if (registration == 0) {
    range = null;
  }

  try {
    const sql = `INSERT INTO events (eventName, pan_campus, audience, start_date, end_date, event_time, venue, registration, reg_range, poster,  event_desc, formlink, attendance, categoryID, hostID) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
    const values = [
      eventName,
      campusWide,
      targeted,
      eventDate,
      endDate,
      eventTime,
      venue,
      registration,
      range,
      poster,
      desc,
      formlink,
      attendance,
      category,
      hostid,
    ];
    await db.query(sql, values);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465, // true for 465, false for other ports
      host: "smtp.gmail.com",
      auth: {
        user: "britojaison123@gmail.com",
        pass: "jxre inap eciv uhmk",
      },
    });

    let results = await db.query(`select email from user where categoryID=?`, [
      category,
    ]);
    let mail = results[0][0].email;
    console.log("Mail is " + mail);

    var mailOptions = {
      from: "britojaison123@gmail.com",
      to: mail,
      subject: "New Event Is Up  ",
      text: `Hey there,

A new event on your interest is up, come register for it.

Event Name: ${eventName}
Date: ${eventDate}
Venue: ${venue}
Time: ${eventTime}
`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error + " ippo ellam mansilayilleda shonnee");
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
  adminpage(req, res);
});

async function editlist(req, res) {
  try {
    const results = await db.query(
      "SELECT * FROM events WHERE hostid = ? AND end_date > CURDATE();",
      [req.session.user]
    );
    //console.log(results[0]);
    var n = results[0].length;
    // console.log(n);
    var eventid = [];
    for (let index = 0; index < n; index++) {
      eventid.push(results[0][index].eventID);
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

    const hostevents = {
      eventid: eventid,
      event: eventname,
      posters: poster,
      date: dates,
      count: n,
    };
    res.render("editlist.ejs", hostevents);
  } catch (error) {
    console.log(error);
  }
}

app.get("/editEvent", async (req, res) => {
  editlist(req, res);
});

app.get("/deleteEvent/:id", async (req, res) => {
  let id = req.params.id;
  console.log(`Deleting ${id}`);
  await db.query("DELETE FROM events WHERE eventID = ?", [id]);
  editlist(req, res);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}
app.get("/editEvent/:id", async (req, res) => {
  const eventid = req.params.id;
  console.log(eventid + " is the ID");
  try {
    const result = await db.query("select * from events where eventid=?", [
      eventid,
    ]);
    // console.log(result[0]);
    const start_date = formatDate(result[0][0].start_date);
    const end_date = formatDate(result[0][0].end_date);
    const eventdetails = {
      eventid: result[0][0].eventID,
      eventname: result[0][0].eventname,
      pan_campus: result[0][0].pan_campus,
      audience: result[0][0].audience,
      start_date: start_date,
      end_date: end_date,
      event_time: result[0][0].event_time,
      venue: result[0][0].venue,
      event_desc: result[0][0].event_desc,
      attendance: result[0][0].attendance,
      registration: result[0][0].registration,
      reg_range: result[0][0].reg_range,
      poster: result[0][0].poster,
      categoryID: result[0][0].categoryID,
      formlink: result[0][0].formlink,
      hostID: result[0][0].hostID,
    };
    console.log(eventdetails);
    res.render("editevent.ejs", eventdetails);
  } catch (error) {
    console.log(error);
  }
});

app.post("/update/:id", async (req, res) => {
  var id = req.params.id;
  console.log(req.file);
  // const imagePath = "\\images\\" + req.file.filename;
  // const poster = imagePath;
  console.log(req.body);
  try {
    await db.query(
      "UPDATE events SET eventName=?,pan_campus=?,audience=?,start_date=?,end_date=?,event_time=?,venue=?,event_desc=?,attendance=?,registration=?,reg_range=?,categoryID=?,formlink=? WHERE eventID = ?",
      [
        req.body.eventName,
        req.body.campusWide,
        req.body.targeted,
        req.body.startDate,
        req.body.endDate,
        req.body.eventTime,
        req.body.venue,
        req.body.desc,
        req.body.attendance,
        req.body.registration,
        req.body.range,
        // poster,
        req.body.category,
        req.body.formlink,
        id,
      ]
    );
    editlist(req, res);
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
