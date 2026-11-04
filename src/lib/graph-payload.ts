import { AREAS, type AreaId } from '../data/areas.ts';
import { PROJECT_OVERRIDES, RELATED } from '../data/graph.ts';
import { flattenGraph } from './graph.ts';
import { formatDates, projectHref, type P } from './projects.ts';

export interface GraphPayload {
  areas: { id: AreaId; label: string; caption: string; href: string; entries: string[] }[];
  entries: Record<string, { label: string; desc?: string; area: AreaId; parent: string | null; depth: number; children: string[]; projects: string[] }>;
  projects: Record<string, { label: string; summary: string; meta: string; paper: boolean; href: string | null; listHref: string; under: string[] }>;
  related: [string, string][];
}

/** Everything the homepage graph needs, as plain JSON. */
export function buildGraphPayload(projects: P[]): GraphPayload {
  const flat = flattenGraph();
  const entries: GraphPayload['entries'] = {};
  for (const e of flat) entries[e.id] = { label: e.label, desc: e.desc, area: e.area, parent: e.parent, depth: e.depth, children: e.children, projects: e.projects };

  const out: GraphPayload['projects'] = {};
  for (const p of projects) {
    const under = flat.filter((e) => e.projects.includes(p.id)).map((e) => e.id);
    if (!under.length) continue;
    const o = PROJECT_OVERRIDES[p.id] ?? {};
    out[p.id] = {
      label: o.label ?? p.data.title,
      summary: p.data.summary,
      meta: [p.data.org, formatDates(p.data.start, p.data.end)].filter(Boolean).join(' · '),
      paper: !!o.paper,
      href: projectHref(p),
      listHref: `/${p.data.section}/`,
      under,
    };
  }
  return {
    areas: AREAS.map((a) => ({ id: a.id, label: a.label, caption: a.caption, href: `/areas/${a.id}/`, entries: flat.filter((e) => e.area === a.id && !e.parent).map((e) => e.id) })),
    entries: JSON.parse(JSON.stringify(entries)),
    projects: out,
    related: RELATED.map(([a, b]) => [a, b]),
  };
}
