$(document).ready(function () {
    
    // PETICION DE SERVICEs
    $.ajax({
        type: 'GET',
        url: URL_CORLAD+"/web/cumpleanios",
        success: function (response) {
            if (response.cumpleanios <= 0) {
                $('body').html("No existen colegiados que cumplan años este mes");
            }
            response.cumpleanios.forEach((element) => {
                fecha = formatearFecha(element.mes, element.dia);
                $('#boxslider').append('<li><img src="img/cumpleanos.png" alt="Imagen de pastel de cumpleaños"/><p class="nombre">'+element.agremiado+'</p><p class="cumpleanos">Feliz cumpleaños</p><p class="date">'+fecha+'</p></li>');
            });
        }
    });

    // CONFIGURACION DEL SLIDER de ONOMASTICOS
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

    
    //FORMATEAR FECHA
    function formatearFecha(mes, dia) {
        var mesFormateado = "";
        switch (mes) {
            case 1:mesFormateado = "enero"; break;
            case 2:mesFormateado = "febrero"; break;
            case 3:mesFormateado = "marzo"; break;
            case 4:mesFormateado = "abril"; break;
            case 5:mesFormateado = "mayo"; break;
            case 6:mesFormateado = "junio"; break;
            case 7:mesFormateado = "julio"; break;
            case 8:mesFormateado = "agosto"; break;
            case 9:mesFormateado = "septiembre"; break;
            case 10:mesFormateado = "octubre"; break;
            case 11:mesFormateado = "noviembre"; break;
            case 12:mesFormateado = "diciembre"; break;
            default:break;
        }
        return dia + " de " + mesFormateado;
    }
});
