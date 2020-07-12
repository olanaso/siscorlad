$(document).ready(function () {
    // PETICION DE SERVICEs
    $.ajax({
        type: 'GET',
        url: "https://api.jsonbin.io/b/5ee91c1b19b60f7aa95b796a/5",
        success: function (response) {
            response.forEach((element) => {
                console.log(element.date);
                $('#boxslider').append('<li><img src="img/cumpleanos.png" alt="Imagen de pastel de cumpleaños"/><p class="nombre">'+element.nombre+'</p><p class="apellido">'+element.apellidos+'</p><p class="cumpleanos">Feliz cumpleaños</p><p class="date">'+element.date+'</p></li>');
                //if (element.date.substr(5,2).trim() == moment().format('MM')) {}
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
            case "01":
                mesFormateado = "enero";
                break;
            case "02":
                mesFormateado = "febrero";
                break;
            case "03":
                mesFormateado = "marzo";
                break;
            case "04":
                mesFormateado = "abril";
                break;
            case "05":
                mesFormateado = "mayo";
                break;
            case "06":
                mesFormateado = "junio";
                break;
            case "07":
                mesFormateado = "julio";
                break;
            case "08":
                mesFormateado = "agosto";
                break;
            case "09":
                mesFormateado = "septiembre";
                break;
            case "10":
                mesFormateado = "octubre";
                break;
            case "11":
                return "noviembre";
                break;
            case "12":
                return "diciembre";
                break;
            default:
                break;
        }
        return dia + " " + mesFormateado;
    }
});
