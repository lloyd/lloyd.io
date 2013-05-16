title: What Is Persona?

<abstract>
I've worked on the Persona service for over two years now.  My involvement began on a fateful airplane ride with the [father of the specification][] that would become Persona.    Shortly after, on April 6th 2011 I made the [first commit][].  On July 1st 2011 [Mike Hanson][], [Ben Adida][] and I had operationalized the original spec, made some decisions, and [I wrote a post on what it is and how it works][].  

We've come a long way: over 20 people [directly contribute to persona][] on a regular basis,  it's supported by a community of thousands, and it's got an extremely hopeful growth curve.  The striking thing, the subject of this post, is how Persona has always been guided by a consistent and clear vision.  The community passionately defends this vision, they know when a feature or change does not fit the vision, and despite being separated by continents and cultures - I believe this vision is what has held the project together and let it grow into what it is today:  An audacious attempt to change the world that actually has legs - an attempt to kill the password, to keep people safer, and to make trying new things online fun again.

So what is this vision?  How succinctly can it be expressed?  This post is my attempt to define the Persona vision, I would love to hear how others express this very same thing.

[father of the specification]: http://www.open-mike.org/entry/verified-email-protocol
[first commit]: https://github.com/mozilla/browserid/commit/1aa343
[I wrote a post on what it is and how it works]: http://lloyd.io/how-browserid-works
[directly contribute to persona]: https://github.com/mozilla/browserid/contributors
[Ben Adida]: http://adida.net
[Mike Hanson]: http://open-mike.org

</abstract>

## Persona is an Easy way to sign in

We promise it will be *easy*.  For users this means that they will have an experience using Persona where they will never get lost.  The next step will always be obvious.  And it will be fast:  *logging into a new site shouldn't take more than a minute*.

For publishers, this means they will have more conversions.  *More users will be willing to try their site when they use Persona*.

The fulfill this promise we must continue to optimize the sign-in flow.  We maximize successful dialog interactions and minimize the time it takes users to get through the experience.

## Persona lets you use your existing email account

For users and publishers, this is the critical element that makes Persona *easy*.

For developers this is an important promise of Persona - it allows email providers who users already trust to play a larger role in sign-in transactions.  This allowance is balanced and fair - email providers have an opportunity to extend and enrich their brand and services, but they must do so while respecting the privacy of their users.

## Persona is an Experience, not an Account

Users don't want a new account that they do not understand.  They do not want to create this account while they're logging into a website, they *just want to log into the website*.  Realizing this promise means we must refine the UI and branding balance to make users recognize the experience of signing in with persona as familiar, but they never must feel like it's a new *account* they are creating or must maintain in some way.  

Publishers don't want a new brand in their sign-in flow that user's don't recognize.  This is confusing for users.  For publishers, persona must allow them them to keep their brand prominent throughout the sign-in flow.

To realize this promise of Persona as an *Experience*, we must ensure the Persona brand has only enough weight to instill confidence and clarity in users, no more.

## Persona is Internet Infrastructure

For users this will mean that Persona will work everywhere the web is.  It will be part of their browsers - chrome, firefox, or IE - it will work in their apps - iOS or Android - It will be this new thing that they don't really understand, but they sure are glad someone made logging in better.

For publishers this means they are not locked into a proprietary technology.  It means they can switch to Persona or away from Persona easily, and they can trust that as the technology evolves it will always do so with a deep consideration for them and their users.

For browser vendors and application authors, this means they can adopt the technology and provide a seamless user experience - one that does not involve putting the branding of competing technologies above their own.

To keep this promise, Mozilla must responsibly walk a tightrope of leveraging its own brand to forward the service, leveraging the service to forward it's own products, and respecting the careful boundaries that exist which will allow website owners, browser vendors and email providers to trust Persona.
