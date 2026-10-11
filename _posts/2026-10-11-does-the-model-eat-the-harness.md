---
layout: post
title: "Does the Model Eat the Harness?"
date: 2026-10-11
---

*Lloyd — Oct 11, 2026*

Two claims keep coming up when I talk with people about AI doing real work.  The first is a ceiling: even the best frontier models aren't good enough for the complex, subject-matter-expert work that happens inside big companies.  The second is a crutch: the harnesses and tools we wrap around models are there to prop up weak models, and they'll fall away as the models get smarter.

They sound like opposites, but they're neighbors.  Much of a harness exists *because* models can't do expert work unaided, so "will the model eat its harness?" is really asking whether the first claim stops being true, and how much of today's engineering evaporates when it does.

**The big idea here is that tools are architecture, not scaffolding.**  The model will eat some of the harness - never all of it.  To find out which parts, I dug through the git history of three open source coding harnesses and watched what happened to each layer as the models underneath them got better.

![A coding agent harness drawn as a stack of layers, with the model eating bits of the top one](/i/harness-hero.png)



## tl;dr;

As of October 2026, across three open source harnesses, newer models outgrew the nags written for older ones (nothing Aider added after GPT-4.5 gets its `lazy` flag), but I found no deterministic tool removed because a model got smarter, and a new nag took `lazy`'s place: **`overeager`, now on 64 of Aider's model entries**.

## 🤔 Isn't the ceiling real?

