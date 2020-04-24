$(document).ready(function () {

    // fetch data from api
    var jqxhr = $.get("https://api.covid19india.org/v2/state_district_wise.json", function (data) {
        
        console.log("fetching data from https://api.covid19india.org/v2/state_district_wise.json");

        var totalConfirmedCases = 0;
        var totalActiveCases = 0;
        var totalDeceasedCases = 0;
        var totalRecovedCases = 0;

        // State Loop
        $.each(data, function(key,value) {
            var stateData = value;
            var stateDistrictData = stateData.districtData;
            
            // State District Loop
            $.each(stateDistrictData, function(key, value) {
                totalConfirmedCases+=value.confirmed;
                totalActiveCases+=value.active;
                totalDeceasedCases+=value.deceased;
                totalRecovedCases+=value.recovered;

                //totalConfirmedCases+=value.delta.confirmed;
                //totalDeceasedCases+=value.delta.deceased;
                //totalRecovedCases+=value.delta.recovered;

            });

          });

        console.log("Total Confirmed Cases = " + totalConfirmedCases);
        console.log("Total Active Cases = " + totalActiveCases);
        console.log("Total Deceased Cases = " + totalDeceasedCases);
        console.log("Total Recovered Cases = " + totalRecovedCases);

        $("#totalConfirmed").html(totalConfirmedCases);
        $("#totalActive").html(totalActiveCases);
        $("#totalDeceased").html(totalDeceasedCases);
        $("#totalRecovered").html(totalRecovedCases);
        

        console.log("data successfully received");

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
});