---
title: How AI Changes How We Build Software and Who We Build It For
layout: post
---

Building software used to be about humans. Now? We're building for our AI teammates.

![Robot testing an iOS application](/i/ai-testing-robot.png "AI-powered testing in action")

I've been thinking about this during my runs lately (yes, I dictate my thoughts while running and let AI clean them up—meta, right?). The fundamental shift happening in software development isn't just about AI helping us code faster. It's about AI becoming the primary user of the platforms we build.

This hit me hardest when looking at testing platforms. Traditional tools like Selenium and Appium were built with human engineers in mind—multiple language bindings, recording tools, debuggers, the whole nine yards. But when AI becomes the user? Everything changes.

## The Client Has Changed

Let's start with a simple realization:

> "For an AI user, they are comfortable with everything. So there is no need to have a myriad of language bindings for AI users because they simply don't care."

Think about that for a moment. We've spent *years* building platform abstractions to make developers comfortable. Python bindings, Java bindings, JavaScript bindings—all because humans have preferences, workflows, existing codebases they want to integrate with.

AI doesn't care. It'll work with whatever you give it. This opens up possibilities we haven't fully explored yet.

Instead of supporting fifteen different programming languages, we can focus on building the *best* interface for the task. Maybe that's a declarative domain-specific language. Maybe it's something else entirely. The point is, we're no longer constrained by human comfort zones.

## Obsolete Before You Know It

Here's where it gets interesting:

> "Having the AI drive the recording tool would be an unnecessary error prone step. So test generation tools become totally obsolete."

Recording tools were a massive innovation for human testers. Point, click, record, refine. But AI doesn't need to "record" anything—it can analyze the DOM directly, take screenshots, understand visual elements, and build tests iteratively. The whole concept of "record and playback" becomes as outdated as punch cards.

What used to take humans 20-30 minutes of careful test creation can now happen in 30 seconds. And because the cost is so low, we don't need tests to be hyper-robust against every possible UI change. When regenerating a dozen tests takes five minutes instead of five hours, our entire approach to test maintenance changes.

## The Economics Flip

This brings us to the economic reality:

> "The tools that result are 10 to 100 times more effective and efficient. And the tools themselves are so cheap to build that they can be built by the companies who need them and be 100% custom."

This is the part that should make every platform vendor nervous. When one engineer can build a custom, AI-optimized testing platform in under a week, why buy an off-the-shelf solution designed for humans?

The "make versus buy" equation has flipped. Custom becomes cheaper than generic.

## Human vs. AI: A Tale of Two Users

Here's how the requirements break down:

| Product Consideration | Human Customer | AI Customer |
|-----|-----|-----|
| **Language Support** | Needs familiar languages (Java, Python) for comfort and existing workflows | Language-agnostic; prefers declarative DSLs over fragmented multi-language support |
| **Test Creation** | Requires recording tools, debuggers, DOM inspection for manual refinement | Analyzes screenshots and DOM directly; recording tools become obsolete |
| **Robustness** | Tests must be extremely robust due to high creation/maintenance costs | Lower robustness needs since regeneration is fast (30 seconds vs. 20-30 minutes) |
| **Reporting** | Needs sophisticated analytical UIs and dashboards for failure investigation | Can process raw logs directly; still needs high-level dashboards for oversight |
| **Tool Complexity** | Benefits from powerful, expressive tools with guardrails for simplicity | Also needs guardrails; too much complexity (like arbitrary JS execution) leads to error-prone tests |

## What This Means for Engineers

Here's the thing—this doesn't mean fewer jobs. It means different jobs. Instead of wrestling with complex third-party tools that were designed for a different era, we get to build custom platforms that leverage AI to achieve results that are *orders of magnitude* better.

Software development becomes about building the tools that enable AI to build and test software more effectively. We're becoming the architects of AI workflows rather than the manual laborers of testing suites.

And honestly? That's more interesting work.

## The Path Forward

We're still in the early days of this transition. Most companies are still using human-centric tools and trying to bolt AI on top. But the companies that recognize this shift and build AI-native platforms from the ground up are going to have significant advantages.

The question isn't whether this transition will happen. It's whether you'll be building the future or getting disrupted by it.

What platforms in your stack were built for humans that could be reimagined for AI? I'd love to hear your thoughts—this is happening across every domain, not just testing.

*Building software that matters, for users that happen to be artificial.*

Onward,  
lloyd