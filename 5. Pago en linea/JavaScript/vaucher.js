function blockearbutton() {
    const button = document.querySelector('#buscar');
    button.setAttribute('disabled', 'disabled');
    button.style.background = '#88BF9F';
    button.style.color = '#dedede';
    button.style.cursor = 'default';
    $('.bi-search').hide();
    $('.bi-arrow-repeat').show();
}

function desblockearbutton() {
    const button = document.querySelector('#buscar');
    button.removeAttribute('disabled');
    button.style.background = '#03873B';
    button.style.color = '#FFFFFF';
    button.style.cursor = 'pointer';
    $('.bi-search').show();
    $('.bi-arrow-repeat').hide();


}

$('#contentResultado').hide();
$('#encontrados').hide();
let nombreColegiado = '';
let apellidoscolegiado = '';
let address = '';
let telefono = '';
let agremiadoid = '';
let detalleTransaccion = [];
let cuotasArray = [];
let multasArray = [];
let code64Convertido = '';
let numerocomprobante;
let cantidad_cuotas=0;
let totalPagar = 0;
let multa_total = 0;
let deuda_total = 0;
let monto_certificado = 20;

$(document).ready(function () {
    desblockearbutton();
});

/*===========FORM BUSQUEDA============*/
$('#buscar').click(function(e) {
    e.preventDefault();
   
    if ($('#dni').val() !== "") {
   
        busquedaDni($('#dni').val());
    }
});

/*Solicitar la gestion clave*/
$('#btnsolicitarclave').click(function(e) {
    let r = confirm("¿Desea solicitar la clave de gestión?");
    r ? sendMailgetclave() : null;
    /*if (r) sendMailgetclave()
    else sendMail()*/
})

/*Solicitar las deudas*/
$('#btnsolicitarPagos').click(function(e) {
    let r = confirm("¿ Desea solicitar las deudas ?");
    r ? sendMailDeudas() : null;
    /*if (r) sendMailDeudas();
    else sendMail()*/
})

$('#pagarVaucher').click(function(e) {
    let $this = $('#pagarVaucher');
    if ($('#nOperacion').val() === "") {
        alert('Ingrese el numero operación.')       
        return;
    }
    if ($('#fechaOperacion').val() === "") {
        alert('Ingrese la fecha de operación.')        
        return;
    }
    if (code64Convertido === "") {
        alert('Ingrese la foto del voucher.')
        return;
    }
   
    $this.attr("disabled", true)
    $this.css("background", "#88BF9F")
    $this.css("color", "#dedede")
    $('#iconoEnviar').hide();
    $('#cargandoEnviar').show();

    let transaccion = {
        "agremiadoid": agremiadoid,
        "dniagremiado": $('#labelDni').val().trim(),
        "comprobanteid": 1,
        "codigocomprobante": "RCB-001",
        "seriecomprobante": "RCB",
        "fotocomprobante": code64Convertido,
        "banco": $('#entidadBancaria').val(),
        "codigo_op_banco": $('#nOperacion').val(),
        "fecha_deposito_banco": $('#fechaOperacion').val(),
        "estadoaprobado": "1"
    };

    if (multasArray.length) {
        multasArray.forEach(multa => {
            detalleTransaccion.push({
                "cantidad": 1,
                "conceptopingresoid": 3,
                "conceptoingreso": 'MULTAS',
                "precio": multa.monto,
                "conceptoingreso_codigo": 'M003',
                "undiad": 'UNID',
                "multaid": multa.id
            });
        })
    }
    if (cantidad_cuotas) {
        detalleTransaccion.push({
            "conceptopingresoid": 2,
            "cantidad": Number(cantidad_cuotas),
            "conceptoingreso": "APORTES",
            "precio": 15,
            "conceptoingreso_codigo": "A002",
            "unidad": "UNID"
        });
    }
    if (document.getElementById("check_certificado").checked) {
        detalleTransaccion.push({
            "conceptopingresoid": 1,
            "cantidad": (cuotasArray.length)?(Number(cantidad_cuotas)-cuotasArray.length):Number(cantidad_cuotas),
            "conceptoingreso": "CERTIFICADO DE HABILIDAD",
            "precio": 20,
            "conceptoingreso_codigo": "CH-001",
            "unidad": "UNID"
        });
    }
  
    let clavegestion = prompt(" Ingrese la clave de gestion?");
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": URL_CORLAD + "/web/ingresowebvoucher",
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "data": JSON.stringify({ transaccion, detalletransaccion: detalleTransaccion, clavegestion }),
      
    }

    $.ajax(settings).done(function(response) {
        numerocomprobante = "RCB-" + response.transaccionDB.numerocomprobante;
        sendMail();
        $this.removeAttr("disabled")
        $this.css("background", "#03873B")
        $this.css("color", "#FFFFFF")
        $('#iconoEnviar').show();
        $('#cargandoEnviar').hide();
    }).error(function(err) {
        /*Reiniccinado los valores**/
        detalleTransaccion = [];
        if(err){
            alert(err.responseJSON.message);
            $this.removeAttr("disabled")
            $this.css("background", "#03873B")
            $this.css("color", "#FFFFFF")
            $('#iconoEnviar').show();
            $('#cargandoEnviar').hide();
        }
    });
});

