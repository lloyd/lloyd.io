---
title: "Vibe Coding is Non-Binary"
layout: post
---

The term "vibe coding" can be a loaded one, especially for software engineers who have built careers on the craft of writing code. It often conjures a simplistic, almost magical image: a developer speaks an idea into the air, and a fully-formed application appears, created entirely by an AI. While this makes for a tempting and simple definition, the reality of vibe coding is far more nuanced and exists on a spectrum. It's not a binary switch, but a gradient of AI assistance that can be applied at various levels of software development.

> "It's super tempting to create a simple, basic and pithy description of vibe coding, that is, for instance, speaking or typing an idea for an application and having some system of LLMs write it for you."

![Orchestra conductor directing code](/i/vibe-coding-conductor.jpg)



## Beyond the All-or-Nothing Myth

The most extreme vision of vibe coding involves an LLM building a complex application from the ground up with zero human oversight—letting the AI "romp around directly using compilers and the tools that software engineers typically use." This might involve everything from setting up the database and authentication to writing the front-end code. While this makes for an interesting prototype, it's not a practical or reliable approach for production-ready software today. The quality bar for software that serves paying customers is simply too high.

> "There's too many considerations, and AI is not quite ready to... build an unsupervised app that you can go and launch and support."

Instead of this all-or-nothing approach, a more effective strategy is to think of vibe coding as a tool to be applied thoughtfully within well-defined boundaries.

## A Practical Approach: Platforms and Guardrails

Consider building a crossword puzzle application. One way to leverage vibe coding is to separate the core application from the content. A team of engineers can build a robust and scalable crossword puzzle *platform*, handling the user interface, database, deployment, and content delivery networks (CDNs). This is traditional, hybrid engineering.

Where vibe coding shines is in content creation. By defining a specific structure for the puzzle data—a domain-specific language (DSL) represented in JSON and governed by a schema—you create a "sandbox" for the AI. You can then ask the LLM to generate the content for a puzzle on any topic imaginable.

> "I can say, give me a crossword puzzle about season four of Friends, or give me a crossword puzzle that's Marvel themed."

In this model, the AI isn't writing the entire application; it's performing a much simpler, constrained task: generating structured data. This is a form of vibe coding that is ready for production right now.

## The Power of Sandboxes

This concept of creating constrained environments for code to run in is not new. It's the same principle behind sandboxes in operating systems, permission systems for user accounts, and browser extension APIs. We give untrusted or specialized code limited access to a system to ensure it can't do anything damaging.

Think of a browser extension. It operates within a constrained API and is treated as untrusted. The browser acts as a "user agent," ensuring the extension doesn't do anything "untoward" and can even implement just-in-time permissions, asking the user for consent at the moment an action is taken. This idea traces back to the fundamentals of operating system design, like user-level accounts in Unix that have restricted access and cannot, for instance, talk directly to the disk. We are simply applying these proven principles to AI.

## Vibe Coding Today and Tomorrow

Currently, vibe coding is most effective for ideation, prototyping, and, most importantly, interactive content generation. The key to unlocking its potential is to build an ergonomic development environment for the AI, just as you would for a human. This means providing clear feedback, helpful error messages, and instructions when mistakes are made, allowing the AI to learn and converge on a working product more quickly.

As the technology evolves, the guardrails we build can become looser, giving the AI more agency. But the core idea remains: vibe coding is about thoughtfully deciding how much control and autonomy to grant an AI within a specific task. Platform building, once a lengthy process, will become a more frequent activity as we create new sandboxes for each new AI application. By embracing this nuanced view, the concept becomes less polarizing and more of an obvious, powerful evolution in how we build software.