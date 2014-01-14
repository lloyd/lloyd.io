title: Improving BrowserID UX

[BrowserID](https://browserid.org/) poses interesting user experience
problems.  The first release was sufficiently complete to provide a
usable system, but we've learned a lot from community feedback and
user testing.  Now we can do better.  This post proposes a new set of
UX diagrams intended to solve several concrete UX problems.  The goal
of this post is to start a discussion which will lead us to
incremental improvments in BrowserID's UX.

## The proposal

Here is a diagram, that is what the next version of BrowserID might
look like:

 <center>
 <a href="/posts/i/uxiter.jpg">![a lil' ux thumbnail](/posts/i/uxsm.png)</a>
 </center>

Rather than going through every single interaction the diagram should
speak for itself (click to enlarge).  The rest of this post will talk
through four distinct problems in BrowserID.

### #1 What Password?

**The problem:** BrowserID provides users with an *account* even
though we don't call it that.  The key data that is kept track of
per-user is a set of related email addresses, and a password.  This
state allows BrowserID to obviate the need to re-verify email
addresses when you move to a new device.

It's been reported repeatedly from user studies and the community that
when we ask for an "email address" and a "password", users will believe that
the password we're asking for is their *email* password.

**A solution:**  The diagrams above do a couple things to help the user
understand that a BrowserID password is distinct from your email password:

  * The user selects a BrowserID password after clicking through the email
    link, not inline in the dialog.
  * When the password is selected, BrowserID is more heavily branded,
    and the language attempts to make it clear that this is a **new**
    password.
  * A more aggressive change is proposed in the password reset flow which
    would have a user, after forgetting their password, choose a new password
    on browserid.org, then verify that password inside the dialog (a bit of
    a sledgehammer, right?).

### #2 Don't Repeat Yourself

**The problem:**  At present, when you use BrowserID and either have not
used it before, or need to sign in (i.e. this is a new device), you provide
the email address you'd like to use.  After providing this email and completing
sign-in or verification, we present you with the identity picker.
Why does the user in this case have to type in their email address, and 
then go and select it?  

**The solution:** In the case of re-authentication or initial email
verification, the flows proposed here omit the email picker in these
cases and directly transition a user to a logged in state.

### #3 Streamline first use
 
**The problem:** *BrowserID* is a new platform.  This means every user
of the system will start off as a first time user.  The current flow
involves about six screens with several fall-off points for new users.  

This is broken.  We should better optimize the first-timer flow.

**The solution:** Fixing *What Password?* helps.  Fixing Don't Repeat
*Yourself* also helps.  Finally, by asking for an email address first,
we can eliminate the need for a specific "Create Account" link.  The
proposal here is to transition login flow appropriately depending on
whether the provided email is known.  With a little polish, this flow
might be better for first timers, users who've forgotten passwords,
and returning users alike.

### #4 Apply knowledge!

**The problem:** It is reasonable to assume that if I use
`lloyd@hilaiel.com` to log into `amazon.com` today, I'll want to do
the same thing tomorrow.  Currently BrowserID doesn't help you sign in 
faster by keying off your previous behaviors.

**The solution:** Without ever allowing information about previous
behaviors to leave the device, we can keep track of what identities
are used for what sites, and use this information to optimize the
order of and default selected identities in the email picker.  Given
the expected success of this trivial heuristic we can make the default
selected id more visually prominent.  In the case where the guess is
correct the user should be able to click a button, or hit enter to
confirm and sign in.

Further, even if we have no specific knowledge of what identity a user has
used in the past for a specific site, we can optimize ordering based on 
global identity usage [frecency].

  [frecency]:http://en.wiktionary.org/wiki/frecency

## Open issues

There are a couple known problems that this iteration does not 
attempt to address:

### Temporary sign-in/shared computers

Persisting authentication in-browser is a problem when computers are 
shared, either informally or in a public terminal scenario.  These issues
can be mitigated by including an opt-in *remember me* checkbox.  This 
solution seems like a good starting point because it should be familiar
to users and directly addresses a large portion of the problem.  A solution
to this is left out of the above proposal because we have some
[other ducks] to get in a row first.

  [other ducks]:https://github.com/mozilla/browserid/issues?milestone=6&state=open

### Password reset and transitive email compromise

One potential weakness in BrowserID occurs when a user looses control
of one of their email addresses.  In today's world, an attacker would be 
able to visit sites where that address was the primary address - used for 
email-based password reset - and gain access to the user's account using 
the captured email to reset passwords.  

With BrowserID, compromise of one email address could potentially the
compromise of all of a user's emails if not handled properly.  The
current system is not vulnerable to transitive compromise because upon
email reset, we only grant the user access to the email address
used to perform the reset.

The problem that arises with the present approach is that a user must
manually re-add and re-verify all of their email addresses.  This is
percieved by some as a usability problem, but is left out of the
diagram above because the right course of action isn't yet clear.

## Now what?

As mentioned, the purpose of this post and diagram is simply to lay
bare the UX challenges we're facing in BrowserID and to solicit
thoughts from the community.  If a conversation starts which leads to
superior solutions, then this post was worth writing.  So share your
thoughts, eh?







  

