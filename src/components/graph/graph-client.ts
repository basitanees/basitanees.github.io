import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationLinkDatum, type SimulationNodeDatum } from 'd3-force';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';
import type { GraphPayload } from '../../lib/graph-payload';
import { highlightSet, onBackgroundClick, onNodeClick, visibleGraph, type VLink, type VNode, type ViewState } from '../../lib/graph-state';

type SNode = VNode & SimulationNodeDatum;
type SLink = SimulationLinkDatum<SNode> & { id: string; kind: VLink['kind'] };

const RADIUS: Record<VNode['kind'], number> = { me: 8, area: 7, entry: 5, project: 4.5 };
const radius = (n: VNode) => (n.kind === 'entry' && n.depth > 1 ? 4 : RADIUS[n.kind]);
const colour = (n: VNode) => (n.area ? `var(--kg-${n.area})` : 'var(--text)');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function mountGraph(root: HTMLElement, payload: GraphPayload): void {
  const svgEl = root.querySelector<SVGSVGElement>('.kg-stage svg')!;
  const card = root.querySelector<HTMLElement>('.kg-card')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('is-live');

  const svg = select(svgEl);
  const bg = svg.append('rect').attr('class', 'kg-bg');
  const gE = svg.append('g');
  const gN = svg.append('g');
  let W = 640;
  let H = 460;
  let state: ViewState = { expanded: new Set(), focus: null };
  const store = new Map<string, SNode>();
  let shown = new Set<string>();
  let nodes: SNode[] = [];
  let links: SLink[] = [];

  const sim = forceSimulation<SNode>()
    .force('link', forceLink<SNode, SLink>().id((d) => d.id))
    .force('charge', forceManyBody<SNode>())
    .force('collide', forceCollide<SNode>())
    .force('x', forceX<SNode>().strength(0.04))
    .force('y', forceY<SNode>().strength(0.07))
    .alphaDecay(0.06)
    .velocityDecay(0.5)
    .on('tick', ticked);
  let nodeSel = gN.selectAll<SVGGElement, SNode>('g.n');
  let edgeSel = gE.selectAll<SVGPathElement, SLink>('path');

  function resize() {
    W = Math.max(280, svgEl.clientWidth);
    H = Math.max(280, svgEl.clientHeight);
    svg.attr('viewBox', `0 0 ${W} ${H}`);
    bg.attr('width', W).attr('height', H);
    const me = store.get('me');
    if (me) { me.fx = W / 2; me.fy = H / 2; }
    (sim.force('x') as ReturnType<typeof forceX<SNode>>).x(W / 2);
    (sim.force('y') as ReturnType<typeof forceY<SNode>>).y(H / 2);
    if (nodes.length) applyForces();
    sim.alpha(0.7).restart();
  }

  function applyForces() {
    const scale = Math.min(1, W / 900);
    sim.force<ReturnType<typeof forceLink<SNode, SLink>>>('link')!.links(links)
      .distance((l) => (l.kind === 'related' ? 220 : (l.source as SNode).kind === 'me' ? Math.min(W, H) * 0.36 : 62 * Math.max(0.8, scale)))
      .strength((l) => (l.kind === 'related' ? 0.01 : (l.source as SNode).kind === 'me' ? 0.3 : 0.7));
    sim.force<ReturnType<typeof forceManyBody<SNode>>>('charge')!.strength((d) => ({ me: -600, area: -420, entry: -160, project: -120 })[d.kind]);
    sim.force<ReturnType<typeof forceCollide<SNode>>>('collide')!.radius((d) => ({ me: 44, area: 54, entry: 36, project: 38 })[d.kind]);

  }

  function render() {
    const g = visibleGraph(payload, state.expanded);
    const areas = payload.areas.map((a) => a.id);
    nodes = g.nodes.map((v) => {
      const n = Object.assign(store.get(v.id) ?? ({} as SNode), v);
      store.set(v.id, n);
      if (n.x == null || !shown.has(v.id)) {
        if (v.kind === 'me') { n.x = W / 2; n.y = H / 2; }
        else if (v.kind === 'area' && n.x == null) {
          const ang = -Math.PI / 2 + (areas.indexOf(v.area!) * 2 * Math.PI) / areas.length;
          n.x = W / 2 + Math.cos(ang) * W * 0.3; n.y = H / 2 + Math.sin(ang) * H * 0.32;
        } else if (v.kind !== 'area') {
          const p = store.get(v.parent!)!;
          n.x = p.x! + (Math.random() - 0.5) * 20; n.y = p.y! + (Math.random() - 0.5) * 20; n.vx = 0; n.vy = 0;
        }
      }
      if (v.kind === 'me') { n.fx = W / 2; n.fy = H / 2; }
      return n;
    });
    shown = new Set(nodes.map((n) => n.id));
    links = g.links.map((l) => ({ ...l }));
    sim.nodes(nodes);

    applyForces();
    edgeSel = edgeSel.data(links, (d) => d.id).join('path').attr('class', (d) => (d.kind === 'related' ? 'x' : 'e'));
    nodeSel = nodeSel
      .data(nodes, (d) => d.id)
      .join((enter) => {
        const g2 = enter.append('g');
        g2.append('circle').attr('class', 'halo');
        g2.append('circle').attr('class', 'ring');
        g2.append('circle').attr('class', 'dot');
        g2.append('text').attr('class', 'lbl').attr('text-anchor', 'middle');
        g2.append('text').attr('class', 'cap').attr('text-anchor', 'middle');
        return g2;
      })
      .attr('class', (d) => `n ${d.kind === 'entry' ? 'entry' : d.kind}`)
      .attr('data-node', (d) => d.id)
      .attr('tabindex', (d) => (d.kind === 'me' ? null : 0))
      .attr('role', (d) => (d.kind === 'me' ? null : 'button'))
      .attr('aria-label', (d) => (d.kind === 'me' ? null : `${d.label}${d.kind === 'project' ? '' : d.open ? ', open' : ', folded'}`));
    nodeSel.select('circle.halo').attr('r', (d) => (d.kind === 'project' ? 0 : radius(d) * (d.open ? 4 : 3.1)))
      .style('fill', colour).style('fill-opacity', (d) => (d.open ? 0.2 : 0.13));
    nodeSel.select('circle.ring').attr('r', (d) => (d.paper ? radius(d) + 3.5 : 0)).style('fill', 'none').style('stroke', colour);
    nodeSel.select('circle.dot').attr('r', radius)
      .style('fill', (d) => (d.kind === 'project' ? 'var(--surface)' : colour(d)))
      .style('stroke', (d) => (d.open ? 'var(--text)' : colour(d)))
      .style('stroke-width', (d) => (d.kind === 'project' ? 1.6 : d.open ? 1.5 : 0));
    nodeSel.select('text.lbl').text((d) => d.label).attr('y', (d) => radius(d) + (d.paper ? 17 : 14));
    nodeSel.select('text.cap').text((d) => (d.kind === 'area' ? payload.areas.find((a) => a.id === d.area)!.caption : '')).attr('y', (d) => radius(d) + 27);
    nodeSel.on('click', (ev: MouseEvent, d) => { if (!ev.defaultPrevented) click(d.id); })
      .on('keydown', (ev: KeyboardEvent, d) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); click(d.id); } })
      .call(dragger);
    highlight();
    sim.alpha(reduced ? 0.3 : 0.9).restart();
  }

  function highlight() {
    const set = highlightSet({ nodes, links: links.map((l) => ({ ...l, source: id(l.source), target: id(l.target) })) }, state.focus);
    nodeSel.classed('dim', (d) => !!set && !set.has(d.id));
    edgeSel.classed('dim', (l) => !!set && !(set.has(id(l.source)) && set.has(id(l.target))));
  }
  const id = (v: string | number | SNode) => (typeof v === 'object' ? v.id : String(v));

  function ticked() {
    for (const n of nodes) {
      if (n.fx != null) continue;
      n.x = Math.max(56, Math.min(W - 56, n.x!));
      n.y = Math.max(44, Math.min(H - 44, n.y!));
    }
    nodeSel.attr('transform', (d) => `translate(${d.x},${d.y})`);
    edgeSel.attr('d', (d) => {
      const a = d.source as SNode;
      const b = d.target as SNode;
      if (d.kind !== 'related') return `M${a.x},${a.y}L${b.x},${b.y}`;
      const mx = (a.x! + b.x!) / 2, my = (a.y! + b.y!) / 2, dx = b.x! - a.x!, dy = b.y! - a.y!;
      return `M${a.x},${a.y}Q${mx - dy * 0.18},${my + dx * 0.18} ${b.x},${b.y}`;
    });
  }

  const dragger = drag<SVGGElement, SNode>()
    .clickDistance(4)
    .filter((ev, d) => d.kind !== 'me' && !ev.button)
    .on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(0.2).restart(); d.fx = d.x; d.fy = d.y; })
    .on('drag', (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
    .on('end', (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; });

  function showCard(nodeId: string | null) {
    const [kind, ref] = nodeId ? [nodeId.slice(0, nodeId.indexOf(':')), nodeId.slice(nodeId.indexOf(':') + 1)] : ['', ''];
    let html = '';
    if (kind === 'area') {
      const a = payload.areas.find((x) => x.id === ref)!;
      html = `<strong>${esc(a.label)}</strong><span class="sum">${esc(a.caption)}</span><a href="${a.href}">All projects in this area →</a>`;
    } else if (kind === 'entry') {
      const e = payload.entries[ref];
      const subs = e.children.map((c) => payload.entries[c].label);
      const projs = e.projects.filter((s) => payload.projects[s]).map((s) => payload.projects[s].label);
      html = `<strong>${esc(e.label)}</strong>${e.desc ? `<span class="sum">${esc(e.desc)}</span>` : ''}` +
        (subs.length ? `<span class="parts">Includes: ${esc(subs.join(' · '))}</span>` : '') +
        (projs.length ? `<span class="parts">Projects: ${esc(projs.join(' · '))}</span>` : '');
    } else if (kind === 'project') {
      const p = payload.projects[ref];
      const where = p.listHref === '/research/' ? 'Research' : 'Work';
      html = `<strong>${esc(p.label)}</strong>${p.paper ? '<span class="badge">Paper</span>' : ''}${p.meta ? `<span class="meta">${esc(p.meta)}</span>` : ''}` +
        `<span class="sum">${esc(p.summary)}</span><span class="parts">Under: ${esc(p.under.map((u) => payload.entries[u].label).join(' · '))}</span>` +
        (p.href ? `<a href="${p.href}">Read the full project →</a>` : `<a href="${p.listHref}">Shown as a card on the ${where} page →</a>`);
    }
    card.innerHTML = html;
    card.classList.toggle('on', !!html);
  }

  function click(nodeId: string) {
    const before = state.expanded;
    state = onNodeClick(payload, state, nodeId);
    showCard(state.focus === nodeId ? nodeId : state.focus);
    if (before.size !== state.expanded.size || [...before].some((x) => !state.expanded.has(x))) render();
    else highlight();
  }
  bg.on('click', () => { state = onBackgroundClick(state); showCard(null); highlight(); });

  // Full screen.
  let opener: HTMLElement | null = null;
  const open = (from: HTMLElement) => { opener = from; root.classList.add('is-full'); document.body.style.overflow = 'hidden'; root.querySelector<HTMLElement>('.kg-close')?.focus(); };
  const close = () => { root.classList.remove('is-full'); document.body.style.overflow = ''; opener?.focus(); };
  root.querySelector<HTMLElement>('.kg-full')?.addEventListener('click', (e) => open(e.currentTarget as HTMLElement));
  root.querySelector<HTMLElement>('.kg-open')?.addEventListener('click', (e) => open(e.currentTarget as HTMLElement));
  root.querySelector<HTMLElement>('.kg-close')?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('is-full')) close(); });

  new ResizeObserver(() => { if (svgEl.clientWidth) resize(); }).observe(svgEl);
  resize();
  render();
}