Let's state it fairly, in the words of someone who'd know.  Here's Andrej Karpathy on [Dwarkesh Patel's podcast](https://www.dwarkesh.com/p/andrej-karpathy) in October 2025, explaining why he wouldn't yet pick an agent over an intern:

> "They just don't work.  They don't have enough intelligence, they're not multimodal enough, they can't do computer use and all this stuff... They're cognitively lacking and it's just not working.  It will take about a decade to work through all of those issues."

The numbers agreed.  When the [Remote Labor Index](https://arxiv.org/abs/2510.26787) launched that same month - 240 real freelance projects, judged on whether a reasonable client would accept the work - the best agent cleared **2.5%** of them.

Then both moved, fast.  Three months later [Karpathy wrote](https://x.com/karpathy/status/2015883857489522876): "I rapidly went from about 80% manual+autocomplete coding and 20% agents in November to 80% agent coding and 20% edits+touchups in December."  The Remote Labor Index [leaderboard](https://labs.scale.com/leaderboard/rli) sits at **21.25%** today, and its 2026 runs got a new harness too: Claude Code and Codex CLI, 30-plus professional apps and a critic agent.  On OpenAI's [GDPval](https://arxiv.org/abs/2510.04374), where professionals with an average of 14 years of experience write the tasks and grade the results blind, the best model went from matching or beating the expert **47.6%** of the time (Claude Opus 4.1, Sep 2025) to [**84.9%**](https://openai.com/index/introducing-gpt-5-5/) (GPT-5.5, Apr 2026, by OpenAI's own count).

So the ceiling is real, but it's misplaced.  GDPval hands the model full context, a clean brief and the reference files.  The Remote Labor Index hands it a messy commission, real files and professional software.  On the first, models match experts most of the time; on the second, the best agent finishes about one job in five.  Much of what lives in that gap is gathering context, driving tools, wrangling file formats and checking its own work.  **A lot of that gap is the harness.**  Not all of it: Remote Labor Index jobs average about 29 hours of professional work to GDPval's 7, GDPval counts ties as wins, and the newest Remote Labor Index scores already come from agents running inside a strong harness.  But the harness moves these numbers on its own.  GDPval's authors picked up 5 points from prompting and harness tweaks alone, and [WildClawBench](https://arxiv.org/abs/2605.10912) found that switching harnesses moved a single model by up to 18 points.  Karpathy said something close in January: "The intelligence part suddenly feels quite a bit ahead of all the rest of it - integrations (tools, knowledge), the necessity for new organizational workflows, processes, diffusion more generally."

It matches my experience, too.  Over the last year I've used frontier models, inside a harness, to port Microsoft's TRELLIS.2 image-to-3D pipeline to AMD ROCm ([the writeup](/ai-on-alien-tech)), to run models across most modalities directly on the GPU, and to build [robojail](https://github.com/lloyd/robojail), a namespace sandbox that keeps coding agents honest.  That's specialist work.  It's also n=1 and expert-assisted, which is exactly the point.  It's what an expert *using models, with tools* looks like.

Two regulated professions already run this way in production.  [Harvey](https://www.harvey.ai/blog/harvey-raises-dollar550m-at-a-dollar155b-valuation-to-help-legal-teams-own-their-intelligence) says 80% of the Am Law 100 (the biggest US law firms) use it.  It [routes work](https://www.harvey.ai/blog/expanding-harveys-model-offerings) across OpenAI, Anthropic and Google models, and in August it shipped [Tenet](https://www.harvey.ai/blog/post-training-update-harvey-tenet), its own model post-trained on an open-weight base, with a telling line: performance depends on "post-training within an agent harness that has the right primitives for the domain."  [Sully.ai](https://www.sully.ai/help-center/articles/what-is-sully) sells a team of "AI employees" (scribe, receptionist, coder, triage nurse) and is blunt that "Everything the platform produces is a draft until a human reviews and approves it."  Neither replaces the lawyer or the doctor.  Both put frontier models to work on real expert work, and both wrap those models in a lot of harness.

## 🩼 So is the harness a crutch?

The other claim isn't a strawman either.  The people building the best harnesses in the world are deleting code.  Boris Cherny, who leads Claude Code, told [The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-claude-code-is-built) last year: "Every time there's a new model release, we delete a bunch of code.  For example, with the 4.0 models, we deleted around half the system prompt because we no longer needed it."  Anthropic's [harness write-up](https://www.anthropic.com/engineering/harness-design-long-running-apps) from March turns it into a principle: "every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing, both because they may be incorrect, and because they can quickly go stale as models improve."  Then it shows its work.  Sonnet 4.5 had what Anthropic calls "context anxiety" - it wrapped tasks up early as its context window filled - so the harness kept resetting its context.  The resets came out once "Opus 4.5 largely removed that behavior on its own."

Behind all of it sits Rich Sutton's [Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html): "We have to learn the bitter lesson that building in how we think we think does not work in the long run."  And its sharpest modern restatement, Pierre-Carl Langlais' [The Model is the Product](https://vintagedata.org/blog/posts/model-is-the-product): "I think it's time to call it: the model is the product."

So if models can already do a lot of expert work, and the best teams delete harness every release, why keep any of it?  The real question isn't *whether* the model eats the harness.  It's *which parts* - and which ones are load-bearing forever.

## 📏 Where's the line?

Here's the rule I keep coming back to: **a probabilistic intellect shouldn't do what a deterministic tool does better.**  That one rule decides which parts of a harness survive.  Three arguments, plus one structural point:

**Physics** - Even a hyper-smart model runs on a platform.  To see, it needs a camera.  To read the internet, it needs a network card.  To know what's in your repo *right now*, or what time it is, something has to go look.  No amount of intelligence absorbs the network card.

**Determinism** - LLMs are probabilistic, like brains.  Making a model multiply big numbers in its head wastes it, and it still gets them wrong; that intellect is better spent on strategy and method.  Compilers, type checkers, test runners and `git` give a precision no probabilistic system should be asked to fake.

**The human analogy** - No amount of evolution makes it sensible to drive a nail with your fist, or to do calculus in your head.  Architects mostly stopped drawing by hand.  Expertise and tool use rise *together*; they don't trade off.

And the structural point: a reasoning model can call specialized sub-models, loosely the way a brain leans on dedicated machinery for vision, hearing and language.  Arguing that all of that should collapse into one general system imposes a worse architecture on a better one - though I'll admit Hermes' vision change, below, is a case where folding a helper model into the main one won.

Even the skeptics' favorite paper lands here.  Apple's [The Illusion of Thinking](https://arxiv.org/abs/2506.06941) found that reasoning models "fail to use explicit algorithms" and collapse on exact computation.  The [main rebuttal](https://arxiv.org/abs/2506.09250) got high accuracy back by "requesting generating functions instead of exhaustive move lists": have the model write a program instead of making a few thousand moves in its head.  That's the whole argument in one exchange.  Nghi Bui's [paper on terminal coding agents](https://arxiv.org/abs/2603.05344) puts it as a design rule: "design tools and interfaces that absorb LLM imprecision as a first-class property."

> NOTE: the first two arguments are engineering.  The other two are analogies, and analogies aren't evidence; how modular brains really are is itself contested.  They're how I think about it.  The proof, such as it is, lives in the git history.

## ⛏️ OK, show me the receipts

Talk is cheap, so I went digging.  The specimens are three open source, model-agnostic harnesses, which means the harness stays put while the models change underneath it:

- **[Aider](https://github.com/Aider-AI/aider)** - Paul Gauthier's terminal pair programmer, started April 2023.  13,138 commits.  The only one old enough to watch across model generations.
- **[OpenCode](https://github.com/anomalyco/opencode)** - the TypeScript coding agent from Dax Raad and the team behind SST.  20,277 commits.
- **[Hermes Agent](https://github.com/NousResearch/hermes-agent)** - Nous Research's self-improving agent.  51,424 commits, almost all of them this year.

I cloned all three with full history and locked a six-layer taxonomy *before* measuring anything:

| layer | what's in it | the bet |
|---|---|---|
| Compensation | edit formats, nag prompts, output repair, retries, per-model workarounds | shrinks as models improve |
| Deterministic tools | tests, linters, LSP, git, sandboxes, exact search | never removed for capability reasons |
| Senses | repo maps, file reads, web, images, voice, connectors | physics: stays |
| Orchestration | multi-model splits, subagents, compaction, skills | grows *because* models improve |
| Memory | conventions files, learned skills, session search | grows |
| Product & plumbing | UI, config, provider catalogs, auth, docs | the null: tracks users and features |

Then I measured every Aider minor release and monthly snapshots of the other two, built a model-release timeline from the vendors' own announcements, and hunted for commits that delete harness because a model got better (and the reverse).  I did the digging with a small fleet of Claude agents, and every quote here comes from its primary source.  To keep myself honest, an independent agent that hadn't seen my analysis blind-recoded 25 of the key commits.  It agreed with my layer on 23, the kind of change on 22, and whether a model was the stated reason on 21.  The disagreements were edge cases: is dropping an o1 `streaming=False` flag compensation or plumbing?  Is rewording an edit tool's output so the model doesn't think the edit failed a tool change, or compensation hiding inside a tool?  None flips a verdict, though the second is a reminder that some compensation lives inside the "durable" layers.

### Aider: one harness, three years, a parade of models

When Paul started Aider, GPT-4 was the only model that could reliably edit code with diffs, and Aider has stayed model-agnostic through every generation since.  It also predates reliable tool calling, so it talks to models through *edit formats* - SEARCH/REPLACE blocks, whole files, unified diffs - that the model writes as plain text and Aider applies.  (Benjamin Rombaut's [source-code taxonomy](https://arxiv.org/abs/2604.03515) of 13 coding agents counts Aider's model-callable tools as zero.)  A harness built around getting models to emit parseable edits is about the best place to watch compensation live and die.

![Aider's runtime code by layer for every minor release from 2023 to 2026, with major model releases marked](/i/harness-aider-layers.png)

Every layer grew - Aider went from about 2,000 lines of runtime code to almost 22,000 - so raw totals say little.  The shares say more.  Compensation peaked at **32% of the code in December 2023**, the month Paul shipped unified diffs to fix GPT-4 Turbo's laziness.  It fell to about 16% by spring 2025, and has crept back to **19%** as new edit formats and per-model flags piled up.  Deterministic tools went from 277 lines to 1,737 and were never removed.  The biggest layer by far is product and plumbing (UI, config and a catalog of 357 model entries), which is the null hypothesis waving hello.

The laziness era is a hoot to read.  GPT-4 Turbo had a "bad habit of 'lazy' coding, where it writes code with comments like '...add logic here...'," so Paul [tested everything](https://aider.chat/2023/12/21/unified-diffs.html), including the internet's favorite prompt hacks: "It's worse to add a prompt that says the user is blind, has no hands, will tip $2000 and fears truncated code trauma."  What shipped was a new edit format, flexible patching (turning it off caused a "9X increase in editing errors") and a nag that still lives in `base_prompts.py`.

The most legible instrument in the whole dig - noisy, but dated - turned out to be Aider's per-model settings.  Every supported model gets an entry, and some entries switch on a nag:

![From lazy to overeager: Aider model entries that switch on each nag prompt, by release date](/i/harness-lazy-overeager.png)

Fifteen entries carry the `lazy` flag.  Every one is from OpenAI's GPT-4 Turbo, GPT-4o or GPT-4.5 families, and no model added since GPT-4.5 has it.  OpenAI had shipped a January 2024 update [meant to](https://openai.com/blog/new-embedding-models-and-api-updates) "reduce cases of 'laziness'" - Aider's benchmark found that one [lazier](https://aider.chat/2024/01/25/benchmarks-0125.html) than the last.  The newer models trained it away.  **The model ate `lazy`.**

Then the opposite problem showed up.  In July 2024 Paul wrote that Claude 3.5 Sonnet was "[the opposite of lazy](https://aider.chat/2024/07/01/sonnet-not-lazy.html)": so industrious it kept blowing through the 4k output token limit.  In March 2025, a month after Claude 3.7 Sonnet shipped, a new flag landed for it: `overeager`, "to try and keep it working within the requested scope."  The prompt reads "Do what they ask, but no more."  It now rides on 64 entries, roughly 16 distinct models, from Claude 3.7 Sonnet and Opus 4.6/4.7 to Gemini 2.5 and 3 and the GPT-5 line (Claude 4, Sonnet 4.5 and Sonnet 4.6 came in without it).  Anthropic's own prompting docs now have a [section](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) titled "Overeagerness": Opus 4.5 and 4.6 "have a tendency to overengineer by creating extra files, adding unnecessary abstractions, or building in flexibility that wasn't requested."

That's the finding I didn't predict.  **Compensation didn't go away.  It flipped sign.**  The smartest models increasingly need to be told to *stop* - though, as the younger harnesses show, a push to finish keeps coming back too.

Three more things the history shows:

- **Almost nothing gets deleted.**  Across 134 releases and the current tree, no entry ever lost `lazy`, `overeager` or the reminder flags; the one wholesale removal, `send_undo_reply` in 2024, came with no reason given.  Old models keep their compensation as fossils, and 291 lines of dead compensation (function-call edit formats, a 2023 fuzzy matcher) still sit in the tree.  Compensation shrinks only because new models are born needing less of the *old* kinds.
- **Compliance with a harness's own format doesn't track capability.**  On Aider's polyglot leaderboard, GPT-5 (high) posted the board's best-ever score *and* sent 22 malformed responses (91.6% of tasks well formed); Claude 3.5 Sonnet managed 100%.  The deterministic patch applier, and the repair logic around it, aren't going anywhere as long as harnesses ask models for dialects they weren't trained on.
- **Orchestration arrived with better models, and outlived its reason.**  Aider's architect/editor split (one model plans the change, a second writes the edit) was "motivated by the release of OpenAI's o1 models.  They are strong at reasoning, but often fail to output properly formatted code editing instructions" - and only practical "due to rapid improvements in the speed and costs of frontier models."  Four months later Paul noted that pairing o1 with Sonnet "didn't produce better results than just using o1 alone."  Nobody deleted the split; like `lazy`, it stayed on as a fossil.

One more mechanism: the reflection loop Paul built in 2023 to bounce *malformed edits* back to the model got reused in 2024 to feed *lint and test failures* back.  Compensation machinery became the pipe for deterministic feedback.

> NOTE: Aider's development largely stopped in mid-2025 (367 commits in May, 27 in July, mostly new model entries since), so its last year is mostly catalog upkeep.  Paul has said only that he's been "[busy with other projects](https://github.com/Aider-AI/aider/issues/4648)."

### OpenCode: tools as senses

![Two loops: OpenCode fed language-server diagnostics back after every edit, and Hermes Agent writes skills after the work](/i/harness-loops.png)

First, a family tree, because there are two OpenCodes.  Kujtim Hoxha started [opencode-ai/opencode](https://github.com/opencode-ai/opencode) in Go in March 2025; the SST team joined, forked it into a TypeScript rewrite that May, and Kujtim carried on at Charm as [Crush](https://github.com/charmbracelet/crush).  The TypeScript repo, now anomalyco/opencode, is the specimen.

OpenCode is where tools act as *senses*.  From Kujtim's first LSP commit in April 2025 until this month's v2 rewrite, every edit came back with what the language server (the engine behind your editor's red squiggles) saw.  By the end of v1 that was "Edit applied successfully." followed by "LSP errors detected in this file, please fix:" and the errors themselves.  The refinements tell you who the audience is: errors only, capped at 20 per file to prevent "context window waste", and one wording change made "to prevent agent from thinking edit didn't apply."  Deterministic output, tuned for a probabilistic reader.

The prompts tell the compensation story in miniature.  The May 2025 rewrite shipped **one prompt for every model and zero model-specific branches**.  Then the zoo arrived: a "beast" prompt because "GPT 4.1 doesn't work well with the anthropic prompt for Claude and pauses to ask for confirmations a lot", a Gemini prompt adapted from gemini-cli's, a Kimi prompt contributed by Moonshot with benchmarks attached.  By this fall OpenCode v1 had nine model-specific prompts plus a default.

Then, this summer, the v2 rewrite started cutting, though no commit says the models stopped needing what it cut.  A 95-line generic prompt full of inherited nagging ("You MUST answer concisely with fewer than 4 lines", "DO NOT ADD ***ANY*** COMMENTS unless asked") became 14 lines that open with "You are an AI agent powered by OpenCode, a coding agent harness."  The Gemini prompt went out with the note "let's see how gemini behaves without it."  Prompt text is down to 33 KB from 99 KB on v1.  And then compensation crept back: a September GPT prompt written "to get it not to expand scope so aggressively" (overeager, again, in a different harness), and, a few weeks after the comment rule went out with the generic prompt, a 300-byte version came back for Claude "to curb reflexive per-function commenting."

Meanwhile the deterministic layer grew more than tenfold in raw lines (1,630 to 19,242), and orchestration went from almost nothing to about 5,700 lines.  One honest wrinkle: v2 shipped without the LSP loop.  Its edit tool carries `// TODO: Add LSP notification and diagnostics after LSP runtime exists.`  That's rewrite scope (the TODO says so), but it's a reminder that "never removed" is a trend, not a law.

### Hermes Agent: a harness that grows

Not to be confused with Nous's Hermes 3 and 4 chat models: the agent has never defaulted to them, and its own code warns that "Nous Research Hermes 3 & 4 models are NOT agentic and are not designed for use with Hermes Agent."  It's also more than a coding agent - messaging gateways, cron, subagents - and it was a small research repo until February 2026, when it exploded.

Hermes is the specimen for the layer that's supposed to grow: memory.  Its README calls it "the only agent with a built-in learning loop", and the loop is real.  In February it gained persistent memory, full-text search over past sessions and a `skill_manage` tool the agent uses to write its own skills (how-to notes it loads when a task matches).  Since March, a background reviewer forks off after the work and patches skills: "Be ACTIVE — most sessions produce at least one skill update, even if small."  What's missing is the other half of a loop.  Nothing measures whether a learned skill made the next task succeed, and the prompt for the curator that prunes old skills admits that "'use=0' is not evidence a skill is valuable; it's absence of evidence either way."  So the agent writes skills, a model grades them, and old ones get pruned by age.

Hermes also has the single best exhibit for the determinism line.  In April it benchmarked its own tool use on GPT-5.4 and GPT-5.3-Codex, caught a model doing mental arithmetic wrong (39,152,053 instead of 39,151,253), and shipped this:

```
NEVER answer these from memory or mental computation — ALWAYS use a tool:
- Arithmetic, math, calculations → use terminal or execute_code
- Hashes, encodings, checksums → use terminal (e.g. sha256sum, base64)
- Current time, date, timezone → use terminal (e.g. date)
```

On its own small benchmark (64-plus runs, scored on the prompts the fix was written for), GPT-5.4's tool compliance went from 68.8% to 100%.  That's compensation added for a 2026 frontier model, and what it compensates *toward* is a deterministic tool.

The rest of Hermes rhymes with the other two:

- **Per-family nagging grew with the model zoo.**  Tool-use enforcement now covers GPT, Gemini, Grok, Qwen, DeepSeek and friends, with Claude the stated exception ("Claude does not exhibit these modes"), until Opus "stopped after writing an 85-byte stub" and a completion nudge went universal: "Do not stop after writing a stub, a plan, or a single command."  And twice this year GPT-5.x on Codex's backend printed its tool call instead of making it: "the JSON was printed, nothing ran, and the turn ended."
- **Edit formats now follow each model's *home* harness**: patches for GPT and Codex, exact string replacement for Claude.  The reason for per-model formats flipped from *the model can't write a clean diff* to *the model was trained on its vendor's dialect*.  A June commit steers GPT away from "a format their first-party harness never taught them."
- **When capability did eat something, the code still grew.**  Vision-capable models now see real pixels instead of a caption from a helper model, but the old path stays for weaker models behind a new routing layer.  In a multi-model harness, capability shows up as a new branch.

About 200 Hermes commit messages (by a rough text search) credit another harness - Codex, OpenClaw, OpenCode, Claude Code, Cline - for the idea.  Harness ideas also spread sideways, from one harness to the next.

### So what got eaten, and what grew?

![Scoreboard: what happened to each harness layer as models improved](/i/harness-scoreboard.png)

Here are the dated moments that tell the story, each in the words of whoever made the change:

| when | harness | what changed | why, in their words |
|---|---|---|---|
| Dec 2023 | Aider | unified diffs and a "lazy" nag for GPT-4 Turbo | "significantly reduces its bad habit of 'lazy' coding" |
| Sep 2024 | Aider | architect/editor split | o1 is "strong at reasoning, but often fail[s] to output properly formatted code editing instructions" |
| Mar 2025 | Aider | `overeager` nag for Claude 3.7 Sonnet | "to try and keep it working within the requested scope" |
| Apr 2025 | Aider | a `patch` edit format for GPT-4.1 (never made its default) | "new `patch` edit format for OpenAI's GPT-4.1 model" |
| Jul 2025 | OpenCode | "beast" prompt for GPT-4.1 | "pauses to ask for confirmations a lot" |
| Mar 2026 | Hermes | inline nudges replaced by a background reviewer | nudges in "43% of user messages", competing with the actual task |
| Apr 2026 | Hermes | "ALWAYS use a tool" for math, hashes and time | "gpt-5.4: 68.8% → 100% tool compliance" |
| May 2026 | Hermes | completion nudge for every model | "Opus stopped after writing an 85-byte stub" |
| Aug 2026 | OpenCode v2 | 95-line generic prompt cut to 14 lines, Gemini prompt removed | "let's see how gemini behaves without it" |
| Sep 2026 | OpenCode v2 | GPT prompt reins in scope | "not to expand scope so aggressively" |
| 2023-2026 | all three | a deterministic tool removed because a model got smarter | none found |

And the verdict on each bet:

- **Compensation shrinks: half right.**  In Aider, the model ate the compensation written for its *old* weaknesses (laziness, format fallbacks), but nobody deleted it; it just stopped being added.  The younger harnesses are still adding finish-the-job nags, and new failure modes keep arriving: over-eagerness, scope creep, stub-and-stop, tool calls printed as text.
- **Deterministic tools persist: holds.**  Tool *lists* churn - Cherny goes on, "We constantly delete tools and experiment with new ones," and OpenCode killed its LSP hover and diagnostics tools as unused - but in almost 85,000 commits I found swaps (ESLint for a weaker built-in linter) and one rewrite that hasn't ported LSP yet, and no shell, search, edit, git, lint or test capability removed because a model got better.
- **Senses stay: holds.**  Repo maps, web, vision and connectors kept growing; when native vision arrived, it came in as a new branch.
- **Orchestration grows because models improve: splits in two.**  Orchestration that *chains capable models* (architect/editor, subagents, background reviewers) grew once models were cheap and fast enough to chain, though the stated reasons are as often cost, context limits and interference as capability.  Orchestration that *breaks work down for a weaker model* shrank: Anthropic stopped chopping long builds into sprints once Opus 4.6 arrived.  (OpenCode's v2 also dropped its todo tool, without saying why.)
- **Memory grows: where anyone tried.**  Hermes writes its own skills and remembers you across sessions; Aider and OpenCode barely have a memory layer.  It's too young to say what survives.
- **Size tracks features and users: alive and well.**  Product and plumbing is half of Aider and 86% of everything Hermes added this year (tests and apps included), which is why raw totals say little on their own.

## 🍋 What about the bitter lesson?

Sutton's essay is the strongest version of the crutch argument, so it deserves a careful read.  Here's his pattern, verbatim: "1) AI researchers have often tried to build knowledge into their agents, 2) this always helps in the short term, and is personally satisfying to the researcher, but 3) in the long run it plateaus and even inhibits further progress, and 4) breakthrough progress eventually arrives by an opposing approach based on scaling computation by search and learning."

That's a perfect description of Aider's `lazy` prompt.  It helped in the short term, it plateaued, and the models trained past it.  It describes over-built task decomposition too.  The bitter lesson has been *right* about a lot of harness.

But read what it's actually against: "building in how we think we think."  A test runner isn't how we think we think.  Neither is a compiler, a sandbox or `git`.  Those are computation, and Sutton's own chess example credits "a simpler, search-based approach with special hardware and software."  If anything, deterministic tools sit with the computation Sutton says wins, not the hand-built knowledge he says loses.

The vendors mostly act like they agree.  When exactness matters, they reach for a schema or a trained-in format rather than a prompt trick: Anthropic's [docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) replace prefill (writing the start of the model's reply for it) with Structured Outputs, and OpenAI recommends its `apply_patch` format "to match the training distribution."  Anthropic is candid about why prefill went: "Model intelligence and instruction following have advanced such that most use cases of prefill no longer require it."  So the trick got eaten, and the exactness moved into a schema.  Even Langlais' own showcase, OpenAI's Deep Research, "learned the core browsing capabilities (searching, clicking, scrolling, interpreting files)," per the passage he quotes.  Training ate the orchestration and the prompting.  It still drives a browser.

I'm not the first to draw this line.  [Dive into Claude Code](https://arxiv.org/abs/2604.14228) argues - in a section its authors flag as inference rather than code-verified - that only the "decision scaffolding" shrinks as models get stronger, while the deterministic infrastructure around the loop stays.  What's new here is the longitudinal part: three harnesses, the oldest three years old, mined from their full git history.

## 🙈 What isn't proven yet?

- **Survivorship** - these are three harnesses that are still alive.  The ones that died aren't in the sample, and the biggest harnesses (Claude Code, Cursor) are closed, so for those I only have their makers' word.
- **Model-agnostic by design** - all three keep serving old and small models, so they're the last place compensation would vanish.  Single-vendor harnesses like Claude Code say they cut big chunks of their system prompt every release.
- **Confounds** - harness code tracks features, users and cost, not just capability.  Aider mostly stopped changing in mid-2025, OpenCode just rewrote itself, and Hermes went from research repo to 51,000 commits in eight months.
- **Young specimens** - OpenCode and Hermes postdate most of the capability jumps that matter, so they're cross-sections.  Aider carries the longitudinal weight alone.
- **My coding** - six layers is a judgment call (the blind re-check agreed with my layer on 23 of 25), and flags like `overeager` are a maintainer's opinion of a model, or a copied entry, rather than a measurement.
- **The testimony is n=1** and expert-assisted.
- **And a cautionary tale** - my draft's favorite anecdote, from AgenticLoops' [OpenCode teardown](https://agenticloopsai.substack.com/p/disassembling-ai-agents-part-3-opencode), said LSP errors made a model change its implementation strategy mid-session.  The author's own published trace shows the model added a `# type: ignore` instead.  Verify first!

## 🍽️ So, does the model eat the harness?

**Yes - the parts that compensated for weakness, and only for the models that had that weakness.**  So far it hasn't eaten the parts that keep it precise or connect it to the world (when Hermes' models grew their own eyes, the old vision path stayed for the rest), and memory is too young to call.

Smarter models don't retire compensation, they *refinance* it.  Generation after generation fixes an old failure mode and brings a new one: lazy became overeager, context anxiety came and went, tool calls started showing up as plain text.  The compensation layer isn't heading to zero, and the harness is where you pay it down.

Some of the harness will be eaten by the model's *vendor* instead, often by training the model on it.  OpenAI says GPT-5.1-Codex-Max is its "[first model natively trained](https://openai.com/index/gpt-5-1-codex-max/) to operate across multiple context windows through a process called compaction" (summarizing old turns so a long session fits), Anthropic now runs [managed agents](https://www.anthropic.com/engineering/managed-agents), and OpenAI's [Agents API](https://developers.openai.com/api/docs/changelog) offers "a managed Codex harness."  That's the bitter lesson collecting its due, and it's still harness, just somebody else's.

There's one more load-bearing piece I'd add, and I'm parking it for its own post: **live tool calibration**.  Plug in two Gmail accounts, one work and one personal, and the generic "Gmail tool" can't tell them apart.  No amount of intelligence knows which Gmail is the work one without asking, so I'd like the harness to probe each connection when it's plugged in, write down what it finds, and re-check it later, since a server can [behave well at first and change](https://arxiv.org/abs/2608.23763).  The closest prior art I found, [AutoContext](https://arxiv.org/abs/2510.02369), explores simulated environments once and saves what it learns.  Nothing I found probes a real account at attach time and writes down what it is.

## 👣 Next steps

1. **Add the open vendor harnesses** - Codex CLI and Gemini CLI - to see whether a harness that tracks one vendor's models deletes compensation faster.  Anthropic's write-ups suggest it does.  (me, by end of year)
2. **Re-run the census on the next frontier release** and see whether `overeager` gets a sibling.  (me, when it ships)
3. **Prototype live tool calibration** and measure it against a plain tool description.  (me, in the follow-up post)
4. **Find a harness that measures whether its learned skills help.**  (you?  see below)

## 🙏 Credits

Shoulders of giants.  Paul Gauthier, for three years of unusually honest notes: release notes that say *why*, benchmark data that counts malformed responses, and a running tally of how much of Aider was written by Aider.  Kujtim Hoxha, Dax Raad and the OpenCode crew, and Teknium and the Nous Research community behind Hermes Agent, for building in the open.  Benjamin Rombaut, whose taxonomy of 13 coding agents is the best map of this territory.  And Prithvi Rajasekaran, Lance Martin and the Anthropic engineers who wrote down which pieces of their harnesses they deleted, and why.

If you maintain a harness: which flags have you quietly stopped adding, and which did you just add?  I'd love to compare notes, and if you've built a harness that *measures* whether its learned skills help, I really want to see it.  🙏

The model's going to keep eating.  Let's make sure we feed it the right parts.  Bon appétit! 🍽️
