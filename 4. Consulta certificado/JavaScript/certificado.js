$(document).ready(function () {
    let categoria = $('#categoria');
    $("#consultar").click(function () {
        if ($('#casillaSearch').val().trim() !== ""){
            if (categoria.val()==="codigo"){
                busquedaCodigo($('#casillaSearch').val());
            }
            if (categoria.val()==="serie"){
                busquedaSerie($('#casillaSearch').val());
            }
        }
    });
    /*TODO falta completar la busqueda por serie de recibo*/
    function busquedaCodigo(busqueda) {
        $.ajax({
            type: "GET",
            url: URL_CORLAD+'/web/busquedaCertificado/'+busqueda,
            data: "json",
            beforeSend: ()=>{
                $('.bi-search').hide();
                $('.bi-arrow-repeat').show();
            },
            success: function (response) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                abrirDocumento(response);
            },
            error: function(err) {
                $('.bi-search').show();
                $('.bi-arrow-repeat').hide();
                $('#section-pdf').html(err.responseJSON.msj + ' <a href="https://corladayacucho.org.pe/portal/2020/07/12/envio-de-vouchers-de-pago" target="_blank">AQUÍ</a>');
            }
        });
    }
    function abrirDocumento(response) {
        if (response){
            if (response.condicion === "HABILITADO") {
                let url = "http://corladayacucho.org.pe/consultas/7.%20QR-Certificado?"+$('#casillaSearch').val();
                window.open(url,'Imprimir', 'width=700,height=700,scrollbars=NO,Titlebar=NO,Resizable=NO,Toolbar=NO');
                $('#section-pdf').html(null);
            } else{
                $('#section-pdf').html("Agremiado deshabilitado...");
            }
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