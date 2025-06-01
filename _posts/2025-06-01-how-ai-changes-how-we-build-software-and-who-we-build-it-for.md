---
title: How AI Changes How We Build Software and Who We Build It For
layout: post
---

This is an exploration of the different product requirements when you're building a platform for humans versus when you're building a platform for AI users. Software testing platforms are a great concrete instance we can analyze to understand this emergent dynamic.

![Robot testing an iOS application](/i/ai-testing-robot.png "AI-powered testing in action")

Consider the industry-leading human-targeted platforms that have existed for a while, like Selenium and Appium. They support different programming languages—lots of different programming languages—so that the human user can find something they're comfortable with and be operating in a familiar and native environment.

> "For an AI user, they are comfortable with everything. So there is no need to have a myriad of language bindings for AI users because they simply don't care."

It's not a feature, it's a mess feature because it leads to an unnecessary persistence of development environments and fragmentation in how people use your testing platform. So they're unable to easily take one user's set of tests and compare it to another because those sets of tests could be in completely different languages.

## Declarative vs. Generative

In fact, the probably optimal environment for the AI user could be declarative. That is, whereas for human users, we expose these programming language hooks and these hooks make the system perfectly generative. So a human user can perform arbitrary logic between each step. For AI, it's actually a liability.

The issue with declarative systems is that essentially we're inventing a DSL. And that DSL might not be complete for all use cases. And that DSL might consist of steps that look like "wait for" and then accept either a CSS selector or an XPath selector. Or steps like "wait for invisible" that accept the same, or "send click" or "send text" that communicate in terms of selectors.

However, it's pretty straightforward to build in declarative mechanisms of reuse. For instance, you could create libraries—declarative libraries that are named and accept parameters and output parameters. And the benefit of that is you can have the AI customer be diligent by using and reusing these. And they can drastically decrease the cost of adapting the tests when the application DOM changes.

This is interesting because it's one case where the AI consumer benefits from abstraction and reuse. Where generally speaking, the AI consumer can handle enormous amounts of complexity, getting these tests right, understanding wait conditions and how to interact with the app can be extremely complex and hard to get stable and right. So this is a place where AI generally benefits from reuse.

## Recording Tools Become Obsolete

Most industry-leading browser-targeting testing platforms offer recording tools that let you go and interact with the web page as a human does, and these platforms record those interactions for you. And the result is a serialized test complete with selectors and stuff. And that's pretty cool.

But in the case of an AI, it doesn't actually need this tool. What an AI can do is if it has access to drive a browser, it can capture a screenshot of the viewport and interrogate the DOM and analyze those two elements in parallel to figure out how to interact with the DOM ideally in order to get the desired result.

The key point here is that the AI sees things differently. Having the AI drive the recording tool would be an unnecessary error-prone step. So test generation tools become totally obsolete.

## The Cost Economics Change Everything

The typical human flow would be: create a first version of this test via recording. Then once that's complete, the human would look at the results, run the results, observe how it performs, and improve it. They would make sure that appropriate success criteria exist. They would go in and identify areas where suboptimal selectors are used based on ephemeral compiler-generated IDs. They would figure out how to correct those. They might go and interact with the engineering team when test IDs don't exist for robust selectors.

This notion of clean and stable and robust and reliable locators is predicated on the fact that these tests are expensive to generate. It would be costly to throw them away and rebuild them. So thus, we have to do all of this dancing in order to try to make your tests robust and resilient.

But when you decrease the cost of throwing the test away and regenerating it, you also decrease the need for the tests to be robust under significant product changes. Sure, you want them to be somewhat robust, but you actually don't mind updating 12 tests every week in order to adapt for new product changes.

## The AI Native Flow

In the AI-facilitated test authoring environment, what you really want is to be able to tell the AI assistant, "hey, test this flow." Or even more generally, "define a new set of tests required to exercise this new feature and then work through them one at a time."

When the machine has a concrete feature that they want to test, ideally, what the machine wants to do is read the human language specification, load the thing that they're testing, and be able to look at it. What that means is: give me a screenshot image of the application I'm testing and give me the structure of it.

Once the AI has the DOM and a screenshot of the target test application, and it has its instructions of what it's testing in hand, it can analyze what the first step should be, starting with the image, and then once it understands the image and where it wants to interact, it can dig down into the DOM and discern what DOM portions are relevant given what it sees.

The AI is iteratively building up the test. And it's been given this headless, completely headless tool that it can use to analyze the application in its native language. And the fascinating part here is the native language of the AI is much closer to the native language of the app.

