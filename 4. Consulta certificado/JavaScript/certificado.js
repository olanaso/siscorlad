$('body').hover(function () {
    // over
    if (window.name === "VentanaExterna") {
        $('#modal-container').remove();
    } else{
        $('body').prepend('<section id="modal-container"><button id="ingresarOriginal">INGRESAR</button></section>');
        $('#container').css('filter', 'blur(2px)');
        $('#ingresarOriginal').click(function (e) { 
            e.preventDefault();
            
            window.open('http://corladayacucho.org.pe/consultas/4.%20Consulta%20certificado/','VentanaExterna',"width=690,height=165,location=NO");
        });
    }
    
}, function () {
    // out
    $('#modal-container').remove();
    $('#container').css('filter', 'none');
}
);

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
            let url = "http://corladayacucho.org.pe/consultas/7.%20QR-Certificado?"+$('#casillaSearch').val();
            window.open(url,'Imprimir', 'width=700,height=700,scrollbars=NO,Titlebar=NO,Resizable=NO,Toolbar=NO');
            $('#section-pdf').html(null);
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