function busquedaDni(busqueda) {
    $.ajax({
        type: "GET",
        url: URL_CORLAD + "/web/busquedaDni/" + busqueda,
        data: "json",  
        beforeSend:function() {
            blockearbutton();        
        },
        success: function(response) {
            desblockearbutton();
            if (response) {                
                insertarDatos(response);
                insertarDatosDeudas(response.dni);
                $('#contentResultado').slideDown(1000);
                $('#encontrados').hide();
            } else {
                $('#contentResultado').slideUp();
                $('#encontrados').show();
            }

        }
    });
}

/*=========INSERTA LOS DATOS DE LA PETICIÓN AL HTML=========*/
function insertarDatosDeudas(busqueda) {
    $.ajax({
        type: "GET",
        url: URL_CORLAD + "/web/deudasAgremiado/" + busqueda,
        data: "json",
        success: function(response) {
            desblockearbutton();
            document.getElementById("check-deudas").checked = false;
            document.getElementById("check-multas").checked = false;
            document.getElementById("check_certificado").checked = false;
            cuotasArray = response.cuotas.cuotas;
            multasArray = response.multas.multas;
            deuda_total = response.cuotas.cuotaTotal;
            multa_total = response.multas.multaTotal;

            cantidad_cuotas=cuotasArray.length;
            $('#cantidad_deuda').attr('disabled', 'disabled');
            $('#check_certificado').attr('disabled', 'disabled');
            if(cuotasArray.length > 0){
                totalPagar = cantidad_cuotas * 15;
                document.getElementById("check-deudas").checked = true;
                $('#cantidad_deuda').removeAttr('disabled');
                $('#check_certificado').removeAttr('disabled');
            }
            if(multasArray.length > 0){
                totalPagar += multa_total;
                document.getElementById("check-multas").checked = true;
            }     

            $('#total-pagar').html("TOTAL A PAGAR: S/ " + totalPagar)
            $("#cuotas_aportes").text((cuotasArray.length)?cuotasArray.length+ ' CUOTAS':'CUOTAS');
            document.getElementById("cantidad_deuda").value=cuotasArray.length;
            $('#total-deuda').html(cantidad_cuotas * 15 + '.00');
            $('#total-multa').html(multa_total + '.00');
            $('#monto-certificado').html(monto_certificado + '.00');
            $('#tabla-detalles-cuotas tbody').html(null);
            $('#tabla-detalles-multas tbody').html(null);
            for (let cuota of response.cuotas.cuotas) {
                $('#tabla-detalles-cuotas tbody').prepend("<tr><td>S/ " + cuota.monto + "</td><td>" + formatearMes(cuota.mes) + "</td><td>" + cuota.anio + "</td></tr>");
            }
            for (let multa of response.multas.multas) {
                $('#tabla-detalles-multas tbody').prepend("<tr><td>S/ " + multa.monto + "</td><td>" + multa.motivo_multa + "</td></tr>");
            }
        }
    });
}

