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


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "sqlmakri",
    database: "bmf2",
  })
  .promise();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

async function adminpage(req, res) {

}

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

  //recommended events!!!!!!

  const userRecommended = await db.query(
    "select e.eventid,e.eventname,e.poster,e.start_date,u.regno from events e inner join user u  on e.categoryid=u.categoryid where u.regno=?;",
    [req.session.user]);
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

  // schoool events!!!!!!!!!!!!!!!!!!!!!!

  const userresults = await db.query(
    "select user.regno,user.dept_id,department.school_id from user inner join department on user.dept_id=department.deptid where regno=?;",
    [req.session.user]
  );
  const schoolresults = await db.query("select eventid,eventname,poster,start_date from events where schoolid=?", [userresults[0][0].school_id]);
  //console.log(schoolresults[0]);
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
    schoolcount: p,

    recommendeventid: recommendeventid,
    recommendevent: schooleventname,
    recommendposters: schoolposter,
    recommenddate: schooldates,
    recommendcount: q

  };

  res.render("home.ejs", events);
}

app.get("/", async (req, res) => {

  const message = {
    content: "",
  };


  res.render("login.ejs", message);
  console.log(" alen  11223343 \n swo 1100001 pwd 12345678");
});

app.get("/logo-home", async (req, res) => {
  homepage(req, res);
});

app.get("/profile", async (req, res) => {
  console.log(req.session.user);
  try {
    const results = await db.query(
      "select * from participated where regno=?",
      [req.session.user]);
    var events = new Array();
    var l = results[0].length;
    var t = l;
    while (0 < t) {
      console.log("hello");
      var event = await db.query(
        "select * from events where eventID=?",
        [results[0][t - 1].eventID]
      );
      events.push(event[0][0]);
      t--;
    }
    console.log(events);
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
    const eventsdetails = {
      eventid: eventid,
      event: eventname,
      posters: poster,
      count: l
    };
    console.log(eventsdetails);

    res.render("profile.ejs", eventsdetails);
  } catch (error) {
    console.log(error);
  }

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
        // console.log(user.role);
        if (user.role == "A") {
          adminpage(req, res);
          res.render("admin.ejs");
        } else {

          homepage(req, res);
        }
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
    res.render("school.ejs", events);
  } catch (error) {
    console.log(error);
  }

});

app.get("/recomm-seemore", async (req, res) => {

  try {
    const userRecommended = await db.query(
      "select e.eventid,e.eventname,e.poster,e.start_date,u.regno from events e inner join user u  on e.categoryid=u.categoryid where u.regno=?;",
      [req.session.user]);
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
      count: q

    };
    console.log(events);
    res.render("school.ejs", events);
  } catch (error) {
    console.log(error);
  }

});

app.get("/event/:id", async (req, res) => {
  // console.log("event 1");
  const eventId = req.params;
  console.log(eventId);
  try {
    const result = await db.query("select * from events where eventid=? ", [eventId.id]);
    // const clubid=result[0][0].clubID;
    // console.log(clubid);
    const club = await db.query("select clubname from clubs where clubid=?", [result[0][0].clubID]);

    var eventdetails = result[0][0];
    eventdetails.club = club[0][0].clubname;
    console.log(eventdetails);

    res.render("event.ejs", eventdetails);

  } catch (error) {
    console.log(error);
  }

});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
