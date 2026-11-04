import type { AreaId } from '../data/areas.ts';
import type { GraphPayload } from './graph-payload.ts';

export type NodeKind = 'me' | 'area' | 'entry' | 'project';
export interface VNode {
  id: string;
  kind: NodeKind;
  /** Area id, entry id or project slug. */
  ref: string;
  label: string;
  /** The node this one grew from; for a shared project, its first visible open parent. */
  parent: string | null;
  area: AreaId | null;
  depth: number;
  open: boolean;
  paper: boolean;
}
export interface VLink { id: string; source: string; target: string; kind: 'tree' | 'related' }
export interface VisibleGraph { nodes: VNode[]; links: VLink[] }
export interface ViewState { expanded: Set<string>; focus: string | null }

const split = (id: string): [NodeKind, string] => {
  const i = id.indexOf(':');
  return i < 0 ? ['me', ''] : [id.slice(0, i) as NodeKind, id.slice(i + 1)];
};

export function childrenOf(p: GraphPayload, nodeId: string): string[] {
  const [kind, ref] = split(nodeId);
  if (kind === 'area') return p.areas.find((a) => a.id === ref)?.entries.map((e) => `entry:${e}`) ?? [];
  if (kind === 'entry') {
    const e = p.entries[ref];
    return e ? [...e.children.map((c) => `entry:${c}`), ...e.projects.filter((s) => p.projects[s]).map((s) => `project:${s}`)] : [];
  }
  return [];
}

function makeNode(p: GraphPayload, id: string, parent: string | null, open: boolean): VNode {
  const [kind, ref] = split(id);
  if (kind === 'area') {
    const a = p.areas.find((x) => x.id === ref)!;
    return { id, kind, ref, label: a.label, parent, area: a.id, depth: 0, open, paper: false };
  }
  if (kind === 'entry') {
    const e = p.entries[ref];
    return { id, kind, ref, label: e.label, parent, area: e.area, depth: e.depth, open, paper: false };
  }
  if (kind === 'project') {
    const pr = p.projects[ref];
    const area = parent ? p.entries[split(parent)[1]]?.area ?? null : null;
    return { id, kind, ref, label: pr.label, parent, area, depth: 9, open: false, paper: pr.paper };
  }
  return { id: 'me', kind: 'me', ref: '', label: 'Abdul Basit', parent: null, area: null, depth: -1, open: true, paper: false };
}

/** What is on screen for a given set of open nodes. */
export function visibleGraph(p: GraphPayload, expanded: ReadonlySet<string>): VisibleGraph {
  const nodes = new Map<string, VNode>();
  const links: VLink[] = [];
  const add = (id: string, parent: string | null) => {
    const n = makeNode(p, id, parent, expanded.has(id));
    nodes.set(id, n);
    return n;
  };
  add('me', null);
  const queue: VNode[] = p.areas.map((a) => {
    links.push({ id: `tree:me>area:${a.id}`, source: 'me', target: `area:${a.id}`, kind: 'tree' });
    return add(`area:${a.id}`, 'me');
  });
  while (queue.length) {
    const n = queue.shift()!;
    if (!n.open) continue;
    for (const c of childrenOf(p, n.id)) {
      if (!nodes.has(c)) queue.push(add(c, n.id));
      links.push({ id: `tree:${n.id}>${c}`, source: n.id, target: c, kind: 'tree' });
    }
  }
  const resolve = (entry: string): string => {
    let id = entry;
    while (!nodes.has(`entry:${id}`)) {
      const e = p.entries[id];
      if (!e.parent) return `area:${e.area}`;
      id = e.parent;
    }
    return `entry:${id}`;
  };
  const seen = new Set<string>();
  for (const [a, b] of p.related) {
    const ends = [resolve(a), resolve(b)].sort();
    const id = `related:${ends[0]}|${ends[1]}`;
    if (ends[0] === ends[1] || seen.has(id)) continue;
    seen.add(id);
    links.push({ id, source: ends[0], target: ends[1], kind: 'related' });
  }
  return { nodes: [...nodes.values()], links };
}

/** The nodes that stay bright when `focus` is selected; null when nothing is. */
export function highlightSet(g: VisibleGraph, focus: string | null): Set<string> | null {
  if (!focus) return null;
  if (!g.nodes.some((n) => n.id === focus)) return null;
  // Walk every tree link, so a project shared by two open entries counts under both.
  const parents = new Map<string, string[]>();
  const kids = new Map<string, string[]>();
  for (const l of g.links) {
    if (l.kind !== 'tree') continue;
    parents.set(l.target, [...(parents.get(l.target) ?? []), l.source]);
    kids.set(l.source, [...(kids.get(l.source) ?? []), l.target]);
  }
  const walk = (start: string, next: Map<string, string[]>) => {
    const seen = new Set<string>();
    const stack = [...(next.get(start) ?? [])];
    while (stack.length) {
      const x = stack.pop()!;
      if (seen.has(x)) continue;
      seen.add(x);
      stack.push(...(next.get(x) ?? []));
    }
    return [...seen];
  };
  const below = walk(focus, kids);
  const set = new Set([focus, ...walk(focus, parents), ...below]);
  const mine = new Set([focus, ...below]);
  for (const l of g.links) {
    if (l.source === focus) set.add(l.target);
    if (l.target === focus) set.add(l.source);
    if (l.kind === 'related') {
      if (mine.has(l.source)) set.add(l.target);
      if (mine.has(l.target)) set.add(l.source);
    }
  }
  return set;
}

/** The next state after a node click. Never mutates `s`. */
export function onNodeClick(p: GraphPayload, s: ViewState, id: string): ViewState {
  const expanded = new Set(s.expanded);
  if (id === 'me') return { expanded, focus: null };
  if (!childrenOf(p, id).length) return { expanded, focus: id };
  if (!expanded.has(id)) {
    expanded.add(id);
    return { expanded, focus: id };
  }
  if (s.focus !== id) return { expanded, focus: id };
  const g = visibleGraph(p, s.expanded);
  const byId = new Map(g.nodes.map((n) => [n.id, n]));
  const under = (x: string) => {
    for (let n = byId.get(x); n; n = n.parent ? byId.get(n.parent) : undefined) if (n.parent === id) return true;
    return false;
  };
  for (const x of [...expanded]) if (x === id || under(x)) expanded.delete(x);
  const parent = byId.get(id)?.parent ?? null;
  return { expanded, focus: parent === 'me' ? null : parent };
}

export function onBackgroundClick(s: ViewState): ViewState {
  return { expanded: new Set(s.expanded), focus: null };
}