$('#cantidad_deuda').keyup(function() {
    let temporal = cantidad_cuotas;
    let valor = $(this).val();
    if(valor){
        let total_dif = valor - (temporal);
        totalPagar = totalPagar + (total_dif * 15);
        cantidad_cuotas = valor;
        if(cantidad_cuotas<cuotasArray.length){
            $('#check_certificado').attr('disabled', 'disabled');
            if(document.getElementById("check_certificado").checked){
                document.getElementById("check_certificado").checked = false;
                totalPagar = totalPagar - monto_certificado;
            }
        } else $('#check_certificado').removeAttr('disabled');

        $('#total-deuda').html(cantidad_cuotas * 15 + '.00');
        $('#total-pagar').html("TOTAL A PAGAR: S/ " + totalPagar)
    }
   
});


$("#check-deudas").change(function() {
    if(this.checked){
        $('#cantidad_deuda').removeAttr('disabled');
        totalPagar += cantidad_cuotas * 15;
        $('#total-pagar').html("TOTAL A PAGAR: S/ " + totalPagar)
        if(cantidad_cuotas >= cuotasArray.length)$('#check_certificado').removeAttr('disabled');
    }
   
    if(!this.checked){
        $('#cantidad_deuda').attr('disabled', 'disabled');
        if(document.getElementById("check_certificado").checked){
            totalPagar = totalPagar - (cantidad_cuotas * 15 + monto_certificado);
            document.getElementById("check_certificado").checked = false;
        } else totalPagar = totalPagar - cantidad_cuotas * 15;

        $('#check_certificado').attr('disabled', 'disabled'); 
        $('#total-pagar').html("TOTAL A PAGAR: S/ " + totalPagar)
    }
});

$("#check_certificado").change(function() {
    if(this.checked){
        totalPagar += monto_certificado;
        $('#total-pagar').html("TOTAL A PAGAR: S/ " + totalPagar)
    }
    if(!this.checked){
        totalPagar=totalPagar - monto_certificado;
        $('#total-pagar').html("TOTAL A PAGAR: S/ " + totalPagar)
    }
});

$("#check-multas").change(function() {   
    if(this.checked){    
        totalPagar += multa_total;
        $('#total-pagar').html("TOTAL A PAGAR: S/ " + totalPagar)
    }
    if(!this.checked){
        totalPagar=totalPagar - multa_total;
        $('#total-pagar').html("TOTAL A PAGAR: S/ " + totalPagar)
    }
});

function insertarDatos(user) {
    nombreColegiado = user.nombres;
    agremiadoid = user.id;
    apellidoscolegiado = user.apellidopaterno + " " + user.apellidomaterno;
    telefono = user.celular;
    address = user.direccion;
    $('#labelNombre').val(user.nombres + " " + user.apellidopaterno + " " + user.apellidomaterno);
    $('#labelDni').val(user.dni);
    $('#labelEmail').val(user.correo);
    $('#total-deuda').html('0.00');
    $('#total-multa').html('0.00');
    $('#monto-certificado').html(monto_certificado + '.00');
}


function previewphoto() {
    document.getElementById("input-id").onchange = function(e) {
        let reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById("image").src = e.target.result;
            code64Convertido = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);

        if (this.files[0].size > 1000000) {
            alert("La imagen sobre pasa el tamaño permitido");
            code64Convertido = '';
            $('#input-id').val('');
            document.getElementById("image").src = 'images/blanco.png';
        }
    };
}
previewphoto();