The end result of this process would be ultimately the series of steps determined empirically and iteratively over the course of maybe 30 seconds up to two minutes that can then be saved. Once saved, the test can be rerun to verify it's reproducible and solid and you're done.

> "Meaning creating a single test in one of these clunky platforms would be a 20 to 30 minute process. Creating a new test with this next generation platform literally becomes a 30 second process."

## The Guard Rails Problem

An empirical observation of building this declarative system for use by an AI is that if you give it tools, it will use them. And if you give it complicated tools, it will use them complicatedly. So, for instance, if it has a CSS selector tool and an XPath selector tool, it will use both. If you also give it an execute JavaScript, it might go and write entire functions and jam them into your test file. The result of that tends to be complicated and error-prone.

The question becomes, how do you constrain the set of features the AI has to force it to do things in a simple, efficient, and understandable fashion? Anytime it resorts to JavaScript, that suggests probably a hole or an opportunity in your declarative structure.

## The Bigger Picture

To zoom way out and synthesize the bottom line for this conversation: it feels like we were in a world where human engineers were the clients of our products, of platform products, of our testing products. That world is gone. And our testing products in this small example need to evolve. And they don't necessarily need to evolve incrementally. They need to die and be replaced with a brand new generation.

Which means we actually need to throw out a lot of these Appium drivers and Selenium drivers. And while we're using testing as an example to explore this idea, it's only one representative area.

The new tools are not going to be usable efficiently by a human. They're going to be optimized for use with an AI. They're going to be designed so that a human can fully understand, inspect, and dig in. But just like doing manual math in the workplace, actually wielding these tools manually would be akin to writing assembly language nowadays. It can happen in very rare circumstances and there is a significant advantage to someone capable of doing it, but it's not how you work day-to-day.

Without AI, these new tools are completely useless. They are a step back from things that already existed. But with AI, they are a 10 to 100 times force multiplier. Meaning creating a single test in one of these clunky platforms would be a 20 to 30 minute process. Creating a new test with this next generation platform literally becomes a 30 second process.

## The Economic Disruption

The final interesting fallout of this discussion is this test platform I described can itself be built in under five business days. I personally have sketched it out in about 10 hours of tinkering. And that involves building the entire system, integrating session management, supporting multiple simultaneous sessions in a single test. It involves a variable substitution system. It involves reusable subflows. It involves run diagnostic output and it involves reports generated for a single run and multiple runs and a command line driver including the ability to trace tests and for each step taken to dump the state of the DOM.

This declarative platform can be put together by one smart engineer in a weekend, be perfectly customized for the company's needs. And given the replacement cost of the platform itself is so low, the make versus buy decision becomes a lot more interesting. Specifically, buying external products just become generally the wrong thing to do.

> "This declarative platform can be put together by one smart engineer in a weekend, be perfectly customized for the company's needs."

## The Broader Implications

The conclusions here at a high level are that building for AI or cyborg users is extremely different than building for human users. The tools that result are 10 to 100 times more effective and efficient. And the tools themselves are so cheap to build that they can be built by the companies who need them and be 100% custom.

| Platform Consideration | Human Users | AI Users |
|----------------------|-------------|----------|
| **Language Support** | Multiple language bindings essential | Single interface sufficient |
| **Test Generation** | Recording tools + manual refinement | Direct DOM + screenshot analysis |
| **Robustness Requirements** | High - tests expensive to recreate | Moderate - cheap regeneration acceptable |
| **Development Time** | 20-30 minutes per test | 30 seconds to 2 minutes per test |
| **Interface Complexity** | Simplified, intuitive UIs needed | Raw, powerful APIs preferred |
| **Error Handling** | Detailed error messages required | Basic feedback sufficient |
| **Documentation** | Extensive tutorials and examples | Minimal - learns through experimentation |
| **Abstraction Tolerance** | Benefits from abstraction layers | Comfortable with complexity |
| **Success Criteria** | ✅ Both require reliable, functional outcomes | ✅ Both require reliable, functional outcomes |
| **Maintenance Needs** | ✅ Both require ongoing platform support | ✅ Both require ongoing platform support |

This speaks to some of the ideas in industry where software begets more software. So it's not like we're going to simply run out of jobs because we have all of the AIs. The point is there's now we can all do more and we can do it better. Rather than spending a month building on top of a third-party platform, we're spending a week building our own platform and applying it to a concrete problem. The results can be far better, far more custom.

What platforms in your stack were built for humans that could be reimagined for AI?

lloyd