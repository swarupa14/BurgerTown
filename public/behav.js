// CART SECTION

function openNav() {
  document.getElementById("mySidenav").style.width = "400px";
  document.getElementById("carttt").style.width = "375px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("carttt").style.width = "0";
}


// Order Page Activities
//var allItems=[];
let name = "";
let price = 0;
let spiceLvl = "";
let addon = [];
let type;

function Item(type, name, price, spiceLvl, addon) {
  this.type = type;
  this.name = name;
  this.price = price;
  this.spiceLvl = spiceLvl;
  this.addon = addon;
}
$(".addtocart").click(function() //Clicking the addtocart button
  {
    name = $(this).siblings("h5").text();
    price = parseInt($(this).siblings("h6").find("span").text());

    if ($(this).hasClass("shakes")) {
      type = 3;
      addon.sort();
      let itemData = new Item(type, name, price, spiceLvl, addon);
      $.post('/item', {
        itemData: itemData
      });
      addon = [];
      $('#carttt').load('/order .cartitems');
      $('.side-cart').load('/order .side-cart');

    }

  });

// Modal JS

$("#BurgerModal .adds button").click(function() { //Clicking the addon buttons in BurgerModal
  if ($(this).hasClass("btn-warning")) {
    $(this).removeClass("btn-warning");
    $(this).addClass("btn-outline-warning");
    for (var i = 0; i < addon.length; i++) {
      if (addon[i] === $(this).text()) {
        addon.splice(i, 1);
      }
    }
  } else {
    $(this).removeClass("btn-outline-warning");
    $(this).addClass("btn-warning");
    addon.push($(this).text());
  }
});

$("#BurgerModal .spice button").click(function() { //Clicking the spice-level buttons in BurgerModal
  $(this).removeClass("btn-outline-warning");
  $(this).addClass("btn-warning");
  $("#BurgerModal .spice button").not(this).removeClass("btn-warning");
  $("#BurgerModal .spice button").not(this).addClass("btn-outline-warning");
  spiceLvl = $(this).text();
});



$("#FriesModal .spice button").click(function() { //Clicking the size buttons in FriesModal
  type = 2;
  if ($(this).hasClass("btn-warning")) {
    $(this).removeClass("btn-warning");
    $(this).addClass("btn-outline-warning");
    addon = [];
  } else {
    $(this).removeClass("btn-outline-warning");
    $(this).addClass("btn-warning");
    addon.push($(this).text());
  }

});

$("#BurgerModal .modal-footer button").click(function() { //Clicking the add button in BurgerModal
  $("#BurgerModal .modal-body button").addClass("btn-outline-warning");
  $("#BurgerModal .modal-body button").removeClass("btn-warning");
  if (spiceLvl === "") {
    alert("Please select your desired spice level.");
    $(this).removeAttr("data-dismiss");
    addon = [];
  } else {
    $(this).attr("data-dismiss", "modal");
    if (addon.length == 0)
      type = 4;
    else type = 1;
    addon.sort();
    let itemData = new Item(type, name, price, spiceLvl, addon);
    $.post('/item', {
      itemData: itemData
    });
    addon = [];
    spiceLvl = "";
    $('#carttt').load('/order .cartitems');
    $('.side-cart').load('/order .side-cart');


  }
});

$("#FriesModal .modal-footer button").click(function() { //Clicking the add button in FriesModal
  $("#FriesModal .modal-body button").addClass("btn-outline-warning");
  $("#FriesModal .modal-body button").removeClass("btn-warning");
  if (addon.length == 0) {
    alert("Please select the size of your fries.");
    $(this).removeAttr("data-dismiss");
    addon=[];
  } else {
    $(this).attr("data-dismiss", "modal");
    let itemData = new Item(type, name, price, spiceLvl, addon);
    $.post('/item', {
      itemData: itemData
    });
    addon = [];
    spiceLvl = "";
    $('#carttt').load('/order .cartitems');
    $('.side-cart').load('/order .side-cart');
  }
});


var index,itemAmount;
//NUMBER INPUT
$(document).on('click','.quantity',function(){

itemAmount=$(this).val();
//alert(itemAmount);
  index=($(this ).index(".quantity"));
//alert("INDEX"+index);
  $.post('/number', { itemAmount:itemAmount,index:index });
  $('#carttt').load('/order .cartitems');
$('.side-cart').load('/order .side-cart');


});

// $("#checkout .information .confirm-order-button button").click(function(){ //Clicking the confirm order button in checkout page
//   $.get("/items",function(data){
//     $.post('/itemz', { allItems:data.allItems });
//     console.log(data.allItems);
//   });
// });


// SignUp FOrm

$('input[type="checkbox"]').click(function() {

  var inputValue = $(this).attr("value");
  $("." + inputValue).toggleClass("hide");

});

//confirm password check
$(".Signup-form .sign-up").click(function() {
  let pass = $(".pass").val();
  let c_pass = $(".c_pass").val();
  if (pass != c_pass){
    alert("Passwords do not match!");
  }

});

//ADMin
$(document).on('click','.add-item',function(){
    $('#admin-section .view-block').load('/additemtomenu');
      $(".dash-items p").removeClass("dash-active");
      $(".add-item").addClass("dash-active");

});
$(".order-status").click(function(){
    $('#admin-section .view-block').load('/orderstatus');
    $(".dash-items p").removeClass("dash-active");
    $(".order-status").addClass("dash-active");
});