function formatearMes(mes) {
    let mesFormateado = "";
    switch (mes) {
        case 1: mesFormateado = "enero";break;
        case 2: mesFormateado = "febrero";break;
        case 3: mesFormateado = "marzo";break;
        case 4: mesFormateado = "abril";break;
        case 5: mesFormateado = "mayo";break;
        case 6: mesFormateado = "junio";break;
        case 7: mesFormateado = "julio";break;
        case 8: mesFormateado = "agosto";break;
        case 9: mesFormateado = "septiembre";break;
        case 10: mesFormateado = "octubre";break;
        case 11: mesFormateado = "noviembre";break;
        case 12: mesFormateado = "diciembre";break;
        default: break;
    }
    return mesFormateado;
}
/*==================================*/
/*=========VALIDANDO FORMS==========*/
$('#contentBusqueda').validate({
    rules: {
        dni: {
            required: true,
            minlength: 8,
            maxlength: 8
        }
    },
    messages: {
        dni: {
            required: "Se requiere el dni",
            minlength: "Cararteres minimos 8",
            maxlength: "Caracteres máximos 8"
        }
    }
});
$('#contentResultado').validate({
    rules: {
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
    $(".file-caption-name").attr("placeholder", "Selecciona archivo ...");
    $(".hidden-xs").html("");
}, 300);


/*=================================ENVIO DE VAUCHER EMAIL=================================*/

function sendMail() {
    let fechaInput = $('#fechaOperacion').val();
    let fecha = new Date(fechaInput);
    fecha.setDate(fecha.getDate() + 1);
    detalles = []
    if (document.getElementById("check-deudas").checked) {
        detalles.push("Deudas de aportes");
    }
    if (document.getElementById("check-multas").checked) {
        detalles.push("Multas");
    }
    if (document.getElementById("check_certificado").checked && !$('#check_certificado').attr('disabled')) {
        detalles.push("Certificado");
    }

    let templateHTML = `
        
      <table class="MsoTableGrid" style="border-collapse: collapse; border: none; margin-left: auto; margin-right: auto; box-shadow: rgba(0, 0, 0, 0.75) 0px 0px 10px 1px; width: 580px;" border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr style="mso-yfti-irow: 0; mso-yfti-firstrow: yes;">
<td style="width: 546px; background: green; padding: 0cm 5.4pt; text-align: center;" colspan="2" valign="top">
<table style="height: 23px; width: 564px;">
<tbody>
<tr>
<td style="width: 138.6px;"><img src="https://corladayacucho.org.pe/portal/wp-content/uploads/2020/08/text85SS8.png" alt="" width="106" height="106" /></td>
<td style="width: 406.4px;">
<p><span style="color: #ffffff;"><strong>COLEGIO REGIONAL DE LICENCIADOS EN ADMINISTRACI&Oacute;N DE AYACUCHO - CORLAD</strong></span></p>
<p><span style="color: #ffffff;"><strong>COMPROBANTE DE PAGO</strong></span></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
  
  
  <tr style="mso-yfti-irow: 4; mso-yfti-lastrow: yes;">
<td style="width: 546px; background: white; padding: 0cm 5.4pt;" colspan="2" valign="top">
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="ES" style="font-size: 12.0pt; mso-bidi-font-size: 12.0pt; font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; color: red; mso-themecolor: background1; mso-ansi-language: ES;">Comprobante enviado por Validar, es necesario que el CORLAD Ayacucho valide el pago, una vez validado se le confirmara con un correo electronico.</p>
</td>
</tr>
  
  
<tr style="mso-yfti-irow: 2;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><strong><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">NRO COMPROBANTE</span></strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${numerocomprobante}</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 2;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><strong><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">NRO DOCUMENTO</span></strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${$('#labelDni').val()}</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 3;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal" style="font-family: 'Calibri Light', sans-serif;"><strong>NOMBRES</strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${$('#labelNombre').val()}</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 3;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><strong><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">CORREO</span></strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${$('#labelEmail').val()}</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 3;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span style="font-family: 'Calibri Light', sans-serif;"><strong>ENTIDAD BANCARIA</strong></span></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${$('#entidadBancaria').val()}</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 3;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal" style="font-family: 'Calibri Light', sans-serif;"><strong>NRO OPERACION</strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${$('#nOperacion').val()}</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 3;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal" style="font-family: 'Calibri Light', sans-serif;"><strong>DESCRIPCION</strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${detalles.join(", ")}</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 3;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal" style="font-family: 'Calibri Light', sans-serif;"><strong>MONTO TOTAL DE PAGO</strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${"S/ "+(totalPagar)}.00</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 3;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal" style="font-family: 'Calibri Light', sans-serif;"><strong>FECHA DE OPERACION</strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span class="SpellE"><span lang="ES" style="font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; mso-ansi-language: ES;">${fecha.toLocaleDateString()}</span></span></p>
</td>
</tr>
<tr style="mso-yfti-irow: 3;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal" style="font-family: 'Calibri Light', sans-serif;"><strong>IMAGEN DEL VAUCHER</strong></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><img src="${code64Convertido}" title="Imagen de vaucher" width="370" /></p>
</td>
</tr>
<tr style="mso-yfti-irow: 4; mso-yfti-lastrow: yes;">
<td style="width: 546px; background: #03883c; padding: 0cm 5.4pt;" colspan="2" valign="top">
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="ES" style="font-size: 9.0pt; mso-bidi-font-size: 12.0pt; font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; color: white; mso-themecolor: background1; mso-ansi-language: ES;">Copyright &copy; Colegio Regional de Licenciados en <span class="SpellE">Administraci&oacute;n</span> de Ayacucho, <span class="SpellE">All</span> <span class="SpellE">rights</span> <span class="SpellE">reserved</span>.</span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="ES" style="font-size: 9.0pt; mso-bidi-font-size: 12.0pt; font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; color: white; mso-themecolor: background1; mso-ansi-language: ES;">www.corladayacucho.org.pe</span></p>
</td>
</tr>
</tbody>
</table>
        `

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://siscorlad.corladayacucho.org.pe/api/web/sendemail",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {

            "from": "\"COMPROBANTE DE PAGO - \" <corladayacucho@corladayacucho.org.pe>",
            "subject": "COMPROBANTE DE PAGO - " + $('#labelNombre').val(),
            "email_html": templateHTML,
            "to": $('#labelEmail').val() + ', corladayacucho14@gmail.com'
        }
    }
    $.ajax(settings).done(function(response) {
        if (response.result) {
            alert(`La transaccion fue enviada correctamente.
        el numero de comprobante es : ${numerocomprobante}
        
        Tome nota y guardalo en caso de reclamos.
        `)
            window.location.reload();
        }
    });
}


