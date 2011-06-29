title: How BrowserID works

[BrowserID](https://browserid.org) is a federated identity system and
set of protocols that makes it possible for users to prove ownership
of email addresses in a secure manner, without requiring per-site
passwords.  BrowserID is hoped to ultimately become an alternative to
the tradition of ad-hoc application level authentication based on site
specific usernames and passwords.  BrowserID is built by [mozilla],
and implements a variant of the [verified email protocol] ([originally
proposed by Mike Hanson], and evolved by [Dan Mills] and others).

> Before reading about the technical details of BrowserID, it's
> recommended you get a visceral understanding of how BrowserID feels
> from a user perspective with the [myfavoritebeer.org demo], and also
> a developer perspective of integration with the [developer tutorial].

  [myfavoritebeer.org demo]:http://myfavoritebeer.org
  [developer tutorial]:https://browserid.org/developers.html

  This post aims to provide
a readable overview of the functioning of the system.

  [verified email protocol]:http://www.open-mike.org/entry/verified-email-protocol
  [mozilla]:http://www.mozilla.org/about/mission.html
  [originally proposed by Mike Hanson]:http://www.open-mike.org/entry/verified-email-protocol
  [Dan Mills]:http://sandmill.org/
  [tutorial documentation]:https://browserid.org/developers.html

This post will first summarize the key design and technical elements
of BrowserID.  Next, it will explore the various actors in
the system and their inter-relationships.  Finally, we'll walk through
several of the most important flows, including certificate
provisioning (where the user attains authentication material from an
identity provider), assertion generation (where the user uses that
material to tell someone who they are), and assertion validation
(where the website the user is logging into cryptographically verifies
the user's claims).

## BrowserID Features

Perhaps the best way to begin understanding BrowserID is to walk through
the key design features present within it:

  * **Possesion Based Authentication** - In BrowserID, browser state contains
    authentication material, which can be leveraged without using a
    password - making authentication with BrowserID more reliant on a
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
    transactions to third parties nor information leakage.

## Key underlying technologies

  * **Public-key cryptography** - Public key crypto is used both by a
    user's browser to create signed assertions about the user's
    identity, and by identity providers to vouch (via signing of a
    key+email pair) for a user's identity in a disconnected fashion.
  * **Cross Document messaging** - The ability to communicate between
    documents served from different domains is the key feature that
    makes a usable implementation of BrowserID possible *right now*
    without native browser support.


### Players

  * **Primary Identity Authority** (or often just, *primary*) - A
  service that directly provides the user with an identity in the form
  of an email address.  Example primaries include [yahoo! mail] or
  [gmail].  This service is in a clear position to make
  * **Secondary Identity Authority** (or *secondary*) - A
  3rd party service (neither affiliated with the user, nor the primary identity
  provider, nor the relying party)
  * **Relying Party** (or *RP*) - A site that uses BrowserID for authentication
  (relying on the claims of identity authorities).
  * The **Implementation Provider** (or *IP*) - A site that uses BrowserID for authentication
  (relying on the claims of identity authorities).

  [yahoo! mail]: http://mail.yahoo.com/
  [gmail]: http://gmail.com/

## Architecture

**FULL SYSTEM VIEW**

