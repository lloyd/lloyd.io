title: How BrowserID works

<small>(a special thanks to [Mike Hanson] for his careful review of this post)</small>

 [Mike Hanson]:http://open-mike.org

[BrowserID](https://browserid.org) is a decentralized identity system
that makes it possible for users to prove ownership of email addresses
in a secure manner, without requiring per-site passwords.  BrowserID
is hoped to ultimately become an alternative to the tradition of
ad-hoc application level authentication based on site specific
user-names and passwords.  BrowserID is built by [Mozilla], and
implements a variant of the [verified email protocol] ([originally
proposed by Mike Hanson], and refined by [Dan Mills] and others).

  [originally proposed by Mike Hanson]:http://www.open-mike.org/entry/verified-email-protocol
  [Dan Mills]:http://sandmill.org/
  [Mozilla]:http://www.mozilla.org/about/mission.html
  [verified email protocol]:http://www.open-mike.org/entry/verified-email-protocol

> Before learning the technical details of BrowserID, it's recommended
> you experience a user's perspective of BrowserID with the
> [myfavoritebeer.org] demo, and then work through the [integration
> tutorial] for a website developer's perspective.

  [myfavoritebeer.org]:http://myfavoritebeer.org
  [integration tutorial]:https://browserid.org/developers.html

This post aims to provide a readable technical overview of the system.
First it will summarize the key design elements of BrowserID.  Next,
it will explore the various actors in the system and their
inter-relationships.  Finally, we'll walk through several of the most
important flows, including certificate provisioning (where the user
obtains authentication material from an identity provider), assertion
generation (where the user uses that material to tell a website who they
are), and assertion verification (where the website being logged into
verifies the user's email address).

## BrowserID Features

Perhaps the best way to begin understanding BrowserID is to walk through
its key design features:

  * **An email is an identity** - There are no *usernames* in BrowserID, it uses
    emails addresses instead.  Users identify with emails quite
    naturally, and no new infrastructure is needed to reliably verify
    ownership of them.
  * **Decentralized** - A user's authentication to a website
    occurs in relative isolation.  No network transactions with third
    parties are needed, so it is efficient and privacy-protecting.
    Additionally, any email address may be used, and any email
    provider may provide first class BrowserID support for their users.
  * **Ownership Based Authentication** - In BrowserID, the browser manages
    authentication material which can be used without a
    password - making authentication with BrowserID more reliant on
    ownership factors, and less on knowledge factors.
  * **Usable today, and better in browsers** - An HTML5 implementation
    provides a functional system today, and BrowserID is designed with
    adoption by browser vendors in mind, which will afford improvements
    in both user experience and security.

To provide these features, BrowserID uses [public-key cryptography]
which is applied both by a user's browser to create signed assertions
about the user's identity, and by identity providers to vouch (via
signing of a key-email pair) for a user's identity in a disconnected
fashion.  BrowserID uses [cross document messaging] to communicate
between documents served from different domains, which makes a usable
implementation of BrowserID possible *right now* without modifications
to existing browsers.

  [public-key cryptography]:http://en.wikipedia.org/wiki/Public_key_crytography
  [cross document messaging]:http://en.wikipedia.org/wiki/Cross-document_messaging

## Actors

As said above, BrowserID is *decentralized*, which results in several
actors interacting under a healthy mutual distrust.  These actors include:

  * **Primary Identity Authorities** (or often just *primary*) - 
    Services that directly provide the user with an identity in the
    form of an email address.  Example *primaries* include [Yahoo! mail]
    or [gmail].  A primary can build "BrowserID support" and
    directly vouch for its user's identities.
  * **Relying Parties** (or *RPs*) - Sites that use BrowserID for
    authentication (relying on the claims of identity authorities).
    The demonstration site [myfavoritebeer.org], is an example RP.
  * The **Implementation Provider** (or *IP*) - This may be the user's web
    browser if native support for BrowserID exists, otherwise
    [browserid.org] fills this role by serving web resources that
    implement the client portion of the system.  In addition to key
    management and implementations of the required algorithms, the
    *IP* also serves as a *Secondary Identity Authority*.  The
    secondary authority - that is, [browserid.org], or in the case
    of native support, a set of servers selected and vetted by the
    browser vendor - will verify and vouch for email addresses issued
    by providers who have not yet implemented BrowserID support.

  [browserid.org]:https://browserid.org
  [Yahoo! mail]: http://mail.yahoo.com/
  [gmail]: http://gmail.com/

## Important Flows

A solid understanding of how BrowserID works can be attained by working through
the main flows of the system, in terms of the interactions between the actors defined
above.  This section will walk through the three most important flows:

### Certificate Provisioning

*Certificate Provisioning* is the process by which a primary (like
`gmail.com`) verifies that a user owns one of her email addresses
(like `lloydhilaiel@gmail.com`) and provides them with a signed
certificate that vouches for their ownership of that email.

Visually, the flow looks like this:

<center>![Certificate Provisioning](posts/i/certificate_provisioning.png)</center>

The actors involved in this flow include the user, her browser (which
happens to have BrowserID support built in), and her email provider
gmail (who in this case happens to be a BrowserID primary identity
authority).

  0. Some event occurs whereby the user indicates that they'd like to
     log into an RP using their gmail address, and the user is
     directed to a web-page on gmail.com designed for the purposes of
     key provisioning.
  1. The user authenticates to gmail using their user-name and password.
     (or, perhaps, a stronger authentication scheme - the strength of
     this login is entirely up to the authority)
  2. gmail-hosted javascript invokes `navigator.id.genKeyPair()`, a
     client side function implemented by the browser, that causes a
     key-pair to be generated.  Upon the completion, the public key is
     returned to the callee (gmail's javascript), and the key-pair is
     cached by the browser for the duration of the session.
  3. gmail's javascript code on the client sends the public key up to
     a gmail server over SSL.
  4. gmail signs the user's email address, the public key, and a
     validity interval generating a [JWT] (which is just a means of
     encoding a signed JSON object).
  5. gmail returns this bundle to the client as a response to the
     request in step 3.
  6. JavaScript code served from gmail invokes
     `navigator.id.registerVerifiedEmail()` on the client passing in
     the certificate.
  7. The browser locates the private key generated in step #2 and
     moves it and the certificate from temporary session storage into
     the user's BrowserID key-ring.  The user now has a valid
     certificate from gmail stored in their browser which they can use
     to generate assertions proving their identity.

  [JWT]:http://self-issued.info/docs/draft-jones-json-web-token.html

Users will encounter certificate provisioning anytime they wish to use
an email to log into a site that they haven't used recently on their
current browser.

The flow above assumes that the primary (gmail) has built custom
BrowserID support.  In practice, BrowserID must handle the case where
an email provider hasn't (yet) built such support.  In this case
browserid.org manually verifies email addresses and acts as a
*secondary authority* (itself issuing certificates for email addresses
which it does not control).

Finally, in the flow above the browser has *native* support for BrowserID,
exposing functions to generate key-pairs and store certificates.  In the
absence of such support, BrowserID provides a small JavaScript shim that
implements the missing functionality using standard HTML5 techniques and
cryptographic routines implemented in JavaScript.

### Assertion Generation

*Assertion Generation* is the process by which a user's browser produces an
*assertion* that proves that a user owns a given email address.

  1. During the process of logging into a website, the user clicks on a
     "sign in" button on the RP's site, causing the RP to invoke
     `navigator.id.getVerifiedEmail()`.
  2. The user selects an email address that they would like to use to log in
     from a list rendered by the browser.
  3. The browser combines the domain requesting
     the identity (the *audience*), a validity period, and the certificate
     associated with the identity in to a bundle (the certificate includes
     a public key, and the email address being shared).
  4. That bundle is signed using the private key associated with the identity,
     encoded into a [JWT], and returned to the web page.

The result of assertion generation is a JSON structure which
looks like this:

    {
        "audience": "myfavoritebeer.org",
        "valid-until": 1308859352261,
        "certificate": {
            "email": "lloydhilaiel@gmail.com",
            "public-key": "<lloyds-public-key>",
            "valid-until": 1308860561861,
        } // certificate is signed by gmail.com
    } // entire assertion signed using lloyd's key for lloydhilaiel@gmail.com

At the completion of this flow, the browser has provided the RP with
an email address that they can verify is owned by the user.  See the
next section for how the verification process works.

While the flow above describes the case where native browser support
exists for BrowserID, the flow is identical (except for the user
interface) when the browser does not have native support: In this case
all of the required functionality can be supplied by a JavaScript
shim.

### Assertion Verification

*Assertion Verification* is the process by which a *Relying Party* can
verify that an assertion of a user's ownership of a certain email is valid.
Verification looks like this:

<center>![Assertion Verification](posts/i/assertion_verification.png)</center>

  1. The RP (securely) transmits the assertion from the client up to
     her servers.
  2. Validity periods are checked on both the certificate and the assertion.
  3. The RP extracts the host-name of the email within the assertion; this is
     the primary identity authority for the email address.  In our example
     above, it's `gmail.com`.
  4. Public key(s) for gmail.com are attained from a well-known location on
     their servers (specifics TBD).
  5. The certificate signature is verified; success proves to the RP that
     the embedded user's public key is valid.
  6. The assertion signature is verified using the embedded user's public key,
     after which point the RP knows the assertion is valid and the user owns
     the specified email address.

At the conclusion of the *assertion verification* flow, the RP has a verified
email address for the user.

The above flow assumes that the primary identity authority supports
BrowserID; specifically, that the authority provisions certificates
and publishes their public keys on their site.  In the case
that the email that is the subject of the assertion is not from a
domain where BrowserID support is present, then the assertion
certificate will include an `issued-by` property that is the domain of
*secondary authority*: the entity that has vouched for the validity of
the email address.  The common case today is that this will be
`browserid.org`, but in the future there may be a small number of secondary
authorities run by browser vendors or trusted organizations.  RPs are
explicitly asked to trust these authorities for email verification, so
their processes and operational security would need to be transparent
and of the highest quality.

In a future where BrowserID is widely adopted, secondary authorities are
the exception rather than the rule.  Identity issuers would be directly
responsible for the security of their own users.

## Implementation Status

At the time of writing, [browserid.org] is a partial implementation of the
system described here.  The key differences between what is described and what
exists are:

  * **certification** - BrowserID is today on requires that authorities host all
    public keys associated with all users.  It will move to certificates
    [in the coming weeks](https://github.com/mozilla/browserid/issues?milestone=6&state=open).
  * **primary support** - BrowserID doesn't currently support primary identity
    authorities as described above, as there aren't any.  In the coming months it will
    defer to 3rd parties properly and
    [gain support for primary authorities](https://github.com/mozilla/browserid/issues?milestone=3&state=open).

## Differences from the Verified Email Protocol

This post exists to provide a clear description of how BrowserID
works, and also to precisely express the ways that it is different
from various different implementations of the same theme.  BrowserID
is a simplification of the protocol [originally
proposed by Mike Hanson], having two key differences:

### Secondaries de-emphasized.

The original proposal emphasized the distribution of secondary
identity authorities more than BrowserID does.  There are significant
UX and administrative challenges in supporting distributed secondary
authorities, and with BrowserID the thinking is that it is better to
focus on encouraging email providers to include BrowserID support than
it is to create a new ecosystem of secondaries, which may ultimately
be detrimental to the safety and usability of the system.

### No webfinger based assertion verification

The original proposal included two different ways for an identity
authority to vouch for a user's identity.  The first method
was as in BrowserID, via a cryptographic signature.  The second method
was for the authority to publish the user's current keys via
[webfinger] and in this way vouch for them.

  [webfinger]:http://code.google.com/p/webfinger/

The latter approach is omitted from BrowserID because it is perceived
as both reducing the privacy of the system (RPs would ultimately leak
more information back to identity providers about the user's activities),
and because it increases total system complexity.


