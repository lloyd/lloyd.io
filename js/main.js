$(document).ready(function() {
    $.get("posts/summary.html", function(data) {
        $("#posts").html(data);
    });
});