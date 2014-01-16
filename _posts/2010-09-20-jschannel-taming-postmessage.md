---
title: JSChannel&#58; Taming postMessage()
layout: post
---

This post presents <a href="http://github.com/mozilla/jschannel">JSChannel</a>, a
little open source JavaScript library that sits atop HTML5&rsquo;s
cross-document messaging and provides rich messaging semantics and an
ergonomic API.


## Usage Overview

Let's start with a quick demonstration of usage.  Here's a sample
containing HTML page:

{% highlight html %}
<html>
<head><script src="jschannel.js"></script></head>
<body>
<iframe id="childId" src="child.html"></iframe>
</body>
<script>
var chan = Channel.build(document.getElementById("childId").contentWindow, "*", "testScope");
chan.query({
    method: "reverse",
    params: "hello world!",
    success: function(v) {
        console.log(v);
    }
});
</script>
</html>
{% endhighlight %}

And here's the child page that's referenced by the former:

{% highlight html %}
<html><head>
<script src="jschannel.js"></script>
<script>

var chan = Channel.build(window.parent, "*", "testScope");
chan.bind("reverse", function(trans, s) {
    return s.split("").reverse().join("");
});

</script>
</head>
</html>
{% endhighlight %}

The parent page builds a `Channel` abstraction around the embedded
iframe's content window.  This abstraction manages several setup
requirements such as adding a message handler for the `message` event
to the window object, etc.  Having built a channel instance, the
parent page sends a query, invoking the `reverse` method, sending in a
single string argument `Hello world!`, and specifies a function to be
invoked upon success (which occurs when a response is received).

Next, in the child we see a similar bit of code to create a channel.
Subsequently the child calls the `bind` method of the channel object
to associate a function with the `reverse` method.

If you were to run this code, you would see `!dlrow olleH` output in
your console log.  There are several features baked into JSChannel
which keeps this simple function invocation simple.  We'll explore those
features in the following section.

## postMessage, the Missing Parts

The little method behind HTML5's [cross document messaging](http://dev.w3.org/html5/postmsg/#web-messaging),
`postMessage`, is quite spartan.  It provides a way to efficiently
move a string between frames, even when those frames are not from the
same origin (scheme + host + port).  It also gives the recipient of a
message a reliable way to know its real origin.  And that's all HTML5
gives you!  Let's briefly run through all the things that one would
probably want to add if they wished to build something non-trivial on
top of post message...

### Origin Checking

The authors of the spec were careful to call out in bright red letters
the importance of verifying the origin of messages:

> Use of this API requires extra care to protect users from hostile
> entities abusing a site for their own purposes.
>
> Authors should check the origin attribute to ensure that messages
> are only accepted from domains that they expect to receive messages
> from. Otherwise, bugs in the author's message handling code could
> be exploited by hostile sites.

While code to implement the origin check certainly isn't difficult,
the cost of messing up that check is quite high as compared to the
ease with which it could be left off:

{% highlight javascript %}
window.addEventListener('message', receiver, false);
function receiver(e) {
  // behind the origin property of the event lies the true sender
  // of this message
  if (e.origin == 'http://example.com') {
    // here lies the guts of message handling, where you may possibly
    // share sensitive information with 'example.com'
  }
}
{% endhighlight %}

JSChannel makes origin checking a bit more prominent: the second
argument to `Channel.build()` is where you can specify the expected
origin of the remote side.  The wild-card `*` *may* be specified, but
the above warnings should be heeded.

(note: the origin argument should probably become more fancy and
 support some sort of safe globbing as well as arrays of host
 globs).

### Message Structure

The HTML5 specification and early implementations leave the message
content (`event.data`) as a string.  Later implementations (chrome 6
at least), allow the payload to be a JavaScript object (without
functions or complex objects).  In either case, there's no message
structure suggested by or built into the specification.  What this
means is that there isn't a standard way to indicate in a message what
'function' is to be invoked on the remote document, nor is it possible
to specify in a response message which query it's a response to.

JSChannel uses the [JSON-RPC][] specification with several
modifications to support some of its more sophisticated API semantics.

  [JSON-RPC]: http://groups.google.com/group/json-rpc/web/json-rpc-2-0

Here's a flavor of messages 'on the wire' during the execution of the
example at the start of this blog post:

    [gHvq1-R] post   message: {"id":81351,"method":"testScope::reverse","params":"hello world!"}
    [SeYpI-L] got    message: {"id":81351,"method":"testScope::reverse","params":"hello world!"}
    [SeYpI-L] post   message: {"id":81351,"result":"!dlrow olleh"}
    [gHvq1-R] got    message: {"id":81351,"result":"!dlrow olleh"}

