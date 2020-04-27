$(document).ready(function () {



    var cookieData = getCookie("indiacovidstate");
    console.log("State = " + cookieData);

    var stateFullData = JSON.parse(localStorage.getItem("stateFullData"));
    if (stateFullData === "") {
        console.log("local storage data missing");
        updateLocalStorage("stateFullData");
    }


    var jqxhr = $.get("https://api.covid19india.org/states_daily.json", function (data) {

        var statesDailyCountArr = [];

        var yesterdayDate = getYesterdayDate();
        var statesDaily = data.states_daily;

        var yesterdayConfirmed = {};
        var yesterdayRecovered = {};
        var yesterdayDeceased = {};

        var indx = statesDaily.length - 1;
        console.log(statesDaily[indx].date);
        console.log(yesterdayDate);
        while (statesDaily[indx].date === yesterdayDate) {
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

        updateStatesDailyCount(statesDailyCountArr, yesterdayConfirmed, yesterdayRecovered, yesterdayDeceased);

        console.log("BEFORE SORTING");
        console.log(statesDailyCountArr);

        statesDailyCountArr.sort(GetSortOrder("confirmed"));

        console.log("AFTER SORTING");
        console.log(statesDailyCountArr);
        updateDailyUpdateTable(statesDailyCountArr);




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

    function updateStatesDailyCount(statesDailyCountArr, dailyCountConfirmed, dailyCountRecovered, dailyCountDeceased) {
        var count = 0;

        $.each(states, function (key, value) {

            if (stateFullData[key]) {
                var statesDailyCount = {};
                statesDailyCount.statecode = key;
                statesDailyCount.name = value;
                statesDailyCount.totalconfirmed = stateFullData[key].confirmed;
                statesDailyCount.totalactive = stateFullData[key].active;
                statesDailyCount.totalrecovered = stateFullData[key].recovered;
                statesDailyCount.totaldeceased = stateFullData[key].deceased;

                statesDailyCount.confirmed = dailyCountConfirmed[key.toLowerCase()];
                statesDailyCount.recovered = dailyCountRecovered[key.toLowerCase()];
                statesDailyCount.deceased = dailyCountDeceased[key.toLowerCase()];

                statesDailyCountArr.push(statesDailyCount);
            }

        });
    }

    function updateDailyUpdateTable(statesDailyCountArr) {

        var tbody = $('#dailyupdate-table').children('tbody');

        var count = 1;
        $.each(statesDailyCountArr, function (key, value) {

            var increasedConfirmed = "";
            if (value.confirmed > 0) {
                increasedConfirmed = "<span id='' style='padding-left:5px;color:red;font-size:medium;'>(&uarr;  <strong>" + value.confirmed + "</strong>)</span>"
            }
            var increasedRecovered = "";
            if (value.confirmed > 0) {
                increasedRecovered = "<span id='' style='padding-left:5px;color:green;font-size:medium;'>(&uarr;  <strong>" + value.recovered + "</strong>)</span>"
            }
            var increasedDeceased = "";
            if (value.confirmed > 0) {
                increasedDeceased = "<span id='' style='padding-left:5px;color:grey;font-size:medium;'>(&uarr;  <strong>" + value.deceased + "</strong>)</span>"
            }

            var tbodyRow = "<tr>";
            tbodyRow += "<td>" + count + "</td>";
            tbodyRow += "<td>" + value.name + "</td>";
            tbodyRow += "<td>" + value.totalconfirmed + increasedConfirmed + "</td>";
            tbodyRow += "<td>" + value.totalactive + "</td>";
            tbodyRow += "<td>" + value.totalrecovered + increasedRecovered + "</td>";
            tbodyRow += "<td>" + value.totaldeceased + increasedDeceased + "</td>";
            tbodyRow += "</tr>";

            tbody.append(tbodyRow);
            count++;
        });
    }

    /* Sort Districts based on a property */
    function GetSortOrder(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return -1;
            } else if (a[prop] < b[prop]) {
                return 1;
            }
            return 0;
        }
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

    function updateLocalStorage(key){
        var stateFullData = {};

    // fetch data from api
        var jqxhr = $.get("https://api.covid19india.org/v2/state_district_wise.json", function (data) {
        var totalConfirmedCases = 0;
        var totalActiveCases = 0;
        var totalDeceasedCases = 0;
        var totalRecovedCases = 0;

        // State Loop
        $.each(data, function (key, value) {

            var state = {};
            state.state = value.state;
            state.statecode = value.statecode;
            state.confirmed = 0;
            state.active = 0;
            state.deceased = 0;
            state.recovered = 0;

            // State District Loop
            $.each(value.districtData, function (key, value) {
                state.confirmed +=value.confirmed;
                state.active += value.active;
                state.deceased += value.deceased;
                state.recovered += value.recovered;

            });

            stateFullData[state.statecode] = state;

        });

    })
        .done(function () {
            localStorage.setItem(key, JSON.stringify(stateFullData));
            console.log("local storage data updated");
        })
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert("finished");
        });
    }

});