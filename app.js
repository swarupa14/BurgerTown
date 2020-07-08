//Packages
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

//Database connection
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

//Get home page
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

//Get any page
app.get("/:lnk", function(req, res) {
  const dest = _.lowerCase(req.params.lnk);
  status = ["", "", "", "", "", ""];

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

  //Loadup Menu and Orders page from Database
  let sql = 'CALL Getmenuitems(?,?,?,?,?);';
  let query = db.query(sql, ['Signature', 'Regulars', "Chef's Special", "Fries", "Shakes"], function(err, results, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      res.render(dest, {
        status_home: status[0],
        status_location: status[1],
        status_menu: status[2],
        status_contact: status[3],
        status_signup: status[4],
        status_cart: status[5],
        signatureitems: results[0],
        regularitems: results[1],
        chefsitems: results[2],
        fries: results[3],
        shakes: results[4]
      });

    }
  });
});


//Signup module
app.post("/signup", function(req, res) {
  var go = 1;
  const userData = {
    f_name: req.body.f_name,
    l_name: req.body.l_name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    pass: req.body.pass,
  };
  if (userData.f_name === "" || userData.l_name === "" || userData.email === "" || userData.address === "" || userData.phone.length != 11 || userData.pass === "" || req.body.c_pass === "" || userData.pass != req.body.c_pass || req.body.agree != 'on') {
    go = 0;
  }
  if (go === 1) {
    let sql1 = 'select email from user where email =' + mysql.escape(userData.email);
    let query1 = db.query(sql1, (err, result) => {
      if (err) throw err;
      if (result.length === 1) {
        console.log("This email is already in use");
        res.redirect("/signup");
      } else {
        let sql = 'insert into user set ?';
        let query = db.query(sql, userData, (err, result) => {
          if (err) throw err;
          console.log(result);
        });
        res.redirect("/");
      }

    });
  }
});

//Signin module
app.post("/:lnk", function(req, res) {

  const userData = {
    phoneOremail: req.body.phoneOremail,
    passWord: req.body.passWord,
  };
  let sql = 'select email,phone,pass from user';
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      for (var i = 0; i < result.length; i++) {
        if (((userData.phoneOremail === result[i].phone) || (userData.phoneOremail === result[i].email)) && (userData.passWord === result[i].pass)) {
          res.redirect("/");
          console.log("Signed in successfully");
          break;
        }
      }
    }


  });
});



//Listening to server on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
