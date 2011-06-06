#!/usr/bin/env node

/*

generate a blog index and shit.  It\'ll look like this

<div id="posts">
  <div class="post" filename="2011-06-02-jsonselect-grows-up.html"
       shortname="jsonselect-grows-up">
    <div class="title">JSONSelect Grows Up</div>
    <div class="date">2011.06.02</div> 
    <div class="abstract">
      <a href="http://jsonselect.org/">JSONSelect</a> is a query language
      for JSON.  With JSONSelect you can write small patterns that match
      against JSON documents.  The language is mostly an adaptation of
      CSS to JSON, motivated by the belief that CSS does a fine job and
      is widely understood.</p>
    </div>
  </div>
</div>

*/

var template = '<div class="post" filename="{{filename}}" shortname="{{shortname}}">\n'+
'  <div class="title"><a href="{{shortname}}">{{title}}</a></div>\n'+
'  <div class="date">{{date}}</div>\n'+
'  <div class="abstract">{{{abstract}}}</div>\n'+
'</div>\n';


const path = require('path'),
        fs = require('fs'),
  mustache = require('mustache');

var posts = [];

const pathToPosts = path.join(path.dirname(__dirname), "posts");

var files = fs.readdirSync(pathToPosts);

function titleToShortname(title) {
    return title.toLowerCase().replace('&','and').replace(/[^a-z0-9 \-./]/g , "").trim().replace(/[\s\/]+/g, "-").replace(/\.+$/,"").replace(/--+/, '-');
}

function processPost(pathToPost, date, name, ext) {
    var p = {};
    p.shortname = name;
    p.filename = path.basename(pathToPost);
    p.date = date;
    p.type = ext === 'md' ? 'markdown' : 'html';

    // now we need the title
    var contents = fs.readFileSync(pathToPost);
    var m = /^title:\s*(.*)\n([\s\S]*?)\n\n/m.exec(contents);
    if (m) {
        p.title = m[1];
        // and now for an abstract
        p.abstract = m[2];
    } else {
        // skip the abstract
        p.title = /^title:\s*(.*)$/m.exec(contents)[1];
    }

    var sn = titleToShortname(p.title);
    if (sn != name) {
        console.log("OOPS! I Suggest:  mv " + date + "-" + name + "." + ext + " "
                    + date + "-" + sn + "." + ext + " ");
    }
    p.shortname = sn;

    return p;
}

files.forEach(function (f) {
    var re = /^(\d{4}-\d{2}-\d{2})-(.*)\.(html|md)$/;
    var m = re.exec(f);
    if (!m) return;

    var p;
    if (p = processPost(path.join(pathToPosts, f), m[1], m[2], m[3])) {
        posts.push(p);
    }
});

var dateRe = new RegExp('^(\\d{4})-(\\d{2})-(\\d{2})$');

posts = posts.sort(function (lhs, rhs) {
    function dateToNum(d) {
        var m = dateRe.exec(d);
        return 10000 * parseInt(m[1]) + 100 * parseInt(m[2]) + parseInt(m[3]);
    }
    return dateToNum(rhs.date) - dateToNum(lhs.date);
});

posts.forEach(function(p) {
    console.log(mustache.to_html(template, p));
});
