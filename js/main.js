function doRoute() {
    var pn = window.location.pathname;
    if (pn === '/index.html' || pn === '/') {
        $("#posts").fadeIn(700);
    } else {
        // find the post we're talking about
        var p = $(".post[shortname=\"" + pn.substr(1) + "\"]");
        if (p.length === 0) {
            // 404
            alert("404: " + pn);
            return;
        }
        p = p[0];
        console.log("getting");
        $.get("posts/" + $(p).attr('filename'), function(data) {
            data = data.replace(/^title:.*$/m, '');
            console.log("got", data);
            $("#content .title").text($(p).find(".title a").text());
            $("#content .date").text($(p).find(".date").text());
            $("#content .post").html(data);
            $("#content").fadeIn(700);
            $('pre code').each(function(i, e) {hljs.highlightBlock(e, '    ')});
        });
    }
}

$(document).ready(function() {
    $.get("posts/summary.html", function(data) {
        $("#posts").html(data);
        doRoute();
    });

    $("#header .container > .img a").click(function() {
        $("#about").slideToggle(700);
        return false;
    });
});
