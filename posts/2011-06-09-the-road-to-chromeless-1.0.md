title: The Road to Chromeless 1.0

Mozilla's <a href="http://github.com/mozilla/chromeless">Chromeless</a> project is an experiment toward building
desktop applications with web technologies.  So far, it's been more
of a fancy-free exploration of interesting features or applications than
the serious and sometimes stodgy stuff that platforms are made of.  A
recent surge of community interest in the project, however, suggests
that the best path forward is for the primary developers of the
platform to buckle down and focus on producing a stable system upon
which *others* can experiment, play, and ship products.

This post attempts to define a *Minimum Viable Product* for
Chromeless: the simplest possible set of requirements for a meaningful
1.0.

Please note, **this is a proposal** intended to start the
conversation.  My hope is to *collaboratively* refine this into an
actual phased plan for getting to 1.0.

So, what will 1.0 look like?

> Chromeless 1.0 will be a well **documented** and **tested** platform
> that lets you build **production quality** desktop applications with
> web technologies.  A skilled web developer can **understand how it
> works** in **five minutes**, and could be **building
> their own application** in about five more.

## The Details

While the above statement is a pretty vision, there is no shortage of
details to be worked out and priorities to be set.  Let's run through
the various areas where there is work to be done:

### Testing

At present there are several high level tests, but a low level unit
testing framework is missing.  By 1.0 we should have unit tests for
nearly every exposed API which may be reasonably tested.

### Documentation

A lot of time has been spent on the [Chromeless documentation
system](http://nochro.me/) (heck, we've written [yet another
documentation extractor](https://github.com/lloyd/docstract) just for
it).  This system in its present state is a fine foundation for
quality documentation, but what's missing at this point is refined
content for all exposed core APIs, as well as overview and
architecture documentation.

### API Review

Given the history of the project (a fork of [addon-sdk][] that was in a
heavy experimentation mode for a while), there are far too many modules
that have stubbed functions or just don't make any sense in Chromeless.

[addon-sdk]: https://github.com/mozilla/addon-sdk

Testing, documentation, and API review are complementary activities
that can all occur in lockstep in one great romp through
the modules of Chromeless today.

### Distributed Development

The tone of the previous tasks might lead you to think that feature
explorations are dead for now in Chromeless.  But no.  I think
attempting to *freeze* feature development is dumb given the inspiring
community activity at the moment.  Instead of trying to lock down
development in some way, I believe we must instead rapidly grow core
features that enable distributed development.

This means two things: First, we must be very careful about
functionality that becomes part of the Chromeless *standard library*:
that which resides in
[`modules/`](https://github.com/mozilla/chromeless/tree/master/modules).
So how do we determine what modules are part of Chromeless proper?  I
propose:

> Modules distributed with Chromeless must have utility to a significant
> number of applications, or must be impossible to implement effectively
> outside of Chromeless, or must be required by modules for which one of
> the previous is true.

Second, I'm proposing that the *minimum viable product* include basic
mechanisms to make it possible to discover and include 3rd party
modules in your apps, while simultaneously paring down the set of
modules exposed by the core platform.  I personally think that git
sub-modules and
[module_dirs](http://nochro.me/#guide/startup-parameters) get us most
of the way there in terms of inclusion.  As far as discovery goes,
perhaps it's as simple as a wiki page for the purposes of 1.0?
(though a system which resembles [`npm`](http://npmjs.org/) is an
interesting thing to dream about for future releases).

### Web Content Embedding

The initial focus of Chromeless was to *make it possible for developers
to prototype web browsers with web technologies*.  A fallout of that focus
was considering the ability to safely sandbox web content inside souped up
iframes a first class feature.  Given that we've already committed to this
feature, that some of the [most interesting](http://webian.org/shell/) products of the community
rely on it, and that nowadays most desktop apps need the feature anyway:
web content embedding must be secure and stable in Chromeless 1.0.

There are several open issues around embedding content inside iframe
(in such a way that it's not aware it's embedded), that should be addressed
before we label 1.0.

### Debugging

**printf debugging** is not quite state of the art, and it's what's
for dinner right now in Chromeless.  While the debugging tools built
into Gecko right now are not the most awesome, they are getting
attention and are rapidly [getting
better](http://blog.mozilla.com/devtools/2011/05/28/web-console-where-you-want-it-to-be-with-nicer-completion-and-more/).
We should allow Chromeless developers to leverage the web console and
levy requirements on the devtools team.  This feels like a much more
useful direction than attempting to embed firebug, a path likely
wrought with peril.

Having excellent logging and debugging tools must be a prerequisite to 1.0.

### Deployment

The Chromeless [`appify`
command](http://nochro.me/#guide/packaging-your-app) makes it easy to
go from a pile of web content to a all-in-one application folder.
There are a couple of refinements necessary to really complete the
story, basic things like [application icon
support](https://github.com/mozilla/chromeless/issues/40).

In addition to the most basic required features, there are several things
that are very interesting but are **not required** for 1.0:

 * **Size optimizations** - Some will balk when they discover that a Chromeless
     application has a distribution size of around 8MB, and I believe we can
     do much better than this.
 * **Application update** - A simple set of conventions and tools could
     be very useful to help developers integrate a secure and efficient
     mechanism for updating application code.  While updating code is vitally
     important, I think 1.0 is viable without it.
 * **A shared runtime** - Chromeless has no way of sharing the same runtime on
     disk.  This means each Chromeless app embeds its own version of
     [XULRunner](https://developer.mozilla.org/en/xulrunner).  There are
     clear opportunities to optimize this, but they should be prioritized
     beneath the other features for 1.0.

### Communication

A final missing piece for Chromeless is a web presences that properly
introduces the project and provides links to all available resources.
The [present landing page](http://mozillalabs.com/chromeless/)
is out of date and information poor.  This task is really complementary
to the labs/research site redesign that is in progress and should aim to
present Chromeless with a level of polish that corresponds to the quality
of the platform (which should be high at 1.0!).

This site should be useful as both a introduction into the project and a
place for all to understand the present state and get involved.

## Participating

There are many ways to participate in the journey to Chromeless 1.0:
the first is to react to this plan.

After things settle, my hope is turn this into a concrete road-map
using [milestones and
issues](https://github.com/mozilla/chromeless/issues) on github.  Once
that's done all you have to do to join [all the other
contributors](https://github.com/mozilla/chromeless/contributors) is
pick an issue you care about, fix it, and send a pull request.

The other form of participation will be telling us about modules you've
written for inclusion in the module directory, or in some cases the
platform itself.

I look forward to your thoughts!  You can share them here, on IRC
([`#chromeless`](http://irclog.gr/#browse/irc.mozilla.org/chromeless) on `irc.mozilla.org`), or via
[the mailing list](mailto:mozilla-labs@googlegroups.com).


