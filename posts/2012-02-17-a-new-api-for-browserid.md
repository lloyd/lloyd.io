title: A new API for BrowserID

There are important features in BrowserID that [existing API][]
prevents us from implementing.  This post motivates and *proposes* a
new API building off the work of the mozilla community and other
BrowserID engineers.

  [existing API]: https://gist.github.com/1336528

## Why?

There are a couple important features that would be beneficial
to build into BrowserID, but cannot do so without restructuring the
API.  These features include:

  1. **An Improved Verification Flow** - We've [prototyped and tested][]
     an email verification change that 8/9 users prefer in
     testing.  In order to implement this we need all sites that
     implement BrowserID to have the ability to detect that a user is
     *already signed in* at page load.
  2. **Sign Out and Shared Computers** - We are actively working
     towards improving user saftey when using shared computers.  This
     feature is very related to the ability to "sign out on all the sites
     I'm signed into".  Making both of these possible requires that
     pages can detect when the user has logged out outside of the context
     of the site.

  [prototyped and tested]: http://www.shanetomlinson.com/2012/browserid-complete-user-registration-flow-experiments/


## The API (proposal)

The BrowserID API is a javascript API that is accessible at `navigator.id.`.
It allows websites to interact with BrowserID to prove a user's ownership
of an email address without per site passwords.

## Shimming

Because BrowserID is new, but is designed to be used in old browsers, a
javascript shim implementation is provided.  To use the API you should
include the following javascript in your page:

    <script src="https://browserid.org/include.js"></script>

This script will provide the functionality documented below in browsers
that don't natively implement the BrowserID API.

## Events

To simplify usage the API is implemented so that all important
asynchronous events are returned to the webpage in DOM-like events.
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

Request an assertion from the user.  The user will be prompted to select
an email address to share with the webpage, encapsulated in an
[assertion][] which proves the user's ownership of the address.

  [assertion]: https://wiki.mozilla.org/Identity/BrowserID#Identity_Assertion

Invocation of this call will cause a status event of type `requesting` to
be emitted immediately, followed by either a status event with type either
`logged_out` or `logged_in`.  In the event that the user chose to share
an email address, a `login` event will be also fired which will contain
an assertion.

This call returns no value, and may throw upon error (i.e. invalid parameters).

The `options` object may contain the following properties:

  * `requiredEmail`: when specified, indicates that the website wishes to
     verify ownership of a specific email address.  The UI will be
     optimized for this case, and the user will only have the option to
     prove that email address or cancel the dialog.

**NOTE:** This function must be invoked in a
click handler as the result of user interaction with the webpage.

#### `navigator.id.logout()`

The site should call `.logout()` when the user indicates with interaction
in content that they want to logout of the site.  This call will cause
a `status` event to be raised of type `logged_out`.

#### `navigator.id.get(<callback>, [options])`

**DEPRECATED**

A function that provides backwards compatibility with the old API.

### Events

#### `status`

An event that is fired at page load, and any time the status of the user
changes.  The following properties are present on this event:

  * `type` - A DOMString representing the type of event.  Type is one of
    `logged_in`, `logged_out`, or `requesting`.
  * `unverifiedEmail` - an optional string containing the email address of
    the user, present when type is `logged_in`.  This value should not
    be deferred to for anything that would grant the user access to the
    website: the only way to reliably check the user's identity is to
    verify the assertion provided in a `logged_in` event.

#### `logged_in`

Fired at page load when a user is signed into a site, or after the site
has called `navigator.id.request()` and the user has chosen to share a
an email address with the webpage.

## About the Design

There are many considerations that went into this design, some of the most
influential considerations include the features mentioned at the start of
this post, as well as the requirement that the API work when implemented
both in HTML and when implemented natively by browsers.  If you're interested
in more context, it's all available in [a previous post][].

  [a previous post][http://lloyd.io/doing-more-with-browserid]

I look forward to your thoughts!
