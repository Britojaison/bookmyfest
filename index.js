// server
import express from "express";
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2";
import bodyParser from "body-parser";
import { render } from "ejs";
import { isModuleNamespaceObject } from "util/types";
import { count } from "console";
import bcrypt, { hash } from "bcrypt";

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
    "SELECT e.eventid, e.eventname, e.poster, e.start_date, p.regno FROM events e INNER JOIN participated p ON e.eventid = p.eventid WHERE p.regno = ? AND e.end_date > CURDATE();",
    [req.session.user]
  );
  //console.log(userRecommended[0]);
  var q = userRecommended[0].length;
  var recommendeventid = [];
  for (let index = 0; index < q; index++) {
    recommendeventid.push(userRecommended[0][index].eventid);
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
    await db.query('DELETE FROM events WHERE end_date <= ?', [cutOffDate]);

    // Render the login page
    res.render("login.ejs", message);
    console.log(" alen  11223343 \n swo 1100001 pwd 78304923");
  } catch (error) {
    console.error("Error deleting events:", error);
    // Handle the error appropriately
    // For example, render an error page or send an error response
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
    while (0 < t) {
      //console.log("hello");
      var event = await db.query("select * from events where eventID=?", [
        results[0][t - 1].eventID,
      ]);
      events.push(event[0][0]);
      t--;
    }
    //console.log(events);
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
      "SELECT e.* FROM events e JOIN participated p ON e.eventID = p.eventID WHERE p.regno = ? AND e.eventID = 8 AND e.end_date < CURDATE();",
      [req.session.user]
    );
    console.log(req.session.user);
    // console.log(pastEventResults[0]); !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    var n = pastEventResults.length;
    n = n - 1;
    console.log(pastEventResults);

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
    // console.log(eventsdetails);

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

    // res.redirect(`/school/${page}`);
  }
});

// app.get("/school/:page",(req,res)=>{
//   const page = req.params.page; // Access page parameter from req.params
//   console.log("Selected page:", page);
//   // Here you can render the appropriate page based on the selected page parameter
// });

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
      console.log(storedpassword);
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
      console.log(departmentid[0]);
      departmentid = departmentid[0][0].deptID;

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

// past evets see more!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

    console.log(campusevents);

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

    console.log(campusevents);

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
      "select e.eventid,e.eventname,e.poster,e.start_date,u.regno from events e inner join user u  on e.categoryid=u.categoryid where u.regno=?;",
      [req.session.user]
    );
    //console.log(userRecommended[0]);
    var q = userRecommended[0].length;
    var recommendeventid = [];
    for (let index = 0; index < q; index++) {
      recommendeventid.push(userRecommended[0][index].eventid);
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
    console.log(hostID);
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

app.get("/createEvent", (req, res) => {
  // console.log("helllo123");
  res.render("createEvent.ejs");
});

app.post("/create", async (req, res) => {
  const eventName = req.query.eventName;
  const campusWide = req.query.campusWide;
  let targeted = req.query.targeted;
  const eventDate = req.query.eventDate;
  const endDate = req.query.endDate;
  const eventTime = req.query.eventTime;
  const venue = req.query.venue;
  const registration = req.query.registration;
  let range = req.query.range;
  const desc = req.query.desc;
  const formlink = req.query.formlink;
  const attendance = req.query.attendance;
  const category = req.query.category;
  const hostid = req.session.user;
  const poster = "/images/example.png";

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
  } catch (error) {
    console.log(error);
  }

  console.log(req.query);
  adminpage(req, res);
});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
