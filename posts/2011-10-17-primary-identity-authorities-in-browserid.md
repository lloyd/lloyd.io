title: Primary Identity Authorities in BrowserID

<abstract>
BrowserID is designed to be a distributed authentication system.
Once fully deployed there will be no central servers required for the 
system to function, and the process of authenticating to a website will
require minimal live communication between the user's browser, the 
identity provider (IdP), and the website being logged into.  In order to 
achieve this, two things are required:

  1. Browser vendors must build native support for BrowserID into their products.
  2. IdP's must build BrowserID support to vouch for their users ownership of issued email addresses.

This post addresses #2, proposing precisely what *BrowserID Support* means 
for an IdP, and how it works.
</abstract>

## Overview

[BrowserID](https://browserid.org) lets users leverage existing email
addresses as the means by which they identify themselves to websites.
Public key cryptography allows a user to identify themselves without
requiring per-site user-names or passwords.  A key design goal of
BrowserID is that once fully deployed, no central 3rd party servers
are required to facilitate the authentication of a user to a website.
Specifically, the process of authenticating to website will be a
detached two party transaction whereby a user is directly provisioned
with a certificate from their identity provider which proves their
ownership of a given email address.  This certificate can then be used
by the user's browser to generate an *assertion* which can be sent to
a website to verify this user's ownership of the email in question.

In order for this system to work, existing identity providers (like
gmail, yahoo mail, twitter, facebook, and countless others), would
need to add features to their web applications.  Concretely, the
following are required:

  1. **A declaration of support**: An IdP must explicitly declare, in the form of a document hosted on their domain, that they support BrowserID.
  2. **A public key**: In order to allow 3rd parties to verify certificates issued by the IdP, they must publicly host the key with which those certificates are signed.
  3. **Authentication webpage**: A user must be able to interact with their IdP at the time that they are logging into a website to prove their identity to the IdP and establish a session.
  4. **Provisioning webpage**: A webpage must be provided which is capable of provisioning a user that is authenticated to the IdP with a certificate.

## Interactions

To make the above requirements more accessible, it's useful to walk
through the interactions that occur during BrowserID authentication
with a focus on the primary's involvement in the process.

### First Time BrowserID Authentication with a Primary IdP (no session)

In this case the user, Bob, visits a website,
[myfavoritebeer.org](http://myfavoritebeer.org), and wishes to
authenticate.

  1. Bob clicks on a sign-in link on `myfavoritebeer.org`.
  2. Javascript on `myfavoritebeer.org` invokes `navigator.id.getVerifiedEmailAddress()`.
  3. BrowserID is invoked and spawns a sign-in dialog, prompting the user to enter their email address.
  4. The user types in `bob@exampleprimary.org`, and clicks sign-in.
  5. BrowserID servers (or the browser) request a (cachable) resource from `exampleprimary.org` to determine if it supports BrowserID: `https://exampleprimary.org/.well-known/vep`
  6. `exampleprimary.org` returns a JSON formatted response that both indicates their support for BrowserID, and provides their public key and links to web resources which provision certificates.
  7. BrowserID servers (or the browser) relay these links to the dialog
  8. The BrowserID dialog loads the provisioning URL in a hidden `iframe` to attempt to acquire a certificate for the user.
  9. The BrowserID dialog communicates the user's claimed email address to the dialog which starts a provisioning attempt
  10. If the user is not currently authenticated, a failure response is attained from the IFrame
  11. The BrowserID dialog redirects the user to the Primary authentication provider's *authentication* URL (changing the content and user visible URL of the dialog), conveying the email address chosen by the user, and the URL to which the user should be returned.
  12. The user interacts with the primary's web interface to authenticate.
  13. Once this interaction is complete, the primary redirects user back to BrowserID, still inside the dialog.
  14. BrowserID again loads the provisioning page in a hidden iframe, and interacts with it.
  15. The primary's provisioning code calls into the browser to generate a key-pair, signs the public key on their server, and returns the result to BrowserID via a browser provided javascript API.
  16. The BrowserID dialog uses the provisioned certificate to generate an assertion, return it to the webpage, and close.

In this case, the user has not recently visited `exampleprimary.org`,
and thus does not have an existing authenticated session.  In this
case, the user must authenticate inline during the sign-in
process.

### First Time BrowserID Authentication with a Primary IdP (with session)

A more ideal variation of the first case arises when the user has
recently visited their IdP in their browser (which is likely if the
provider is something the user visits often, like a social networking
site or web-mail).  In this case, step #8 completes successfully, and
the flow skips directly to step #15.

### Re-provisioning an Previously Verified Email Address

In this case the user has several email addresses in use with
BrowserID, and selects one for which the provider has BrowserID
support.  The difference from the main case is in steps #1-#4.  Rather
than the user having to type in their email address, they'll select it
from a list.  Subsequent to this, the same flow as above applies (and
varies depending on whether the user has an existing session).

## Primary IdP Responsibilities

As discussed above, there are four distinct things an IdP must
provide in order to become a primary identity authority for BrowserID.
The following sections will explore these requirements in greater
detail.

### A Declaration of Support

In order to make it possible for the browser or BrowserID servers to
determine if there is primary support available for a given domain,
there must be a well location where an expression of support is
published.  [RFC 5785][] proposes a convention for well-known
resources, such as that required by BrowserID, which is a `.well-known`
directory under document root.  Applying this convention, primaries must serve a
JSON document under `.well-known/vep`, for example:

  [RFC 5785]: http://tools.ietf.org/html/rfc5785

    {
        "public-key": "<encoded public key>",
        "authentication": "/browserid/auth",
        "provisioning": "/browserid/provision"
    }

This document should:

  1. be served from `/.well-known/vep`
  2. be served with a `Content-Type` of `application/json`
  3. be provided over SSL.

**NOTE:** The file name `vep`, is an acronym for **V**erified
**E**mail **P**rotocol, [the standard][] which the BrowserID service from
Mozilla implements.

  [the standard]: https://wiki.mozilla.org/Identity/Verified_Email_Protocol/Latest

The top level keys present have the following contents and meaning:

  * **public-key** is an encoded public key that can be used to
    verify that certificates issued from the primary are authentic.
  * **authentication** is a path that serves web content that can be
    rendered inside the BrowserID dialog to allow the user to
    authenticate to the IdP.
  * **provisioning** is a path to content that is capable of generating
    a certificate using an established session with the IdP.

### Delegation of Authority

Many large organizations and web applications span multiple domains.
Mozilla's own web presence spans multiple domains, two of which are
`mozilla.org` and `mozilla.com`.  For large organizations, it's often
useful from and administrative and security standpoint to have
centrally maintained, shared infrastructure.  To support this need,
BrowserID supports *delegation of authority*, the process by which
a domain explicitly delegates authentication and provisioning for
email addresses that fall under it to another host.  Delegation
occurs when a `authority` property is present in the declaration
of support which contains a domain name (in which case, all other
properties present are ignored).

For example, mozila.org and mozilla.com might include the following
JSON file in `/.well-known/vep`:

    {
        "authority": "browserid.mozilla.org"
    }

In attempting to determine whether primary BrowserID support exists
for an email address `lloyd@mozilla.com`, one would first pull
`https://mozilla.com/.well-known/vep`, upon discovery of delegated
authority, next one would check
`https://browserid.mozilla.org/.well-known/vep`.

Normal caching rules apply, and as with HTTP, clients should detect
infinite redirection loops and may limit redirection to a reasonable
maximum, like 5.

### Provisioning Webpage

Web content hosted at the IdP's *provisioning* URL is designed to be
loaded in a hidden iframe, and communicate with the content that loads
it via an API supplied either by the browser or by a javascript
shim when browser support isn't available.  The API used by the
provisioning page includes the following functions:

    // A function invoked to fetch provisioning parameters, such as
    // email and desired certificate duration.
    navigator.id.beginProvisioning(function(email, cert_duration_s) { });
    
    // cause the browser to generate a key-pair, cache the private key
    // and return the public key for signing.
    navigator.id.genKeyPair(function(pubkey) { });
    
    // upon successful certificate signing, register the certificate
    // with the browser.
    navigator.id.registerCertificate(certificate);
    
    // in the event of a failure, the provisioning code should
    // invoke this function to terminate the provisioning process,
    // providing a developer readable string
    navigator.id.raiseProvisioningFailure(string reason);

Provisioning web content should include the following javascript to
provide the above functions:

    https://browserid.org/provisioning_api.js

Upon load, provisioning web content should immediately invoke
`navigator.id.beginProvisioning()` to indicate to the browser that
the provisioning process has begun, and to attain provisioning
parameters such as the recommended certificate duration and the email
address the user would like to verify.

Once the email is attained, the provisioning page can determine whether there
is an authenticated session in the user's present browser that can be leveraged
to confirm the user's identity.  The criteria for whether such a session exists
and the user may be silently provisioned with a certificate is up to
the primary IdP who may use standard web sessioning mechanisms (like cookies).

As soon as it is determined that the user may be provisioned, the primary's
provisioning code should cause a key-pair to be generated by the browser by
invoking `navigator.id.genKeyPair()`, providing a callback that will be called
with the encoded public key once the generation process is complete.

Once provisioning code has a public key, it should pass it up to IdP servers
for signing, and return the signed version to the client.  Finally the 
provisioning code should invoke `navigator.id.registerCertificate()` with the 
encoded certificate as a parameter to successfully complete the provisioning
process.

If at any point an error is encountered during the provisioning process, 
`navigator.id.raiseProvisioningFailure()` may be called with a developer
readable failure string to indicate to the browser that an error has occurred.

### Authentication Webpage

The authentication webpage is displayed from within the BrowserID dialog after
silent provisioning fails, and is intended to allow the user to provide
authentication credentials to the primary as part of authenticating to a website.

The authentication page should be designed to work well on mobile devices and
desktops.  For the latter, the IdP may assume a resolution of 700 pixels by
375 pixels.

Upon load, the authentication webpage will be loaded with several pieces of
GET data, including:

  * `user`: The local part of the email address the user is attempting to use.
  * `return_to`: The URL that the user should be sent to after authentication

In the previous example, the loaded authentication URL may look like:

    https://exampleprimary.org/browserid/auth?user=bob&return_to=https://browserid.org/sign_in#Ad4f

Once the user's interaction with the authentication dialog is complete, the
dialog should redirect to the URL provided in the `return_to` GET parameter.

Subsequent to this interaction, the BrowserID dialog will re-attempt the
provisioning process, and the results of that will indicate whether the
user has successfully authenticated with the primary.

## Data Formats

Above we avoid the important issue of data formats for certificates,
public keys, and private keys.  At the time of writing, we're working
to finalize the specific cryptographic algorithms and encoding formats
we'll be using.  BrowserID currently uses RSA encoded in [JSON
Web Tokens][].  These choices are being revisited to attempt to come
up with an algorithm and encoding that has adequate performance and
security, ideally with mature and widely available implementations.

  [JSON Web Tokens]: http://self-issued.info/docs/draft-jones-json-web-token.html

## Next Steps

There are several open issues with this proposal, and by no means should it be
considered final.  The intention of this post is to open up our present thinking
for discussion.  Along with fielding community feedback and ideas, we'll now start
prototyping an example primary to get a feel for implementation considerations and
user experience, to allow us to refine the proposal.

## Issues for further consideration

### Inline authentication

One complexity of primary IdPs is that today, the flow of authenticating to a
website becomes a three party transaction:  BrowserID, primary, and website. There
are many ways to transfer control from BrowserID to the primary once we
determine that the email the user wishes to use is associated with a primary
identity authority.

The mechanism that was chosen is to replace the BrowserID dialog with content from
the primary.  This decision has significant trade-offs to consider.  The benefits
of this approach include:

  1. The URL bar is displayed by the browser as usual, leveraging familiar anti-phishing UI.
  2. Primary content has full control over branding, how the user should be authenticated, and
     what sessioning mechanisms to use.
  3. The user need not find a different window and return to the dialog subsequently,
     which would raise UX problems.
  4. The protocol is highly portable.

Discovering the problems with the proposed approach is left as an exercise for the reader.

### Division of Authentication and Provisioning

The above design breaks certificate provisioning
into two distinct processes, implemented by two distinct web
resources.  These are *authentication* - the process of establishing an
authenticated session with your primary - and *provisioning* - the
process of attaining a signed certificate.

This decision was made to minimize the duplication of code, and simplify requirements on
primaries.  There are several features of this approach worth consideration:

  * Authentication code need not interact with any browser provided JavaScript APIs, nor include any cryptographic code
  * Provisioning code need not include any styling nor provide any visible UI.
  * Authentication code can refuse to be run in a frame.
  * Provisioning code must run in a frame.
  * In the case where an authenticated session does not exist, we'll perform provisioning twice.
  * Browser caching and careful API design should mitigate downsides of multiple provisioning attempts.

### `return_to` vs. A Well-Known Return URL

When the authentication resource is loaded, it's passed a URL to send the user to upon completion
in the `return_to` GET parameter.  An alternative implementation would be to define this return
URL, making it well known.  Benefits of `return_to` include a means for the dialog to pass
temporal, non-sensitive state to itself, and a bit less specification to rev.

### Errors during provisioning

The provisioning iframe can fail in a number of ways.  It can send no response to the containing
iframe, malformed responses, or it can try to frame-bust the BrowserID dialog.

For the first two cases, we should develop heuristics which can detect
runaway dialogs.  One utility of `navigator.id.beginProvisioning()` is
that it is expected to invoked at the time the provisioning code loads, which
give us an early indication that the provisioning code is
functioning as expected.  Timeout heuristics can consider information like this
to robustly determine whether provisioning should be considered stalled.

As far as frame busting, a reasonable countermeasure may be to have the BrowserID dialog close
upon unload with a failure, upon attempts by embedded code to frame-bust.  Further, the iframe
[sandbox property][] can be used in browsers where it's supported.

  [sandbox property]: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#attr-iframe-sandbox

### Errors during authentication

Authentication code is in no way *forced* to redirect the user back to BrowserID as is designed.
The countermeasure here is a combination of existing browser native mechanisms to
help indicate to the user that something phishy is going on, combined with potentially a
dynamic blacklist of known bad actors.

When BrowserID is implemented by browser vendors, several additional countermeasures
become possible.

### Versioning

Several protocols are defined in this proposal.  Drastic change can be handled by versioning
of the support declaration document, which would obviate the need for more granular versioning.
