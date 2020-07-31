//Packages

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mysql = require("mysql");
const _ = require("lodash");
let status = ["", "", "", "", "", ""];
let allItems = [];
let userDataSignIn = {
  phone: " ",
  passWord: " "
};
var user_data = {
  username: "",
  usernumber: "",
  useraddress: ""
};
//let orderId=0;
//let order_id=5;
var i = 0;
var flag = 0;

let addonName = [];
let itemSpiceLvl = [];
let user_flag=0;
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
let x = "Regular";
let tempprice = 0;
let totprice = 0;

db.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("MYSQL connected...");
})

app.post("/signout", function(req,res){
  user_data = {
    username: "",
    usernumber: "",
    useraddress: ""
  };
  user_flag=0;
  allItems=[];
  totprice=0;
  res.redirect("back");

});

//Get item data from behav.js by clicking add to cart button
app.post("/item", function(req, res) {

  allItems.push(req.body.itemData);
  if (allItems[i].type == 1) {
    addonName.push(allItems[i].addon.toString());
    itemSpiceLvl.push(allItems[i].spiceLvl);
    x = allItems[i].addon.toString();
    flag = 1;


  } else if (allItems[i].type == 2) {
    addonName.push(allItems[i].addon.toString());
    itemSpiceLvl.push(null);
    x = allItems[i].addon.toString();
    flag = 2;
  } else if (allItems[i].type == 4) {
    addonName.push(null);
    itemSpiceLvl.push(allItems[i].spiceLvl);
    flag = 3;

  } else {
    addonName.push(null);
    itemSpiceLvl.push(null);
    flag = 3;

  }

  tempprice = parseInt(allItems[i].price);
  i++;

  res.end();


});

//Get data from behav js through clicking confirm order button
app.post("/checkout", function(req, res) {
  //let userPhone = userDataSignIn.phone;
  let userName = req.body.username;
  let userPhone = req.body.usernumber;
  let userAddress = req.body.useraddress;
  let sql6 = "CALL get_name_and_orderid();";
  let query = db.query(sql6, function(err, results) {
    if (err)
      console.log(err);
    else {
      let order_id = results[0][0].Y;
      let sql5 = "CALL insert_order(?,?,?,?);";
      query = db.query(sql5, [order_id, userName, userPhone, userAddress], function(err, results) {
        if (err) {
          console.log(err);
        } else {
          console.log("INSERT ORDER SUCCESSFUL");
        }
      });
      for (var i = 0; i < allItems.length; i++) {
        let itemName = allItems[i].name;
        let itemPrice = allItems[i].price;

        let sql3 = "CALL calc_tot_price(?,?,?,?,?);";
        let query = db.query(sql3, [order_id, itemName, addonName[i], itemPrice, itemSpiceLvl[i]], function(err, results, fields) {
          if (err) {
            console.log(err);
          } else {
            console.log("INSERT ITEMS SUCCESSFUL");
          }
        });
      }
      let sql4 = "CALL update_order(?);";
      query = db.query(sql4, [order_id], function(err, results) {
        if (err) {
          console.log(err);
        } else {
          console.log("UPDATE ORDER SUCCESSFUL");
        }
      });
      res.redirect("/");
      res.end();
      allItems=[];
      totprice=0;
    }
  });
});


//Send data back to behav js
// app.get("/signout", function(req, res) {
//   res.json({
//     user_data: user_data,
//     user_flag: user_flag
//   });
// });

//Get home page
app.get("/", function(req, res) {
  res.render("index", {
    itemnumber: allItems.length,
    cartitems: allItems,
    // itemamount:itemnum,
    addonprice: resultprice,
    totalprice: totprice,
    status_home: "active",
    status_location: "",
    status_menu: "",
    status_contact: "",
    status_signup: "",
    status_cart: "",
    username: user_data.username,
    usernumber: user_data.usernumber,
    useraddress: user_data.useraddress,
    user_flag: user_flag

  });
});

var resultprice = [];
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
      let sql1 = 'Select * from addon where name=?';

      let query1 = db.query(sql1, [x], function(err, results1, fields) {
        if (err) {
          console.log(err);
        } else {

          if (flag != 3 && x != "") {
            console.log(results1[0]);

            resultprice.push(results1[0].price);
            console.log(flag);
            totprice = tempprice + parseInt(totprice) + parseInt(results1[0].price);

          } else if (flag == 3) {
            resultprice.push(0);
            totprice = tempprice + parseInt(totprice) + parseInt(0);
          }

          console.log(resultprice);
          x = "";
          flag = 0;
          tempprice = 0;
          res.render(dest, {
            itemnumber: allItems.length,
            cartitems: allItems,
            // itemamount:itemnum,
            addonprice: resultprice,
            totalprice: totprice,
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
            shakes: results[4],
            username: user_data.username,
            usernumber: user_data.usernumber,
            useraddress: user_data.useraddress,
            user_flag: user_flag
          });

        }
      });
    }
  });
});


//Signup module
app.post("/signup", function(req, res) {
  var go = 1;
  let userName = req.body.f_name + " " + req.body.l_name;
  const userData = {
    user_name: userName,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    pass: req.body.pass,
  };
  if (userData.user_name === "" || userData.email === "" || userData.address === "" || userData.phone.length != 11 || userData.pass === "" || req.body.c_pass === "" || req.body.agree != 'on') {
    go = 0;
  }
  if(userData.pass != req.body.c_pass){
    go=0;
  }
  if (go === 1) {
    let sql1 = 'select phone from user where phone =' + mysql.escape(userData.phone);
    let query1 = db.query(sql1, (err, result) => {
      if (err) throw err;
      if (result.length === 1) {
        console.log("This phone number is already in use");
        res.redirect("back");
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
  userDataSignIn.phone = req.body.phone;
  userDataSignIn.passWord = req.body.passWord;
  let sql = 'select * from user';
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      for (var i = 0; i < result.length; i++) {
        if ((userDataSignIn.phone === result[i].phone) && (userDataSignIn.passWord === result[i].pass)) {

          console.log("Signed in successfully");
          user_data = {
            username: result[i].user_name,
            usernumber: result[i].phone,
            useraddress: result[i].address
          };
          user_flag=1;
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
                  itemnumber: allItems.length,
                  cartitems: allItems,
                  // itemamount:itemnum,
                  addonprice: resultprice,
                  totalprice: totprice,
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
                  shakes: results[4],
                  username: user_data.username,
                  usernumber: user_data.usernumber,
                  useraddress: user_data.useraddress,
                  user_flag: user_flag
                });

              }
            });
          });
          res.redirect("back");
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
