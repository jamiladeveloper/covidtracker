$(document).ready(function () {

    var dayText = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var day = now.getDay();

    $("#date").html(dayText[day - 1] + ", " + date + "/" + month + "/" + year);


    var jqxhr = $.get("../data/totalcount.json", function (data) {

        console.log("fetching data from local count");;

        //if(data)


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


    $(".fab,.backdrop").click(function () {
        if ($(".backdrop").is(":visible")) {
            $(".backdrop").fadeOut(125);
            $(".fab.child")
                .stop()
                .animate({
                    bottom: $("#masterfab").css("bottom"),
                    opacity: 0
                }, 125, function () {
                    $(this).hide();
                });
        } else {
            $(".backdrop").fadeIn(125);
            $(".fab.child").each(function () {
                $(this)
                    .stop()
                    .show()
                    .animate({
                        bottom: (parseInt($("#masterfab").css("bottom")) + parseInt($("#masterfab").outerHeight()) + 70 * $(this).data("subitem") - $(".fab.child").outerHeight()) + "px",
                        opacity: 1
                    }, 125);
            });
        }
    });



});



