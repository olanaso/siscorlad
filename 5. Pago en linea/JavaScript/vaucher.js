/*======================URL GENERAL=======================*/
var url_servicios = "http://34.227.105.144:3000/";

$(document).ready(function () {
    $('#contentResultado').hide();
    $('#contentPago').hide();
    /*====================================*/
    /*===========FORM BUSQUEDA============*/
    $('#buscar').click(function (e) {
        e.preventDefault();
        if ($('#dni').val() != ""){
            busquedaDni($('#dni').val());
        }
    });
    $('#pagar').click(function () {
        if ($('#input-id').val()!=""){
            $('tbody').html("");
            if ($('#check_certificado:checked').val() == "on"){
                let certificado = $('#monto-certificado').html();
                let cantidad = 1;
                let monto = parseInt(certificado) * cantidad;
                $('tbody').prepend("<tr><td>"+cantidad+"</td><td>Certificado</td><td>"+certificado+"</td><td>"+monto+"</td></tr>");
            }
            if ($('#check_aporte:checked').val() == "on"){
                let aporte = $('#monto-aporte').html();
                let cantidad = 2;
                let monto = parseInt(aporte) * cantidad;
                $('tbody').prepend("<tr><td>"+cantidad+"</td><td>Aporte</td><td>"+aporte+"</td><td>"+monto+"</td></tr>");
            }
            if ($('#check_aporte:checked').val() == undefined && $('#check_certificado:checked').val() == undefined){
                $('#contentPago').hide();
            } else {
                $('tbody').append("<tr><td></td><td></td><td>Subtotal</td><td>415</td></tr>");
                $('tbody').append("<tr><td></td><td></td><td>IGV</td><td>0</td></tr>");
                $('tbody').append("<tr><td></td><td></td><td>Total</td><td>415</td></tr>");
                $('#contentPago').slideDown();
            }
        }else {
            $('#contentPago').slideUp();
        }
    });
    function busquedaDni(busqueda) {
        $.ajax({
            type: "GET",
            url: 'https://api.jsonbin.io/b/5eed4a4f2406353b2e08f5f3/7',//url_servicios+"agremiados/?filter[where][dni]="+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                for (let responseElement of response) {
                    console.log(responseElement);
                    if (responseElement.dni == busqueda){
                        insertarDatos(response[0]);
                        $('#contentResultado').slideDown(1000);
                        break;
                    }else{
                        $('#contentResultado').slideUp();
                    }
                }
                // if (response.length != 0){
                //     insertarDatos(response[0]);
                //     $('#contentResultado').slideDown(1000);
                // }else {
                //     $('#contentResultado').slideUp();
                // }
            }
        });
    }
    function insertarDatos(user){
        $('#labelNombre').val(user.nombre+" "+user.apellidos);
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
});