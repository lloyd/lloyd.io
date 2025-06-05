---
title: Are AI Editors Obsolete?
layout: post
---

The way developers use AI is rapidly changing, moving beyond simple integrations within code editors towards more complex, "agentic" workflows. This shift suggests that the current model of AI assistance directly in the editor might soon become obsolete.

![AI robot superhero disrupting traditional editors](/i/ai-editors-obsolete-robot.png "AI superhero blasting off toward pull requests while traditional editors crumble")

## The Traditional Editor-Based Approach

Historically, developer adoption of AI, exemplified by tools integrated into editors like VS Code, focused on providing help for small, specific tasks. Developers would highlight sections of code and ask the AI to write a function, explain an implementation, or debug a piece of code. This approach involved tactically employing AI on a micro-level to solve immediate problems.

> "In this model of usage, you as the developer are using your editor. And you're highlighting sections of a file. For instance, and saying, hey, AI, write some code here. Or, hey AI, tell me what you think of this implementation. Or, hey AI, dig into this function call and tell me how it works."

## The Rise of Agentic Workflows

With the advent of more powerful models and tools like GitHub Copilot, Google's Jules, and Claude Code used via command line or in automated workflows (like GitHub Actions), the interaction with AI is moving outside the editor. This is the "agentic move," where AI is applied to much larger problems. Instead of writing a single function, AI agents can be tasked with analyzing an entire codebase, updating multiple system components (backend, frontend, APIs, databases), or removing all references to a third-party service.

This agentic approach allows developers to provide architectural direction and guidance while the AI handles the heavy lifting of implementing large, complex features. The scale of tasks manageable by AI has grown significantly.

> "It's where we're moving away from very specifically applying AI to solve small problems, implement a function, implement a data structure, sketch out an API, debug this function to much larger problems, which are, hey, analyze this code base, update the back end, the front end, the GraphQL API between them, and my analytics system, for instance."

## Increased Pace and Complexity

The agentic workflow, often involving multiple AI instances working on different parts of a project simultaneously, is described as "extremely high-paced." A developer might manage several AI sessions, each tackling a medium to large feature, potentially resulting in thousands of lines of code changes per day. This contrasts sharply with the slower pace of waiting for AI to complete small tasks within an editor.

> "However, when you have two or three Claude sessions running implementing medium to large size features, and you are actively monitoring the more complex one, you're moving very, very fast. You're getting to the point where you can manage three, four, 5,000 lines of code a day that are non-trivial and bring meaningful features, not AI slop."

## Challenges and the Human Role

While powerful, agentic AI isn't perfect. Challenges exist, such as the AI missing crucial context (like the extensibility of a custom parser), giving up when tasks become difficult, or implementing easier solutions that compromise the user experience.

This is where the human role evolves. Instead of being constantly in the editor, the developer acts more as an architect and supervisor. They monitor the AI's progress, interrupt and redirect it when it goes off track, and review the completed work, often through pull requests. The human's greatest impact shifts to reviewing larger code changes and prescribing new directions.

> "At this point, rather than a human sitting in the editor and reviewing, it seems like the human wants to be sitting in a diff view reviewing pull requests one after another and prescribing changes and new directions. And that's where a human right now, this month, today, seems like they can have the greatest impact."

## The Future of AI in Development

The rapid move towards these larger-scale, agentic workflows raises questions about the longevity and value of companies heavily invested in building AI directly into editors. If the cutting edge of developer productivity involves managing AI agents outside the editor, how long will the editor-centric model remain relevant? The landscape is dynamic, and the focus appears to be shifting towards AI handling broader tasks with human oversight and review.

lloyd