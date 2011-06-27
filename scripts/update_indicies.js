#!/usr/bin/env node

const Showdown = require('showdown').Showdown;
const converter = new Showdown.converter();

/*
generate a blog index and shit, and an atom feed and shit.
*/

var template = '' +
    '{{#posts}}' +
    '<div class="post" filename="{{filename}}" shortname="{{shortname}}" format="{{type}}">\n'+
    '  <div class="title"><a href="/{{shortname}}">{{title}}</a></div>\n'+
    '  <div class="date">{{date}}</div>\n'+
    '  <div class="abstract">{{{abstract}}}</div>\n'+
    '</div>\n' +
    '{{/posts}}';

var atomTemplate = '' +
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<feed xmlns="http://www.w3.org/2005/Atom">\n' +
    '\n' +
    '    <id>http://trickyco.de</id>\n' +
    '    <title>trickyco.de - Lloyd\'s blog</title>\n' +
    '    <link href="http://trickyco.de" rel="alternate" />\n' +
    '    <link type="application/atom+xml" rel="self" href="http://trickyco.de/feed.atom"/>\n' +
    '    <updated>{{updated}}</updated>\n' +
    '    <author>\n' +
    '        <name>Lloyd Hilaiel</name>\n' +
    '        <email>lloyd@hilaiel.com</email>\n' +
    '    </author>\n' +
    '{{#posts}}' +
    '    <entry>\n' +
    '        <title type="html">{{title}}</title>\n' +
    '        <link href="http://trickyco.de/{{shortname}}"/>\n' +
    '        <id>http://trickyco.de/{{shortname}}</id>\n' +
    '        <updated>{{updated}}</updated>\n' +
    '        <summary type="html">{{abstract}}</summary>\n' +
    '    </entry>\n' +
    '{{/posts}}' +
    '</feed>\n';


function ISODateString(d) {
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())+'T'
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())+'Z';
}

const path = require('path'),
        fs = require('fs'),
  mustache = require('mustache');

var posts = [];

const pathToPosts = path.join(path.dirname(__dirname), "posts");
const pathToLinks = path.join(path.dirname(__dirname), "links");
const pathToSummary = path.join(pathToPosts, "summary.html");
const pathToFeed = path.join(path.dirname(__dirname), "feed.atom");

var files = fs.readdirSync(pathToPosts);

function titleToShortname(title) {
    return title.toLowerCase().replace('&','and').replace(/[^a-z0-9 \-./]/g , "").trim().replace(/[\s\/]+/g, "-").replace(/\.+$/,"").replace(/--+/, '-');
}

function processPost(pathToPost, date, name, ext) {
    var p = {};
    p.shortname = name;
    p.filename = path.basename(pathToPost);
    p.date = date;
    p.updated = ISODateString(new Date(date));

    p.type = ext === 'md' ? 'markdown' : 'html';

    // now we need the title
    var contents = fs.readFileSync(pathToPost);
    var m = /^title:\s*(.*)\n([\s\S]*?)\n\n/m.exec(contents);
    if (m) {
        p.title = m[1];
        // and now for an abstract
        p.abstract = m[2];

        // if its markdown, then let's run it through showdown
        p.abstract = converter.makeHtml(p.abstract);

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
        return (10000 * parseInt(m[1],10) + 100 * parseInt(m[2],10) + parseInt(m[3],10));
    }
    return dateToNum(rhs.date) - dateToNum(lhs.date);
});

// Now we're ready!  let's start with the blog index
fs.writeFileSync(pathToSummary, mustache.to_html(template, {posts: posts}));
console.log("Updating blog index @", pathToSummary);

// And now an atom feed

console.log("Updating atom feed @", pathToFeed);
fs.writeFileSync(
    pathToFeed,
    mustache.to_html(atomTemplate, {
        posts: posts,
        updated: ISODateString(new Date())
    })
);

console.log("Updating linkdir");
posts.forEach(function(p) {
    fs.symlink(path.join("..", "posts", p.filename),
               path.join(pathToLinks, p.shortname + "." + (p.type === "markdown" ? "md" : "html")));
});

console.log("now you should commit these changed files.");
