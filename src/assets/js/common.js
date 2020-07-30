/*Header Menu*/
$(window).click(function() {
	$(".header-nav li").removeClass("active");
});
$(".header-nav li").click(function(e){
	  e.stopPropagation();
    $(".header-nav li").removeClass("active");
    $(this).addClass("active");		
});

