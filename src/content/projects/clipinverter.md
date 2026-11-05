---
title: CLIPInverter
section: research
form: page
areas: [ml-foundations, generative-vision]
org: KUIS AI Center, Koç University
start: '2021-04'
end: '2023'
summary: Edits real photos from a free-form text description by conditioning the GAN inversion itself on the text. Published in ACM Transactions on Graphics and presented at SIGGRAPH Asia 2023. I built its refinement module.
links:
  - { label: arXiv, href: 'https://arxiv.org/abs/2307.08397' }
  - { label: DOI, href: 'https://doi.org/10.1145/3610287' }
  - { label: Project page, href: 'https://cyberiada.github.io/CLIPInverter/' }
  - { label: Demo, href: 'https://huggingface.co/spaces/johnberg/CLIPInverter' }
  - { label: 'Code', href: 'https://github.com/johnberg1/CLIPInverter' }
order: 20
---

**CLIP-Guided StyleGAN Inversion for Text-Driven Real Image Editing.** ACM Transactions on Graphics, 2023, presented at SIGGRAPH Asia 2023. Ahmet Canberk Baykal (first author), me, Duygu Ceylan, Erkut Erdem, Aykut Erdem and Deniz Yuret.

## The problem

You have a real photo and a sentence describing how it should change. The usual options both hurt. Optimising a latent code for every image is slow. Mapping fixed prompts to editing directions struggles when the description asks for several changes at once.

## The idea

Condition the inversion itself on the text. CLIPInverter has two parts:

- **CLIPAdapter:** small text-conditioned adapter layers that steer a pretrained GAN-inversion encoder (e4e) using the CLIP embedding of the target text, while it's still inverting the image.
- **CLIPRemapper:** a CLIP-guided refinement step that corrects the predicted residual latent code.

## My part

I built the first working prototype of CLIPAdapter, then handed it over to a co-author. I designed and built CLIPRemapper on my own, from start to finish.

## What it can do

- Edit real photos from free-form text, across human faces, cats and birds.
- Handle descriptions with several attributes, combine facial attributes, and change an attribute gradually.
- Take a reference image instead of text, and cope with captions it never saw in training.

The project page compares it with StyleCLIP-LM and HairCLIP, and reports more accurate edits and more photo-realistic results, shown in qualitative figures.

## Credit

The official code is linked above.
