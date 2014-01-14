title: Improving Persona

Yesterday I put together a community meeting for the [Persona][]
project, which is an authentication system for the web that allows
site owners to "outsource the handling of passwords" and implement a
highly usable log in system in a couple hours.

[Persona]: https://login.persona.org/

The topic was "What I *hate* about Persona", and my goal was to
subvert our over-loaded issue tracker and flooded email inboxes, to
attempt to name some of the top reasons that cause people to not
use Persona everywhere.

The full notes for our conversation are available in [an etherpad][], and this
post attempts to summarize each distinct concern so that we can see these key
problems more clearly, and **end** them one by one.

[an etherpad]: https://id.etherpad.mozilla.org/why-i-hate-persona

## Announcing Persona Office Hours

Before getting into the list, one conclusion from this meeting.  *It was
awesome.*  It's one thing to get an email from a interested community member,
it's another to hear her voice as she describes the reasons why she will not
be using Persona for her current project.

To keep this awesome going, Dan Callahan is going to organize monthly
community office hours that are laser focused at users of the Persona
platform.  It's up to him to define the structure, but early conclusions
are we're going to do this monthly and experiment with different tools
and formats to make it trivial to participate, give feedback, and get
live help from an actual human.

## Naming Persona Pain Points

Here are the issues that were raised, in no particular order.  I will
run a survey to try to understand relative signifigance of these problems.

Also, please note that many of these issues are not new to the Persona
team.  We are actively working on many of these issues.  This call, and
this post, is an attempt to push ourselves to challenge our priorities,
and be more accountable, and get these issues addressed *faster*.

1.  *The persona Popup is not always working*. It's just showing up blank.
2.  *"Persona" the name is confusing*.  Googling it is not helpful.
3.  *Pseudonymous identities as a core product feature*.  This is the notion
    that users typically have a "junk email" address, and we should build
    directly into Persona mechanisms.  Also, If a user simply creates
    one email per site, the UI becomes unwieldy.
4.  *The `watch()` API is hard to understand*.  "null" and "undefined"
    having different meaning is confusing.  It's unclear when `onlogin`
    fires and frustrating it does not always imply user interaction.
5.  *The `watch()` API forces people to do unnatural things*.  The specific
    complaint was pulling emails out of sessions and embedding them
    in pages required more design change than desired.  It should be much
    easier to build auto-login.
6.  *It's hard to manage multiple identities with Persona*.  It is too
    easy to end up with two persona accounts.
7.  *My last used email address at a site is not remembered well*.  Logging
    out of persona eliminates the record of what emails you use where, and
    that is annoying.
8.  *It is hard to share multiple email addresses*.  This can occur when a
    with a site wants to you allow you to
    register multiple email addresses, or set a backup address.
9.  *Logging out of a site does not really log you out*.  Because you stay
    authenticated to persona, user expectation is defied when logging back
    in requires no credentials.
10. *There's no way to force re-authentication*.  "For any site that deals
    in information the user cares about, It's a requirement that you can
    force re-authentication to log in".
11. *This is not me, is not clear*.  When "This is not me" is used to switch
    between two accounts I own, the button language is wrong.
12. *Communication with the community needs to be better*.  Better meeting
    notes with more context, better distilation of current priorities.  Better
    messaging of the things we're working on and their relative resourcing.
    Also, the community meeting wasn't announced as prominently as it should
    have been.
13. *Allow sign into one site to sign you into many*.  This is to support
    a more proper SSO solution for mid-sized businesses and public sites.
14. *Announcements of breaking changes are not prominent enough*.  For the
    community, Persona contracts and APIs sometimes seem to change without
    warning.
15. *It's hard to debug when persona breaks*. (a sentiment echoed strongly
    by IdP implementors).
16. *Users can't understand that login means signup*.
17. *Users don't understand the value of Persona*.  Sometimes it seems like
    facebook connect is just an easier solution.  There is not sufficiently
    clear messaging to explain to users why they should share their email
    and set up what seems like another account.
18. *The popup would be better as a drop-down*.
19. *Seems to not always work right on iOS*.
20. *Persona is confusing for users on shared computers*.
21. *It's not possible to use a shared email address*.  This is specifically
    when there is an email address that many people share.
22. *We want more site branding inside the dialog*.  When a user trusts a
    site but not persona, it would be better if the site could be more
    prominently branded inside the dialog to evoke user trust.
23. *Case sensitivity issues*.  Behavior is not always consistent when
    user's sign in with an email typed in mmixed case.
24. *IdP development is hard*.  Templates for an awesome authentication
    page that works across browsers and devices would help.
