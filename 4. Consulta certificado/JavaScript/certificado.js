/*======================URL GENERAL=======================*/
URL_CORLAD = "http://54.161.211.196:3000/api";

$(document).ready(function () {
    var categoria = $('#categoria');
    $("#consultar").click(function () {
        if ($('#casillaSearch').val().trim() != ""){
            if (categoria.val()==="codigo"){
                busquedaCodigo($('#casillaSearch').val());
            }
            if (categoria.val()==="serie"){
                busquedaSerie($('#casillaSearch').val());
            }
        }
    });
    /*TODO falta completar la busqueda por serie de recibo*/
    function busquedaSerie(busqueda) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+'/web//'+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                abrirDocumento(response);
            }
        });
    }
    function busquedaCodigo(busqueda) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+'/web/busquedaNro/'+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                abrirDocumento(response);
            }
        });
    }
    function abrirDocumento(response) {
        if (response){
            let url = "https://corladayacucho.org.pe/portal/"+$('#casillaSearch').val();
            window.open('http://127.0.0.1:5500/7.%20QR-Certificado/index.html?71-2020-CORLAD/A','Imprimir', 'width=700,height=700,scrollbars=NO,Titlebar=NO,Resizable=NO,Toolbar=NO');
        }else {
            $('#section-pdf').html("No se encontro nada...");
        }
    }

    /*=============================*/
    /*=====VALIDANDO CASILLAS======*/
    $('#content').validate({
        rules: {
            casillaSearch: {
                required: true
            }
        },
        messages: {
            casillaSearch: {
                required: "Ingrese Búsqueda"
            }
        }
    });
});