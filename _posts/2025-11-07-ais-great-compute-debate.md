---
layout: post
title: "Are my inane questions going to outer space?"
date: 2025-11-07
---

![AI Compute Visualization](/temp-image-1762539191367-kz3suf.jpg)

Here's a hot take on the future of AI compute. When you hear about Google's Project Suncatcher—their actual moonshot research into solar-powered satellite constellations with onboard TPUs—it paints a vivid picture of one possible future. In that world, the demand for computation is so vast that we literally have to go off-planet to power it. It leads to a provocative question: a decade from now, when I'm on a run and summon my personal AI, will my voice command travel to space and back just to be understood?

## The Other Side of the Coin: Efficiency at the Edge

But there's another path. My own experience running cloud-hosted models locally on consumer-grade hardware reveals the incredible potential of optimization. When you examine a specialized Tensor Processing Unit (TPU) handling quantized 8-bit integer operations, it can outperform a massive, general-purpose processor that consumes ten times the wattage. The performance gains aren't small—we're talking orders of magnitude.

**Documented Efficiency Gains: 30-80× performance per watt**

This isn't magic; it's simply reconfiguring the same silicon to be hyper-optimized for a specific task. And these are just the gains we're seeing today—as we stack algorithmic improvements, precision optimizations, and specialized hardware, could we push toward 100× or beyond? This opens up possibilities like dynamic silicon configuration or even creating custom, model-specific hardware. It suggests a future that isn't about endlessly scaling up, but about radically scaling *smart*.

## Why Edge Computing Matters Beyond Efficiency

There's more to the edge story than just performance per watt. Computation at the edge brings privacy, isolation, air-gapped security, offline operation, and resilience. These aren't just nice-to-haves—they're requirements for entire sectors. Legal work demands client confidentiality. Medical applications require HIPAA compliance and can't risk patient data in transit. Defense applications need air-gapped systems. And pragmatically, most of us simply want personal privacy for our personal queries.

This isn't a niche concern. The pressure from these sectors—legal, medical, defense, and billions of individuals who value privacy—represents enormous market opportunity. That pressure will keep us innovating around computation in the small.

And here's the thing: while certain applications will demand cutting-edge, latest-generation intelligence running on massive infrastructure, the majority of people on the planet strategizing their bathroom remodel or planning tomorrow's dinner won't need it. Those everyday queries can run beautifully on efficient, private, local hardware.

## It's Not Just the Hardware: Smarter Model Optimization

This efficiency-first mindset extends to the models themselves. We're already proficient at the basics of model optimization, but new frontiers are emerging that could change the game entirely:

**Pruning**
Removing entire layers or connections from neural networks to reduce size and complexity.

**Quantization**
Decreasing the numerical precision of model weights (e.g., from 32-bit to 8-bit integers).

**Distillation**
Training a smaller "student" model to mimic the behavior of a larger, more complex "teacher" model.

**Neural Transformation**
An emerging technique that regenerates portions of models in code, re-architecting them for maximum inference speed.

That last one is especially intriguing. Right now, we design models using abstractions that are easy for humans to build and train. But those structures are often suboptimal for actual inference. Neural compiler systems like TVM, AITemplate, and XLA are already delivering single-digit to low-double-digit speedups by transforming models into optimized kernels. What if, as these techniques mature, we could automatically re-architect trained models to achieve dramatically faster inference—the trajectory is compelling.

## A Tale of Two Futures

This brings us to a fundamental fork in the road for AI's future. Which path will we follow?

> When I'm on my run and I ask a question... is that question going to run out in space and be executed in a data center? Or is it actually going to be executed on a device on my person—maybe not powered by my footsteps today (we're talking milliwatts from kinetic harvesters versus watts for even efficient NPUs), but perhaps by a battery-efficient chip that only needs charging once a week?

The current chase for compute, with trillions of dollars and massive energy subsidies on the line, feels all-consuming. Industry forecasts project data-center electricity demand doubling by 2030, driven by AI. But what if, underneath that growth, there's a different question worth asking?

> Is this incessant compute demand a temporary artifact of this technological inflection... where we know what we want to build, but we don't yet have the optimal hardware to run it?

It's not the common line you hear from companies building massive data centers. The growth is real. But the question remains compelling: how much of today's computing load could migrate to radically more efficient architectures once we optimize for inference rather than racing to train ever-larger models?

Are we building a bigger engine, when what we really need is a more aerodynamic car? I'm curious to see where this goes.
