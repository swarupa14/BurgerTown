//Packages

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mysql = require("mysql");
const fileUpload = require('express-fileupload');
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
  useraddress: "",
  useremail: ""
};
//var fname,lname;
//let orderId=0;
//let order_id=5;
//var i = 0;
let c = 0;
var flag = 0;
app.use(fileUpload());
let addonName = [];
let itemSpiceLvl = [];
let user_flag = 0;
let adminFlag=0;
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
var totalpricearr = [];
var itemnum = [];
let crossinput = 0;

db.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("MYSQL connected...");
})
var j = 0;
var input = 0;
app.post("/signout", function(req, res) {
  user_data = {
    username: "",
    usernumber: "",
    useraddress: ""
  };
  user_flag = 0;
  allItems = [];
  totprice = 0;
  totalpricearr = [];
  totalpricearr.push(0);
  resultprice = [];
  resultprice.push(0);
  itemnum = [];
  addonName = [];
  itemSpiceLvl = [];
  x = "";
  tempprice = 0;
  crossinput = 0;
  flag = 0;
  j = 0;
  input = 0;
  flagpos = 0;
  res.redirect("back");
  res.end();

});

//Get item data from behav.js by clicking add to cart button
app.post("/item", function(req, res) {
  totprice = 0;
  input = 0;
  flagpos = 1;
  itemnum.push(1);

  allItems.push(req.body.itemData);
  c = allItems.length;
  if (allItems[c - 1].type == 1) {
    addonName.push(allItems[c - 1].addon.toString());
    itemSpiceLvl.push(allItems[c - 1].spiceLvl);
    x = allItems[c - 1].addon.toString();
    flag = 1;


  } else if (allItems[c - 1].type == 2) {
    addonName.push(allItems[c - 1].addon.toString());
    itemSpiceLvl.push(null);
    x = allItems[c - 1].addon.toString();
    flag = 2;
  } else if (allItems[c - 1].type == 4) {
    addonName.push(null);
    itemSpiceLvl.push(allItems[c - 1].spiceLvl);
    flag = 3;

  } else {
    addonName.push(null);
    itemSpiceLvl.push(null);
    flag = 3;

  }

  tempprice = parseInt(allItems[c - 1].price);


  res.end();


});

//Get Number input Data

var flagpos = 0;


app.post("/number", function(req, res) {

  totprice = 0;
  input = 1;


  var n = req.body.itemAmount;
  j = req.body.index;
  if (itemnum[req.body.index] < n) {
    flagpos = 1;

  } else if (itemnum[req.body.index] == n && n == 1) {


  } else {
    flagpos = 0;

  }

  itemnum[req.body.index] = n;
  amount = parseInt(itemnum[j]);

  if (allItems[j].type == 1) {
    x = allItems[j].addon.toString();
    flag = 1;

  } else if (allItems[j].type == 2) {
    x = allItems[j].addon.toString();
    flag = 2;

  } else if (allItems[j].type == 3 || allItems[j].type == 4) {
    flag = 3;
  }
  tempprice = parseInt(allItems[j].price);
  //  console.log("ITEM price" + totprice);


  res.end();

});

//crossing from cart
var cross;

app.post("/cross", function(req, res) {
  crossinput = 1;
  totprice = 0;
  cross = req.body.crossindex;
  allItems.splice(cross, 1);

  itemnum.splice(cross, 1);

  res.end();
//  i--;

});


