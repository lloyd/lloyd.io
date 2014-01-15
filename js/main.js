// ahem.
var disqus_shortname = "trickycode";

var dateRegex = /^(\d{4})-(\d{2})-(\d{2}) /;
function relDates() {
  $("div.date").each(function() {
    var dt = $(this).text();
    var m;
    if (m = dateRegex.exec(dt)) {
      var txt;

      // credit?  John Resig of course: http://ejohn.org/blog/javascript-pretty-date/
      var then = new Date();
      then.setUTCFullYear(parseInt(m[1]), parseInt(m[2], 10) - 1 , parseInt(m[3], 10));
      var diff = (((new Date()).getTime() - then.getTime()) / 1000),
      day_diff = day_diff = Math.floor((diff-1) / 86400);

	  var txtDiff =
        day_diff <= 0 && "today" ||
		day_diff == 1 && "yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
		day_diff < (2 * 365) && Math.ceil( day_diff / 30 ) + " months ago" ||
        m[0];

      $(this).text(txtDiff);
    }
  });
}

$(document).ready(function() {
  $("#header div.me").click(function() {
    $("#about").slideToggle(700);
    return false;
  });

  // manipulate dates into relative dates
  relDates();

  // now add disqus
  var pn = window.location.pathname;
  disqus_identifier = undefined;
  disqus_url = "http://trickyco.de"; // legacy

  // on the index page disqus is used for comment count
  if (pn === '/index.html' || pn === '/') {
    $("div.post > div.comments > a").each(function(ix, el) {
      el = $(el);
      el.attr('data-disqus-identifier', el.attr('data-disqus-identifier').replace(/^\//, ""));
    });
    $("<script id='disqus_script' type='text/javascript' async='true' " +
      " src='http://trickycode.disqus.com/count.js'/>").appendTo("head");
    $("#posts, #content").fadeIn(700);
  }
  // on post pages we want to display the whole thread
  else {
    disqus_url += pn;
    disqus_identifier = pn.replace(new RegExp('/', 'g'), "");
    $("<script id='disqus_script' type='text/javascript' async='true' " +
      " src='http://trickycode.disqus.com/embed.js'/>").appendTo("head");
  }
});
