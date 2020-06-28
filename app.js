const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mysql = require("mysql");
const _ = require("lodash");
let status = ["", "", "", "", "", ""];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use("/public", express.static('./public/'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'burgertown'
});

db.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("MYSQL connected...");
})


app.get("/", function(req, res) {
  res.render("index", {
    status_home: "active",
    status_location: "",
    status_menu: "",
    status_contact: "",
    status_signup: "",
    status_cart: ""
  });
});

app.get("/:lnk", function(req, res) {
  status = ["", "", "", "", "", ""];
  const dest = _.lowerCase(req.params.lnk)
  switch (dest) {
    case "location":
      status[1] = "active";
      break;
    case "menu":
      status[2] = "active";
      break;
    case "contact":
      status[3] = "active";
      break;
    case "signup":
      status[4] = "active";
      break;
    case "cart":
      status[5] = "active";
      break;
    default:
  }
  res.render(dest, {
    status_home: status[0],
    status_location: status[1],
    status_menu: status[2],
    status_contact: status[3],
    status_signup: status[4],
    status_cart: status[5]
  });
});

app.post("/signup", function(req, res) {
    let go = 1;
    const userData = {
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      pass: req.body.pass,
    };
    if (userData.f_name === "") {
      go = 0;
    }
    if (userData.l_name === "") {
      go = 0;
    }
    if (userData.email === "") {
      go = 0;
    }
    if (userData.address === "") {
      go = 0;
    }
    if (userData.phone.length != 11) {
      go = 0;
    }
    if(userData.pass === "")
      go=0;
    if(req.body.c_pass === "")
      go=0;
    if (userData.pass != req.body.c_pass) {
      go = 0;
    }
    if(go===1) {
      let sql = 'insert into user set ?';
      let query = db.query(sql, userData, (err, result) => {
        if (err) throw err;
        console.log(result);
      });
      res.redirect("/signin");
    }
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
