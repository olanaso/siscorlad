$(document).ready(function () {
    
    // PETICIONES AJAX
    $.ajax({
        type: 'GET',
        url: "https://api.jsonbin.io/b/5ee8fca80e966a7aa36abd46",
        success: function (response) {
            response.forEach((element) => {
                console.log(element.nombre+element.apellidos+element.date);
                $('#boxslider').append('<li><img src="img/cumpleanos.png" alt="Imagen de pastel de cumpleaños"/><p class="nombre">'+element.nombre+'</p><p class="apellido">'+element.apellidos+'</p><p class="cumpleanos">Feliz cumpleaños</p><p class="date">'+element.date+'</p></li>');
            });
        }
    });
    // CONFIGURACION DEL SLIDER
    setInterval(() => {
        $('#boxslider').bxSlider({
            auto: true,
            speed: 500,
            pager:false,
            pause: 4000,
            minSlides: 1,
            maxSlides: 4,
            slideWidth:400
        }); 
    }, 1000);
});