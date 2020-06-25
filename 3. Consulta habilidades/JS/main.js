/*======================URL GENERAL=======================*/
var url_servicios = "http://34.227.105.144:3000/";

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
            url: url_servicios+"agremiados/?filter[where][dni]="+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                if (response.length != 0){
                    insertarDatos(response[0]);
                }else {
                    borrarDatos();
                }
            }
        });
    }
    function busquedaCodigo(busqueda) {
        $.ajax({
            type: "GET",
            url: url_servicios+"agremiados/?filter[where][codigocolegiado]="+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                if (response.length != 0){
                    insertarDatos(response[0]);
                }else {
                    borrarDatos();
                }
            }
        });
    }
    function busquedaNombre(busqueda) {
        let busquedaArray = busqueda.split(" ").reverse();
        var filtro = '';
        /*SI LOS USUARIOS TIENES UN NOMBRE O DOS NOMBRES O TRES NOMBRES*/
        if (busquedaArray.length == 3){
            filtro = 'agremiados/?filter={"limit":2,"where":{"or":[{"nombres": {"like": "'+busquedaArray[2]+'"}},{"apellidopaterno": {"like": "'+busquedaArray[1]+'"}},{"apellidomaterno": {"like": "'+busquedaArray[0]+'"}}]}}';
        }
        if (busquedaArray.length == 4){
            filtro = 'agremiados/?filter={"limit":2,"where":{"or":[{"nombres": {"like": "'+busquedaArray[3]+" "+busquedaArray[2]+'"}},{"apellidopaterno": {"like": "'+busquedaArray[1]+'"}},{"apellidomaterno": {"like": "'+busquedaArray[0]+'"}}]}}';
        }
        if (busquedaArray.length == 5){
            filtro = 'agremiados/?filter={"limit":2,"where":{"or":[{"nombres": {"like": "'+busquedaArray[4]+" "+busquedaArray[3]+" "+busquedaArray[2]+'"}},{"apellidopaterno": {"like": "'+busquedaArray[1]+'"}},{"apellidomaterno": {"like": "'+busquedaArray[0]+'"}}]}}';
        }

        $.ajax({
            type: "GET",
            url: url_servicios+filtro,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                if (response[0].length != 0){
                    insertarDatos(response[0]);
                }else {
                    borrarDatos();
                }
            }
        });
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
        if (typeof user.foto == "object"){
            $('#imagen-perfil').css("background", "transparent");
        }else{
            $('#imagen-perfil').css("background", "no-repeat url(data:image/jpeg;base64,"+user.foto+")");
            $('#imagen-perfil').css("background-size", "100% 100%");
        }
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
            url: url_servicios+'agremiados/',
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