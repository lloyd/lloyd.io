title: How BrowserID works

[BrowserID](https://browserid.org) is a federated identity system and
set of protocols that makes it possible for users to prove ownership
of email addresses in a secure manner, without requiring per-site
passwords.  BrowserID is hoped to ultimately become an alternative to
the tradition of ad-hoc application level authentication based on site
specific usernames and passwords.  BrowserID is built by [mozilla],
and implements a variant of the [verified email protocol] ([originally
proposed by Mike Hanson], and refined by [Dan Mills] and others).

  [originally proposed by Mike Hanson]:http://www.open-mike.org/entry/verified-email-protocol
  [Dan Mills]:http://sandmill.org/
  [mozilla]:http://www.mozilla.org/about/mission.html
  [verified email protocol]:http://www.open-mike.org/entry/verified-email-protocol

> Before reading about the technical details of BrowserID, it's
> recommended you get a visceral understanding of how BrowserID feels
> from a user perspective with the [myfavoritebeer.org] demo, and also
> a developer perspective of usage with the [developer tutorial].

  [myfavoritebeer.org]:http://myfavoritebeer.org
  [developer tutorial]:https://browserid.org/developers.html

This post aims to provide a readable overview of the functioning of
the system.  First it will summarize the key design and technical elements
of BrowserID.  Next, it will explore the various actors in
the system and their inter-relationships.  Finally, we'll walk through
several of the most important flows, including certificate
provisioning (where the user attains authentication material from an
identity provider), assertion generation (where the user uses that
material to tell someone who they are), and assertion verification
(where the website being logged into verifies the user's email address).

## BrowserID Features

Perhaps the best way to begin understanding BrowserID is to walk through
its key design features:

  * **Possesion Based Authentication** - In BrowserID, the browser manages
    authentication material which can be used without a
    password - making authentication with BrowserID more reliant on
    ownership factors, and less so on knowledge factors.
  * **An email is an identity** - An identity is just an email addresses
    in BrowserID: users identify with emails quite naturally, and no new
    infrastructure is needed to reliably verify a users ownership of them.
  * **Usable today, but better in browsers** - While HTML5 features
    provide a functional system today, BrowserID is designed to be
    adopted by browser vendors, which will afford improvements in user
    experience and security.
  * **Decentralized** - A user authenticating to a website using an
    identity provider can occur in relative isolation without network
    transactions to third parties (so it's efficient) nor information
    leakage (and private).  Additionally, any email address may be used,
    and any email provider may provide first class BrowserID support for
    their users.

To provide these features, BrowserID uses [public-key cryptography]
which is applied both by a user's browser to create signed assertions
about the user's identity, and by identity providers to vouch (via
signing of a key, email pair) for a user's identity in a disconnected
fashion.  Finally, [cross document messaging] provides the
ability to communicate between documents served from different
domains, which makes a usable implementation of BrowserID possible
*right now* without modifications to existing browsers.

  [public-key cryptography]:http://en.wikipedia.org/wiki/Public_key_crytography
  [cross document messaging]:http://en.wikipedia.org/wiki/Cross-document_messaging

## Actors

As said above, BrowserID is *federated* and *distributed*, which means we have several
different entities operating under a healthy mutual distrust:

  * **Primary Identity Authority** (or often just, *primary*) - A
    service that directly provides the user with an identity in the
    form of an email address.  Example primaries include [Yahoo! mail]
    or [gmail].  This service can build "BrowserID support" and
    directly (cryptographically) vouch for its user's identities.
  * **Relying Party** (or *RP*) - A site that uses BrowserID for
    authentication (relying on the claims of identity authorities).
    The demonstration site [myfavoritebeer.org], is an example RP.
  * **Implementation Provider** (or *IP*) - This may be the user's web
    browser if *native support* for browserid exists, otherwise
    [browserid.org] fills this roll by serving web resources that
    implement the client portion of the system.  In addition to key
    management and implementations of the required algorithms, the
    *IP* also serves as a *Secondary Identity Authority*.  That is
    [browserid.org] (or in the case of native support, a set of
    servers selected by the browser vendor) will verify and vouch for
    email addresses issued by providers who have not yet implemented
    BrowserID support.

  [browserid.org]:https://browserid.org
  [Yahoo! mail]: http://mail.yahoo.com/
  [gmail]: http://gmail.com/

## Important Flows

A solid understanding of how BrowserID works can be attained by working through
the main flows of the system, in terms of the interactions between the actors defined
above.  This section will walk through the three most important flows in the system:

### Certificate Provisioning

*Certificate Provisioning* is the process by which a primary (like
`gmail.com`) verifies that a user owns one of her email addresses
(like `lloydhilaiel@gmail.com`) and provides them with a signed
certificate that vouches for their ownership of that email.

Visually, the flow looks like this:

> **Provisioning diagram, Numbered**

The actors involved in this flow include the user, her browser (who
happens to have BrowserID support built in), and her email provider
gmail (who in this case happens to be a BrowserID primary identity
authority).

  0. Some event occurs whereby the user indicates that they'd like to
     log into an RP using their gmail address, and the user is
     directed to a webpage on gmail.com designed for the purposes of
     key provisioning.
  1. The user authenticates to gmail using their username and password.
  2. gmail hosted javascript invokes `navigator.id.genKeyPair()`, a
     client side function, implemented by the browser, that causes a
     keypair to be generated.  Upon the completion of this
     computationally expensive operation, the public key is returned
     to the callee (gmail's javascript), and the keypair is cached by
     the browser for the duration of the session.
  3. gmail's javascript code on the client sends the public key up to
     a gmail server over SSL.
  4. gmail signs the user's email address, the public key, and a
     validity interval generating a [JWT].
  5. gmail returns this bundle to the client as a response to the
     request in step 3.
  6. JavaScript code served from gmail on the client invokes
     `navigator.id.registerVerifiedEmail()` on the client passing in
     the certificate.
  7. The browser locates the private key generated in step #2 and
     moves it and certificate from temporary session storage into the
     user's BrowserID keyring.  The user now has a valid certificate
     from gmail stored in their browser which they can use to generate
     assertions proving their identity.

  [JWT]:http://self-issued.info/docs/draft-goland-json-web-token-00.html

Users encounter certificate provisioning anytime they wish to use
an email to log into a site that they haven't used recently on their
current browser.

The flow above assumes that the primary (gmail) has built custom
BrowserID support.  In practice, BrowserID must handle the case where
an email provider hasn't (yet) built such support.  In this case
browserid.org manually verifies email addresses and acts as a
*secondary* (itself issuing certificates for email addresses which it
does not control).

Finally, in the flow above the browser has *native* support for BrowserID,
exposing functions to generate keypairs and store certificates.  In the
absence of such support, BrowserID provides a small JavaScript shim that
provides the missing functionality using standard HTML5 techniques and
cryptographic routines implemented in javascript .

### Assertion Generation

*Assertion Generation* is the process by which a user's browser produces an
*assertion* that proves that a user owns a given email address.

  1. During the process of logging into a website, the user clicks on a
     "sign in" button on the RP's site, causing the RP to invoke
     `navigator.id.getVerifiedEmail()`.
  2. The user selects an email address that they would like to use to log in
     from a list rendered by the browser.
  3. The browser combines the the domain requesting
     the identity (the *audience*), a validity period, and the certificate
     associated with the identity in to a bundle (the certificate includes the
     a PEM encoded public key, and the email address being shared).
  4. That bundle is signed using the private key associated with the identity,
     encoded into a [JWT], and returned to the web page.

The result of assertion generation is a JSON structure which conceptually
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
an email address that they can verify is owned by the user.

While the flow above describes the case where native browser support
exists for BrowserID, the flow is identical (except for the user
interface) when the browser does not have native support: In this case
all of the required functionality can be supplied by a javascript
shim.

### Assertion Verification

*Assertion Verification* is the process by which a *Relying Party* can
verify that an assertion of a user's ownership of a certain email is valid.
Verification looks like this:

>  **Assertion Verification diagram, Numbered**

  1. The RP (securely) transmits the assertion from the client up to
     her servers.
  2. validity periods are checked on both the certificate and the assertion.
  3. The RP extracts the hostname of the email within the assertion, this is
     the primary identity authority for the email address.  In our example
     above, it's `gmail.com`.
  4. public key(s) for gmail.com are attained from a well known location on
     their servers (specifics TBD).
  5. The certificate signature if verified, after which point the RP knows the
     embedded user's public key is valid.
  6. The assertion signature is verified using the embedded user's public key,
     after which point the RP knows the assertion is valid and the user owns
     the specfied email address.

At the conclusion of the *assertion verification* flow, the RP has a verified
email address for the user.

The above flow assumes that the primary identity authority supports
BrowserID, specifically that would mean that they provision
certificates and publish their public keys on their site.  In the case
that the email that is the subject of the assertion is not from a
domain where BrowserID support is present, then the assertion
certificate will include an `issued-by` property that is the domain of
*secondary authority*: the entity that has vouched for the validity of
the email address.  The common case today is that this will be
`browserid.org`, but in the future there may be a small number of secondary
authorities run by browser vendors or trusted organizations.

In a future where BrowserID is widely adopted, secondary authorities are
the exception rather than the rule.

## Implementation Status

At the time of writing, [browserid.org] is a partial implementation of the
system described here.  The key differences between what is described and what
exists are:

  * **certification** - BrowserID is today on requires that authorities host all
    public keys associated with all users.  It will move to certificates
    [in the coming weeks](https://github.com/mozilla/browserid/issues?milestone=6&state=open).
  * **primary suppoort** - BrowserID doesn't currently support primary identity
    authorities as described above, as there aren't any.  In the coming months it will
    defer to 3rd parties properly and
    [gain support for federated primary authorities](https://github.com/mozilla/browserid/issues?milestone=3&state=open).

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
it is to create a new ecosystem of secondaries, which will ultimately
may detriment users.

### No webfinger based assertion verification

The original proposal included two different ways for an identity
authority to vouch for a user's identity.  The first method
was as in BrowserID, via a cryptographic signature.  The second method
was for the authority to publish the user's current keys via
[webfinger] and in this way vouch for them.

  [webfinger]:http://code.google.com/p/webfinger/

The latter approach is ommitted from BrowserID because it is percieved
as both reducing the privacy of the system (RPs would ultimately leak
more information back to identity providers about the user's activities),
and because it increases total system complexity.


