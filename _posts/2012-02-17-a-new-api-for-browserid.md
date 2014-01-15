---
title: A new API for BrowserID
layout: post
---

<small>(This post was collaboratively written with
[Ben Adida], [Austin King], [Shane Tomlinson], and [Dan Mills])</small>

 [Austin King]:http://ozten.com/
 [Shane Tomlinson]:http://shanetomlinson.com
 [Ben Adida]:http://benlog.com
 [Dan Mills]:https://twitter.com/#!/thunder

There are important features in BrowserID that [existing API][]
prevents us from implementing.  This post motivates and *proposes* a
new API building off the work of the Mozilla community and other
BrowserID engineers.

  [existing API]: https://gist.github.com/1336528


## Why?

There are a couple important features that would be beneficial
to build into BrowserID, but cannot be added without restructuring the
API.  These include:

  1. **An Improved Verification Flow** - We've [prototyped and tested][]
     an email verification change that 8/9 users prefer in
     testing.  In order to implement this we need all sites that
     implement BrowserID to have the ability to detect that a user is
     *already signed in* at page load.

  2. **Sign Out and Shared Computers** - We are actively working
     towards improving user safety when using computers that are not
     their own.  The solution to this problem requires that
     pages are able to detect when the user has logged out outside of the
     context of the site.

  [prototyped and tested]: http://www.shanetomlinson.com/2012/browserid-complete-user-registration-flow-experiments/


## The API (proposal)

The BrowserID API is a javascript API that is accessible at `navigator.id.`.
It allows websites to interact with BrowserID to prove a user's ownership
of an email address without per site passwords.

## Shimming

Because BrowserID's goal is to support all popular browsers, a
javascript shim implementation is provided.  To use the API you should
include the following javascript in your page:

    <script src="https://browserid.org/include.js"></script>

This script will provide the functionality documented below in browsers
that don't natively implement the BrowserID API.

## Events

To simplify usage, the API is implemented so that all important
asynchronous events are returned to the web-page in DOM-like events.
These events are emitted from the `navigator.id` object, and can be
listened for using `navigator.id.addEventListener()` and
`navigator.id.removeEventListener()` which have an identical signature
and similar semantics to [their DOM counterparts][].

  [their DOM counterparts]: https://developer.mozilla.org/en/DOM/element.addEventListener

## Synopsis

This API proposal is hoped to be easy to apply, but still provide sites with
all the hooks they need to build a great user experience.  The simplest
possible application in pseudo code is:

    if (!signed_in) {
      navigator.id.addEventListener('login', function(event) {
        // send event.assertion up to the server for verification
        // and to create a user session
      });

      onClick(function() {
        navigator.id.request();
      });
    } else {
      navigator.id.addEventListener('logout', function(event) {
        // The user has logged out!  perform a page transition or
        // an ajax request to end the user's session, and
        // update the page.
      });
    }

## The API

### Functions

#### `navigator.id.request([options])`

Request an [assertion][] from the user.  The user will be prompted to select
an email address to share with the web-page, encapsulated in an
[assertion][] which proves the user's ownership of the address.

  [assertion]: https://wiki.mozilla.org/Identity/BrowserID#Identity_Assertion

**NOTE:** This function must be invoked in a
click handler as the result of user interaction with the web-page.

Once the user finishes interacting with the dialog, either a `login` or
`logincanceled` event will be emitted to reflect the results of the
interaction.

This call returns no value, and may throw upon error (i.e. invalid parameters).

The `options` object may contain the following properties:

  * `requiredEmail`: when specified, indicates that the website wishes to
     verify ownership of a specific email address.  The UI will be
     optimized for this case, and the user will only have the option to
     prove that email address or cancel the dialog.

#### `navigator.id.logout()`

The site should call `.logout()` when the user indicates with interaction
in content that they want to logout of the site.  Invocation of this call
will cause a `logout` event to be raised.

#### `navigator.id.setLoggedInUser(<email>)`

A page may call this function before page load is complete to optimize
their site.  The `email` address should be the string of the currently logged
in user, or null if no user is logged in.

Invoking this function has the following affects:

  * If the specified user is already logged in, no `login` event will be fired
    at page load, which will minimize work done that could detriment page load
    performance.
  * For browser native implementations, a display of the currently logged in
    user is possible when this function is invoked before page load.

#### `navigator.id.get(<callback>, [options])`

A **DEPRECATED** function that provides backwards compatibility with the old API.

### Events

#### `login`

An event that is fired at page load when a user is signed in, or when the
user signs in via the browser or the BrowserID dialog.

  * `assertion` - A DOMString holding an [assertion][] of a users ownership
    of an email address.
  * `unverifiedEmail` - A string containing the email address of the
    user, which is embedded inside the assertion.  This value should
    not be deferred to for anything that would grant the user access
    to the website: the only way to reliably check the user's identity
    is to verify the assertion.

#### `loginCanceled`

An event that is fired when the user cancels the login process in the
BrowserID dialog.

#### `logout`

An event that is fired at page load when a user is not signed in,
and any time the user logs out.

## About the Design

There are many considerations that went into this design, some of the most
influential considerations include the features mentioned at the start of
this post, as well as the requirement that the API work when implemented
both in HTML and when implemented natively by browsers.  If you're interested
in more context, it's all available in [a previous post][].

  [a previous post]: http://lloyd.io/doing-more-with-browserid

I look forward to your thoughts!