function sendMailgetclave() {

    let templateHTML = `
        <table class="MsoTableGrid" style="border-collapse: collapse; border: none; margin-left: auto; margin-right: auto; box-shadow: rgba(0, 0, 0, 0.75) 0px 0px 10px 1px; width: 580px;" border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr style="mso-yfti-irow: 0; mso-yfti-firstrow: yes;">
<td style="width: 546px; background: green; padding: 0cm 5.4pt; text-align: center;" colspan="2" valign="top">
<table style="height: 23px; width: 564px;">
<tbody>
<tr>
<td style="width: 138.6px;"><img src="https://corladayacucho.org.pe/portal/wp-content/uploads/2020/08/text85SS8.png" alt="" width="106" height="106" /></td>
<td style="width: 406.4px;">
<p><span style="color: #ffffff;"><strong>COLEGIO REGIONAL DE LICENCIADOS EN ADMINISTRACI&Oacute;N DE AYACUCHO - CORLAD</strong></span></p>
<p><span style="color: #ffffff;"><strong>CLAVE DE GESTI&Oacute;N WEB</strong></span></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="mso-yfti-irow: 2;">
<td style="width: 158.4px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><span style="font-family: 'Calibri Light', sans-serif;"><strong>CLAVE DE GESTION</strong></span></p>
</td>
<td style="width: 387.6px; padding: 0cm 5.4pt;" valign="top">
<p class="MsoNormal"><h1>_clavegestion_</h1></p>
</td>
</tr>
<tr style="mso-yfti-irow: 4; mso-yfti-lastrow: yes;">
<td style="width: 546px; background: #03883c; padding: 0cm 5.4pt;" colspan="2" valign="top">
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="ES" style="font-size: 9.0pt; mso-bidi-font-size: 12.0pt; font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; color: white; mso-themecolor: background1; mso-ansi-language: ES;">Copyright &copy; Colegio Regional de Licenciados en <span class="SpellE">Administraci&oacute;n</span> de Ayacucho, <span class="SpellE">All</span> <span class="SpellE">rights</span> <span class="SpellE">reserved</span>.</span></p>
<p class="MsoNormal" style="text-align: center;" align="center"><span lang="ES" style="font-size: 9.0pt; mso-bidi-font-size: 12.0pt; font-family: 'Calibri Light',sans-serif; mso-fareast-font-family: 'Times New Roman'; color: white; mso-themecolor: background1; mso-ansi-language: ES;">www.corladayacucho.org.pe</span></p>
</td>
</tr>
</tbody>
</table>
   
        `

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://siscorlad.corladayacucho.org.pe/api/web/sendemailclavegestion",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "dni": $('#labelDni').val(),
            "from": "\"CLAVE DE GESTIÓN - \" <corladayacucho@corladayacucho.org.pe>",
            "subject": "CLAVE DE GESTIÓN - " + $('#labelNombre').val(),
            "email_html": templateHTML,
            "to": $('#labelEmail').val()
        }
    }
    $.ajax(settings).done(function(response) {
        if (response.result) {
            alert(`La clave fue enviado a su correo personal
        `)
            // window.location.reload();
        }
    });
}

