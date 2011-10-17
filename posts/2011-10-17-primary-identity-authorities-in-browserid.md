title: Primary Identity Authorities in BrowserID

There have been some misperceptions regarding [BrowserID](https://browserid.org), specifically
around the claim that it is a fully *distributed* authentication system.  The source of this
confusion is the presence of central servers in the current incarnation of BrowserID.  To 
clarify, the role of these centralized servers in BrowserID today is to make the system immediately
usable - allowing users to use *any email address* to log into *any site* from *any browser*, from
day one.  The design goal of the system, however, is to quickly render these servers obsolete: to do this we
must migrate client logic from web resources served by browserid servers directly into the 
browser, and we must migrate the verification and certification of email addresses from 
BrowserID servers to the servers of identity providers.  These two tasks are going to take a while as they
require the participation of browser vendors and identity providers, respectively.  This 
post addresses the latter problem by proposing the precise means by which identity providers may
directly vouch for their user's email addresses. 

## Overview

[BrowserID](https://browserid.org) is a distributed authentication system from Mozilla.  It 
lets users leverage existing email addresses as the means by which they identify
themselves to websites.  Public key cryptography allows a user to identify 
themselves without requiring per-site usernames or passwords.  A key design 
goal of BrowserID is that once fully deployed, no central 3rd party servers are required
to facilitate the authentication of a user to a website.  Specifically, the goal is that 
the process of authenticating to website is a detached two party transaction whereby a 
user is directly provisioned with a certificate from their identity provider which proves
their ownership of a given email address.  This certificate can then be used to generate
an *assertion* which can be sent to a website to verify this user's ownership of the 
email in question.  

In order for this system to work, existing identity providers (like gmail, yahoo mail, twitter,
facebook, and countless others), would need to add features to their web applications.  Concretely,
the following are required:

  1. **A declaration of support**: An IdP must explicitly declare, in the form of a document hosted on their domain, that they support BrowserID.
  2. **A public key**: In order to allow 3rd parties to verify certificates issued by the IdP, they must publically host the key with which those certificates are signed.
  3. **Authentication webpage**: A user must be able to interact with their IdP at the time that they are logging into a website to acquire a *certificate* that is signed by the IdP and proves their ownership of an identity from that IdP
  4. **Provisioning webpage**: Once authenticated, a webpage capable of provisioning the user with certificates must be provided.

## Interactions

To make the above requirements more accessible, it's useful to walk through the interactions that occur
during BrowserID authentication with a focus on the primary's involvment in the process.

### First Time BrowserID Authentication with a Primary IdP (no session)

In this case, the user, Bob, visits a website, [myfavoritebeer.org](http://myfavoritebeer.org), and
wishes to authenticate.  

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

In this case, the user has not recently visited `exampleprimary.org`, and thus does not have an existing authenticated session.  In this case, the user must authenticate inline during the authentication process.

### First Time BrowserID Authentication with a Primary IdP (with session)

A more ideal variation of the first case, in this case the user has recently visited their IdP in their browser (which is likely if the provider is something the user visits often, like a social networking site or webmail).  In this case, step #8 completes successfully, and the flow skips directly to step #15.

### Re-provisioning an Previously verified Email Address

In this case the user has several email addresses in use with BrowserID, and selects one for which the provider has BrowserID support.  The difference from the main case is in steps #1-#4.  Rather than the user having to type in their email address, they'll select it from a list.   Subsequent to this, the same flow as above applies (and varies depending on whether the user has an exisiting session.

## Primary IdP Responsibilities

Let's dig into the specifics of what the 




This post proposes how websites that provide users with an identity in the form of an 
email address can become first class 

