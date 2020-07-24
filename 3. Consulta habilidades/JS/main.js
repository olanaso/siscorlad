/*======================URL GENERAL=======================*/
//import URL_CORLAD from '../../10. service/corlad.service';
//console.log(URL_CORLAD);
URL_CORLAD = "http://54.161.211.196:3000/api";
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


$(document).ready(function () {
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
                }else{
                    borrarDatos();
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
                }else{
                    borrarDatos();
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
                }
                for (let responseElement of response) {
                    if (responseElement){
                        busquedaId(responseElement.id);
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
                }else{
                    borrarDatos();
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
        $('#date').val(user.fechaingreso);
        $('#date-habilitado').html(user.fechaHabilitado);
        $('#date-ultima-cuota').html(user.ultimaCuota);
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
        $('#deuda').html("S/. "+user.multas.multaTotal);

        var pagoTr='';
        for (let pago of user.pagos) {
            let tr = '<tr><td>'+pago.cantidad+'</td>'+'<td>'+pago.fechatransaccion+'</td>'+'<td>S/. '+pago.precio+'</td>'+'<td>'+pago.denominacion+'</td>'+'<td>'+pago.serienumero+'</td></tr>';
            pagoTr+=tr;
        }
        $('.table tbody').html(pagoTr);
    }

    function borrarDatos() {
        $('#name').val(null);
        $('#surname').val(null);
        $('#collage').val(null);
        $('#date').val(null);
        $('#condicion').val(null);
        $('#deuda').html('');
        $('#date-habilitado').html('');
        $('#date-ultima-cuota').html('');
        $('#imagen-perfil img').show();
        $('.table tbody').html("");
        $('#imagen-perfil').css("background", "transparent");
    }


    /*===================BOTON DE BUSQUEDA======================*/
    var search = $('#search');
    $('#button-search').click(function (e) { 
        if (true) {             //submitUserForm()
            e.preventDefault();
            if ($('#criterio').val() == "none") {
                $('#criterio').css('border', '1px solid red');
            } else{
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
                limit: 5,
                minLength: 1,
                select: function (event,ui){
                    if (true) {
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