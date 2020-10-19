/*Generales*/
let ESPECIALIDADES = [],
    ID_ESPECILIDAD = 0;

$.ajax({
    url: URL_CORLAD + "/especialidads",
    dataType: "json",
    success: function(data) {
        ESPECIALIDADES = [];
        for (let item of data) {
            ESPECIALIDADES.push({
                id: item.id,
                value: item.denominacion,
                label: item.denominacion
            });
        }
        $("#especialidad").autocomplete({
            source: ESPECIALIDADES,
            minLength: 1,
            select: function(event, ui) {
                log("Selected: " + ui.item.value + " aka " + ui.item.id);
            },
            select: function(event, ui) {
                console.log(ui)
                ID_ESPECILIDAD = ui.item.id;
            }
        });
    }
});



function sendMailgetclave() {

    let r = confirm("¿Desea solicitar la Clave Web para gestionar las acciones ?");
    if (!r) return;

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

    if ($('#correo').val().trim() === '') {
        alert('Realice la búsqueda del colegiado.')
        return
    }

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://siscorlad.corladayacucho.org.pe/api/web/sendemailclavegestion",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "dni": $('#search').val(),
            "from": "\"CLAVE DE GESTIÃ“N - \" <corladayacucho@corladayacucho.org.pe>",
            "subject": "CLAVE DE GESTIÃ“N - " + $('#name').val(),
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

function previewphoto() {

    document.getElementById("icono").onchange = function() {
        let reader = new FileReader();

        reader.onload = function(e) {
            // get loaded data and render thumbnail.
            document.getElementById("image").src = e.target.result;
        };
        // read the image file as a data URL.
        reader.readAsDataURL(this.files[0]);
        console.log("tamaño de imagen", this.files[0].size)

        if (this.files[0].size > 200000) {

            alert("La imagen sobre pasa el tamaño permitido")
            setTimeout(function() {
                document.getElementById("image").src = 'http://www.bajoelagua.com/avatares/avatar_g.jpg';
                $('#icono').val('');
            }, 1000)


        }
    };

}

previewphoto();

$('#btnsave').click(function(e) {
    let clavegestion = prompt(" Ingrese la clave de gestion?");


    let settings = {
        "async": true,
        "crossDomain": true,
        "url": URL_CORLAD + "/guardarAgremiadoWeb",
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "data": JSON.stringify({
            nombres: $('#name').val(),
            apellidopaterno: $('#apparterno').val(),
            apellidomaterno: $('#apmarterno').val(),
            especialidadid: ID_ESPECILIDAD,
            celular: $('#celulares').val(),
            fechanacimiento: $('#fechanacimiento').val(),
            foto: $('#image').attr('src'),
            clavegestion,
            dni: $('#dni').val()
        })

    }

    $.ajax(settings).done(function(response) {

        alert('Se grabo correctamente.')
        location.reload()
    }).error(function(err) {
        alert('Ocurrio un error !:'+ err.message)
        location.reload()
    });
})


/*============================================================*/
/*===================METODOS DE BUSQUEDA======================*/
function busquedaDni(busqueda) {
    blockearbutton();
    $.ajax({
        type: "GET",
        url: URL_CORLAD + "/web/obtenerAgremiadoWeb/" + busqueda,
        data: "json",
        beforeSend: () => {
        },
        success: function(response) {
            desblockearbutton()
            let agremiado = response.aportes[0]
            if (agremiado) {
                // detalleUsuario(response.id);
                insertarDatos(agremiado);
                $('#agremiadoEncontrado').fadeOut();
            } else {
                borrarDatos();
                $('#agremiadoEncontrado').fadeIn();
            }
        }
    });
}

 function formatearFecha(fecha) {
        let f = new Date(fecha);
        return f.getDate()+"-"+f.getMonth()+"-"+f.getFullYear();
    }


function insertarDatos(user) {

    $('#name').val(user.nombres);
    $('#dni').val($('#search').val());
    $('#apparterno').val(user.apellidopaterno);
    $('#apmarterno').val(user.apellidomaterno);
    $('#collage').val(user.codigocolegiado);
    $('#especialidad').val(user.especialidad);
    ID_ESPECILIDAD = user.especialidadid
    $('#date').val(formatearFecha(user.fechaingreso));
    $('#documento').val(user.dni);
    $('#correo').val(user.correo);
        $('#image').attr('src',user.foto);
    $('#celulares').val(user.celular);
    $('#fechanacimiento').val(user.fechanacimiento);


}

/*===================BOTON DE BUSQUEDA======================*/
let search = $('#search');
$('#button-search').click(function(e) {
    busquedaDni(search.val());
});

function blockearbutton() {
    const button = document.querySelector('#button-search');
    button.setAttribute('disabled', 'disabled');
    button.style.background = '#88BF9F';
    button.style.color = '#dedede';
    button.style.cursor = 'default';
    $('.bi-search').hide();
    $('.bi-arrow-repeat').show();
}

function desblockearbutton() {
    const button = document.querySelector('#button-search');
    button.removeAttribute('disabled');
    button.style.background = '#03873B';
    button.style.color = '#FFFFFF';
    button.style.cursor = 'pointer';
    $('.bi-search').show();
    $('.bi-arrow-repeat').hide();
}