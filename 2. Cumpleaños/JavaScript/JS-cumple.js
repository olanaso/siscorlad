$(document).ready(function () {
    $('#boxslider').bxSlider({
        auto: true,
        speed: 500,
        pager:false,
        pause: 4000,
        minSlides: 1,
        maxSlides: 4,
        slideWidth:400
    });
    setInterval(() => {
        $('.bx-viewport').attr("style", "width: 100%; overflow: hidden; position: relative; height: 192px;"); 
    }, 1000);
});