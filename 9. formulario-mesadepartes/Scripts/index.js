$(document).ready(function () {
    

    /*===================================
    ===========Cargar archivos=========*/
    $('#customFileLang').change(function (e) { 
        e.preventDefault();
        var extPdf = /(.pdf)$/i;
        var extDocx = /(.docx)$/i;
        var extDocx = /(.zip)$/i;
        if (!extDocx.exec($(this)[0].value) && !extPdf.exec($(this)[0].value)) {
            alert('Solo se puede adjuntar archivos pdf, docx, zip');
            $(this)[0].value = ''
            console.log($(this)[0].value);
            return;
        }

        $('#customFileText').html($(this)[0].files[0].name);

        console.log($(this)[0].value);
        console.log($(this)[0].files[0].size);
    });
    $('.example-popover').popover({
        container: 'body',
        trigger: 'hover'
    });
    /*===============================
    ===========JQUERYS=============*/
    //Mascaras
    $('#celular').mask('(+51) 000 000 000');
    $('#numeroHojas').mask('###0');
    $('#numeroDocumento').mask('00000000');
    //Validacion de los campos de form
    $('#formulario').validate({
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
            correoElectronico:{
                required: true,
                email: true
            },
            domicilio:{
                required: true
            },
            customFileLang:{
                required: true
            },
            numeroHojas:{
                required: true
            },
            mensajeTramite:{
                required: true
            }
        }
    });
});