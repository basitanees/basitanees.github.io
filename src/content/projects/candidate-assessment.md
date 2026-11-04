---
title: HR manager
section: work
alsoIn: research
form: page
areas: [agentic-systems]
org: aiXplain
role: Research Engineer
start: '2023-06'
end: present
summary: aiXplain's HR manager assesses and ranks job candidates from their CVs, video interviews with an AI avatar and chat-based interviews. I designed it, and it ranks candidates with the method from my co-authored EACL 2026 paper.
links:
  - { label: Product page, href: 'https://hrmanager.aixplain.com/' }
  - { label: arXiv, href: 'https://arxiv.org/abs/2603.26710' }
order: 20
---

## What I designed

The HR manager evaluates and ranks candidates from several kinds of input at once:

- **CV analysis.**
- **Video interviews**, where the candidate talks to an AI avatar.
- **Interactive chat-based interviews.**

Every interview then goes through transcript analysis and emotion analysis, so the assessment covers how the candidate answered as well as what they said.

I also designed its PostgreSQL schema and Alembic migrations.

## The paper

**Agentic AI for Human Resources: LLM-Driven Candidate Assessment.** EACL 2026. Kamer Ali Yuksel (first author), me, Ashraf Elneima, Sanjika Hewavitharana, Mohamed Al-Badrashiny and Hassan Sawaf.

Most applicant tracking systems match keywords or hand out shallow scores. A hiring team needs more than that: an assessment it can read, question and audit. The paper describes the framework:

- An LLM writes a rubric for each role, and several agents evaluate every candidate against it, criterion by criterion.
- Inputs include the job description, CVs, interview transcripts and HR feedback.
- The output is structured: assessment reports, candidate comparisons and ranked recommendations a hiring team can audit.

## Ranking with mini-tournaments

The HR manager ranks candidates with the paper's method.

Comparing every pair of candidates is noisy and slow. Scoring each one on their own is inconsistent.

So the LLM ranks small groups of candidates at a time. A Plackett-Luce model combines those small rankings into one, and an active-learning loop picks whichever group will tell it the most next. The result is a ranking that holds together across the whole pool, with far fewer comparisons.
