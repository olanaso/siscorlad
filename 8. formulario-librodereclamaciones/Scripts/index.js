$(document).ready(function () {
    

    /*====================================
    ==============JQUERY================*/

    $('#tabs').tabs();
    //MASCARAD PARA LOS FORMULARIOS
    $('#tipoDocumento').blur(function (e) { 
        e.preventDefault();
        $('#numeroDocumento').val("");
        if ($(this).val() === 'none') {
            $('#numeroDocumento').unmask();
        }
        if ($(this).val() === 'dni') {
            $('#numeroDocumento').removeAttr('disabled');
            $('#numeroDocumento').mask('00000000');
        }
        if ($(this).val() === 'carnet') {
            $('#numeroDocumento').removeAttr('disabled');
            $('#numeroDocumento').unmask();
        }
        if ($(this).val() === 'passport') {
            $('#numeroDocumento').removeAttr('disabled');
            $('#numeroDocumento').unmask();
        }
    });
    $('#numeroDocumento').mask('00000000');
    $('#celular').mask('(+51) 000 000 000');
    $('#celularJ').mask('(+51) 000 000 000');
    $('#telefonoFijo').mask('(000) 000 000');
    $('#telefonoFijoJ').mask('(000) 000 000');
    $('#numeroRuc').mask('00000000000');

    //Validando campos de formulario
    $('#form-natural').validate({
        rules: {
            numeroDocumento: {
                required: true,
                minlength: 8
            },
            apellidoPaterno:{
                required: true
            },
            apellidoMaterno:{
                required: true
            },
            nombres:{
                required: true
            },
            celular:{
                required: true
            },
            telefonoFijo:{
                required: false
            },
            correoElectronico:{
                required: true,
                email: true
            },

            domicilio:{
                required: true
            },
            mensaje:{
                required: true
            }
        }
    });
    $('#form-juridica').validate({
        rules: {
            numeroRuc: {
                required: true,
                minlength: 11
            },
            razonSocial:{
                required: true
            },
            celularJ:{
                required: true
            },
            telefonoFijoJ:{
                required: false
            },
            correoElectronicoJ:{
                required: true,
                email: true
            },
            domicilioJ:{
                required: true
            },
            mensajeJ:{
                required: true
            }
        }
    });
});