let userName="";
let userPhone="";
let userAddress="";
let orderID=0;
let ocTotalPrice=0;
let orderDesc=[];
let ocItemName=[];
let ocAddon=[];
var today = new Date();
var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var estTime= today.getHours() +1+ ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = time+' '+date;
var estDateTime=estTime+' '+date;
//Get data from behav js through clicking confirm order button
app.post("/checkout", function(req, res) {
  //let userPhone = userDataSignIn.phone;
   userName = req.body.username;
   userPhone = req.body.usernumber;
   userAddress = req.body.useraddress;
  let sql5 = "CALL insert_order(?,?,?);";
  query = db.query(sql5, [userName, userPhone, userAddress], function(err, results) {
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
    let query = db.query(sql3, [itemName, addonName[i], itemPrice, itemSpiceLvl[i], itemnum[i]], function(err, results, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log("INSERT ITEMS SUCCESSFUL");
      }
    });
  }
  let sql6 = "CALL update_order();";
  query = db.query(sql6, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log("UPDATE ORDER SUCCESSFUL");
    }
  });
  let sql9="select orderID,total_price from orders where phone="+mysql.escape(userPhone)+" order by orderID desc";
  query = db.query(sql9, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      orderID=results[0].orderID;
      ocTotalPrice=results[0].total_price;
      console.log(orderID);
      let sql10="CALL order_description(?)";
      query = db.query(sql10, [orderID],function(err, results) {
        if (err) {
          console.log(err);
        } else {
          orderDesc=results[0];
          ocItemName=results[1];
          ocAddon=results[2];
          console.log(ocAddon);
        }
      });
    }
  });
  allItems = [];
  totprice = 0;
  totalpricearr = [];
  totalpricearr.push(0);
  resultprice = [];
  resultprice.push(0);
  itemnum = [];
  addonName = [];
  itemSpiceLvl = [];
  x = "";
  tempprice = 0;
  crossinput = 0;
  flag = 0;
  j = 0;
  input = 0;
  flagpos = 0;
  orderDesc=[];
  ocItemName=[];
  ocAddon=[];
  res.redirect("orderconfirmed");
  res.end();

});

let ohOrderDet=[];
var ohOrderDesc=[];
var ohOcItemName=[];
var ohOcAddon=[];
app.post("/getorderhis",function(req,res){
  let sql9="select orderID,DATE_FORMAT(date, '%Y-%m-%d') as oDate,order_status,total_price from orders where phone="+mysql.escape(user_data.usernumber);
  query = db.query(sql9, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      ohOrderDet=results;
      console.log(results[0].orderID);
      let sql10;
        for(var i=0;i<ohOrderDet.length;i++){
        sql10="CALL order_description(?)";
        query = db.query(sql10, [results[i].orderID],function(err, res) {
          if (err) {
            console.log(err);
          } else {
            orderDesc=res[0];
            ocItemName=res[1];
            ocAddon=res[2];
            //console.log(orderDesc[0].quant);
            ohOrderDesc.push(orderDesc);
            ohOcItemName.push(ocItemName);
            ohOcAddon.push(ocAddon);
            //console.log(ocAddon);
          }
        });
      //  console.log(orderDesc);

      }
    }
  });
  ohOrderDesc=[];
  ohOcItemName=[];
  ohOcAddon=[];
  res.redirect("orderhistory");
});


