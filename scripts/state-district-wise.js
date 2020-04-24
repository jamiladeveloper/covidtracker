$(document).ready(function () {

    // fetch data from api
    var jqxhr = $.get("https://api.covid19india.org/v2/state_district_wise.json", function (data) {

        console.log("fetching data from https://api.covid19india.org/v2/state_district_wise.json");

        var totalConfirmedCases = 0;
        var totalActiveCases = 0;
        var totalDeceasedCases = 0;
        var totalRecovedCases = 0;

        var topDistricts = [];
        var showMaxDistricts = 20;


        // State Loop
        $.each(data, function (key, value) {
            var stateData = value;
            var stateDistrictData = stateData.districtData;

            // State District Loop
            $.each(stateDistrictData, function (key, value) {
                totalConfirmedCases += value.confirmed;
                totalActiveCases += value.active;
                totalDeceasedCases += value.deceased;
                totalRecovedCases += value.recovered;

                //totalConfirmedCases+=value.delta.confirmed;
                //totalDeceasedCases+=value.delta.deceased;
                //totalRecovedCases+=value.delta.recovered;


                var districtObj = {};
                districtObj.state = stateData.state;
                districtObj.district = value;
                topDistricts.push(districtObj);




            });

        });

        console.log("Total Confirmed Cases = " + totalConfirmedCases);
        console.log("Total Active Cases = " + totalActiveCases);
        console.log("Total Deceased Cases = " + totalDeceasedCases);
        console.log("Total Recovered Cases = " + totalRecovedCases);

        // Sort Districts based on confirmed count
        topDistricts.sort(GetSortOrder("confirmed"));
        updateTopDistrictTable(topDistricts, showMaxDistricts);


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

    function GetSortOrder(prop) {
        return function (a, b) {
            if (a.district[prop] > b.district[prop]) {
                return -1;
            } else if (a.district[prop] < b.district[prop]) {
                return 1;
            }
            return 0;
        }
    }

    function updateTopDistrictTable(topDistricts, maxDistricts) {

        var tbody = $('#top-districts-table').children('tbody');

        //Then if no tbody just select your table 
        //var table = tbody.length ? tbody : $('#myTable');

        var count = 1;
        $.each(topDistricts, function (key, value) {
            if(count <= maxDistricts) {
                tbody.append("<tr>" + "<td>" + count + "</td>" + "<td>" + value.district.district + "</td>" + "<td>" + value.state + "</td>" + "<td>" + value.district.confirmed + "</td>" + "<td>" + value.district.active + "</td>" + "<td>" + value.district.recovered + "</td>" + "<td>" + value.district.deceased + "</tr>");
                count++;
            }
        });
    }

});