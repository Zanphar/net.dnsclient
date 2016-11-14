﻿$(function () {

    $('.dropdown-menu a').click(function () {
        $(this).closest('.dropdown').find('input.dnsserver').val($(this).text());
    });

    $("#btnResolve").click(function () {

        var btn = $(this).button('loading');

        var server = $("#txtServer").val();
        var domain = $("#txtDomain").val();
        var type = $("#optType").val();

        {
            var i = server.indexOf("(");
            if (i > -1) {
                var j = server.indexOf(")");
                server = server.substring(i + 1, j);
            }
        }

        if ((server === null) || (server === "")) {
            showAlert("warning", "Missing!", "Please enter a valid DNS server.");
            btn.button('reset');
            return;
        }

        if ((domain === null) || (domain === "")) {
            showAlert("warning", "Missing!", "Please enter a domain name to query.");
            btn.button('reset');
            return;
        }
        else {
            var i = domain.indexOf("://");
            if (i > -1) {
                var j = domain.indexOf(":", i + 3);

                if (j < 0)
                    j = domain.indexOf("/", i + 3);

                if (j > -1)
                    domain = domain.substring(i + 3, j);
                else
                    domain = domain.substring(i + 3);

                $("#txtDomain").val(domain);
            }
        }

        var apiUrl = "/api/dnsclient/?server=" + server + "&domain=" + domain + "&type=" + type;
        var divOutput = $("#divOutput");

        //show loader
        divOutput.html("<pre><img class='center-block' src='/img/loader.gif' /></pre>");
        divOutput.show();
        hideAlert();

        $.ajax({
            type: "GET",
            url: apiUrl,
            dataType: 'json',
            cache: false,
            success: function (responseJSON, status, jqXHR) {

                switch (responseJSON.status) {
                    case "ok":
                        divOutput.html("<pre>" + JSON.stringify(responseJSON.response, null, 2) + "</pre>");
                        break;

                    case "error":
                        showAlert("danger", "Error!", responseJSON.response.Message);
                        divOutput.hide();
                        break;

                    default:
                        showAlert("danger", "Error!", "Invalid status code was received.");
                        divOutput.hide();
                        break;
                }

                btn.button('reset');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert("danger", "Error!", jqXHR.status + " " + jqXHR.statusText);
                divOutput.hide();
                btn.button('reset');
            }
        });

    });

});

function showAlert(type, title, message) {
    var alertHTML = "<div class=\"alert alert-" + type + "\" role=\"alert\">\
    <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
    <strong>" + title + "</strong>&nbsp;" + message + "\
    </div>";

    var divAlert = $(".AlertPlaceholder");

    divAlert.html(alertHTML);
    divAlert.show();

    if (type == "success") {
        setTimeout(function () {
            hideAlert();
        }, 5000);
    }

    return true;
}

function hideAlert() {
    $(".AlertPlaceholder").hide();
}