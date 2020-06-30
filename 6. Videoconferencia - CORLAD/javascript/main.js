$(document).ready(()=>{
    $('#url_compartir').hide();
    $('#copy').hide();
    $('#cerrar').hide();


    $('#generar').click(function (e) {
        var input = $('#sala');
        var combo = $('#sala_select');
        e.preventDefault()
        if (input.val().trim() == ""){
            input.css('border', '1px solid red');
        }else{
            $('#url_compartir').show();
            $('#copy').show();
            //quitar espacios del input
            var sala = input.val();
            var salaSplit = sala.split(" ");
            var salaSinEspacios = "";
            salaSplit.forEach((palabra)=>{
                salaSinEspacios += palabra;
            })

            if(combo.val() == "jitsi"){
                const domain = 'meet.jit.si';
                const options = {
                    roomName: salaSinEspacios,
                    width: '100%',
                    height: '100%',
                    parentNode: document.querySelector('#meet')
                };
                const api = new JitsiMeetExternalAPI(domain, options);
                $('#url_compartir').html(domain + '/' + salaSinEspacios);

                input.attr('disabled','disabled');
                $(this).attr('disabled','disabled');
                setTimeout(function () {
                    $('#cerrar').fadeIn(2000);
                },2000)
                $('#cerrar').click(()=>{
                    api.dispose();
                    $('#cerrar').hide();
                    $(this).removeAttr('disabled');
                    input.removeAttr('disabled');
                    $('#url_compartir').hide();
                    $('#copy').hide();
                    input.val("");
                });
            }
            if(combo.val() == "ocho"){
                $('#url_compartir').html('8x8.vc/' + salaSinEspacios);
                input.attr('disabled','disabled');
                $(this).attr('disabled','disabled');
                setTimeout(function () {
                    $('#cerrar').fadeIn(2000);
                },5000)
                let url_8x8 = 'https://8x8.vc/'+input.val();
                $('#meet').append('<iframe src="'+url_8x8+'" frameborder="0" id="8x8" width="100%" height="100%"></iframe>');
                $('#cerrar').click(function () {
                    $('#meet').html('<button type="button" id="cerrar">Cerrar sesión</button>');
                });
                $('#cerrar').click(()=>{
                    $(this).removeAttr('disabled');
                    input.removeAttr('disabled');
                    $('#url_compartir').hide();
                    $('#copy').hide();
                    input.val("");
                    $('#meet').html('<button type="button" id="cerrar">Cerrar sesión</button>');
                    $('#cerrar').hide();
                });
            }
        }
    });

});