//ADMIN SECTION
let dashAdd="dash-active";
let dashUp="";
let dashStat="";
let orderIDForUpdate=0;
let orderDetailsForUpdate={
  uname:"",
  unumber: "",
  uaddress: ""
};
app.post("/admin",function(req,res){
  adminFlag=1;
  dashAdd="dash-active";
  dashUp="";
  dashStat="";
  let item_name= req.body.itemname;
  let item_section = req.body.itemsection;
    let item_ingredients= req.body.ingredients;
  let  item_price= req.body.price;
    let file = req.files.uploaded_image;
	let img_name=file.data;
  console.log(file);
 //file.mv('public/img/'+file.name, function(err) {
  let sql = "CALL insert_items(?,?,?,?,?);";
  let query = db.query(sql, [item_name,item_section,item_ingredients,item_price,img_name], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
//});
  res.redirect("/menu");
});


let del = 0,
  disp = 0,
  pend = 0;
let orderInfo = [];
let orderDate = '0000-00-00';
let orderStatus = 'Test';
app.post("/orderstat", function(req, res) {
  adminFlag=0;
  dashStat="dash-active";
  dashAdd="";
  dashUp="";
  orderDate = req.body.orderDate;
  orderStatus = req.body.stat1;
  console.log(orderStatus);
  res.redirect("admin");
});

//See order status
app.get("/admin", function(req, res) {
  let sql = 'CALL get_order_details(?,?);';
  let query = db.query(sql, [orderDate, orderStatus], function(err, results, fields) {
    if (err) console.log(err);
    else {
      if (orderStatus == "") {
        del = results[2][0].X1;
        disp = results[3][0].X2;
        pend = results[4][0].X3;
        orderInfo=[];
      } else if (orderStatus == "Delivered") {
        del = results[1][0].Y;
        disp =0;
        pend=0;
        orderInfo = results[0];
      } else if (orderStatus == "Dispatched") {
        disp = results[1][0].Y;
        del=0;
        pend=0;
        orderInfo = results[0];
      } else if (orderStatus == "Pending") {
        pend = results[1][0].Y;
        del=0;
        disp=0;
        orderInfo = results[0];
      } else if (orderStatus == "All"){
        del = results[2][0].X1;
        disp = results[3][0].X2;
        pend = results[4][0].X3;
        orderInfo=results[5];
      }
      res.render("admin", {
        status_home: "active",
        status_location: "",
        status_menu: "",
        status_contact: "",
        status_signup: "",
        status_cart: "",
        orderInfo: orderInfo,
        del: del,
        disp: disp,
        pend: pend,
        uname: orderDetailsForUpdate.uname,
        unumber: orderDetailsForUpdate.unumber,
        uaddress: orderDetailsForUpdate.uaddress,
        admin_flag: adminFlag,
        dash_add: dashAdd,
        dash_up: dashUp,
        dash_stat: dashStat

      });
    }
  });
});

//Update order status
app.post("/getordid", function(req,res){
  dashUp="dash-active";
  dashStat="";
  dashAdd="";
  orderIDForUpdate=req.body.ord_id;
  let sql="select * from orders where orderID=?";
  let query= db.query(sql,[orderIDForUpdate],(err,result)=>{
    if(err) console.log(err);
    else{
      orderDetailsForUpdate.uname=result[0].user_name;
      orderDetailsForUpdate.unumber=result[0].phone;
      orderDetailsForUpdate.uaddress=result[0].address;
    }
  });
  res.redirect("admin");
  adminFlag=2;
});

app.get("/admin", function(req,res){
  res.render("admin", {
    status_home: "active",
    status_location: "",
    status_menu: "",
    status_contact: "",
    status_signup: "",
    status_cart: "",
    uname: orderDetailsForUpdate.uname,
    unumber: orderDetailsForUpdate.unumber,
    uaddress: orderDetailsForUpdate.uaddress,
    admin_flag: adminFlag,
    dash_add: dashAdd,
    dash_up: dashUp,
    dash_stat: dashStat
  });
});
let updateOrderStatus="";
app.post("/updateorderinfo", function(req,res){
  orderDetailsForUpdate.uname=req.body.uname;
  orderDetailsForUpdate.unumber=req.body.unumber;
  orderDetailsForUpdate.uaddress=req.body.uaddress;
  updateOrderStatus=req.body.stat2;
  let sql="CALL update_order_details(?,?,?,?,?);";
  let query= db.query(sql,[orderIDForUpdate,orderDetailsForUpdate.uname,orderDetailsForUpdate.uaddress,orderDetailsForUpdate.unumber,
  updateOrderStatus],(err,result)=>{
    if(err) console.log(err);
    else{
      console.log("Update Successful");
    }
  });
  orderDetailsForUpdate.uname="";
  orderDetailsForUpdate.unumber="";
  orderDetailsForUpdate.uaddress="";
  res.redirect("admin");
});


//Get home page
app.get("/", function(req, res) {
  //TOTAL NUMBER OF ITEMS IN CART
  var k, sum = 0;
  for (k = 0; k < allItems.length; k++) {
    sum = parseInt(sum) + parseInt(itemnum[k]);
  }
  res.render("index", {
    itemnumber: sum,
    cartitems: allItems,
    itemamount: itemnum,
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

totprice = 0;
var v;
var tot_temp_price;
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
  //TOTAL NUMBER OF ITEMS IN CART
  var k, sum = 0;
  for (k = 0; k < allItems.length; k++) {
    sum = parseInt(sum) + parseInt(itemnum[k]);
  }
  totprice = 0;
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
            //    console.log(results1[0]);
            if (input != 1) {

              resultprice.push(results1[0].price);
              tot_temp_price = parseInt(totprice) + parseInt(tempprice) + parseInt(results1[0].price);
              totalpricearr.push(tot_temp_price);

            }


          } else if (flag == 3) {

            if (input != 1) {

              resultprice.push(0);
              tot_temp_price = parseInt(totprice) + parseInt(tempprice) + parseInt(0);
              totalpricearr.push(tot_temp_price);

            }


          }
          if (crossinput == 1) {
            var p = parseInt(cross) + parseInt(1);
            console.log("Before slicing" + totalpricearr);
            totalpricearr.splice(p, 1);


            resultprice.splice(p, 1);
            console.log("After slicing" + totalpricearr);
            console.log("After slicing addonprice" + resultprice);

            crossinput = 0;

          }

          console.log("TOtal price array" + totalpricearr);
          console.log("Item num" + itemnum);
          for (v = 0; v < allItems.length; v++) {
            //  console.log("CALCULATING TOTAL PRICE!");
            totprice = parseInt(totprice) + parseInt(totalpricearr[v + 1] * itemnum[v]);
          }


          console.log(resultprice);
          x = "";
          flag = 0;
          tempprice = 0;
          var splitUserName=user_data.username.split(" ");
          res.render(dest, {
            itemnumber: sum,
            cartitems: allItems,
            itemamount: itemnum,
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
            fname: splitUserName[0],
            lname: splitUserName[1],
            email: user_data.useremail,
            address: user_data.useraddress,
            phone: user_data.usernumber,
            user_flag: user_flag,
            orderInfo: orderInfo,
            del: del,
            disp: disp,
            pend: pend,
            uname: orderDetailsForUpdate.uname,
            unumber: orderDetailsForUpdate.unumber,
            uaddress: orderDetailsForUpdate.uaddress,
            admin_flag: adminFlag,
            dash_add: dashAdd,
            dash_up: dashUp,
            dash_stat: dashStat,
            ocName: userName,
            ocContact: userPhone,
            ocAddress: userAddress,
            dateTime: dateTime,
            order_id: orderID,
            estTime: estDateTime,
            orderDesc: orderDesc,
            ocItemName: ocItemName,
            ocAddon: ocAddon,
            ocTotalPrice: ocTotalPrice,
            ohOrderDet: ohOrderDet,
            ohOrderDesc: ohOrderDesc,
            ohOcItemName: ohOcItemName,
            ohOcAddon: ohOcAddon
          });
        }
      });
    }
  });
});

