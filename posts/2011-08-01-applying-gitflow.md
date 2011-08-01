title: Applying Gitflow

This post will describe the release management processes of the
BrowserID project, which is based on
[gitflow](http://nvie.com/posts/a-successful-git-branching-model/).
The [BrowserID](https://browserid.org) project has recently become a
high visibility venture, with many sites actively using the service
for authentication.  This overnight change from experiment to
production presents us with a dilemma: the project is still in
early stages and needs to be able to rapidly iterate and evolve, but
at the same time it must be stable and available for those who have
started using it.  This post describes how we'll resolve this dilemma.

**NOTE:**  Some of the hostnames mentioned in this post might not be live yet,
but they'll be up RSN.

## Goals

The following goals shape the design of the release process:

  * *Stable*: Only tested changes make it to production.
  * *Public*: The QA process should be open to the community (sites need to be forewarned of interesting changes, and have an opportunity to test them before they go live)
  * *Nimble*: There should be a patterned way to rapidly move high priority fixes to production.
  * *Fast*: The delay between a feature being complete to it entering production should be short (less than 2 weeks).
  * *Parallel*: Production hotfixes, feature development, and beta testing should never interfere with each other.

## Gitflow, and our tweaks

Gitflow is a lightweight branching methodology for use with git.  It *out of the box* provides a framework to achieve several of the above goals.  If you're not familiar with gitflow, you should [read about it](http://nvie.com/posts/a-successful-git-branching-model/).  The executive summary is this:

Gitflow is a branching technique for use with git that is designed with the expectation that there is a centralized repository.  In gitflow there are two main branches, the `develop` branch and the `production` branch.  The `production` branch (often called the *master*) is always stable and ready for production, while the `develop` branch is the first place features land.  Features typically are performed on their own feature branches so that `develop` remains a consistent integration target for developers, but small standalone commits may be made directly on `develop`.

The mechanism by which commits move from *development* to *production* are `release` branches.  These branches are ephemeral, they fork from develop at a point in time and exist until they are vetted.  Once a release branch is ready, it is merged into production, the branch label is deleted, and a tag is created at the merge point for future reference.  As fixes are made on a release branch they should be immediately back-merged to `develop` to keep it current.

The final important bit of gitflow is a pattern for getting high priority fixes into production *fast*.  The mechanism to support this is `hotfixes` which are branches which originate off of production, are tested, then merge into both `develop` and `production`.

In short, Gitflow is an excellent mapping of modern software best practices onto git.  Despite this, we did make a few tweaks:

### Our main branch names

We renamed the *development* branch from `develop` to `dev`, and the *production* branch from `master` to `prod`.  There are two motivations for these renamings:  first `dev` and `prod` are short, well understood, and easy to type.  Second, and more importantly, there are many different expectations for the master branch.  Many consider the `master` or default branch to be where unstable changes land.  A pull request on github, for instance, is typically something you target at the `master` branch of a project.  With Gitflow, `master` means *production* and the only two ways that changes get there are via hotfix or release branches.  *The problem is* by changing the semantics of the `master` branch, you make it harder for your community to contribute.

What if we were to flip the meaning of master the other way?  What if `master` was the *development* branch, and we created a new name for the *production* branch instead (leaving `master` and `production`)?  While this makes more sense to me personally, others with expectations about how gitflow works would be confused.

The best solution seems to be to throw away the `master` branch, and create two explicitly named branches to represent *development* and *production*.  Finally, the absence of a `master` branch itself is useful, as it serves as a conspicuous indicator to the causal visitor that some type of new-fangled convention is in play.

### Not releases, but trains!

Another divergence from gitflow is in the suggested names of release branches.  While gitflow suggests `release-XXX`, we choose to name them `train-XXX`.  This is a trivial change which hopefully reinforces that a time based rolling release model is in play.

## The Approach

BrowserID will combine gitflow, a one-week train
model, and a three-enviroment server setup to achieve the above
goals.  Here's how it will work:

There are three environments hosting code at different stages of maturity:

  * `browserid.org` (*production*) - runs tested code from the tip of the `prod` branch.
  * `diresworb.org` (*beta*) - runs code from the latest branched train in the repo, and is
    always ready for testing.
  * `dev.diresworb.org` (*development*) - runs the latest code from the `dev` branch, and is
    updated automatically upon commit.

Every week (on thursday morning), a new train will start rolling.
Specifically, that means the past train (that has been on beta for a
week) will be merged into production, tagged, and published - and a
new train will be split off of `dev`.  Each train has a monotonically
increasing version number, and train branches have the form `train-123`.

Significant changes from the previous train will be documented in the
ChangeLog which will be manually reviewed each thursday morning to ensure
that it's a concise and complete summary of what has changed.

Other than some bugzilla based processes by which mozilla QA will be
able to bless or derail trains, *this is it*.  The rest of the details
(i.e. hotfix branches and feature branches) will just follow the
conventions proposed in gitflow.

## tl;dr;

The key takeaways **for developers** or contributors should be:

  1. changes go into the `dev` branch and the same should be the target of pull requests.
  2. the `dev` branch should stay in a consistent and functional state, always.  If you have a larger
     feature you're working on, phase it as granularly as possible and use feature branches.
  3. use `--no-ff` as proposed in gitflow when merging feature branches to dev to increase the informational value of history.
  4. in the case of a critical security or bugfix, hotfix branches should be used.

The key takeaways **for QA** and site owners that use BrowserID:

  1. code will be pushed into production once a week, roughly thursday morning pacific time.
  2. the next candidate for production is always available to test on [diresworb.org](https://diresworb.org).
  3. to derail a train with an issue you consider a blocker, [file an issue](https://github.com/mozilla/browserid/issues) and label it `beta_blocker` (tee-hee).
  4. as soon as a commit which addresses an issue lands on `dev`, it can be regressed on [dev.diresworb.org](https://dev.diresworb.org).

## Next steps

There's a lot described here, and a lot missing.  This process is being implemented now, and we'll make changes as we find things that could work better.  Subsequent to that, we'll work on integrating CI and higher level processes.

What do you think?
