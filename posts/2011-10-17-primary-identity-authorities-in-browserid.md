title: Primary Identity Authorities in BrowserID

There have been some misperceptions regarding
[BrowserID](https://browserid.org), specifically around the claim that
it is a fully *distributed* authentication system.  The source of this
confusion is the presence of central servers in the current
incarnation of BrowserID.  To clarify, the role of these centralized
servers in BrowserID today is to make the system immediately usable -
allowing users to use *any email address* to log into *any site* from
*any browser*, from day one.  The design goal of the system, however,
is to quickly render these servers obsolete: to do this we must
migrate client logic from web resources served by browserid servers
directly into the browser, and we must migrate the verification and
certification of email addresses from BrowserID servers, to those of
identity providers.  These two tasks are going to take a while as
they require the participation of browser vendors and identity
providers, respectively.  This post addresses the latter task by
proposing a precise means by which identity providers may directly
vouch for their user's email addresses.

## Overview

[BrowserID](https://browserid.org) is a distributed authentication
system from Mozilla.  It lets users leverage existing email addresses
as the means by which they identify themselves to websites.  Public
key cryptography allows a user to identify themselves without
requiring per-site usernames or passwords.  A key design goal of
BrowserID is that once fully deployed, no central 3rd party servers
are required to facilitate the authentication of a user to a website.
Specifically, the goal is that the process of authenticating to
website is a detached two party transaction whereby a user is directly
provisioned with a certificate from their identity provider which
proves their ownership of a given email address.  This certificate can
then be used to generate an *assertion* which can be sent to a website
to verify this user's ownership of the email in question.

In order for this system to work, existing identity providers (like
gmail, yahoo mail, twitter, facebook, and countless others), would
need to add features to their web applications.  Concretely, the
following are required:

  1. **A declaration of support**: An IdP must explicitly declare, in the form of a document hosted on their domain, that they support BrowserID.
  2. **A public key**: In order to allow 3rd parties to verify certificates issued by the IdP, they must publically host the key with which those certificates are signed.
  3. **Authentication webpage**: A user must be able to interact with their IdP at the time that they are logging into a website to acquire a *certificate* that is signed by the IdP and proves their ownership of an identity from that IdP
  4. **Provisioning webpage**: Once authenticated, a webpage capable of provisioning the user with certificates must be provided.

## Interactions

To make the above requirements more accessible, it's useful to walk
through the interactions that occur during BrowserID authentication
with a focus on the primary's involvment in the process.

### First Time BrowserID Authentication with a Primary IdP (no session)

In this case, the user, Bob, visits a website,
[myfavoritebeer.org](http://myfavoritebeer.org), and wishes to
authenticate.

  1. Bob clicks on a sign-in link on `myfavoritebeer.org`.
  2. Javascript on `myfavoritebeer.org` invokes `navigator.id.getVerifiedEmailAddress()`
  3. BrowserID is invoked and spawns a login dialog, prompting the user to enter the email address they wish to use to authenticate
  4. The user types in `bob@exampleprimary.org`, and clicks sign-in.
  5. BrowserID servers (or the browser) request a (cachable) resource from `exampleprimary.org` to determine if it supports BrowserID: `https://exampleprimary.org/.well-known/browserid`
  6. `exampleprimary.org` returns a JSON formatted response that both indicates their support for BrowserID, and provides links to their public key and web resources which provision certificates
  7. BrowserID servers (or the browser) relay these links to the dialog
  8. The BrowserID dialog loads the provisioning url in a hidden iframe to attempt to acquire a certificate for the user.
  9. The BrowserID dialog communicates with the provisioning content to start a provisioning attempt
  10. If the user is not currently authenticated, a failure response is attained from the IFrame
  11. The BrowserID dialog redirects the user to the Primary authentication provider's *authentication* url (changing the content and user visible URL of the dialog), conveying the email address chosen by the user.
  12. The user interacts with the primary's web interface to authenticate.
  13. Once this interaction is complete, the primary redirects the web content in the dialog back to BrowserID.
  14. BrowserID again loads the provisioning url and interacts with it.
  15. the primary's provisioning code generates a keypair, signs the public key on the server, and returns the result to BrowserID via a javascript call
  16. the BrowserID dialog uses the provisioned certificate to generate an assertion, return it to the webpage, and close.

In this case, the user has not recently visited `exampleprimary.org`,
and thus does not have an existing authenticated session.  In this
case, the user must authenticate inline during the authentication
process.

### First Time BrowserID Authentication with a Primary IdP (with session)

A more ideal variation of the first case, in this case the user has
recently visited their IdP in their browser (which is likely if the
provider is something the user visits often, like a social networking
site or webmail).  In this case, step #8 completes successfully, and
the flow skips directly to step #15.

### Re-provisioning an Previously verified Email Address

In this case the user has several email addresses in use with
BrowserID, and selects one for which the provider has BrowserID
support.  The difference from the main case is in steps #1-#4.  Rather
than the user having to type in their email address, they'll select it
from a list.  Subsequent to this, the same flow as above applies (and
varies depending on whether the user has an exisiting session.

## Primary IdP Responsibilities

As discussed above, there are four distinct things a primary IdP must
provide in order to become a primary identity provider in BrowserID.
The following sections will explore these requirements in greater
detail.

### A Declaration of Support

In order to make it possible for the browser or BrowserID servers to
determine if there is primary support available for a given domain,
there must be a well location that an expression of support can be
published.  [RFC 5785][] proposes a convention for well-known resources
such as that required by BrowserID, which is to tuck them under a
`.well-known` directory under document root.  Given this, primaries
must serve a JSON document under `.well-known/browserid`, that looks
something like this:

  [RFC 5785]: http://tools.ietf.org/html/rfc5785

    {
        "public-key": "/.well-known/browserid.pk",
        "authentication": "/browserid/auth",
        "provisioning": "/browserid/provision"
    }

This document should:

  1. be served from `/.well-known/browserid`
  2. be served with a `Content-Type` of `application/json`
  3. be provided over SSL.

The top level keys present have the following contents and meaning:

  * **public-key** is a path underneath the same domain where the
    public-key for the domain is published.
  * **authorization** is a path that serves web content that can be
    rendered inside the BrowserID dialog to allow the user to
    authenticate to the IdP.
  * **provisioning** is a path to content that is capable of generating
    a certificate using an established session with the IdP.

### Provisioning Webpage

Web content hosted at IdP's *provisioning* url is designed to be
loaded in an invisible iframe, and communicate with the content that
loads it via [cross document messaging][].

  [cross document messaging]: http://www.whatwg.org/specs/web-apps/current-work/multipage/web-messaging.html#web-messaging

Upon load, provisioning web content may verify that the content which has
loaded it has been served from `https://browserid.org`.  Subsequent to that,
the content can determine which email address needs to be provisioned by
checking `window.location.hash`.  In the case of the example above, the
provisioning webpage would be loaded with a url of:

    https://exampleprimary.org/browserid/provision.html#bob@exampleprimary.org

Once the email is attained, the provisioning page can determine whether there
is an authenticated session in the user's present browser that can be leveraged
to confirm the user's identity.  The criteria for whether such a session exists
and the user may be silently provisioned with a certificate is up to
the primary IdP who may use standard web sessioning mechanisms (like cookies).

As soon as it is determined that the user may be provisioned, the primary's
provisioning code should emit a message to its parent indicating that provisioning
is underway.  The message that should be emitted should be JSON encoded as a string:

    {
        "status": "provisioning",
        [ "progress", 0.0 ]
    }

This message implies to parent code implicitly that thus far there
have been no errors, and provisioning is proceeding.  The
"provisioning" message may be emitted any number of times, and if
meaningiful approximate progress is available it may be added to the
message as a number under the "progress" property.  Sample javascript
to emit this message follows:

    window.parent.postMessage(
      JSON.stringify({
        status: "provisioning",
        progress: 0.0
      }),
      "https://browserid.org"
    );

In the event of a failure, the should emit a 'failure' message with an
optional developer readable error message:

    {
        "status": "failure",
        [ "reason", "email address requires authentication" ]
    }

Finally, upon successful keypair and certificate generation, the provisioning
content should emit a success message containing authentication material:

    {
        "status": "success",
        "certificate": "<encoded signed certificate>",
        "private-key": "<encoded private key>"
    }

### Authentication Webpage

The authentication webpage is displayed from within the BrowserID dialog after
silent provisioning fails, and is intended to allow the user to provide
authentication credentials to the primary as part of authenticating to a site.

The authentication page should be designed to work well on mobile devices and
desktops.  For the latter, the IdP may assume a resolution of 700 pixels by
375 pixels.

Upon load, the authentication webpage will be loaded with several pieces of
GET data, including:

  * `user`: The local part of the email address the user is attempting to use.
  * `return_to`: The url that the user should be sent to after authentication

In the previous example, the loaded authentication url may look like:

    https://exampleprimary.org/browserid/auth?user=bob&return_to=https://browserid.org/sign_in#Ad4f

Once the user's interaction with the authentication dialog is complete, the
dialog should redirect to the url provided in the `return_to` GET parameter.

Subsequent to this interaction, the BrowserID dialog will re-attempt the
provisioning process, and the results of that will indicated whether the
user has successfully authenticated with the primary.

## Data Formats

The conversation above avoids the important issue of data formats for certificates,
public keys, and private keys.  At the time of writing, we're working to
finalize the specific cryptographic algorithms and encoding formats we'll
be using.  BrowserID at present leverages RSA encoded in [JSON Web Tokens][].
At present we're revisiting these choices to attempt to come up with an algorithm and
encoding that has adequate performance, security, and has mature and widely avaiable
libraries.

  [JSON Web Tokens]: http://self-issued.info/docs/draft-jones-json-web-token.html

## Next Steps

There are several open issues with this proposal, and by no means should it be
considered final.  The intention of this post is to open up our present thinking
for discussion.  Along with fielding community feedback and ideas, we'll now start
prototyping an example primary to get a feel for implementation considerations and
user experience, to allows us to refine the proposal.

## Issues for further consideration

### `postMessage` and IE7

By specifying that communication between IdP provided provisioning code communicates
with BrowserID, we build an explicit dependency on cross document messaging which
makes us unable to support certain popular browsers, most notably Internet Explorer 7.

According to [StatCounter GlobalStats][], this decision means that
BrowserID support would be available immediately in at least 90% of
browsers.  It's an open question whether we should make the job of primaries
(much) more complex to gain an additional 4% of market share that's trending
downward.

  [StatCounter GlobalStats]: http://gs.statcounter.com/

### Communication by fragment

In the case of provisioning, information is passed from the BrowserID dialog to the
IdP's content via url fragment, while the response is passed via `postMessage()`.
This assymetry exists to avoid load time race conditions present with postMessage
(i.e. avoid the issue that if a message is posted to the provisioning frame before
the provisioning frame has bound a listener, the message will be missed).

### Inline authentication

One complexity of primary IdPs is that today, the flow of authenticating to a 
website becomes a three party transaction:  BrowserID, primary, and website.  
There are many ways to transfer control from BrowserID to the primary once we
determine that the email the user wishes to use is associated with a primary
identity authority.  

The mechanism that was chosen is to replace the BrowserID dialog with content from
the primary.  This decision has significant tradeoffs to consider.  The benefits
of this approach include:

  1. The url bar is displayed by the browser as usual, using familiar anti-phishing UI.
  2. Primary content has full control over how the user should be authenticated, and
     what sessioning mechanisms to use.
  3. The user need not find a different window and return to the dialog subsequently,
     which would raise UX problems.
  4. The protocol is highly portable.

Discovering the downsides to the proposed approach are left as an excercise to the reader.

### Division of Authentication and Provisioning

The above design breaks the process of certificate provisioning from a
primary into two distinct processes, implemented by two distinct web
resources.  These are *authentication* - the process of establishing an
authenticated session with your primary - and *provisioning* - the
process of attaining a keypair and signed certificate.

This decision was made to minimize the duplication of code, and simplify requirements on 
primaries.  There are several features of this approach worth consideration:

  * If the authentication code was to directly provision a key, it would add
    communication requirements, probably indicating post message or browserid hosted
    resource inclusion
  * By not having the authentication process provision a certificate, we're
    forced to retry provisioning after successful authentication, adding some latency
    and error modes.
  * The provisioning page is loaded twice when a user must authenticate, however browser
    caching may mitigate user perceptible latency.
  * Authentication code needs not use postMessage include any crytographic code
  * provisioning code needs not include any styling nor provide any visibile UI.
  * Authentication code can refuse to be run in a frame
  * provisioning code must run in a frame but may only allow `browserid.org` to include it.

### `return_to` vs. A Well-Known Return URL

When the authentication resource is loaded, it's passed a URL to send the user to upon completion 
in the `return_to` GET parameter.  An alternative implementation would be to define this return
URL, making it well known.  Benefits of `return_to` include a means for the dialog to pass 
temporal, non-sensitive state to itself, and one bit of specification to have to rev.

### Errors during provisioning

The provisioning iframe can fail in a number of ways.  It can send no response to the containing
iframe, malformed responses, or it can try to frame-bust to try to capture the BrowserID dialog.

For the first two cases, we should develop heuristics which can detect
runaway dialogs.  One motivation for including progress messages is
that these give us an early indication that the provisioning code is
functioning as expected.  These timeout heuristics can consider this
information to determine whether provisioning stalled.

As far as frame busting, a reasonable countermeasure may be the BrowserID dialog closing dialog
upon unload with a failure, upon attempts to frame bust by embedded code.  Further the iframe
[sandbox property][] can be used in browsers where it's supported.

  [sandbox property]: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#attr-iframe-sandbox

### Errors during authentication

Authentication code is in no way forced to redirect the user back to BrowserID as is designed.  
The countermeasure here is a combination of existing browser native mechansims to 
help indicate to the user that something phishy is going on, combined with potentially a 
dynamic blacklist of known bad actors.

### Versioning

Several protocols are defined in this proposal.  Drastic change can be handled by versioning
of the top level support declaration, which would obviate the need for more granular versioning
(i.e. postMessage bodies).

There is ample precedent to address this issue when it arises.

### postMessage vs. navigator.id.XXX

The provisioning frame communicates the results of provisioning via messages posted
back to its parent.  This is unlike how websites that use browserid communicate
(via an abstraction parked at `navigator.id`).  This is intended to alleviate
provisioning code from including a javascript shim in its evaluation context.

### Forwards compatibility with Browser Native implementations

A browser plugin (or built in implementation) should be able to fully
perform the responsibilities of the BrowserID dialog implemented today
in web content, however there are some places where that will be made
more complex by compatibility considerations.

Specifically, it might be cleaner to provide provisioning code with a proper
javascript API rather than using postMessage, however this can be simulated
in native code with some care.  

The proposal for now is a single protocol over postMessage for now,
with a gradual streamlining of the interface as browser adoption picks up.
Whether we could simplify the client implementation and improve forward
compatibility with a small provisioning specific javascript shim, is 
an open question.