/*=============================ENVIA DE DEUDA A PAGOS======================================*/


function sendMailDeudas() {
    
    
        let anio = prompt(" Ingrese Año?");
             let dni = $('#labelDni').val()
    
        let settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://siscorlad.corladayacucho.org.pe/api/web/obtenerAportes/${dni}/${anio}`,
        "method": "get"
    }
    $.ajax(settings).done(function(response) {
        if (response) {
         
           let templateHTML = `
     <table class="MsoTableGrid" style="border-collapse: collapse; border: none; margin-left: auto; margin-right: auto; box-shadow: rgba(0, 0, 0, 0.75) 0px 0px 10px 1px; width: 580px;">
<tbody>
<tr>
<td style="text-align: center; width: 546px; background: #03883c; padding: 0cm 5.4pt; color: white;" colspan="4">
<h3><strong>COLEGIO REGIONAL DE LICENCIADOS EN ADMINISTRACI&Oacute;N DE AYACUCHO - CORLAD</strong></h3>
<blockquote>
<h3><span style="color: #ffff00;"><strong>LISTA DE APORTES POR A&Ntilde;O ${anio}</strong></span></h3>
</blockquote>
</td>
</tr>
<tr style="text-align: center; width: 546px; background: #03883c; padding: 0cm 5.4pt; color: white;">
<td style="text-align: center; width: 124px;"><strong>A&Ntilde;O</strong></td>
<td style="text-align: center; width: 131px;"><strong>MES&nbsp;</strong></td>
<td style="text-align: center; width: 125px;"><strong>MONTO S/.</strong></td>
<td style="text-align: center; width: 136px;"><strong>ESTADO</strong></td>
</tr>`

for(let row of response.aportes){
     templateHTML+=   `<tr>
    <td style="width: 124px; text-align: center;">${row.anio}</td>
    <td style="width: 131px; text-align: center;">${row.mes}</td>
    <td style="text-align: center; width: 125px;">S/. 15.00</td>
    <td style="width: 136px; text-align: center;">${ row.estadoaporteid=='1' ? 'PENDIENTE': 'PAGADO' }</td>
    </tr>`
}


templateHTML+=`
<tr>
<td style="text-align: center; width: 546px; background: #03883c; padding: 0cm 5.4pt; color: white;" colspan="4">
<p>Copyright &copy; Colegio Regional de Licenciados en Administraci&oacute;n de Ayacucho, All rights reserved.</p>
</td>
</tr>
<tr>
<td style="text-align: center; width: 546px; background: #03883c; padding: 0cm 5.4pt; color: white;" colspan="4"><a href="http://www.corladayacucho.org.pe/">www.corladayacucho.org.pe</a></td>
</tr>
</tbody>
</table>`



 var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://siscorlad.corladayacucho.org.pe/api/web/sendemail",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "dni": $('#labelDni').val(),
            "from": "\"LISTADO DE APORTES - \" <corladayacucho@corladayacucho.org.pe>",
            "subject": "LISTADO DE APORTES - " + $('#labelNombre').val(),
            "email_html": templateHTML,
            "to": $('#labelEmail').val()
        }
    }
    $.ajax(settings).done(function(response) {
        if (response.result) {
            alert(`Los aportes fueron enviados a su correo`)
            // window.location.reload();
        }
    });


        
   
        }
        
    });
    

  


    
    
     
}


