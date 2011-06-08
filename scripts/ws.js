#!/usr/bin/env node

const connect = require('connect'),
         path = require('path'),
          url = require('url'),
           fs = require("fs");

connect(
    connect.logger(),
    function(req, resp, next) {
        var parsedurl = url.parse(req.url, true);
        var uri = parsedurl.pathname;
        console.log(uri);
        if (/^\/(|favicon.ico|posts\/.*|feed.atom|(?:i|js|css)\/.*)$/.test(uri)) {
            next();
            return;
        }
        // non-static.  serve index.html
    	fs.readFile(path.join(path.dirname(__dirname), "index.html"), function(err, file) {
    		if(err) {
    			resp.writeHead(500, {"Content-Type": "text/plain"});
    			resp.write(err + "\n");
    			resp.end();
    			return;
    		} else {
    		    resp.writeHead(200, {"Content-Type": "text/html"});
    		    resp.write(file, "binary");
    		    resp.end();
            }
        });
    },
    connect.static(path.dirname(__dirname))
).listen(3000);
