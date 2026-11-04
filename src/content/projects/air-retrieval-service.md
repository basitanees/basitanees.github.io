---
title: aiR retrieval service
section: work
form: page
areas: [retrieval-rag, knowledge-graphs, agentic-systems, ml-infrastructure]
org: aiXplain
role: Research Engineer
start: '2023-06'
end: present
summary: I own aiR, the retrieval service behind every aiXplain agent's knowledge base, and I designed its V3 rebuild for scale, accuracy and reliability.
order: 10
---

aiR is where aiXplain agents look things up. When an agent has to answer from a pile of documents, aiR finds the passages that hold the answer and hands them over with their sources.

I own the service end to end, and I designed its V3 rebuild. The goals were easy to say and hard to hit: find the right passage more often, give agents less text to read, and fit far more data on the same machines.

On an Arabic encyclopedia benchmark, V3 puts the right article first much more often than V2 did. Agents read a fraction of the text they used to, and the same data needs far less memory.

## What it does

- **Hybrid search** on Qdrant: vector and keyword (BM25) search together.
- **LLM re-ranking**, so agents get a short list of results that actually holds the answer.
- **Structure-aware indexing** and context-aware embeddings, so each passage is understood as part of its whole document.
- **A semantic and metadata layer:** per-collection field schemas and index-level defaults.
- **Multi-query search** that merges many queries into one ranked list, and **grouped search** for variety across documents.
- **Reading-order and neighbouring-chunk retrieval**, so an answer split across chunks arrives whole.
- **Provenance on every result** (source document, chunk and matched query), so agents can cite their evidence.

I also led IndexFactory, aiR's SDK layer, which put different vector and graph-search backends behind one interface.

## Built to grow

I re-architected storage around a multi-tenant design. That lifted the old cap on the number of indexes, and an empty index now costs nothing. Compression with Google's TurboQuant cut memory again, with no measurable loss in accuracy.

## Running it

I run aiR in production: Kubernetes on AWS (EKS), CI/CD for aiR, Koder and the aiXplain SDK, Datadog tracing across services, and backups and capacity planning for every production collection.

## How a change gets in

I set one rule for every retrieval change: benchmark it against what's in production, on recall, latency and cost, before it ships.

That rule is how research reaches users here. Google's TurboQuant compression, Perplexity's context-aware embeddings and decision-model re-ranking all came in that way.

I write the RFCs and decision briefs that get designs like these adopted.
