title: Trivial Deployment With Git

This post composes a tiny recipe for small scale site deployment with
git.  If you have a small, mostly static website that you develop using
git, and you would like to streamline the publishing of the site to
a server that you control, then this post is for you.

By the end of this post updating the code on your server will be as simple
as:

    git push vm master

### Step 1: pick a user

When you're logging into your server, you'll be doing so as a specific user.
This user account should be one with minimal system access.  I often use
`http` or `www-data` for this purpose, but you can create a new user if you
like.

### Step 2: figure out paths

Two questions here, where will your repository reside?  Where will the code
that your webserver serves reside?

For the purposes of this tutorial, let's say we created a user named `jsonselect`
in step one, and we're going to serve the website out of `/home/jsonselect/www`,
and the repository will reside at `/home/jsonselect/repo`.

### Step 3: get the code

We need to now seed the server with a clone of your repository, and a checkout of the
code at the paths determined in step two.  Given the parameters of this example, here's
something that might work:

    $ sudo -u jsonselect git --work-tree /home/jsonselect/www clone git://github.com/lloyd/JSONSelect /home/jsonselect/repo

NOTE the `git://` url in this case points to a repo on github, you should replace this with
some url pointing to the repo you wish to start with.

After this step is done you can peek in `/home/jsonselect/repo` to review the git
administrative files, and `/home/jsonselect/www` to see a copy of the code stored in
your repo.

### Step 4: set up update!

Now, when the repository is updated, you want to make sure that the code is updated too.
In order to do this, we'll use a `post-update` hook which is a script that runs after every
update.

Create a file (as user `jsonselect`) at
`/home/jsonselect/repo/hooks/post-update` with the following contents:

    #!/bin/bash
    echo "updating server code, booyah."
    git --git-dir `pwd` --work-tree /home/jsonselect/www reset --hard HEAD

Now enable the hook you just created by making it executable

    $ sudo -u jsonselect chmod +x /home/jsonselect/repo/hooks/post-update

this will forcefully update the code in your document root at each push.

### Step 5: Enable ssh access.

As user `jsonselect` you need to add the public keys of everyone who will be allowed to update
the site's code.  Simply add public keys to `~jsonselect/.ssh/authorized_keys` (or whatever
user you've created).

You can also include some restrictions to minimize what users are allowed to do via this account,
here's a sample line:

    no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty <ssh-key>

when you're done, ensure the permissions and ownership of `authorized_keys` is correct:

    $ sudo chown jsonselect.jsonselect ~jsonselect/.ssh/authorized_keys
    $ sudo chmod 0600 ~jsonselect/.ssh/authorized_keys

### Step 6: (optional) Lock down the headless account

git ships with a small "shell" that is designed to restrict what users logging in via
accounts like the one you just created can do.  This is a useful added security measure, 
and to enable it you simply change the shell of the account to git-shell:

    $ sudo chsh -s `which git-shell` jsonselect

**At this point your server is all set up!**

### Step 7: set up your client

Now hop over to you client machine and we'll set up push access: 

    $ git clone git@github.com:lloyd/JSONSelect
    $ cd JSONSelect
    $ git remote add vm jsonselect@<servername>:/home/jsonselect/repo

Now you're all done!  Make a test commit and verify you can publish using git by just
pushing to `vm`:

    $ git push vm master

enjoy!







