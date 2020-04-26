$(document).ready(function () {

    var showMaxDistricts = 15;
    var topDistricts = [];
    
    var statesDailyCountArr = [];

    var cookieData = getCookie("indiacovidstate");
    console.log("State = " + cookieData);

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

            // State District Loop
            $.each(stateDistrictData, function (key, value) {
                totalConfirmedCases += value.confirmed;
                totalActiveCases += value.active;
                totalDeceasedCases += value.deceased;
                totalRecovedCases += value.recovered;

                var districtObj = {};
                districtObj.state = stateData.state;
                districtObj.statecode = stateData.statecode;
                districtObj.district = value;
                topDistricts.push(districtObj);
            });

        });;

        // Sort Districts
        topDistricts.sort(GetSortOrder("confirmed"));
        // Update table
        updateTopDistrictTable(topDistricts);


        $("#totalConfirmed").html(totalConfirmedCases);
        $("#totalActive").html(totalActiveCases);
        $("#totalDeceased").html(totalDeceasedCases);
        $("#totalRecovered").html(totalRecovedCases);

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

    /* Sort Districts based on a property */
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

    /* Inject data into table */
    function updateTopDistrictTable(topDistricts) {

        var tbody = $('#top-districts-table').children('tbody');

        var count = 1;
        $.each(topDistricts, function (key, value) {
            if (count <= showMaxDistricts) {
                tbody.append("<tr>" + "<td>" + count + "</td>" + "<td>" + value.district.district + "</td>" + "<td>" + value.state + "</td>" + "<td>" + value.district.confirmed + "</td>" + "<td>" + value.district.active + "</td>" + "<td>" + value.district.recovered + "</td>" + "<td>" + value.district.deceased + "</tr>");
                count++;
            }
        });
    }


    var jqxhr = $.get("https://api.covid19india.org/states_daily.json", function (data) {

        var yesterdayDate = getYesterdayDate();
        var statesDaily = data.states_daily;

        var yesterdayConfirmed = {};
        var yesterdayRecovered = {};
        var yesterdayDeceased = {};

        var indx = statesDaily.length - 1;
        console.log(statesDaily[indx].date);
        console.log(yesterdayDate);
        while (statesDaily[indx].date === yesterdayDate) {
            console.log("yes");
            if (statesDaily[indx].status === "Confirmed") {
                yesterdayConfirmed = statesDaily[indx];
            }
            else if (statesDaily[indx].status === "Recovered") {
                yesterdayRecovered = statesDaily[indx];
            }
            else if (statesDaily[indx].status === "Deceased") {
                yesterdayDeceased = statesDaily[indx];
            }

            indx--;

        }

        updateStatesDailyCount(yesterdayConfirmed, yesterdayRecovered, yesterdayDeceased);


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

    function updateStatesDailyCount(dailyCountConfirmed, dailyCountRecovered, dailyCountDeceased) {
        var count = 0;

        $.each(states, function (key, value) {
            var statesDailyCount = {};
            statesDailyCount.statecode = key;
            statesDailyCount.name = value;
            statesDailyCount.confirmed = dailyCountConfirmed[key.toLowerCase()];
            statesDailyCount.recovered = dailyCountRecovered[key.toLowerCase()];
            statesDailyCount.deceased = dailyCountDeceased[key.toLowerCase()];

            statesDailyCountArr.push(statesDailyCount);

        });
    }



    function getYesterdayDate() {
        var months = ["Jan", "Feb", "Mar", "Apr", "May"];
        var now = new Date();
        var yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        var year = yesterday.getFullYear();
        var month = yesterday.getMonth();
        var date = yesterday.getDate();

        return date + "-" + months[month] + "-" + year % 100;
    }


    var states = {
        "AN": "Andaman and Nicobar Islands",
        "AP": "Andhra Pradesh",
        "AR": "Arunachal Pradesh",
        "AS": "Assam",
        "BR": "Bihar",
        "CH": "Chandigarh",
        "CT": "Chhattisgarh",
        "DD": "0",
        "DL": "Delhi",
        "DN": "0",
        "GA": "Goa",
        "GJ": "Gujarat",
        "HP": "Himachal Pradesh",
        "HR": "Haryana",
        "JH": "Jharkhand",
        "JK": "Jammu and Kashmir",
        "KA": "Karnataka",
        "KL": "Kerala",
        "lA": "Ladakh",
        "lD": "0",
        "MH": "Maharashtra",
        "ML": "Meghalaya",
        "MN": "Manipur",
        "MP": "Madhya Pradesh",
        "MZ": "Mizoram",
        "NL": "Nagaland",
        "OR": "Odisha",
        "PB": "Punjab",
        "PY": "Puducherry",
        "RJ": "Rajasthan",
        "SK": "Sikkim",
        "TG": "Telangana",
        "TN": "Tamil Nadu",
        "TR": "Tripura",
        "TT": "0",
        "UP": "Uttar Pradesh",
        "UT": "Uttarakhand",
        "WB": "West Bengal"
    };


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