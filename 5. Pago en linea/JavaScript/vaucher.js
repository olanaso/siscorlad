//$('#contentResultado').hide();
$('#encontrados').hide();
var nombreColegiado = '';
var apellidoscolegiado = '';
var address = '';
var telefono = '';
/*===========FORM BUSQUEDA============*/
$('#buscar').click(function (e) {
    e.preventDefault();
    if ($('#dni').val() != ""){
        busquedaDni($('#dni').val());
    }
});
$('#pagarVaucher').click(function () {
    
});
function busquedaDni(busqueda) {
    $.ajax({
        type: "GET",
        url: URL_CORLAD+"/web/busquedaDni/"+busqueda,
        data: "json",
        beforeSend: ()=>{
            $('.bi-search').hide();
            $('.bi-arrow-repeat').show();
        },
        success: function (response) {
            $('.bi-search').show();
            $('.bi-arrow-repeat').hide();
            if (response){
                insertarDatos(response);
                insertarDatosDeudas(response.dni);
                $('#contentResultado').slideDown(1000);
                $('#encontrados').hide();
            }else{
                $('#contentResultado').slideUp();
                $('#encontrados').show();
            }
            
        }
    });
}
var multa_total = 0;
var deuda_total = 0;
var monto_certificado = 15;
function insertarDatosDeudas(busqueda) {
    $.ajax({
        type: "GET",
        url: URL_CORLAD+"/web/deudasAgremiado/"+busqueda,
        data: "json",
        success: function (response) {
            document.getElementById("check-deudas").checked = false;
            document.getElementById("check-multas").checked = false;
            document.getElementById("check_certificado").checked = false;
            deuda_total = response.cuotas.cuotaTotal;
            multa_total = response.multas.multaTotal;
            $('#total-deuda').html(response.cuotas.cuotaTotal+'.00');
            $('#total-multa').html(response.multas.multaTotal+'.00');
            $('#monto-certificado').html(monto_certificado+'.00');
            $('#tabla-detalles-cuotas tbody').html(null);
            $('#tabla-detalles-multas tbody').html(null);
            for (let cuota of response.cuotas.cuotas) {
                $('#tabla-detalles-cuotas tbody').prepend("<tr><td>S/ "+cuota.monto+"</td><td>"+formatearMes(cuota.mes)+"</td><td>"+cuota.anio+"</td></tr>");
            }
            for (let multa of response.multas.multas) {
                $('#tabla-detalles-multas tbody').prepend("<tr><td>S/ "+multa.monto+"</td><td>"+multa.motivo_multa+"</td></tr>");
            }
        }
    });
}
function insertarDatos(user){
    nombreColegiado = user.nombres;
    apellidoscolegiado = user.apellidopaterno+" "+user.apellidomaterno;
    telefono = user.celular;
    address = user.direccion;
    $('#labelNombre').val(user.nombres+" "+user.apellidopaterno+" "+user.apellidomaterno);
    $('#labelDni').val(user.dni);
    $('#labelEmail').val(user.correo);
}


function previewphoto() {
    document.getElementById("input-id").onchange = function () {
        var reader = new FileReader();

        reader.onload = function (e) {
            // get loaded data and render thumbnail.
            document.getElementById("image").src = e.target.result;
        };
        // read the image file as a data URL.
        reader.readAsDataURL(this.files[0]);
        console.log("tamaño de imagen", this.files[0].size);

        if (this.files[0].size > 100000) {
            alert("La imagen sobre pasa el tamaño permitido");
            $('#input-id').val('');
            document.getElementById("image").src = 'images/blanco.png';
        }
    };
}
previewphoto();

