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
  * **Federated** - Both sites wishing to use BrowserID for
    authentication and sites wishing to provide authentication
    services have a high degree of autonomy in making decisions about
    whom to trust and how much.
  * **Distributed** - A user authenticating to a website using an
    identity provider can occur in relative isolation without network
    transactions to third parties (so it's efficient) nor information
    leakage (and private).

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
     validity interval generating a JWT encoded certificate.
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

> **Assertion Generation diagram, Numbered**

### Assertion Verification

*Assertion Verification* is interesting bit of a user login.  It is
the process by which a *Relying Party* can verify that an assertion
that a user owns a certain email is valid.

>  **Assertion Verification diagram, Numbered**

## Implementation Status

**XXX**: Dis

## Differences from the Verified Email Protocol



### Secondaries de-emphasized.

**XXX**: Talk about how we've de-emphasized the federation of secondaries and said
that this is the job of either the IP builders or browser vendors.

### No webfinger based assertion verification

**XXX**:Talk about how we've thrown out the webfinger based serving of public keys
for a user.



