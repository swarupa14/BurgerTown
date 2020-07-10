// CART SECTION

function openNav() {
  document.getElementById("mySidenav").style.width = "380px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}


// Order Page Activities

let name="";
let price=0;
let spiceLvl = "";
let addon = [];
function Item (name,price,spiceLvl,addon){
  this.name = name;
  this.price= price;
  this.spiceLvl= spiceLvl;
  this.addon= addon;
}
$(".addtocart").click(function() //Clicking the addtocart button
  {
    name= $(this).siblings("h5").text();
    price=parseInt($(this).siblings("h6").find("span").text());

  });

// Modal JS

$("#BurgerModal .adds button").click(function() {
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

$("#BurgerModal .spice button").click(function() {
  $(this).removeClass("btn-outline-warning");
  $(this).addClass("btn-warning");
  $("#BurgerModal .spice button").not(this).removeClass("btn-warning");
  $("#BurgerModal .spice button").not(this).addClass("btn-outline-warning");
  spiceLvl = $(this).text();
});



$("#FriesModal .spice button").click(function() {
  $(this).removeClass("btn-outline-warning");
  $(this).addClass("btn-warning");
  $("#FriesModal .spice button").not(this).removeClass("btn-warning");
  $("#FriesModal .spice button").not(this).addClass("btn-outline-warning");

});

$("#BurgerModal .modal-footer button").click(function() {
  $("#BurgerModal .modal-body button").addClass("btn-outline-warning");
  $("#BurgerModal .modal-body button").removeClass("btn-warning");
  if(spiceLvl===""){
    alert("Please select your desired spice level.");
    $(this).removeAttr("data-dismiss");
  }
  else{
    $(this).attr("data-dismiss","modal");
    let itemData=new Item(name,price,spiceLvl,addon);
    $.post('/item', { itemData: itemData });
  }
});

// SignUp FOrm

$('input[type="checkbox"]').click(function() {

  var inputValue = $(this).attr("value");
  $("." + inputValue).toggleClass("hide");

});

//confirm password check
$(".Signup-form .sign-up").click(function() {
  let pass = $(".pass").val();
  let c_pass = $(".c_pass").val();
  if (pass != c_pass)
    alert("Passwords do not match!");

});
