import type { AreaId } from '../data/areas';

export type Section = 'work' | 'research';

export interface ProjectData {
  title: string;
  section: Section;
  alsoIn?: Section;
  form: 'page' | 'card';
  areas: AreaId[];
  org?: string;
  role?: string;
  start?: string;
  end?: string;
  summary: string;
  links: { label: string; href: string }[];
  order: number;
}

export interface P {
  id: string;
  data: ProjectData;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (d: string) => {
  const [year, month] = d.split('-');
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
};

export const formatDates = (start?: string, end?: string) => {
  if (!start) return '';
  return end ? `${formatDate(start)} – ${end === 'present' ? 'present' : formatDate(end)}` : formatDate(start);
};

export const sortProjects = <T extends P>(ps: T[]): T[] =>
  [...ps].sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));

export const inSection = <T extends P>(ps: T[], s: Section): T[] =>
  ps.filter((p) => p.data.section === s || p.data.alsoIn === s);

export const withArea = <T extends P>(ps: T[], a: AreaId): T[] => ps.filter((p) => p.data.areas.includes(a));

export const projectHref = (p: P): string | null => (p.data.form === 'page' ? `/${p.data.section}/${p.id}/` : null);
