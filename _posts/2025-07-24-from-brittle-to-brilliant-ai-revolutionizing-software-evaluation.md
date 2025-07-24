---
title: "From Brittle to Brilliant: How AI is Revolutionizing Software Evaluation"
layout: post
---

We are rapidly moving toward a world where near-human-level cognition is available at every layer of our software. 🧠 This isn't a far-off dream; it's a paradigm shift happening right now, promising sub-500 millisecond reasoning on complex topics and fundamentally changing how we build and validate technology.

![AI evaluation system visualization](https://dev.headlands.cloud/image/attachment/PuLelhuzjHdBHGAmvAEyX-i7BDSlChMm5xcxvTrt2mw)




This evolution is perfectly captured in the journey of building evaluation systems for conversational AI. Over the past decade, I've built three such systems at three different companies, each representing a distinct era of technology. This is the story of how we went from rigid, brittle, and expensive testing to a new world where evaluation is as dynamic, nuanced, and intelligent as the AI it measures.

## The Early Days: Heuristic-Based Evaluation

About 10 years ago, at a startup called Ozlo (later acquired by Facebook), the first evaluation system I built was entirely heuristic-based. This was pre-modern LLM, so testing relied on custom databases, keyword matching, and parsing syntax trees. We'd specify an input utterance and context, and the system would check the AI's response for certain entities or features. The same architectural approach was used again at Facebook to assess their digital assistant.

The problem with this approach is that it's incredibly brittle and expensive to maintain. You can't express success in a simple, human way. Instead, you have to "angle around it" with a series of inflexible checks.

> You couldn't just say something like, 'when I ask for Mega Millions current jackpot, it should return the current jackpot of the Mega Millions.' You can't express your success criteria in an understandable and human way. In some of these cases, if you can build the evaluation system, then you should be able to build the assistant that it is supposed to test anyway. It's kind of a chicken and egg problem.
> 
> *— From the source audio*

These systems struggled to validate answers to real-time, dynamic questions, and they were never truly holistic in their assessment. They were a necessary step, but they were a constant, costly engineering effort.

## The Shift to AI-Powered Grading

The third time I built an evaluation system, at my current company, the game had changed. The conversational agent itself was powered by modern LLMs, and for the first time, I could incorporate AI into the evaluation process itself.

Initially, this felt uncomfortable. Using an LLM for grading introduced concerns about cost, speed, and non-determinism. What if you get a different evaluation result every time you run it? To build a reliable baseline, I started by running every AI-based evaluation in triplicate and averaging the results to get a stable signal.

Despite the complexity, the benefit was staggering. The expressiveness of the evaluation system improved by orders of magnitude. Suddenly, we could write sophisticated rubrics for the AI to follow, much like a professor giving instructions to a team of TAs. This allowed for deep, nuanced analysis that went far beyond simple keyword matching.

> If you invest a little bit of time in that grading rubric, boy can you get deep analysis. Far better than looking for keywords or analyzing in a traditional heuristic fashion... which are almost always proxies for what you really want to measure. You want to measure, was this response good? Would the user be satisfied? Was the user's intent fulfilled?
> 
> *— From the source audio*

## The Breakthrough: Rubric-Driven Evaluation

A recent blog post from the search engine company Exa triggered a major unlock for me. They proposed that their evaluations *are* LLM prompts—the tests are simply rubrics written in plain language. This is the fourth version of the evaluation system, and it's a complete paradigm shift. The test itself is just a set of grading guidelines executed by an LLM.

This approach has clear tradeoffs. Tests are slower and more expensive in terms of compute. But the benefits are transformative:

- **Human-Centric:** Anyone in the organization can read a test and understand exactly what it's doing. No engineering knowledge required.
- **Accessibility:** Anyone can create a test with minimal training, democratizing the quality assurance process.
- **100% Testability:** By providing the evaluator with a screenshot and the raw content of the response, everything the user sees becomes instantly testable. You no longer need to litter your code with test IDs.
- **Decoupling:** You can completely refactor or rewrite the underlying software, and as long as the final product looks and acts the same, your entire test suite remains valid. The engineering cost of porting and maintaining tests evaporates.

## From Evaluation to Execution: AI as the Runtime

This evolution in testing points to a much larger trend. For years, we've operated with a bias to minimize the use of LLMs at runtime due to cost and latency. We use AI to *write* code, which is then run in a traditional, deterministic way. But as the cost of generative AI plummets and its quality soars, that bias is becoming obsolete.

### Is Code Becoming the New Assembly Language?

The logical conclusion is that AI is becoming the new runtime. We are heading toward a future where software systems are built to be run by an LLM, not just evaluated by one. In this world, the code we write today may become like assembly language—an intermediate layer that is generated by a higher-level process and never directly read by humans.

Eventually, the code itself might become ephemeral, generated on the fly by an LLM to perform a task and then discarded. This raises fascinating questions for the future of our industry. What does an AI-first programming language look like? And how long will this temporary phase of using LLMs to *write* code last before we transition to having the LLM *be* the runtime? The journey of the evaluation system shows us the path, and it suggests the most profound changes are still to come.