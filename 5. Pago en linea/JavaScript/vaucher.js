/*======================URL GENERAL=======================*/
var url_servicios = "http://34.227.105.144:3000/";

$(document).ready(function () {
    $('#contentResultado').hide();
    /*====================================*/
    /*===========FORM BUSQUEDA============*/
    $('#buscar').click(function (e) {
        e.preventDefault();
        if ($('#dni').val() != ""){
            busquedaDni($('#dni').val());
        }else{

        }
    });
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
                    insertarDatos(response[0])
                    $('#contentResultado').slideDown(1000);
                }else {
                    $('#contentResultado').slideUp();
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
                document.getElementById("input-id").src = e.target.result;
            };
            // read the image file as a data URL.
            reader.readAsDataURL(this.files[0]);
            console.log("tamaño de imagen", this.files[0].size)

            if (this.files[0].size > 20000) {
                alert("La imagen sobre pasa el tamaño permitido");
                $('#input-id').val('');
            }
        };
    }
    previewphoto();


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