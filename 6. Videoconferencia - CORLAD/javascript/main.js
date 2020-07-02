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

            if(true){
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
        }
    });

});
