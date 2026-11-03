---
title: Voice customer-service agent
section: work
form: page
areas: [ai-agents, llm-systems]
org: aiXplain
role: Research Engineer
start: '2023-06'
end: present
summary: A voice customer-service agent I built end to end for a client, from the first idea to live calls. It answers from the client's customer data through SQL, and an eval harness keeps finding its failures and making it better.
order: 15
---

I built this voice agent for a client end to end, from the first idea to live calls. Callers ask questions, and the agent answers from the client's customer data by running SQL queries against it.

## An agent that keeps getting better

Shipping the first version is the easy part. The real work is improving it from what real callers do, without fitting it to its own tests. So I built an eval harness around it:

- **Live logs become tests.** Customer logs are evaluated continuously, and every failure turns into a new test case on the fly.
- **No lucky passes.** Each test case runs several times before it counts.
- **Budgeted prompt optimization.** Prompt optimization runs within an LLM budget the user chooses, and keeps going until the test cases pass.
- **A held-out check.** Every change is checked against a held-out set, so the agent doesn't overfit to the tests it learned from.

## Where it got to

The agent now follows its instructions on live calls, and the evals keep catching new failures as callers find them.
