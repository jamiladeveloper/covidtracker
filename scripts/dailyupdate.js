$(document).ready(function () {

    

    var cookieData = getCookie("indiacovidstate");
    console.log("State = " + cookieData);

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
            var statesDailyCount = {};
            statesDailyCount.statecode = key;
            statesDailyCount.name = value;
            statesDailyCount.confirmed = dailyCountConfirmed[key.toLowerCase()];
            statesDailyCount.recovered = dailyCountRecovered[key.toLowerCase()];
            statesDailyCount.deceased = dailyCountDeceased[key.toLowerCase()];

            statesDailyCountArr.push(statesDailyCount);

        });
    }

    function updateDailyUpdateTable(statesDailyCountArr) {

        var tbody = $('#dailyupdate-table').children('tbody');

        //Then if no tbody just select your table 
        //var table = tbody.length ? tbody : $('#myTable');

        var count = 1;
        $.each(statesDailyCountArr, function (key, value) {
            //if(count <= maxDistricts) {
            tbody.append("<tr>" + "<td>" + count + "</td>" + "<td>" + value.name + "</td>" + "<td>" + value.confirmed + "</td>" + "<td>" + value.recovered + "</td>" + "<td>" + value.deceased + "</td>" + "</tr>");
            count++;
            //}
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

});