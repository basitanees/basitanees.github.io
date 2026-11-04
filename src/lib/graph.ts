import { AREAS, AREA_IDS, type AreaId } from '../data/areas.ts';
import { GRAPH, PROJECT_OVERRIDES, RELATED, type GraphEntry } from '../data/graph.ts';

export interface FlatEntry {
  id: string;
  label: string;
  desc?: string;
  area: AreaId;
  /** Parent entry id, or null for a top-level entry. */
  parent: string | null;
  /** 1 for a top-level entry. */
  depth: number;
  projects: string[];
  children: string[];
}

/** Empty drafts are kept in the data but never rendered. */
const rendered = (e: GraphEntry) => !(e.draft && !(e.projects?.length || e.items?.length));

/** Every rendered entry, in document order. */
export function flattenGraph(): FlatEntry[] {
  const out: FlatEntry[] = [];
  const walk = (items: GraphEntry[], area: AreaId, parent: string | null, depth: number) => {
    for (const e of items.filter(rendered)) {
      const kids = (e.items ?? []).filter(rendered);
      out.push({ id: e.id, label: e.label, desc: e.desc, area, parent, depth, projects: e.projects ?? [], children: kids.map((k) => k.id) });
      walk(kids, area, e.id, depth + 1);
    }
  };
  for (const area of AREA_IDS) walk(GRAPH[area], area, null, 1);
  return out;
}

/** The areas whose entries list this project, in ring order. */
export function projectAreas(slug: string): AreaId[] {
  const found = new Set(flattenGraph().filter((e) => e.projects.includes(slug)).map((e) => e.area));
  return AREA_IDS.filter((a) => found.has(a));
}

/** Problems with the graph data. Empty when it is valid against the given project slugs. */
export function graphProblems(slugs: string[]): string[] {
  const problems: string[] = [];
  const known = new Set(slugs);
  const all: GraphEntry[] = [];
  const collect = (items: GraphEntry[]) => items.forEach((e) => (all.push(e), collect(e.items ?? [])));
  AREA_IDS.forEach((a) => collect(GRAPH[a]));

  const seen = new Set<string>();
  for (const e of all) {
    if (seen.has(e.id)) problems.push(`duplicate entry id: ${e.id}`);
    seen.add(e.id);
  }
  const flat = flattenGraph();
  const byId = new Map(flat.map((e) => [e.id, e]));
  for (const e of flat) {
    for (const s of e.projects) if (!known.has(s)) problems.push(`unknown project "${s}" in entry ${e.id}`);
    if (e.depth === 1 && !e.desc) problems.push(`top-level entry ${e.id} has no description`);
    if (!e.desc && !e.projects.length && !e.children.length) problems.push(`entry ${e.id} has no description, project or sub-entry`);
  }
  for (const [a, b] of RELATED) {
    const ea = byId.get(a);
    const eb = byId.get(b);
    if (!ea || !eb) problems.push(`related link ${a} ↔ ${b} names a missing entry`);
    else if (ea.area === eb.area) problems.push(`related link ${a} ↔ ${b} is inside one area`);
  }
  return problems;
}

/** Every string the graph shows, for the guard check. */
export function graphStrings(): string[] {
  return [
    ...AREAS.flatMap((a) => [a.label, a.caption]),
    ...flattenGraph().flatMap((e) => [e.label, e.desc ?? '']),
    ...Object.values(PROJECT_OVERRIDES).map((o) => o.label ?? ''),
  ].filter(Boolean);
}
