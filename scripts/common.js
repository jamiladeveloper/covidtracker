$(document).ready(function(){

    var dayText = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var day = now.getDay();

    $("#date").html(dayText[day - 1] + ", " + date + "/" + month + "/" + year);
});