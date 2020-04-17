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
