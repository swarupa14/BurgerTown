// CART SECTION

function openNav() {
  document.getElementById("mySidenav").style.width = "375px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}



var totalorder = 0;
var totalprice = 0;
var add = true;

// Order Page Activities

$(".minus").click(function() //Clicking the minus button
  {
    add = false;


  });
$(".plus").click(function() //Clicking the minus button
  {
    add = true;


  });

$(".addtocart").click(function() //Clicking the addtocart button
  {


    if (add) {
      totalorder++;
    } else {
      totalorder--;
      if (totalorder < 0) {
        totalorder = 0;

      }
    }



    $(this).text("Added to Cart");

    $(".hide", this).removeClass("hide");
    $(this).attr("disabled", true);

    var price = $(".prices", this).text();
    totalprice += parseInt(price);
    $(".num").text(totalorder);


  });




// Modal JS

$("#BurgerModal .adds button").click(function() {
  $(this).removeClass("btn-outline-warning");
  $(this).addClass("btn-warning");
});
$("#BurgerModal .modal-footer button").click(function() {
  $("#BurgerModal .modal-body button").addClass("btn-outline-warning");
  $("#BurgerModal .modal-body button").removeClass("btn-warning");
});


$("#BurgerModal .spice button").click(function() {
  $(this).removeClass("btn-outline-warning");
  $(this).addClass("btn-warning");
  $("#BurgerModal .spice button").not(this).removeClass("btn-warning");
  $("#BurgerModal .spice button").not(this).addClass("btn-outline-warning");

});
$("#FriesModal .spice button").click(function() {
  $(this).removeClass("btn-outline-warning");
  $(this).addClass("btn-warning");
  $("#FriesModal .spice button").not(this).removeClass("btn-warning");
  $("#FriesModal .spice button").not(this).addClass("btn-outline-warning");

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
