/*==================METODOS DEL CATPCHA======================*/
function submitUserForm() {
    var response = grecaptcha.getResponse();
    if(response.length == 0) {
        document.getElementById('g-recaptcha-error').innerHTML = '<span style="color:#ff0000;">Verifica si no eres un robot.</span>';
        return false;
    }
    return true;
}
function verifyCaptcha() {
    document.getElementById('g-recaptcha-error').innerHTML = '';
}

$('body').hover(function () {
        // over
        if (window.name === "VentanaExterna") {
            $('#modal-container').remove();
        } else{
            $('body').prepend('<section id="modal-container"><button id="ingresarOriginal">INGRESAR</button></section>');
            $('#container').css('filter', 'blur(2px)');
            $('#ingresarOriginal').click(function (e) { 
                e.preventDefault();
                window.open('http://corladayacucho.org.pe/consultas/3.%20Consulta%20habilidades/','VentanaExterna',"width=690,height=733,location=NO");
            });
        }
        
    }, function () {
        // out
        $('#modal-container').remove();
        $('#container').css('filter', 'none');
    }
);
$(document).ready(function () {
    $('#agremiadoEncontrado').hide();
    /*============================================================*/
    /*===================METODOS DE BUSQUEDA======================*/
    function busquedaDni(busqueda) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+"/web/busquedaDNI/"+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                if (response){
                    detalleUsuario(response.id);
                    insertarDatos(response);
                    $('#agremiadoEncontrado').fadeOut();
                }else{
                    borrarDatos();
                    $('#agremiadoEncontrado').fadeIn();
                }
            }
        });
    }
    function busquedaCodigo(busqueda) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+"/web/busquedaNro/"+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                if (response){
                    detalleUsuario(response.id);
                    insertarDatos(response);
                    $('#agremiadoEncontrado').fadeOut();
                }else{
                    borrarDatos();
                    $('#agremiadoEncontrado').fadeIn();
                }
            }
        });
    }
    function busquedaNombre(busqueda) {
        
        $.ajax({
            type: "GET",
            url: URL_CORLAD+"/web/busquedaNombresApellidos/"+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                
                if (response.length <= 0) {
                    borrarDatos();
                    $('#agremiadoEncontrado').fadeIn();
                }
                for (let responseElement of response) {
                    if (responseElement){
                        busquedaId(responseElement.id);
                        $('#agremiadoEncontrado').fadeOut();
                        break;
                    }
                }
            }
        });
    }
    function detalleUsuario(id) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+'/web/detalleagremiado/'+id,
            data: "json",
            success: function (response) {
                if (response){
                    insertarDatosDetalle(response);
                    $('#agremiadoEncontrado').fadeOut();
                }else{
                    borrarDatos();
                    $('#agremiadoEncontrado').fadeIn();
                }
            }
        });
    }
    function busquedaId(busqueda) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+"/web/busquedaId/"+busqueda,
            data: "json",
            success: function (response) {
                insertarDatos(response);
                detalleUsuario(busqueda);
            }
        });
    }
    function insertarDatos(user) {
        $('#name').val(user.nombres);
        $('#surname').val(user.apellidopaterno+" "+user.apellidomaterno);
        $('#collage').val(user.codigocolegiado);
        $('#date').val(formatearFecha(user.fechaingreso));
        $('#documento').val(user.dni);
        $('#imagen-perfil img').hide();
        if (typeof user.foto == "object"){
            $('#imagen-perfil').css("background", "transparent");
        }else{
            $('#imagen-perfil').css("background", "no-repeat url("+user.foto+")");
            $('#imagen-perfil').css("background-size", "100% 100%");
        }
    }
    function insertarDatosDetalle(user) {
        $('#condicion').val(user.condicion);
        $('#deudaAporte').html("S/ "+user.cuotas.cuotaTotal);
        $('#multaTotal').html("S/ "+user.multas.multaTotal);
        $('#date-ultima-cuota').html(formatearFecha(user.pagos[0].fechatransaccion));
        $('#date-habilitado').html(habilitadoHasta(user.pagos[0].fechatransaccion));
        $('#tabla-detalles-cuotas tbody').html(null);
        $('#tabla-detalles-multas tbody').html(null);
        for (let cuota of user.cuotas.cuotas) {
            $('#tabla-detalles-cuotas tbody').prepend("<tr><td>S/ "+cuota.monto+"</td><td>"+formatearMes(cuota.mes)+"</td><td>"+cuota.anio+"</td></tr>");
        }
        for (let multa of user.multas.multas) {
            $('#tabla-detalles-multas tbody').prepend("<tr><td>S/ "+multa.monto+"</td><td>"+multa.motivo_multa+"</td></tr>");
        }
    }

    function borrarDatos() {
        $('#name').val(null);
        $('#surname').val(null);
        $('#collage').val(null);
        $('#date').val(null);
        $('#tabla-detalles-cuotas tbody').html(null);
        $('#tabla-detalles-multas tbody').html(null);
        $('#documento').val(null);
        $('#condicion').val(null);
        $('#deuda').html('');
        $('#date-habilitado').html('');
        $('#date-ultima-cuota').html('');
        $('#imagen-perfil img').show();
        $('.table tbody').html("");
        $('#imagen-perfil').css("background", "transparent");
    }

    function formatearFecha(fecha) {
        let f = new Date(fecha);
        return f.getDate()+"-"+f.getMonth()+"-"+f.getFullYear();
    }
    function habilitadoHasta(fecha) {
        let f = new Date(fecha);
        f.setMonth(f.getMonth() + 1);
        return f.getDate()+"-"+f.getMonth()+"-"+f.getFullYear();
    }
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
    /*===================BOTON DE BUSQUEDA======================*/
    var search = $('#search');
    $('#button-search').click(function (e) { 
        if (submitUserForm()) {             //submitUserForm()
            e.preventDefault();
            if (search.val() == "" || search.val() == "undefined" || search.val() == null) {
                search.removeClass('valid');
                search.addClass('error');
            } else {
                search.removeClass('error');
                search.addClass('valid');
                if ($('#criterio').val() == "dni") {
                    busquedaDni(search.val());
                }
                if ($('#criterio').val() == "codColegiado") {
                    busquedaCodigo(search.val());
                }
                if ($('#criterio').val() == "nombreApellido") {
                    busquedaNombre(search.val());
                }
            }
        } else {
            e.preventDefault();
        }
    });
    /*=========================VALIDACION y CAMBIOS DE CAMPO REQUERIMIENTO============================*/
    $('#criterio').blur(function () { 
        var that = $(this);
        if (that.val() == "dni") {
            search.attr("type", "number");
            search.attr("name", "number");
            search.attr("placeholder", "Ingrese su DNI");
            search.autocomplete({
                disabled:true
            });
            $('#criterio').css('border', '1px solid #ccc');
            // $('[name="number"]').mask('00000000');
        } 
        else if (that.val() == "nombreApellido") {
            search.attr("type", "text");
            search.attr("name", "text");
            search.attr("placeholder", "Ingrese sus nombres y apellidos");
            search.autocomplete({
                source: function( request, response ) {
                    $.ajax( {
                      url: URL_CORLAD+"/web/busquedaNombresApellidos/"+search.val(),
                      dataType: "json",
                      success: function( data ) {
                          datos = [];
                          for (let item of data) {
                              datos.push(item.nombres);
                          }
                          response( datos );
                      }
                    });},
                disabled: false,
                limit: 4,
                minLength: 2,
                select: function (event,ui){
                    if (submitUserForm()) {
                        setTimeout(()=>{
                            busquedaNombre(search.val());
                        },300);
                    }
                }
            });
            $('#criterio').css('border', '1px solid #ccc');
        }
        else if (that.val() == "codColegiado") {
            search.attr("type", "text");
            search.attr("name", "codigo");
            search.attr("placeholder", "Ingrese su código de colegiado");
            search.autocomplete({
                disabled:true
            });
            $('#criterio').css('border', '1px solid #ccc');
        }else{
            search.autocomplete({
                disabled:true
            });
            search.attr("placeholder", "Seleccione tipo de búsqueda");
            search.attr("type", "search");
            search.attr("name", "search");
        }
    });

    /*=======================VALIDACION DE CAMPO BUSQUEDA=========================*/
    $('#section-busqueda').validate({
        rules: {
            number: {
                required: true,
                number: true,
                minlength: 8,
                maxlength: 8
            },
            codigo: {
                required: true,
                minlength: 1
            },
            text: {
                required: true,
            }
        },
        messages: {
            number: {
                required: "Ingrese su DNI",
                number: "Ingrese un número valido",
                minlength: "Carácteres minimos 8",
                maxlength: "Carácteres maximos 8"
            },
            codigo: {
                required: "Ingrese su código de colegiado",
                minlength: "Carácteres minimos 1"
            },
            text: {
                required: "Ingrese nombres y apellidos",
            }
        }
    });
});