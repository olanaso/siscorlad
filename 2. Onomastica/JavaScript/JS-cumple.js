$(document).ready(function () {
    // PETICION DE SERVICEs
    $.ajax({
        type: 'GET',
        url: "http://34.227.105.144:3000/agremiados",
        success: function (response) {
            response.forEach((element) => {
                if (element.fechanacimiento.substr(5,2).trim() == moment().format('MM')) {
                    $('#boxslider').append('<li><img src="img/cumpleanos.png" alt="Imagen de pastel de cumpleaños"/><p class="nombre">'+element.nombres+'</p><p class="apellido">'+element.apellidopaterno+' '+element.apellidomaterno+'</p><p class="cumpleanos">Feliz cumpleaños</p><p class="date">'+formatearFecha(element.fechanacimiento.substr(5,2),element.fechanacimiento.substr(8,2))+'</p></li>');
                }
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
