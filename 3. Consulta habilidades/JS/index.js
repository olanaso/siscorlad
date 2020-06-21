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
    var listUsers = [];
    var listNombres = [];
    var search = $('#search');
    $.ajax({
        type: "GET",
        url: "https://api.jsonbin.io/b/5eed4a4f2406353b2e08f5f3",
        data: "json",
        success: function (response) {
            for (let user of response) {
                let listPagos = [];
                let listUser = [];
                for (let pago of user.pagos) {
                    listPagos.push([pago.numero,pago.fechaPago,pago.aporte,pago.concepto,pago.comprobante]);
                }
                listUsers.push([user.nombre,user.apellidos,user.dni,user.nColegiado,user.fechaIncorporacion,user.condicion,user.deuda,user.fechaHabilitado,user.ultimaCuota, listPagos,user.imagen]);
                listNombres.push(user.nombre + " " + user.apellidos);
            }
        }
    });
    
    //boton de busqueda
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
                    $('.bi-search').hide();
                    $('.bi-arrow-repeat').show();
                    setTimeout(() => {
                        $('.bi-search').show();
                        $('.bi-arrow-repeat').hide();
                        if ($('#criterio').val() == "dni") {
                            busquedaDni(listUsers, search.val());
                        }
                        if ($('#criterio').val() == "codColegiado") {
                            busquedaCodigo(listUsers, search.val());
                        }
                        if ($('#criterio').val() == "nombreApellido") {
                            busquedaNombre(listUsers, search.val());
                        }
                    }, 2000);
                }
            }
        } else {
            e.preventDefault();
        }
    });
    
    
    // VALIDACIONES DE BUSQUEDA
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

    $('#criterio').blur(function () { 
        var that = $(this);
        if (that.val() == "dni") {
            search.attr("type", "number");
            search.attr("name", "number");
            search.autocomplete({
                disabled:true
            });
            $('#criterio').css('border', '1px solid #ccc');
            // $('[name="number"]').mask('00000000');
        } 
        else if (that.val() == "nombreApellido") {
            search.attr("type", "text");
            search.attr("name", "text");
            search.autocomplete({
                source: listNombres,
                disabled: false,
                minLength: 2,
                select: function (event,ui){
                    $('.bi-search').hide();
                    $('.bi-arrow-repeat').show();
                    setTimeout(() => {
                        busquedaNombre(listUsers, search.val());
                        $('.bi-search').show();
                        $('.bi-arrow-repeat').hide();
                    }, 2000);
                }
            });
            $('#criterio').css('border', '1px solid #ccc');
        }
        else if (that.val() == "codColegiado") {
            search.attr("type", "number");
            search.attr("name", "codigo");
            search.autocomplete({
                disabled:true
            });
            $('#criterio').css('border', '1px solid #ccc');
            // $('[name="codigo"]').mask('000');
        }else{
            search.autocomplete({
                disabled:true
            });
            search.attr("type", "search");
            search.attr("name", "search");
        }
    });

    //METODOS DE BUSQUEDA
    function busquedaDni(lista=[], busqueda) {
        for (let i = 0; i < lista.length; i++) {
            if (lista[i][2]==busqueda) {
                insertarDatos(lista[i]);
                break;
            } else{
                borrarDatos();
            }
        }
    }
    function busquedaCodigo(lista=[], busqueda) {
        for (let i = 0; i < lista.length; i++) {
            if (lista[i][3]==busqueda) {
                insertarDatos(lista[i]);
                break;
            } else{
                borrarDatos();
            }
        }
    }
    function busquedaNombre(lista=[], busqueda) {
        for (let i = 0; i < lista.length; i++) {
            var nombreCompleto = lista[i][0]+" "+lista[i][1];
            if (nombreCompleto.includes(busqueda)) {
                insertarDatos(lista[i]);
                break;
            } else{
                borrarDatos();
            }
        }
    }
    function insertarDatos(lista) {
        $('#name').val(lista[0]);
        $('#surname').val(lista[1]);
        $('#collage').val(lista[3]);
        $('#date').val(lista[4]);
        $('#condicion').val(lista[5]);
        $('#deuda').html(lista[6]);
        $('#date-habilitado').html(lista[7]);
        $('#date-ultima-cuota').html(lista[8]);
        $('#imagen-perfil img').hide();
        $('#imagen-perfil').css("background", "no-repeat url("+lista[10]+")");
        $('#imagen-perfil').css("background-size", "100% 100%");

        var children = "";
        for (let i = 0; i < lista[9].length; i++) {
            var tr = "<tr>";
            var trf = "</tr>"
            var td = "";
            for (let j = 0; j < lista[9][i].length; j++) {
                var contenidos = "<td>"+lista[9][i][j]+"</td>";
                td+=contenidos;
            }
            var child = tr+td+trf;
            children += child;
        }
        $('.table tbody').html(children);
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
});