### Query/Response Semantics

An integral requirement in the definition of message structure was the
requirement to be able to implement query/response semantics atop of it.
JSChannel includes a unique identifier in the message structure, and
includes a mechanism for determining starting id.  These two features
make query/response semantics possible while also making a message dump
more scrutable.

### Dispatch

In the HTML5 specification, all posted messages arrive in a document
as *message* events that your listener will receive.  While it's fairly
simple to write code that dispatches messages to handler routines based on
the origin and 'method' of incoming messages, this code is
boilerplate and it gets less fun to write each time you have to debug
it.

Dispatch is built into JSChannel, and multiple channels may happily
co-exist simultaneously in the same page.  It's expected that allowing
channels to be created next to the code to which they're relevant will
be useful in larger projects.  Instantiating multiple channel objects
looks as you might expect, and can occur anywhere in your code:

{% highlight javascript %}
var chan1 = Channel.build(document.getElementById("firstChildId").contentWindow,
                          "http://somesite.com", "scope1");

var chan2 = Channel.build(document.getElementById("secondChildId").contentWindow,
                          "http://someothersite.com", "scope2");
{% endhighlight %}

### Scoping

As sites get larger and more complex, it becomes possible that you'll
have method name collisions, which can mess up message routing.  It's
common practice to prepend a 'scope' to method names to help mitigate
this.

The third argument to `Channel.build()` is a *scope* which will be prepended to
message methods.  This would allow multiple channels to be instantiated with the same
frame for different purposes.  Method names can remain terse and natural and
different scopes will prevent collisions.

### Error Handling

Given that postMessage leaves the questions of query/response semantics and message
structure up to higher level code, there is really no place to hang error handling.

JSChannel introduces a protocol message to allow errors to be returned from invocations:

    [0p1uq-R] got    message: {"id":483615,"error":"invalid_arguments","message":"argument should be a string"}

At the API level, there are some niceties, like automatic conversion of exceptions
into error messages.  For example, the following sample code would generate the
error message above (when invoked without a string argument):

{% highlight javascript %}
var chan = Channel.build(window.parent, "*", "testScope");
chan.bind("reverse", function(trans, s) {
    if (typeof s !== 'string') {
        throw { error: "invalid_arguments", message: "argument should be a string" };
    }
    return s.split("").reverse().join("");
});
{% endhighlight %}

Finally, the [code that handles exceptions][] will automatically
convert exceptions raised due to accidental programmatic errors into
protocol messages with error type 'runtime_error'.  This hopefully
will cause bugs to manifest earlier and more clearly, rather than to
cause mysterious hangs.

  [code that handles exceptions]: http://github.com/mozilla/jschannel/blob/9879dc6ad1349c4857b037e8a1b8ceb69ba099e1/src/jschannel.js#L184-215

### Setup Race Conditions

Finally, one of the first things that this developer hit when employing postMessage
was the race condition that arises when sending message into iframes.  This issue occurs
on both sides of the channel:  If the parent does not wait for the child to load, any initial
queries they send may be lost without any indication.  If a child tries to send messages
before a parent has instantiated their channel, the same is true.

JSChannel addresses this problem
with <a href="http://github.com/mozilla/jschannel/blob/9879dc6ad1349c4857b037e8a1b8ceb69ba099e1/src/jschannel.js#L277-296">a
simple application level handshake</a> which causes the queuing of
messages until the remote end is ready.  This feature allows the
developer to safely instantiate and immediately send messages over a
channel without worrying about instantiation timing.

## Digging Deeper

Given that JSChannel is pretty new, this post is probably the best overview documentation
available.  You can kick the tires, file bugs, and read the implementation over
on <a href="http://github.com/mozilla/jschannel">github</a>.

## Further Reading and Influences

JSChannel is largely built on the work of others, here's a laundry
list of things that have influenced me in no particular order:

* <a href="http://code.google.com/p/pmrpc/">pmrpc</a> An abstraction very much like JSChannel, with a slightly different API and slightly different goals.
* <a href="http://xauth.org">XAuth</a>, a *open platform for extending authenticated user services across the web*
that uses postMessage for RPC.
* <a href="http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/">Learning from XAuth: Cross-domain localStorage</a> -- An Article by Nicholas Zakas which covers some of the techniques that JSChannel encapsulates and does a great job of highlighting some of the more exciting parts of how you can apply postMessage.
* <a href="http://json-rpc.org/">JSON-RPC</a> a simple and beautiful message format for implementing RPC semantics using JSON
