---
slug: coaching
date: 2025-09-01
weight: 2.4M
gloss: llm running coach
role: builder + runner
when: 2025 — present
scope: personal AI running coach + Strava data pipeline
stack: [Claude Code, Python, Strava API, Cloudflare Tunnel, Markdown]
status: live
links:
  - { label: "latest run", url: "https://oschei.com/about/" }
title: coAchIng
description: An LLM-driven running coach that reads my Strava history and plans the next block.
---

## what it is

An LLM running coach that runs inside Claude Code. A markdown vault holds the
runner profile, training blocks, weekly and post-run reviews, and race history;
a Python pipeline pulls every run from the Strava API into CSVs the coach treats
as its canonical log. It plans forward, reviews each session against the data,
and calls out drift between training and goals rather than cheerleading.

It debuted by pacing a first marathon to 3:58:57 — sub-4, Zürich, April 2026.

## what it taught

Most of the value is in the boring parts: a stable data schema, "newest run
first" conventions, and a coach persona disciplined enough to lead with numbers
and push back on weak goals. The model is only as good as the retrieval and the
guardrails around it. Giving it a real role, read-only by default and asking
before it writes, made it useful instead of agreeable.

## stack notes

Strava API → a Python fetcher (incremental, summary plus per-activity detail)
→ CSVs the coach reads directly. A webhook behind a Cloudflare tunnel fires
after each run and publishes the latest activity back to this site — the
live block on the about page is the same pipeline closing the loop.
