---
title: Is My NodeJS Program Leaking?
layout: post
---


One challenge in building production systems with NodeJS, something
that we've dealt with in BrowserID, is finding and fixing memory
leaks.  In our case we've discovered and fixed memory leaks in various
different areas in our own code, node.js core, and 3rd party
libraries.  This post will lay bare some of our learnings in BrowserID and
present a new node.js library that's targeted of the problem of identifying
when your process is leaking, earlier.


## Who cares, Just restart it!

One thing we've considred in the past is a brute force approach that
just deals with the incremental growth of processes.  Namely, when you
hit a threshold, shut the process down, and start another one up.
With sophisiticated load balancers and a smart deployment
process you can do something like this with zero user visible impact.
There are several why we were unstatisfied with this approach.

First, **it makes deployment more complex**.  If we were to just admit
that leaks happen, then it would not be possible to write a simple and
robust node application.  In the case of browserid, it turns out we
need the ability to *drain* a process and bring another up in its
place anyway, so while we've reserved the right to wield this
sledgehammer in the future.  But we apply a lotta node in a lotta places,
and having to constantly implement restarting in all of our deployments,
even those whose importance wouldn't otherwise warrant it, makes node
less appealing.

Second, **a larger heaps hurt performance**.  As most of the leaks we've
detected we've found in load testing, we've got clear data showing the
steady degradation of the system over time as the heap monatonically grows.
So that argues that the *just restart it* approach should occur
frequently, to ensure you get reasonable performance on your available
hardware.  Having to factor in eroded performance and periodic restarts,
which in turn can lead to load bursts on different nodes, you hurt your
cost model for scaling.

Finally, **it's a vector for more serious problems**.  Memory leaks
can become leaks of finite resources, like file descriptors.  Having a
known weakness such as this in your software means, for instance,
moving a line of code that allocates a file descriptor could suddenly

So in summary, memory leaks suck.

## Finding Memory Leaks in Node, the Algorithm

The most successful, and most primitive, means of finding memory leaks in
BrowserID has involved the following steps:

  1. Realize you have a problem, like V8 can't allocate memory and you die with an `ENOMEM`
  2. Figure out the most concise way to reproduce the problem in the shortest period of time.
  3. Think about what code is excercised at what rates in #2.  Think some more.
  4. Based on your guesses, disable approximately 1/2 of the functionality in your application
  5. Try to reproduce the problem
  6. If you can, disable another 1/2, if you can't enable 1/2 of the 1/2 you disabled
  7. Go back to #3 until you've isolated the problem to a very concise area of code.
  8. Given your new knowledge, work to build a minimal sample which reproduces the problem
  9. Fix it.
  10. Share your fixes with the world, if the problem wasn't in your code.

This is the time proven approach of applying a binary search to find
software defects.  This approach is so straightforward and reliable
that `git` itself implements a `bisect` command that applys a similar
pattern to finding the introduction of a bug within a commit range.

But, this flow isn't particularly good, especially when you compare it
with the tooling available for native code (mmm, valgrind).  There
are two specific subproblems worth solving that can accelerate the
detection and resolution of memory leaks.

## Detecting Leaks

Leaks can be hard to detect, and specifically, steps number 2 and 5 above
are not easy.  In problems we've had with browserid it was required to let a
process run for 5-20 minutes before being able to conclude that a leak was
present with any level of confidence.  The process involves watching RSS usage
of the process over time and taking notes.  Sure there are a thousand ways to
automate this memory sampling, but given the natural cyclic growth and compaction
of the heap in a javascript program, external monitoring of the process requires
a longer period of sampling to allow for confident conclusions.

## Discovering Leaks

Once you've discovered that you have a leak, rather than the brute force bisection 
above, we should have tooling that can help you along.  There is work going on in 
this area, by XXX // talk to mark mayo.

## Introducing gcstats

[gcstats][] is a new library that hooks the V8 garbage collector to
attempt to collect information about your application's memory usage
and make it programatically accessible.

  [gcstats]: https://github.com/lloyd/node-gcstats

gcstats is simple to instal:

    $ npm install

and just as easy to use:

    const gcstats = require('gcstats');

    // ... do lots of stuff ..

    console.log(gcstats.stats());

The output of which will look something like:

    { num_full_gc: 151,
      num_inc_gc: 720,
      heap_compactions: 30,
      usage_trend: '0.5',
      estimated_base: '2001407',
      min: { bytes: 1790624, when: Tue, 07 Feb 2012 04:18:14 GMT },
      max: { bytes: 2006136, when: Tue, 07 Feb 2012 04:19:57 GMT } }

The whole goal of gcstats is to give metrics on memory usage that are
more meaningful that simple sampling of RSS size of the heap.  Here are
what the output fields above mean:

  * `num_full_gc` is the number of full mark and sweep garbage collection
    runs that have occured since the first time gcstats was required.
  * `num_inc_gc` is the number of times that V8 has performed *inc*remental
    garbage collection, referred to within V8 as `scavenge` GC.
  * `heap_compactions` is the number of times, after a full GC, V8 has actually
    compacted the heap and free'd allocated memory.
  * `usage_trend` is a signed magic number that tells the *recent* percentage change in
    your heap.  This number will be described later.
  * `estimated_base` is an estimate of the minimum amount of javascript heap memory
    your program uses.  That is, over the last several heap compactions, how small
    did heap shrink to on average.
  * `min` from the begining of time, what was the minimum amount of memory your
    process has used.
  * `max` same as above, but for maximum.

## How is `usage_trend` calculated?

The most important value above is `usage_trend`, which is my attempt to roll
the data into a single number that can give you an idea of whether, and to what
extent you're leaking.

The key to usage_trend is having a means of understanding memory usage that is
more stable and yields more meaningful results than periodic sampling.  A node
process doing lots of memory allocation can run full mark and sweep GC with
heap compaction every 4-15 seconds.  A mostly idle node.js process may not do
any GC for a much long period of time (60 seconds seems to be the upper bound).

The adaptive GC heuristics of V8 make time based sampling of questionable value,
especially if you have a bursty workload.  Instead of time based sampling, all
measurements taken by gcstats occur immediately after heap compaction.  The more
active the node process, the more frequently sampling will occur.  And hopefully,
samples taken after compaction will be more meaningful to compare.

Usage trend, is then the difference between recent usage (over the
last ~10 post-compaction heap samples) and long term usage (over the
last ~120 post-compaction heap samples), divided by long term usage.
In simpler terms, it's the recent percentage change in memory use when
usage using one of the most stable measurements of usage available.

## Why is this useful?

gcstats gives you a stable number of heap growth over time.  Let's compare the
data given by tracking and comparing the values obtained by simple sampling of
heap usage vs. sampling of 'usage_trend' over time:

### Simple time based sampling




