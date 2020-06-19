$(document).ready(function () {
    var progress = $('#progress-circle').hide();
    var error = $('#error').hide();
    var vaciar = $('#vacio').hide();
    var cuentas = [];

    $.ajax({
        type: "GET",
        url: "https://api.jsonbin.io/b/5eebbbe72406353b2e0839d0",
        data: "json",
        success: function (response) {
            cuentas = response;
        }
    });

    $('input[type="submit"]').click(function (e) {
        e.preventDefault();
        for (var element of cuentas) {
            if (element.user == $('#input-user').val().trim() || element.email == $('#input-user').val().trim() && element.password == $('#input-password').val().trim()) {
                progress.fadeIn();
                error.hide();
                vaciar.hide();
                setTimeout(() => {
                    progress.fadeOut();
                }, 2500);
                break;
            } else if ("" == $('#input-user').val().trim() || "" == $('#input-user').val().trim() && "" == $('#input-password').val().trim()){
                vaciar.show();
                error.hide();
            } else{
                error.show()
                vaciar.hide();
            }
        }
    });
});