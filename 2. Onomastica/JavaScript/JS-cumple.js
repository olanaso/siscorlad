$(document).ready(function () {
    // PETICIONES AJAX
    $.ajax({
        type: 'GET',
        url: "https://api.jsonbin.io/b/5ee91c1b19b60f7aa95b796a/5",
        success: function (response) {
            response.forEach((element) => {
                if (element.date.slice(2).trim() == moment().format('MMMM')) {
                    $('#boxslider').append('<li><img src="img/cumpleanos.png" alt="Imagen de pastel de cumpleaños"/><p class="nombre">'+element.nombre+'</p><p class="apellido">'+element.apellidos+'</p><p class="cumpleanos">Feliz cumpleaños</p><p class="date">'+element.date+'</p></li>');
                }
            });
        }
    });
    // CONFIGURACION DEL SLIDER
    setTimeout(() => {
        $('#boxslider').bxSlider({
            auto: true,
            speed: 500,
            pager:false,
            pause: 4000,
            minSlides: 1,
            maxSlides: 4,
            slideWidth:370
        }); 
    }, 1000);
});