function formatearMes(mes) {
    var mesFormateado = "";
    switch (mes) {
        case 1:mesFormateado = "enero"; break;
        case 2:mesFormateado = "febrero"; break;
        case 2:mesFormateado = "marzo"; break;
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
    return mesFormateado;
}
var totalPagar = 0;
setInterval(()=>{
    totalPagar = 0;
    if(document.getElementById("check-deudas").checked) {totalPagar += deuda_total;}
    if (document.getElementById("check-multas").checked) {totalPagar += multa_total;}

    if (deuda_total <= 0) { $('#check-deudas').attr('disabled', 'disabled');} else { $('#check-deudas').removeAttr('disabled'); }
    if (multa_total <= 0) { $('#check-multas').attr('disabled', 'disabled'); } else { $('#check-multas').removeAttr('disabled'); }

    if(deuda_total > 0 && !document.getElementById("check-deudas").checked) {
        $('#check_certificado').attr('disabled', 'disabled');
    }else{
        
        if(multa_total > 0 && !document.getElementById("check-multas").checked) {
            $('#check_certificado').attr('disabled', 'disabled');
        }else{
            $('#check_certificado').removeAttr('disabled');
            if (document.getElementById("check_certificado").checked) {totalPagar += monto_certificado;}
        }
    }

    $('#total-pagar').html("TOTAL A PAGAR: S/ "+totalPagar)

    totalPagar = totalPagar * 100;
},300);
/*==================================*/
/*=========VALIDANDO FORMS==========*/
$('#contentBusqueda').validate({
    rules: {
        dni: {
            required: true,
            minlength: 8,
            maxlength:8
        }
    },
    messages: {
        dni:{
            required: "Se requiere el dni",
            minlength: "Cararteres minimos 8",
            maxlength: "Caracteres máximos 8"
        }
    }
});
$('#contentResultado').validate({
    rules:{
        nOperacion: {
            required: true
        }
    }
});


$('#default-datepicker').datepicker({
    format: "dd/mm/yy",
    weekStart: 1,
    todayBtn: "linked",
    todayHighlight: true
});
/**************************************************/
/*CONFIGURANDO A ESPAÑOL EL ADJUNTADOR DE ARCHIVOS*/
setTimeout(() => {
    $(".file-drop-zone-title").html("Arrastra y suelta el voucher ...");
    $(".file-caption-name").attr("placeholder","Selecciona archivo ...");
    $(".hidden-xs").html("");
}, 300);




Culqi.options({
    
    style: {
    logo: 'https://corladayacucho.org.pe/portal/wp-content/uploads/2020/07/logocorlad.png',
    
    }
});
Culqi.publicKey = 'pk_test_xDCpMxAgd8kjuKSV';
// Usa la funcion Culqi.open() en el evento que desees
$('#pagarTarjeta').on('click', function(e) {
    var detalles = [];
    if (document.getElementById("check-deudas").checked) {
        detalles.push("Deudas de aportes");
    }
    if (document.getElementById("check-multas").checked) {
        detalles.push("Multas");
    }
    if (document.getElementById("check_certificado").checked && !$('#check_certificado').attr('disabled')) {
        detalles.push("Certificado");
    }

    // Configura tu Culqi Checkout
    Culqi.settings({
        title: 'PAGO CORLAD',
        currency: 'PEN',
        description: detalles.join(", "),
        amount: totalPagar
    });
    // Abre el formulario con las opciones de Culqi.settings
    Culqi.open();
    e.preventDefault();
});
/*Para pagar*/
function culqi() {
    if (Culqi.token) { // ¡Objeto Token creado exitosamente!
        var token = Culqi.token.id;
        var email = Culqi.token.email;


        var data = {
            "amount": totalPagar,
            "description": detalles.join(", "),
            "email": email,
            "address": address,
            "address_city": "AYACUCHO",
            "first_name": nombreColegiado,
            "last_name": apellidoscolegiado,
            "phone_number": telefono,
            "source_id": token
        };

        var url = "https://corladayacucho.org.pe/culqui/proceso.php";

        $.post(url, data, function(res) {
            console.log(res)
            alert(' Tu pago se Realizó con ' + res + '. Agradecemos tu preferencia.');
            if (res == "exito") {

            } else {
                alert("No se logró realizar el pago.");
            }
        });

        //En esta linea de codigo debemos enviar el "Culqi.token.id"
        //hacia tu servidor con Ajax
    } else { // ¡Hubo algún problema!
        // Mostramos JSON de objeto error en consola
        console.log(Culqi.error);
        alert(Culqi.error.user_message);
    }
};