title: How BrowserID works

[BrowserID](https://browserid.org) is a federated identity system and
set of protocols that makes it possible for users to prove ownership
of email addresses in a secure manner, without requiring passwords.
BrowserID is hoped to ultimately become an alternative to the
tradition of per-site usernames and passwords.

BrowserID is built by [mozilla](http://mozilla.org), and implements a
version of the [verified email
protocol](https://wiki.mozilla.org/Identity/Verified_Email_Protocol).
([Mike Hanson] proposed the protocol, and [Dan Mills] and others have
helped evolve it) Good [tutorial
documentation](https://browserid.org/developers.html) exists on the
BrowserID website, while this post aims to describe the functioning of
the system.

  [Mike Hanson]:http://open-mike.org
  [Dan Mills]:http://sandmill.org/

## Dramatis personæ
   
  * **Primary Identity Authority** (or often just, *primary*) - A
  service that directly provides the user with an identity in the form
  of an email address.  Example primaries include [yahoo! mail] or
  [gmail].  This service is in a clear position to make
  * **Secondary Identity Authority** (or *secondary*) - A
  3rd party service (neither affiliated with the user, nor the primary identity
  provider, nor the relying party)
  * **Relying Party** (or *RP*) - A site that uses BrowserID for authentication
  (relying on the claims of identity authorities).
  
  [yahoo! mail]: http://mail.yahoo.com/
  [gmail]: http://gmail.com/

## Architecture

**FULL SYSTEM VIEW**

