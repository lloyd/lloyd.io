---
title: Evolving BrowserID Data Formats
layout: post
---

After a couple years of experience, we (the identity community that
supports Persona) have amassed a small collection of changes to the
data formats which underly the BrowserID protocol.  This post is a
migration guide for maintainers of BrowserID client implementations.


(NOTE: This summary is based on the work of Dan Callahan, Dirkjan Ochtman, and
others.)

The motivation for these changes include:

1. **Standards Conformance**: We've been tracking the [JOSE][] family of specs
   from the beginning.  They've drifted.  Tighter conformance suggests a greater
   chance of reusable cryptography code.
2. **Extensibility**: We'd like to fully support experimentation and extension
   by allowing *extended claims*: identity providers should be able to include
   information in certificates, and RPs in assertions.
3. **Efficiency and Consistency**: The initial implementation of BrowserID encodes
   binary data in multiple different ways, resulting in needless complexity and
   a bloated representation.  Also, there is needless precision in time representation.

  [JOSE]: http://datatracker.ietf.org/wg/jose/

## Key Representation

Currently, DSA keys are represented thus:

{% highlight json %}
{
  "algorithm": "DS",
  "y": "afdc3103...5028",
  "p": "d6c4e50...7b401",
  "q": "b1e370...55ab3b",
  "g": "9a8269...9cf6ef"
}
{% endhighlight %}

We will move to the following representation:

{% highlight json %}
{
  "kty": "DSA",
  "y": "cob47Q...XNcTw",
  "p": "1sTlBF...Be0AQ",
  "q": "seNw9k...Vqzs",
  "g": "moJpqy...Zz27w"
}
{% endhighlight %}

Specifically, the important changes are:

1. instead of `algorithm`, we'll represent key type using the `kty` key (see [v19 of the JWK spec][])
2. instead of abbreviated algorithm names, (DS), we'll use the full acronym (DSA).
3. All binary data is to be represented using unpadded [base64url encoding][] (NOTE: this is *not* base64);

  [base64url encoding]: http://tools.ietf.org/html/rfc4648#section-5

Other than these changes, the property names of RSA or DSA keys is unchanged.  There is no
need to seperately cover RSA, because changes are completely analagous.

  [v19 of the JWK spec]: http://tools.ietf.org/html/draft-ietf-jose-json-web-key-19#section-3.1

## Certificate Representation

Recall all signed objects in browserid are represented thus:

    <header>.<payload>.<signature>

The external representation of a signed object is, and will continue to be,
these three components base64url encoded, joined by periods (`.`).

Header and signature segments will be unchanged, but there are a couple changes to the
payload.  Previously, the payload looked something like this:

{% highlight json %}
{
  "public-key": { "...": "..." },
  "principal": {
    "email": "user@example.com"
  },
  "iat": 1389964286666,
  "exp": 1421500286666,
  "iss": "example.com"
}
{% endhighlight %}

We will move to a representation that looks like this:

{% highlight json %}
{
  "pubkey": { "...": "..." },
  "sub": "user@example.com",
  "iat": 1389964111,
  "exp": 1421500111,
  "iss": "example.com"
}
{% endhighlight %}

Note that key representation is omitted in these examples as changes are outlined above.

The important changes are:

1. rather than representing the user's identity under `principal.email`, we now use the subject field (with a key of `sub` [from the JWT spec][]).
2. all times are now represented in [POSIX time][] (seconds since the 1970 epoch).
3. the user's public key is provided under a `pubkey` property.

  [from the JWT spec]: http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-14#section-4.1.2
  [POSIX time]: http://en.wikipedia.org/wiki/POSIX_time

## Assertion Representation

What we typically refer to with the shorthand of "assertions" are encoded bundles, called *Backed Identity Assertions*, which look thus:

    <cert header>.<cert payload>.<cert signature>~<assertion header>.<assertion payload>.<assertion signature>

That is a Backed Identity Assertion includes an Identity Certificate
whereby an identity authority vouches that a specific subject (typically a person)
controls a specific keypair - combined with an Identity Assertion assertion whereby the
subject claims she owns a specific identity and wishes to prove it to a specific "audience"
(typically a website) at a specific time.  Note, Identity certificate and assertion are separated
with a tilde (`~` - U+007E).

The changes to assertions include key representation and certificate representation
as described above, as well as some minor changes to the assertion payload.  Previously
a payload may have looked something like this:

{% highlight json %}
{
  "exp": 1385103958923,
  "aud": "http://123done.org"
}
{% endhighlight %}

Which will be change to look like this:

{% highlight json %}
{
  "iat": 1385103839,
  "exp": 1385103959,
  "aud": "http://123done.org"
}
{% endhighlight %}

The relevant changes in assertion payload include:

1. All times are represented in [POSIX time][]
2. Issue time (`iat`) is included to make the validity period of an assertion explicit.

## Further Reading

This post describes a subset of planned changes which affect two
different groups: *Client implementations* of BrowserID (which
generate keypairs, and create Backed Identity Assertions) will need to
be updated, and  *Identity providers* will need to update their support
documents (with a new representation of a public key), and will need
to generate Identity Certificates which conform to the new formats.

There is a final set of changes to support document representation that
will allow more graceful key revocation and rotation by identity providers, that
is not covered in this post.

For more in depth coverage of the updated BrowserID formats, you can
refer to the [in progress specification update][].  Finally, you can
have a look at the [new reference verification library][] that implements
verification of assertions which conform to this new format, while retaining
backwards compatibility.

  [in progress specification update]: https://github.com/mozilla/id-specs/tree/greenfield/browserid
  [new reference verification library]: https://github.com/mozilla/browserid-local-verify

Finally, this transition will begin slowly over the coming months.  First a new
verifier will be deployed, then we will migrate client implementations as we
reach out to identity providers to migrate.
