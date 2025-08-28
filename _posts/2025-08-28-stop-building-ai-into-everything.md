---
title: Stop Building AI Into Everything
date: 2025-08-28
---

I was jogging this morning when Strava congratulated me with another jaunty AI summary. Cute. Useless. And emblematic of a bigger trend: every product team is racing to bolt an AI assistant onto their surface. Meanwhile, the work I want done starts *above* any single app and crosses *all* of them.

![Overwhelm: every device wants to talk](/i/voice-everywhere.png)



Let's stop pretending the interface we should talk to lives inside every silo. It doesn't. **AI assistants belong to the user's agent**—the thing that knows our world, our preferences, our data—**not embedded per-app**.

---

## The pattern behind the hype (and why it breaks)

- **Context lives across silos.** Real tasks (“compare this contract to last year and draft legal’s email”) braid together files, mail, calendar, and notes.
- **Preference & memory sprawl.** Ten mini-assistants each want their own persona, settings, and memory. I want one brain that learns me once.
- **Redundant R&D, brittle UX.** Per-app AI assistants are expensive to build, hard to maintain, and never as capable as a user-chosen agent with proper tools.

If you're building an AI assistant into a single product, ask: *Am I a data source, or am I the primary actor the user truly wants to talk to?* Most apps are sources. That's not an insult; it's a design truth.

---

## Exhibit A through F: nice demos, wrong layer

### A) Adobe Acrobat: “talk to your PDF”
Acrobat’s AI Assistant now supports hands-free voice in its app and “PDF Spaces.” You can literally talk to a document viewer, ask questions, and get spoken responses.  
**Why this misses:** contracts live in Drive, mail, Slack, Notion, and history. The useful task ("compare to last year; draft legal's note; propose redlines") spans storage + email + calendar. The viewer shouldn't own that assistant.

### B) Google Photos “Ask Photos”: chat with your memories
Ask Photos is a conversational way to query your photo library—“show me the best picture from each national park I visited.”  
**Why this misses:** trip planning based on those memories needs Maps, airline emails, hotel receipts, and everyone’s calendar. Photo memory ≠ trip plan.

### C) Spotify DJ: hold to talk to the DJ
The AI DJ now takes real-time voice requests in many markets for Premium users. Hold the button, speak a mood/genre, the DJ adapts.  
**Why this misses:** “45-minute tempo arc for a hill workout” is a *training* intent—calendar + route + HR zones + speakers—not a music-only intent. Music is a source; my agent should orchestrate it.

### D) Zoom AI Companion: another assistant in the meeting window
Zoom lets participants ask in-meeting questions grounded in the live transcript.  
**Why this misses:** summarizing a meeting is nice; the real work—file tickets, schedule follow-ups across teams, update docs—lives outside Zoom. Let **my** agent, which already knows my projects and context, drive that.

### E) Bank of America “Erica”: talk to *their* assistant
Erica is a mature, bank-scoped assistant with massive usage.  
**Why this misses:** meaningful guidance needs a unified view across multiple banks, brokerages, subscriptions, and goals. My agent should model cashflow; the bank is a data source.

### F) GitHub “Copilot Voice”: a cautionary tale
GitHub ended the specialized “Hey, GitHub!” voice preview and handed speech to the generic VS Code speech extension.  
**Why this teaches the lesson:** maintaining AI assistants per surface is brittle. The durable value concentrates at the **agent layer** that spans repos, issues, docs, and chat—not one editor.

---

## What good looks like

**One agent. Many tools. Zero silos.**  
The thing I talk to should be *mine*: latest-gen model, my privacy posture (including on-device when I want it), my visualization stack (diagrams, charts), my long-term memory, and my *connections*—email, files, calendar, chat, repos, analytics, bank feeds, health, you name it.

Vendors should **ship tools and authenticated access**, not their own AI overlord:

- **Expose capabilities as tools** (query, fetch, mutate) with clear schemas and scopes.
- **Standardize auth** so my agent can connect once and rotate tokens sanely.
- **Return structured, composable data** (not just prose) so my agent can fuse and visualize.
- **Stay opinionated at the source** (great analytics! great file diffs!) while resisting “agent-cosplay.”

Call it MCP-ish if you like; call it "tools over assistants." The point is the same: **apps provide data and actions; the agent provides the conversation and the plan**.

---

## A quick design test for builders

1. *Are you a destination or a datasource?*  
   If most valuable user intents require other systems, you're a **source**—optimize for tools and access, not owning the AI assistant.

2. *Does your AI assistant meaningfully outperform the user's agent with your tools attached?*  
   If not, you’re adding **redundant UX** and maintenance.

3. *Will your per-app memory and visualization choices scale to user preference?*  
   Probably not. Let the **agent own preference**, you own **truth and capability**.

---

## The industry nudge (a friendly one)

Big players building user-agents should **align on auth and capability schemas** so we don’t recreate the streaming-app mess for AI. Vendors who resist will ship louder demos and worse outcomes. Vendors who cooperate will ship fewer UIs and better user value.

We can still ship "starter" AI assistants inside products for *debugging and testing your tools*. Just don't confuse that with the endgame. The endgame is simple:

> **Let my agent talk.**  
> **Let your app do.**