/*====================================PAGO EN LINEA CON CULQI==========================================*/
Culqi.options({

    style: {
        logo: 'https://corladayacucho.org.pe/portal/wp-content/uploads/2020/07/logocorlad.png',

    }
});
Culqi.publicKey = 'pk_test_xDCpMxAgd8kjuKSV';
// Usa la funcion Culqi.open() en el evento que desees
let detalles;
$('#pagarTarjeta').on('click', function(e) {
    detalles = [];
    if (document.getElementById("check-deudas").checked) detalles.push("Deudas de aportes");
    if (document.getElementById("check-multas").checked) detalles.push("Multas");
    if (document.getElementById("check_certificado").checked && !$('#check_certificado').attr('disabled')) detalles.push("Certificado");

    // Configura tu Culqi Checkout
    Culqi.settings({
        title: 'PAGO CORLAD',
        currency: 'PEN',
        description: detalles.join(", "),
        amount: totalPagar
    });
    // Abre el formulario con las opciones de Culqi.settings
    if (totalPagar >= 10) {
        Culqi.open();
        e.preventDefault();
    } else {
        alert('No puede pagar un monto menor a los S/ 10');
    }
});

/*Para pagar*/
function culqi() {
    if (Culqi.token) { // ¡Objeto Token creado exitosamente!
        let token = Culqi.token.id;
        let email = Culqi.token.email;


        let data = {
            "amount": totalPagar,
            "description": detalles.join(", "),
            "email": email,
            "address": address,
            "address_city": "AYACUCHO",
            "first_name": nombreColegiado,
            "last_name": apellidoscolegiado,
            "phone_number": telefono,
            "source_id": token
        };

        let url = "https://corladayacucho.org.pe/culqui/proceso.php";

        $.post(url, data, function(res) {

            //alert(' Tu pago se Realizó con ' + res + '. Agradecemos tu preferencia.');
            if (res.includes('phone_number')) {
                alert("No se completo la transacción, por favor actualice su número de celular");
            }
            if (res == "exito") {
                alert("El pago se realizo con éxito. Agradecemos su preferencia.")
            } else {
                alert("No se logró realizar el pago.");
            }
        });

        //En esta linea de codigo debemos enviar el "Culqi.token.id"
        //hacia tu servidor con Ajax
    } else { // ¡Hubo algún problema!
        // Mostramos JSON de objeto error en consola
        console.log("error al entrar a culqui: " + Culqi.error);
        alert(Culqi.error.user_message);
    }
}