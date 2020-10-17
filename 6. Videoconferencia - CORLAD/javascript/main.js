$(document).ready(()=>{
    $('#url_compartir').hide();
    $('#copy').hide();
    $('#cerrar').hide();


    $('#generar').click(function (e) {
        e.preventDefault()
        let input = $('#sala');
        if (input.val().trim() === "") input.css('border', '1px solid red');
        else{
            $('#url_compartir').show();
            $('#copy').show();
            //quitar espacios del input
            let sala = input.val();
            let salaSplit = sala.split(" ");
            let salaSinEspacios = "";
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
