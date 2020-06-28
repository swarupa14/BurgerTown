

var totalorder=0;
var totalprice=0;
var add=true;

// Order Page Activities

$(".minus").click(function()   //Clicking the minus button
{
  add=false;


});
$(".plus").click(function()    //Clicking the minus button
{
  add=true;


});

$(".card").click(function()    //Clicking the addtocart button
{


  if(add)
  {
    totalorder++;
  }
  else
  {
    totalorder--;
    if(totalorder<0)
    {
      totalorder=0;

    }
  }



    $(".addtocart", this).text("Added to Cart");

  $(".hide", this).removeClass("hide");
  $(".addtocart", this).attr("disabled", true);

  var price=   $(".prices", this).text();
  totalprice+= parseInt(price);
  $(".num").text(totalorder);


});




// Modal JS

$("#BurgerModal .modal-body button").click(function()
{
  $(this).removeClass("btn-outline-warning");
  $(this).addClass("btn-warning");
});
$("#BurgerModal .modal-footer button").click(function()
{
  $("#BurgerModal .modal-body button").addClass("btn-outline-warning");
  $("#BurgerModal .modal-body button").removeClass("btn-warning");
});



// SignUp FOrm

$('input[type="checkbox"]').click(function(){

  var inputValue = $(this).attr("value");
 $("." + inputValue).toggleClass("hide");

    });


$(".Signup-form .sign-up").click(function(){
  let f_name= $(".f_name").val();
  let l_name= $(".l_name").val();
  let email= $(".email").val();
  let address= $(".address").val();
  let phone= $(".phone").val();
  let pass= $(".pass").val();
  let c_pass=$(".c_pass").val();
  let agree=$(".agree:checked").val();
  if (f_name === "")
    alert("You must enter your first name!");
  if (l_name === "")
    alert("You must enter your last name!");
  if(email==="")
    alert("You must enter an email address!");
  if (address === "")
    alert("You must enter your home address!");
  if (phone.length != 11)
    alert("You must enter a valid phone number!");
  if(pass === "")
    alert("You must enter a password!");
  if(c_pass === "")
    alert("You must confirm your password!");
  if (pass !=c_pass)
    alert("Passwords do not match");
  if(agree!='on')
    alert("You must agree to our terms and conditions to create an account!");

});
