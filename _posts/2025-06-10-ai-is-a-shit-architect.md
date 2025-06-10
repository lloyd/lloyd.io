---
title: AI is a Shit Architect
layout: post
---

I've been working with AI tools for coding for years, but we've hit a major inflection point over the last few weeks with the advent of tools like Claude Code. The ability to specify a large body of work—potentially thousands of lines of code—and have a system work on it while I focus on other tasks is unprecedented. But as powerful as these new tools are, my experience at this very moment is that you can't give them much rope. An AI can take on an enormous project and complete it with guidance, but it very frequently will go off the rails.

![Robot architect drawing impossible bridges](/i/ai-shit-architect-robot.png "A cute robot drawing impossible architectural plans")



## Where AI Fails: The Architectural Blind Spot

I recently had an experience that perfectly illustrates this problem. A large portion of our software is in Golang, and I asked Claude to build a quick linter for a JSON document. The task involved an enumerated type with over 1,500 possible values. Claude cranked for about a minute and reported the task was complete. When I dug in, I found it had written a program that parsed the enum definition—which already had a map—extracted the values, and then built a new map on top of it. This isn't even about sophisticated architecture; it's just common sense. No human developer would ever do that.

In another case, I instructed Claude to use a custom HTML parser I had built for a specific application. The parser and the client code were in the same repository. Instead of using the parser's existing API, Claude jumped directly into the parser's implementation and started adding use-case-specific details.

> "it... totally [broke] the line of abstraction and [created] a maintainability nightmare."

These moments are frustrating. When an AI goes off track, it requires human intervention to stop it, figure out where things went wrong, and reset. It kills your momentum and steals your focus from high-level orchestration.

## Maximizing Efficacy in a Changing Landscape

So the question becomes, how do we maximize our leverage of these existing tools in the short term? We're likely in a window of a month or two before the next major model releases, so optimizing our current workflow is key.

I've found that investing time in providing clear direction for the AI pays outsized dividends. By thinking deeply about your interactions, systemically analyzing the mistakes the AI makes, and updating high-level prompting (like a `Claude.md` file in your repository) to prevent those mistakes, you can save yourself massive amounts of time and frustration.

If allocating an hour a day to focusing on AI-visible and human-visible documentation can improve performance by even 10-20%, it's a huge win.

## The Power of Patterns and Guardrails

AI is fantastic at identifying, replicating, and executing patterns. In our software, we have a well-designed and heavily documented event system. When I tell Claude to create a new event and hook it in, it succeeds autonomously with a very high success rate because the pattern is clear. This highlights a crucial takeaway for developers and architects:

- **Invest in AI-Facing Documentation:** Create and maintain top-level documentation that describes your software's organization and rules. This gives the AI the context it needs to operate correctly.

- **Refine Your Software Structure:** Traditionally, a startup might build a quick first version and worry about proper architecture later. To use AI effectively, that investment in structure and abstraction needs to happen sooner.

- **Embrace Solid API Design:** APIs are contracts that define responsibilities and boundaries between components. These hard lines are exactly what an AI needs to understand what is allowable and to phase its work correctly. They are the guardrails that keep it on track.

By doing the architecture and building the scaffolding yourself, you can then deploy AI agents to build on top of that core infrastructure tirelessly and in parallel.

The reality is that, at present, AI is still a shit architect. For the coming months, and maybe for as long as a year, the 10x to 100x performance improvement lies in combining human architectural skill with AI implementation speed. If you are a great architect, now is the time to lean into those skills. Every bit I've invested in architecture and guardrails has paid me back in the ability to more effectively employ multiple AI instances at a time.

lloyd