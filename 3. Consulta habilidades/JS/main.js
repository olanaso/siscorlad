function blockearbutton() {
    const button = document.querySelector('#button-search');
    button.setAttribute('disabled', 'disabled');
    button.style.background = '#88BF9F';
    button.style.color = '#dedede';
    $('.bi-search').hide();
    $('.bi-arrow-repeat').show();
}

function desblockearbutton() {
    const button = document.querySelector('#button-search');
    button.removeAttribute('disabled');
    button.style.background = '#03873B';
    button.style.color = '#FFFFFF';
    $('.bi-search').show();
    $('.bi-arrow-repeat').hide();
}


/*==================METODOS DEL CATPCHA======================*/
function submitUserForm() {
    var response = grecaptcha.getResponse();
    if(response.length === 0) {
        document.getElementById('g-recaptcha-error').innerHTML = '<span style="color:#ff0000;">Verifica si no eres un robot.</span>';
        return false;
    }
    return true;
}
function verifyCaptcha() {
    document.getElementById('g-recaptcha-error').innerHTML = '';
}

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
               blockearbutton()
            },
            success: function (response) {
               desblockearbutton()
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
                blockearbutton()
            },
            success: function (response) {
               desblockearbutton()
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
                 blockearbutton()
            },
            success: function (response) {
                desblockearbutton()
                
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

    /*=========================FUNCIONES===========================*/
    function detalleUsuario(id) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+'/web/detalleagremiado/'+id,
            data: "json",
              beforeSend: ()=>{
                 blockearbutton()
            },
            success: function (response) {
                desblockearbutton()
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
            beforeSend: ()=>{
                 blockearbutton()
            },
            success: function (response) {
                 desblockearbutton()
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
            $('#imagen-perfil').css("background", "no-repeat url("+user.foto+")").css("background-size", "100% 100%");
        }
    }
    function insertarDatosDetalle(user) {
        $('#condicion').val(user.condicion);
        $('#deudaAporte').html("S/ "+user.cuotas.cuotaTotal);
        $('#multaTotal').html("S/ "+user.multas.multaTotal);
       // $('#date-ultima-cuota').html(formatearFecha(user.pagos[0].fechatransaccion));
        //$('#date-habilitado').html(habilitadoHasta(user.pagos[0].fechatransaccion));
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

    function formatearMes(mes) {
        let mesFormateado = "";
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
        return mesFormateado;
    }

    /*===================BOTON DE BUSQUEDA======================*/
    let search = $('#search');
    $('#button-search').click(function (e) { 
        if (submitUserForm()) {             //submitUserForm()
            e.preventDefault();
            if (search.val() === "" || search.val() === "undefined" || search.val() == null) {
                search.removeClass('valid');
                search.addClass('error');
            } else {
                search.removeClass('error');
                search.addClass('valid');
                if ($('#criterio').val() === "dni") {
                    busquedaDni(search.val());
                } else if ($('#criterio').val() === "codColegiado") {
                    busquedaCodigo(search.val());
                } else if ($('#criterio').val() === "nombreApellido") {
                    busquedaNombre(search.val());
                }
            }
        } else {
            e.preventDefault();
        }
    });

    /*=========================CAMBIOS DE CAMPO REQUERIMIENTO============================*/
    search.autocomplete({
        source: function( request, response ) {
            $.ajax( {
              url: URL_CORLAD+"/web/busquedaNombresApellidos/"+search.val(),
              dataType: "json",
                beforeSend: ()=>{
               blockearbutton()
            },
              success: function( data ) {
                   desblockearbutton()
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

    $('#criterio').blur(function () { 
        let that = $(this);
        if (that.val() === "dni") {
            search.attr("type", "number");
            search.attr("name", "number");
            search.attr("placeholder", "Ingrese su DNI");
            search.autocomplete({
                disabled:true
            });
            $('#criterio').css('border', '1px solid #ccc');
        } 
        else if (that.val() === "nombreApellido") {
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
                        setTimeout(() => {
                            busquedaNombre(search.val());
                        },300);
                    }
                }
            });
            $('#criterio').css('border', '1px solid #ccc');
        }
        else if (that.val() === "codColegiado") {
            search.attr("type", "text");
            search.attr("name", "codigo");
            search.attr("placeholder", "Ingrese su código de colegiado");
            search.autocomplete({
                disabled:true
            });
            $('#criterio').css('border', '1px solid #ccc');
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
                minlength: "Caracteres mínimos 8",
                maxlength: "Caracteres máximos 8"
            },
            codigo: {
                required: "Ingrese su código de colegiado",
                minlength: "Caracteres mínimos 1"
            },
            text: {
                required: "Ingrese sus nombres y apellidos",
            }
        }
    });
});