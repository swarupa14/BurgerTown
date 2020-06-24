const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _= require("lodash");
let status=["","","","","",""];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("index",{status_home: "active",
  status_location: "",
  status_menu: "",
  status_contact: "",
  status_signup: "",
  status_cart: ""
  });
});

app.get("/:lnk", function(req,res){
  status=["","","","","",""];
  const dest= _.lowerCase(req.params.lnk)
  switch (dest) {
    case "location": status[1]="active";
    break;
    case "menu": status[2]="active";
    break;
    case "contact": status[3]="active";
    break;
    case "signup": status[4]="active";
    break;
    case "cart": status[5]="active";
    break;
    default:
  }
  res.render(dest,{status_home: status[0],
  status_location: status[1],
  status_menu: status[2],
  status_contact: status[3],
  status_signup: status[4],
  status_cart: status[5]
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
