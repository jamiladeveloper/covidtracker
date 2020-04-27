$(document).ready(function () {

    var cookieData = getCookie("indiacovidstate");
    console.log("State = " + cookieData);

    var stateFullData = {};

    // fetch data from api
    var jqxhr = $.get("https://api.covid19india.org/v2/state_district_wise.json", function (data) {
        var totalConfirmedCases = 0;
        var totalActiveCases = 0;
        var totalDeceasedCases = 0;
        var totalRecovedCases = 0;

        // State Loop
        $.each(data, function (key, value) {

            var stateData = value;
            var stateDistrictData = stateData.districtData;

            var state = {};
            state.state = value.state;
            state.statecode = value.statecode;
            
            state.confirmed = 0;
            state.active = 0;
            state.deceased = 0;
            state.recovered = 0;

            // State District Loop
            $.each(stateDistrictData, function (key, value) {
                totalConfirmedCases += value.confirmed;
                totalActiveCases += value.active;
                totalDeceasedCases += value.deceased;
                totalRecovedCases += value.recovered;


                state.confirmed +=value.confirmed;
                state.active += value.active;
                state.deceased += value.deceased;
                state.recovered += value.recovered;

            });

            stateFullData[state.statecode] = state;

        });;

        $("#totalConfirmed").html(totalConfirmedCases);
        $("#totalActive").html(totalActiveCases);
        $("#totalDeceased").html(totalDeceasedCases);
        $("#totalRecovered").html(totalRecovedCases);

        //console.log(stateFullData);

    })
        .done(function () {
            console.log(JSON.stringify(stateFullData));
            localStorage.setItem("stateFullData", JSON.stringify(stateFullData));
        })
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert("finished");
        });




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