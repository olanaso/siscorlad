/*==================METODOS DEL CATPCHA======================*/
function submitUserForm() {
    var response = grecaptcha.getResponse();
    if(response.length == 0) {
        document.getElementById('g-recaptcha-error').innerHTML = '<span style="color:red;">Verifica si no eres un robot.</span>';
        return false;
    }
    return true;
}
function verifyCaptcha() {
    document.getElementById('g-recaptcha-error').innerHTML = '';
}


$(document).ready(function () {
    /*========================================================*/
    /*======================URL GENERAL=======================*/
    var urlPeticion = "http://34.227.105.144:3000/agremiados";

    /*===================METODO DE PETICION AJAX======================*/
    function peticionAjax(tipo, busqueda) {
        $.ajax({
            type: "GET",
            url: urlPeticion, 
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                if (tipo == "dni") {
                    busquedaDni(response, busqueda);
                }
                if (tipo == "codColegiado") {
                    busquedaCodigo(response, busqueda);
                }
                if (tipo == "nombreApellido") {
                    busquedaNombre(response, busqueda);
                }
            }
        });
    }


    /*===================METODOS DE BUSQUEDA======================*/
    function busquedaDni(lista, busqueda) {
        for (var user of lista) {
            if (user.dni == busqueda) {
                insertarDatos(user);
                break;
            } else{
                borrarDatos();
            }
        }
    }
    function busquedaCodigo(lista, busqueda) {
        for (let user of lista) {
            if (user.codigocolegiado == busqueda) {
                insertarDatos(user);
                break;
            } else{
                borrarDatos();
            }
        }
    }
    function busquedaNombre(lista, busqueda) {
        for (let user of lista) {
            var nombreCompleto = user.nombres + " " + user.apellidopaterno + " " + user.apellidomaterno;
            if (nombreCompleto.includes(busqueda)) {
                insertarDatos(user);
                break;
            } else{
                borrarDatos();
            }
        }
    }
    function insertarDatos(user) {
        $('#name').val(user.nombres);
        $('#surname').val(user.apellidopaterno + " " + user.apellidomaterno);
        $('#collage').val(user.codigocolegiado);
        $('#date').val(user.fechaIncorporacion);//falta
        $('#condicion').val(user.condicion);//falta
        $('#deuda').html(user.deuda);//falta
        $('#date-habilitado').html(user.fechaHabilitado);//falta
        $('#date-ultima-cuota').html(user.ultimaCuota);//falta
        $('#imagen-perfil img').hide();
        $('#imagen-perfil').css("background", "no-repeat url("+user.imagen+")");//falta
        $('#imagen-perfil').css("background-size", "100% 100%");
        //PARA LA LISTA DE PAGOS
        var children = "";
        for (let pago of user.pagos) {
            var td = "<td>"+pago.numero+"</td>"+"<td>"+pago.fechaPago+"</td>"+"<td>"+pago.aporte+"</td>"+"<td>"+pago.concepto+"</td>"+"<td>"+pago.comprobante+"</td>";
            var child = "<tr>"+td+"</tr>";
            children += child;
        }
        $('tbody').html(children);
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
        if (submitUserForm()) {             //submitUserForm()
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
                        peticionAjax("dni", search.val());
                    }
                    if ($('#criterio').val() == "codColegiado") {
                        peticionAjax("codColegiado", search.val());
                    }
                    if ($('#criterio').val() == "nombreApellido") {
                        peticionAjax("nombreApellido", search.val());
                    }
                }
            }
        } else {
            e.preventDefault();
        }
    });

    /*=========================VALIDACION y CAMBIOS DE CAMPO REQUERIMIENTO============================*/
    var listaUsers = [];
            $.ajax({
                type: "GET",
                url: urlPeticion,
                data: "json",
                success: function (response) {
                    for (let user of response) {
                        listaUsers.push(user.nombres + " " + user.apellidopaterno+" "+user.apellidomaterno);
                    }
                }
    });
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
                source: listaUsers,
                disabled: false,
                minLength: 2,
                select: function (event){
                    setTimeout(() => {
                        peticionAjax("nombreApellido", search.val());
                    }, 200);
                }
            });
            $('#criterio').css('border', '1px solid #ccc');
        }
        else if (that.val() == "codColegiado") {
            search.attr("type", "number");
            search.attr("name", "codigo");
            search.attr("placeholder", "Ingrese su código de colegiado");
            search.autocomplete({
                disabled:true
            });
            $('#criterio').css('border', '1px solid #ccc');
            // $('[name="codigo"]').mask('000');
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
                number: true,
                minlength: 3,
                maxlength: 3
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
                number: "ingrese un número valido",
                minlength: "Carácteres minimos 3",
                maxlength: "Carácterse maximos 3"
            },
            text: {
                required: "Ingrese nombres y apellidos",
            }
        }
    });
});