//Change account details module
app.post("/myaccount",function(req,res){
  let userName = req.body.fname + " " + req.body.lname;
  let email= req.body.email;
  let address= req.body.address;
  let phone= req.body.phone;
  console.log(userName,email,address,phone);
  let sql="CALL update_user_details(?,?,?,?,?);";
  let query=db.query(sql,[phone,userName,address,email,user_data.usernumber],(err,result)=>{
    if(err) throw err;
    user_data = {
      username: userName,
      usernumber: phone,
      useraddress: address,
      useremail: email
    };
    res.redirect("/");
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
  if (userData.pass != req.body.c_pass) {
    go = 0;
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
  let login_flag=0;
  userDataSignIn.phone = req.body.phone;
  userDataSignIn.passWord = req.body.passWord;
  let sql = 'select * from user';
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      for (var i = 0; i < result.length; i++) {
        if ((userDataSignIn.phone === result[i].phone) && (userDataSignIn.passWord === result[i].pass)) {
          login_flag=1;
          console.log("Signed in successfully");
          user_data = {
            username: result[i].user_name,
            usernumber: result[i].phone,
            useraddress: result[i].address,
            useremail: result[i].email
          };
          user_flag = 1;
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
                var splitUserName=user_data.username.split(" ");
                res.render(dest, {
                  itemnumber: sum,
                  cartitems: allItems,
                  itemamount: itemnum,
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
                  fname: splitUserName[0],
                  lname: splitUserName[1],
                  email: user_data.useremail,
                  address: user_data.useraddress,
                  phone: user_data.usernumber,
                  user_flag: user_flag,
                  orderInfo: orderInfo,
                  del: del,
                  disp: disp,
                  pend: pend,
                  uname: orderDetailsForUpdate.uname,
                  unumber: orderDetailsForUpdate.unumber,
                  uaddress: orderDetailsForUpdate.uaddress,
                  admin_flag:adminFlag,
                  dash_add: dashAdd,
                  dash_up: dashUp,
                  dash_stat: dashStat,
                  ocName: userName,
                  ocContact: userPhone,
                  ocAddress: userAddress,
                  dateTime: dateTime,
                  order_id: orderID,
                  estTime: estDateTime,
                  orderDesc: orderDesc,
                  ocItemName: ocItemName,
                  ocAddon: ocAddon,
                  ocTotalPrice: ocTotalPrice,
                  ohOrderDet: ohOrderDet,
                  ohOrderDesc: ohOrderDesc,
                  ohOcItemName: ohOcItemName,
                  ohOcAddon: ohOcAddon
                });

              }
            });
          });
          res.redirect("back");
          break;
        }
      }
      if(login_flag==0)
        res.redirect("back");

    }
  });
});



//Listening to server on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
