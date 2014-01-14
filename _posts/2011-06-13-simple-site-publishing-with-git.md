title: Simple Site Publishing with Git

This post provides a tiny recipe for small scale site deployment with
git.  If you have a small, mostly static website that you develop using
git, and you would like to streamline the publishing of the site to
a server that you control, then this post is for you.

By the end of this post updating the code on your server will be as simple
as:

    $ git push vm master

### Step 1: pick a user

When you're logging into your server, you'll be doing so as a specific user.
This user account should be one with minimal system access.  I often use
`http` or `www-data` for this purpose, but you can create a new user if you
like.  For the purposes of this tutorial, we'll create a user with the name
`gituser` and refer to him later in this tutorial as the *git user*.

**NOTE:** The rest of this tutorial assumes you are authenticated as this user.

### Step 2: figure out paths

Now we must answer two questions:

  * Where on disk will your repository reside?
  * Where will your webserver serve from (where is the the "document root")?

For the purposes of this tutorial, let's say we're going to serve the
website out of `/home/gituser/www`, and the repository will reside
at `/home/gituser/repo`.

### Step 3: get the code

We need to now seed the server with a clone of your repository, and a
checkout of the code at the paths determined in step two.  First let's
get a "bare" copy of the repository:

    $ git clone --bare git://github.com/lloyd/trickyco.de /home/gituser/repo

**NOTE:** the `git://` url in this case points to an example
repository on github (the trickyco.de repo containing this site's
code), you should replace this with some url pointing at your own repository.

Next, let's get a snapshot of the latest code in repo and drop it in the
specified location:


    $ git --git-dir /home/gituser/repo archive --format=tar --prefix=www/ HEAD | (cd /home/gituser/ && tar xf -)

After this step is done you can peek in `/home/gituser/repo` to
review the git administrative files, and `/home/gituser/www` to see
a copy of the code stored in your repo.

### Step 4: set up automatic site update on push

Now, when the repository is updated ("pushed" to), you want to make
sure that the website is updated too.  In order to do this, we'll use a
`post-update` hook which is a script that runs after every update.

Create a file (owned by the git user) at `<path to
repo>/hooks/post-update` with the following contents:

    #!/bin/bash
    echo "updating server code, booyah."
    rm -rf /home/gituser/www/*
    git --git-dir /home/gituser/repo archive --format=tar HEAD | (cd /home/gituser/www/ && tar xf -)

Now enable the hook you just created by making it executable

    $ chmod +x <path to repo>/hooks/post-update

This will forcefully update the code in your document root at each push.

**NOTE:** in our example `<path to repo>` is `/home/gituser/repo`.

### Step 5: Enable ssh access.

Now you need to add the public keys of everyone who will be allowed to
update the site's code to the `.ssh` directory of the git user.
Become the git user and add public keys to `$HOME/.ssh/authorized_keys` (**NOTE:** you'll
probably have to create the `.ssh` dir if you just created this user).

You can also include some restrictions to minimize what may be done by
folks authenticating as this account, here's a sample line:

    no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty <ssh public key>

When you're done, ensure `authorized_keys` is owned by your git user
and the permissions ar `0600`:

    $ chown gituser.gituser ~/.ssh/authorized_keys
    $ chmod 0600 ~/.ssh/authorized_keys

### Step 6: (optional) Lock down the headless account

git ships with a small "shell" that is designed to restrict what users
logging in via accounts like the one you just created can do.  This is
a useful added security measure, and to enable it you simply change
the shell of the account to git-shell:

    $ chsh -s `which git-shell`

**At this point your server is all set up!**

### Step 7: set up webserver

This step is your business.  Go have a talk with your webserver and 
tell her where the document root is.  Test it.  Look good?

### Step 8: set up your client

Now hop over to you client machine and we'll set up push access: 

    $ git clone git@github.com:lloyd/trickyco.de
    $ cd trickyco.de
    $ git remote add vm gituser@<servername>:/home/gituser/repo

Now you're all done!  Make a test commit and verify you can publish
using git by just pushing to `vm`:

    $ git push vm master

## Variations

**The Ludicrous Simple Variant**: If you want this setup to be even simpler
and won't have multiple users pushing (like if you want use git to
manage content of `public_html` or something), you can skip step #1
and just use your own user account.

**The Not-So-Trivial Variant**: [gitolite][] is a mature project which 
consists of a pile of scripts which does basically what I described
here, but with lots of additional features, and more sophisiticated
administrative control for multiple repostitories.  At this point
you should have a strong understanding of how it works, as it uses
all the same hooks that we've used above.

[gitolite]: https://github.com/sitaramc/gitolite

Happy pushing!






