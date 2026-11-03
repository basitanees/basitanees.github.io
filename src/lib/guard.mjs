import { readFileSync } from 'node:fs';

const BANNED_WORDS = JSON.parse(readFileSync(new URL('./banned-words.json', import.meta.url), 'utf8'));

// Proper names and technical terms from the sources that happen to contain a banned word.
const ALLOWLIST = [
  'Visual-Inertial Integrated Navigation System',
  'A Unified Framework for Domain Adaptation, Image Synthesis and Manipulation',
  'eval harnesses',
  'eval harness',
];

const PATTERNS = [
  ['phone', /\+?\d[\d\s-]{9,}\d/g],
  ['em-dash', /[—―]/g],
  ['figure', /\d+(\.\d+)?\s?%/g],
  ['figure', /\b\d+(\.\d+)?\s?(percent|per cent)\b/gi],
  ['figure', /\b\d+(\.\d+)?\s?[×x](?![a-z])/gi],
  ['figure', /\b\d+(\.\d+)?\s?times\b/gi],
  ['figure', /\b\d+(\.\d+)?\s?ms\b/gi],
  ['figure', /\b\d+(\.\d+)?\s(s|secs?|seconds?|milliseconds?)\b/gi],
  ['figure', /\b\d+(\.\d+)?[kmb]\b/gi],
  ['figure', /~\s?\d/g],
  ['figure', /\b\d{1,3}(,\d{3})+\b/g],
  ['figure', /\b\d+\+(?!\s?years)/g],
  ['figure', /\d+\s?(→|->)\s?\d+/g],
  ['figure', /\b(millions|billions|thousands|hundreds|dozens) of\b/gi],
];

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Each banned word plus its common inflections (leverage → leveraging, robust → robustness).
const inflected = (w) => `${escapeRegExp(w.endsWith('e') ? w.slice(0, -1) : w)}(?:e|es|ed|d|ing|s|ness|ity|ities|ment|ments|ly|er|ers)?`;
const BANNED_RE = new RegExp(`\\b(${[...BANNED_WORDS.map(inflected), 'scalability'].join('|')})\\b`, 'gi');

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', horbar: '―', hellip: '…', middot: '·', times: '×', rarr: '→', larr: '←',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', copy: '©',
};

export function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
      if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

// `forbidden` is an extra list of terms to reject, supplied at run time.
export function findViolations(text, { forbidden = [] } = {}) {
  const found = [];
  for (const term of forbidden) {
    const re = new RegExp(`\\b${term.trim().split(/\s+/).map(escapeRegExp).join('\\s+')}\\b`, 'gi');
    for (const m of text.matchAll(re)) found.push({ rule: 'forbidden-term', match: m[0], index: m.index });
  }
  for (const [rule, re] of PATTERNS) {
    for (const m of text.matchAll(re)) found.push({ rule, match: m[0], index: m.index });
  }
  let prose = text;
  for (const phrase of ALLOWLIST) prose = prose.replace(new RegExp(escapeRegExp(phrase), 'gi'), (p) => ' '.repeat(p.length));
  for (const m of prose.matchAll(BANNED_RE)) found.push({ rule: 'banned-word', match: m[0].toLowerCase(), index: m.index });
  return found.sort((a, b) => a.index - b.index);
}
