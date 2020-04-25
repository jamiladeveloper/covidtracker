$(document).ready(function () {

    $(document).ajaxStart(function () {
        //$("#loading").show();
        console.log("show");
    }).ajaxStop(function () {
        //$("#loading").hide();
        
    });

    // fetch data from api
    var jqxhr = $.get("https://api.covid19india.org/resources/resources.json", function (data) {

        console.log("fetching data from https://api.covid19india.org/resources/resources.json");;


        //topDistricts.sort(GetSortOrder("confirmed"));
        updateEssentialsTable(data.resources);


        console.log("data successfully received");

    })
        .done(function () {
            console.log("hide");
            //alert("second success");
        })
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert("finished");
        });


    $("#essentialSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#essentials-table tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
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
            $.each(contacts, function (key, value) {
                contactHtml += "<a href='tel:" + value + "'>" + value + "</a> <br>";
            });

            tbody.append("<tr>" + "<td>" + value.city + "</td>" + "<td>" + value.category + "</td>" + "<td>" + "<a href='" + value.contact + "'>" + value.nameoftheorganisation + "</a>" + "</td>" + "<td>" + value.descriptionandorserviceprovided + "</td>" + "<td>" + contactHtml + "</td>" + "</tr>");
        });
    }

});