/*======================URL GENERAL=======================*/
//var url_servicios = "http://34.227.105.144:3000/";

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
            url: 'https://api.jsonbin.io/b/5eed4a4f2406353b2e08f5f3/6',            //url_servicios+"agremiados/?filter[where][dni]="+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                for (let responseElement of response) {
                    if (responseElement.dni == parseInt(busqueda)){
                        insertarDatos(responseElement);
                        break;
                    }else{
                        borrarDatos();
                    }
                }
            }
        });
    }
    function busquedaCodigo(busqueda) {
        $.ajax({
            type: "GET",
            url: 'https://api.jsonbin.io/b/5eed4a4f2406353b2e08f5f3/6',//url_servicios+"agremiados/?filter[where][codigocolegiado]="+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                for (let responseElement of response) {
                    if (responseElement.nColegiado == parseInt(busqueda)){
                        insertarDatos(responseElement);
                        break;
                    }else{
                        borrarDatos();
                    }
                }
            }
        });
    }
    function busquedaNombre(busqueda) {
        /*
        var busquedaArray = busqueda.split(" ");
        var filtro;
        if (busquedaArray.length == 3){ //si la persona tiene un nombre
            filtro = 'agremiados/?filter={"limit":2,"where":{"or":[{"nombres": {"like": "'+busquedaArray[2]+'"}},{"apellidopaterno": {"like": "'+busquedaArray[1]+'"}},{"apellidomaterno": {"like": "'+busquedaArray[0]+'"}}]}}';
        }
        if (busquedaArray.length == 4){ //si la persona tiene dos nombre
            filtro = 'agremiados/?filter={"limit":2,"where":{"or":[{"nombres": {"like": "'+busquedaArray[3]+" "+busquedaArray[2]+'"}},{"apellidopaterno": {"like": "'+busquedaArray[1]+'"}},{"apellidomaterno": {"like": "'+busquedaArray[0]+'"}}]}}';
        }
        if (busquedaArray.length == 5){ //si la persona tiene tres nombres
            filtro = 'agremiados/?filter={"limit":2,"where":{"or":[{"nombres": {"like": "'+busquedaArray[4]+" "+busquedaArray[3]+" "+busquedaArray[2]+'"}},{"apellidopaterno": {"like": "'+busquedaArray[1]+'"}},{"apellidomaterno": {"like": "'+busquedaArray[0]+'"}}]}}';
        }
        */
        var url_path = encodeURIComponent(JSON.stringify({"limit":5,"where":{"or":[{"nombres": {"like": busqueda}},{"apellidopaterno": {"like": busqueda}},{"apellidomaterno": {"like": busqueda}}]}}));
        $.ajax({
            type: "GET",
            url: 'https://api.jsonbin.io/b/5eed4a4f2406353b2e08f5f3/6' ,//url_servicios+'agremiados/?filter='+url_path,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                for (let responseElement of response) {
                    if (responseElement.nombre+' '+ responseElement.apellidos == busqueda){
                        insertarDatos(responseElement);
                        break;
                    }else{
                        borrarDatos();
                    }
                }
            }
        });
    }
    function insertarDatos(user) {
        $('#name').val(user.nombre);
        $('#surname').val(user.apellidos);
        $('#collage').val(user.nColegiado);
        $('#date').val(user.fechaIncorporacion);//falta
        $('#condicion').val(user.condicion);//falta
        $('#deuda').html(user.deuda);//falta
        $('#date-habilitado').html(user.fechaHabilitado);//falta
        $('#date-ultima-cuota').html(user.ultimaCuota);//falta
        $('#imagen-perfil img').hide();
        if (typeof user.imagen == "object"){
            $('#imagen-perfil').css("background", "transparent");
        }else{
            $('#imagen-perfil').css("background", "no-repeat url("+user.imagen+")");
            $('#imagen-perfil').css("background-size", "100% 100%");
        }

        var pagoTr='';
        for (let pago of user.pagos) {
            let tr = '<tr><td>'+pago.numero+'</td>'+'<td>'+pago.fechaPago+'</td>'+'<td>S/. '+pago.aporte+'</td>'+'<td>'+pago.concepto+'</td>'+'<td>'+pago.comprobante+'</td></tr>';
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
    var listaUsers = [];
        $.ajax({
            type: "GET",
            url: 'https://api.jsonbin.io/b/5eed4a4f2406353b2e08f5f3/6',//url_servicios+'agremiados/',
            data: "json",
            success: function (response) {
                for (let user of response) {
                    listaUsers.push(user.nombre + " " + user.apellidos);
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
                limit: 5,
                minLength: 2,
                select: function (event){
                    if (submitUserForm()) {
                        setTimeout(() => {
                            busquedaNombre(search.val());
                        }, 200);
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