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


                state.confirmed += value.confirmed;
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
            localStorage.setItem("stateFullData", JSON.stringify(stateFullData));
        })
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert("finished");
        });


    var jqxhr = $.get("https://api.covid19india.org/states_daily.json", function (data) {

        var statesdailyjson = {};
        var statesdailydays = [];
        var statesdailyconfirmed = [];
        var statesdailyrecovered = [];
        var statesdailydeceased = [];

        statesdailyjson.statecode = cookieData;
        var statecode = cookieData.toLowerCase();
        
        $.each(data.states_daily, function(key, value) {
            var dateStr = value.date;
            dateStr = dateStr.split('-')[0] + "-" + dateStr.split('-')[1];
            
            if(statesdailydays.indexOf(dateStr) < 0){
                statesdailydays.push(dateStr);
            }
            
            if(value.status === "Confirmed") {
                statesdailyconfirmed.push(value[statecode]);
            }    
            else if(value.status === "Recovered") {
                statesdailyrecovered.push(value[statecode]);
            }
            else if(value.status === "Deceased") {
                statesdailydeceased.push(value[statecode]);
            }
        });

        statesdailyjson.date = statesdailydays;
        statesdailyjson.confirmed = statesdailyconfirmed;
        statesdailyjson.recovered = statesdailyrecovered;
        statesdailyjson.deceased = statesdailydeceased;

        console.log(statesdailyjson);

        updateConfirmedChart(statesdailyjson);
        updateRecoveredChart(statesdailyjson);
        updateDeceasedChart(statesdailyjson);

    })
        .done(function () {
            localStorage.setItem("stateFullData", JSON.stringify(stateFullData));
        })
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert("finished");
        });




    function updateConfirmedChart(data) {
        new Chartist.Line('.ct-chart-confirmed', {
            labels: data.date,
            series: [
                data.confirmed,
            ]
        }, {
            fullWidth: true,
            showPoint: false,
            chartPadding: {
                right: 40
            }
        });
    }

    function updateRecoveredChart(data) {
        new Chartist.Line('.ct-chart-recovered', {
            labels: data.date,
            series: [
                data.recovered,
            ]
        }, {
            fullWidth: true,
            showPoint: false,
            chartPadding: {
                right: 40
            }
        });
    }

    function updateDeceasedChart(data) {
        new Chartist.Line('.ct-chart-deceased', {
            labels: data.date,
            series: [
                data.deceased,
            ]
        }, {
            fullWidth: true,
            showPoint: false,
            chartPadding: {
                right: 40
            }
        });
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

    //updateChart();
    $("#stateName").html(states[cookieData]);

});