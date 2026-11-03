---
title: Voice agents and call center studio
section: work
form: page
areas: [ai-agents, llm-systems]
org: aiXplain
role: Research Engineer
start: '2023-06'
end: present
summary: A call center studio I designed for building voice agents, a voice customer-service agent I built end to end for a client, and the evals and prompt optimization that keep it getting better.
order: 15
---

## The call center studio

I designed a whole call center studio for building voice agents. In it, users can:

- define agent profiles and their prompts, with prompt versioning;
- set up the agent and its LLM;
- choose and tune the text-to-speech and speech-to-text models.

Each agent keeps an internal memory of the call, which it can look up and update as the conversation goes. And I tuned the whole studio for latency and a smooth experience, because on a phone call every pause shows.

## A voice agent for a client

I built a voice customer-service agent for a client end to end, from the first idea to live calls. Callers ask questions, and the agent answers from the client's customer data by running SQL queries against it.

It now follows its instructions on live calls.

## Evals that keep finding failures

- **Mined from production logs.** Calls are evaluated continuously, and every failure becomes a new test case on the fly.
- **Written from guidance.** I can generate new test cases, or improve existing ones, by describing what I want in plain text.
- **Run with repeats.** Every test case runs several times, so the agent has to pass consistently, not once by luck.

## Prompt optimization with GEPA

On top of the evals, I built a prompt optimization loop on [GEPA](https://arxiv.org/abs/2507.19457), the reflective prompt-evolution method from Agrawal et al. (2025). It rewrites the agent's prompt to score better on the test cases, within a dollar budget, an iteration budget and any constraints the user sets.

A held-out set checks every improvement, so the prompt doesn't overfit to the tests it learned from.
