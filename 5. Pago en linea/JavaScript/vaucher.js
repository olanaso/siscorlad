$(document).ready(function () {
    $('#contentResultado').hide();
    $('#contentPago').hide();
    $('#encontrados').hide();
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
            $('#tabla-pago tbody').html("");
            if ($('#check_certificado:checked').val() == "on"){
                let certificado = $('#monto-certificado').html();
                let cantidad = 1;
                let monto = parseInt(certificado) * cantidad;
                $('#tabla-pago tbody').prepend("<tr><td>"+cantidad+"</td><td>Certificado</td><td>"+certificado+"</td><td>"+monto+"</td></tr>");
            }
            if ($('#check_aporte:checked').val() == "on"){
                let aporte = $('#monto-aporte').html();
                let cantidad = 1;
                let monto = parseInt(aporte) * cantidad;
                $('#tabla-pago tbody').prepend("<tr><td>"+cantidad+"</td><td>Aporte</td><td>"+aporte+"</td><td>"+monto+"</td></tr>");
            }
            if ($('#check_aporte:checked').val() == undefined && $('#check_certificado:checked').val() == undefined){
                $('#contentPago').hide();
            } else {
                $('#tabla-pago tbody').append("<tr><td></td><td></td><td>Subtotal</td><td>415</td></tr>");
                $('#tabla-pago tbody').append("<tr><td></td><td></td><td>IGV</td><td>0</td></tr>");
                $('#tabla-pago tbody').append("<tr><td></td><td></td><td>Total</td><td>415</td></tr>");
                $('#contentPago').slideDown();
            }
        }else {
            $('#contentPago').slideUp();
        }
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
    function insertarDatosDeudas(busqueda) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+"/web/deudasAgremiado/"+busqueda,
            data: "json",
            success: function (response) {
                $('#tabla-detalles tbody').html("");
                $('#monto-aporte').html(response.cuotas.cuotaTotal+'.00');
                var estado;
                for (let cuota of response.cuotas.cuotas) {
                    if (cuota.estadoaporteid == 1) estado = "Pendiente";if (cuota.estadoaporteid == 2) estado = "Pagado";if (cuota.estadoaporteid == 3) estado = "Cancelado";
                    $('#tabla-detalles-cuotas tbody').prepend("<tr><td>"+formatearFecha(cuota.fecha_registro)+"</td><td>"+estado+"</td><td>S/. "+cuota.monto+"</td></tr>");
                }
                for (let multa of response.multas.multas) {
                    $('#tabla-detalles-multas tbody').prepend("<tr><td>"+formatearFecha(cuota.fecha_registro)+"</td><td>"+estado+"</td><td>S/. "+cuota.monto+"</td></tr>");
                }
            }
        });
    }
    function insertarDatos(user){
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

    function formatearFecha(fecha) {
        let f = new Date(fecha);
        return f.getDate()+"-"+f.getMonth()+"-"+f.getFullYear();
    }

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