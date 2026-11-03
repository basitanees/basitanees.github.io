---
title: LLM-driven candidate assessment
section: work
alsoIn: research
form: page
areas: [ai-agents, llm-systems]
org: aiXplain
role: Research Engineer
start: '2023-06'
end: present
summary: A platform that uses LLMs to assess and rank job candidates from CVs, video assessments and chat-based interviews. I designed it and co-authored the EACL 2026 paper on it.
links:
  - { label: arXiv, href: 'https://arxiv.org/abs/2603.26710' }
order: 20
---

**Agentic AI for Human Resources: LLM-Driven Candidate Assessment.** EACL 2026. Kamer Ali Yuksel (first author), me, Ashraf Elneima, Sanjika Hewavitharana, Mohamed Al-Badrashiny and Hassan Sawaf.

## The problem

Most applicant tracking systems match keywords or hand out shallow scores. A hiring team needs more than that: an assessment it can read, question and audit.

## What I designed

The platform evaluates and ranks candidates from several kinds of input at once: CV analysis, video assessments and interactive chat-based interviews.

The paper describes the framework behind it:

- An LLM writes a rubric for each role, and several agents evaluate every candidate against it, criterion by criterion.
- Inputs include the job description, CVs, interview transcripts and HR feedback.
- The output is structured: assessment reports, candidate comparisons and ranked recommendations a hiring team can audit.

## Ranking with mini-tournaments

Comparing every pair of candidates is noisy and slow. Scoring each one on their own is inconsistent.

So the LLM ranks small groups of candidates at a time. A Plackett-Luce model combines those small rankings into one, and an active-learning loop picks whichever group will tell it the most next. The result is a ranking that holds together across the whole pool, with far fewer comparisons.
