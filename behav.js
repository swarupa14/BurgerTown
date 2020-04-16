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

$("#BurgerModal button").click(function()
{
  $(this).css("background-color","#F5AA13");
  $(this).css("color","#000");

});
