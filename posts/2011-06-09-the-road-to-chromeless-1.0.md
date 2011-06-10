title: The Road to Chromeless 1.0

Mozilla's [Chromeless][] project is a framework for building desktop
applications with web technologies.  So far, it's been a fancy-free
experiment where developers have focused more on exploring interesting
features or applications than the serious and stodgy stuff that real
platforms are made of.  A steady surge of community interest in the
project, however, has suggested to me that the most useful path
forward is for the primary developers of the platform to buckle down
and focus on producing a stable system upon which others can
experiment, play, and ship products.

This post attempts to define a "Minimum Viable Product" for
Chromeless, the high level essentials that must be satisfied in order
for a non-zero major version to have meaning.

Please note, **this is a proposal**, I'm simply laying down my own
opinion and biases to start the conversation (so speak up! *I
can't hear you* and I really would like to).

[Chromeless]: http://github.com/mozilla/chromeless

## What will 1.0 look like?

> Chromeless 1.0 will be a well **documented** and **tested** platform that
> lets you build **production quality** desktop applications with web
> technologies.  A skilled web developer can **understand how it works**
> in **five minutes**, and can build a basic proof of concept application
> in **under an hour**.  

While this is a concise vision, there are a lot of details to be worked
out and priorities to be set.  Let's run through the various areas where
work is to be done in priority order (most important first):

### Testing

At present there are several high level tests, but a unit testing framework
hasn't been implemented.  The framework itself is a very trivial amount of 
work, but it remains outstanding.  By 1.0 we should have unit tests for 
nearly every exposed API which may be reasonably tested.

### Documentation

A lot of time has been spent on the [chromeless documentation
system](http://mozilla.github.com/chromeless/) (heck, we've written
[yet another documentation
extractor](https://github.com/lloyd/docstract) just for it).  This
system is a find basis for quality documentation, but what's missing
at this point is robust documentation for all exposed core APIs.

### API Review

Given the history of the project (a fork of [addon-sdk] that was in a
heavy experimentation mode for a while), there are far too many modules
that have stubbed functions or just don't make any sense in chromeless.

Testing, documentation, and API review are complementary activities
that can all occur in lockstep in one great romp through
the modules in chromeless today.

### Distributed Development

The tone of the previous tasks might lead you to think that feature
explorations are dead for now in Chromeless.  But no.  I think
attempting to "freeze" feature development is dumb given the inspiring
community activity at the moment.  Instead of trying to lock down
development in some way, I believe we must instead rapidly grow core
features that enable distributed development.

This means two things:  First, we must be very careful about functionality
that becomes part of the chromeless "standard library", that which
resides in `modules/`.  As noted above, everything that is in `modules/` must
be excrutiatingly tested and documented.  Which begs the question, how do
we determine what modules are part of chromeless proper?  I propose:

> Modules distributed with Chromeless must have utility to a siginificant
> number of applications, or must be impossible to implement effectively
> outside of chromless, or must be required by modules for which one of
> the previous is true.

I'm proposing that the *minimum viable product* to include *minimal*
mechanisms to make it possible to discover and include 3rd party
modules in your apps.  I personally think that git submodules and
[module_dirs](http://mozilla.github.com/chromeless/#guide/startup-parameters)
get us most of the way there in terms of inclusion.  As far as
discovery goes, perhaps it's as simple as a wiki page for the purposes
of 1.0?

A final note along these lines, distributed development means less API
symmetry.  While the addon-sdk project from which chromeless was born
has, in my opinion, highly ambitious goals for the degree to which
module authors will adhere to conventions or use prescribed libraries,
I feel like chromeless we should throw out as much as we can to
simultaneously allow module developers greater design freedom and to ensure
that we get good adherence to the things we do prescribe (inportant stuff
like the number and signatures of functions exported by event emitters, or
how streams work).

### Web Content Embedding

The initial focus of chromeless was to "make it possible for developers
to prototype web browsers with web technologies".  A fallout of that focus
was considering the ability to safely sandbox web content inside souped up 
iframes a first class feature.  Given that we've already committed to this
feature, that some of the [most interesting]() products of the community 
rely on it, and that nowadays most desktop apps need the feature anyway: 
web content embedding must be secure and stable in Chromeless 1.0.

There are several open issues around embedding content inside iframe 
(in such a way that it's not aware it's embedded), that should be addressed
before we label 1.0.

### Development and Debugging

**printf debugging** is not quite state of the art, and it's what's
for dinner right now in Chromeless.  While the debugging tools built
into Gecko right now are not the most awesome, they are getting
attention and rapidly [getting
better](http://blog.mozilla.com/devtools/2011/05/28/web-console-where-you-want-it-to-be-with-nicer-completion-and-more/).
We should allow chromeless developers to leverage the web console and
levy requirements on the devtools team.

Having excellent logging and debugging tools must be a prerequisite to 1.0.

### Distribution

