$(document).ready(function () {

    var cookie = getCookie("indiacovidstate");
    console.log("State: " + cookie);
    if (cookie === "") {
        console.log("Setting cookie");
        var jqxhr = $.get("https://ipapi.co/json/", function (data) {

            setCookie("indiacovidstate", data.region_code, 3);

        })
            .done(function () {
                //alert("second success");
            })
            .fail(function () {
                alert("error");
            })
            .always(function () {
                //alert("finished");
            });
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        console.log("Cookie added " + cname + ", value = " + cvalue);
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
});
