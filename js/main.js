//var disqus_identifier = undefined;
//var disqus_url = undefined;
var converter = new Showdown.converter();

// ahem.
var disqus_shortname = "trickycode";

// do we have pushstate support!?
var linksRewritten = false;
function usePushState() {
    if (!linksRewritten && window.history && window.history.pushState) {
        linksRewritten = true;
        window.onpopstate = doRoute;
        $("a[href^='/']").click(function() {
            window.history.pushState(undefined, undefined, $(this).attr('href'));
            doRoute();
            return false;
        });
    }
}


var pn = undefined;
function doRoute() {
    // don't double route in cases where we get into this function twice
    if (pn === window.location.pathname) return;
    pn = window.location.pathname;

    $("#posts, #content").hide();

    if ($("#posts:empty").length === 1) {
        $.get("posts/summary.html", function(data) {
            $("#posts").html(data);
            pn = undefined;
            usePushState();
            doRoute();
        });
    } else {
        if (pn === '/index.html' || pn === '/') {
            document.title = "trickyco.de - lloyd's blog";
            $("#posts").fadeIn(700);


            $("#disqus_script").remove();
            disqus_identifier = undefined;
            disqus_url = "http://trickyco.de";
            $("<script id='disqus_script' type='text/javascript' async='true' " +
              " src='http://trickycode.disqus.com/count.js'/>").appendTo("head");

        } else {
            // find the post we're talking about
            var p = $(".post[shortname=\"" + pn.substr(1) + "\"]");
            if (p.length === 0) {
                // 404
                alert("404: " + pn);
                return;
            }
            p = p[0];
            $.get("posts/" + $(p).attr('filename'), function(data) {
                data = data.replace(/^title:.*$/m, '');
                var postTitle = $(p).find(".title a").text();
                $("#content .title").text(postTitle);
                document.title = postTitle;
                $("#content .date").text($(p).find(".date").text());
                if ($(p).attr("format") === "markdown") {
                    data = converter.makeHtml(data);
                }
                $("#content .post").html(data);
                $("#content").fadeIn(700);
                $('pre code').each(function(i, e) {
                    hljs.highlightBlock(e, '    ')
                });

                // now re-initialize disqus
                $("#disqus_thread").empty();
                $("iframe[name*=\"DISQUS\"]").remove();
                $("#disqus_script").remove();
                disqus_identifier = $(p).attr('shortname');
                disqus_url = "http://trickyco.de" + pn;
                $("<script id='disqus_script' type='text/javascript' async='true' " +
                  " src='http://trickycode.disqus.com/embed.js'/>").appendTo("head");
            });
        }
    }
}

$(document).ready(function() {
    $("#header div.me").click(function() {
        $("#about").slideToggle(700);
        return false;
    });

    doRoute();
});
