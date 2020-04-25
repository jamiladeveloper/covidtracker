$(document).ready(function () {

    var jqxhr = $.get("https://api.covid19india.org/v2/state_district_wise.json", function (data) {

        console.log("fetching data from https://api.covid19india.org/v2/state_district_wise.json");

        var totalConfirmedCases = 0;
        var totalActiveCases = 0;
        var totalDeceasedCases = 0;
        var totalRecovedCases = 0;


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
            });

        });

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


    // fetch data from api
    var jqxhr = $.get("https://api.covid19india.org/resources/resources.json", function (data) {

        console.log("fetching data from https://api.covid19india.org/resources/resources.json");;

        
        //topDistricts.sort(GetSortOrder("confirmed"));
        updateEssentialsTable(data.resources);


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

    function updateEssentialsTable(essentials) {

        var tbody = $('#essentials-table').children('tbody');

        $.each(essentials, function (key, value) {

            var contactList = value.phonenumber;
            var contacts = contactList.split(",\n");
            
            var contactHtml = "";
            $.each(contacts, function(key, value) {
                contactHtml+="<a href='tel:" + value + "'>" + value + "</a> <br>";
            });
            
            tbody.append("<tr>" + "<td>" + value.city + "</td>" + "<td>" + value.category + "</td>" + "<td>" + "<a href='" + value.contact + "'>" + value.nameoftheorganisation +  "</a>" + "</td>" + "<td>" + value.descriptionandorserviceprovided + "</td>" + "<td>" + contactHtml + "</td>" + "</tr>");
        });
    }

});