export interface UseCaseModule {
  name: string;
  status: 'synced' | 'active' | 'connected' | 'running';
}

export interface UseCaseStat {
  label: string;
  value: string;
}

export interface UseCaseConfig {
  id: number;
  title: string;
  description: string;
  url: string;
  systemName: string;
  metric: string;
  metricValue: string;
  navItems: string[];
  stats: UseCaseStat[];
  modules: UseCaseModule[];
}

export const useCases: UseCaseConfig[] = [
  {
    id: 1,
    title: 'Lead Gen & Outreach',
    description: 'Data, email sequences, and CRM — wired as one system.',
    url: 'outreach.digitalarchitect.com',
    systemName: 'Outreach',
    metric: 'Pipeline capacity',
    metricValue: '72%',
    navItems: ['Overview', 'Leads', 'Sequences'],
    stats: [
      { label: 'Enriched', value: '847' },
      { label: 'Open rate', value: '34%' },
      { label: 'In CRM', value: '126' },
    ],
    modules: [
      { name: 'Enrichment agent', status: 'synced' },
      { name: 'Sequence agent', status: 'running' },
      { name: 'Deliverability monitor', status: 'active' },
      { name: 'CRM sync', status: 'connected' },
    ],
  },
  {
    id: 2,
    title: 'Ops & AI Agents',
    description: 'Agents and automations running follow-ups, billing, and client ops.',
    url: 'agents.digitalarchitect.com',
    systemName: 'Operations',
    metric: 'Workflow load',
    metricValue: '68%',
    navItems: ['Overview', 'Agents', 'Runs'],
    stats: [
      { label: 'Workflows', value: '12' },
      { label: 'Agents live', value: '4' },
      { label: 'Tasks today', value: '89' },
    ],
    modules: [
      { name: 'Inbox triage agent', status: 'running' },
      { name: 'Follow-up agent', status: 'active' },
      { name: 'Billing agent', status: 'synced' },
      { name: 'Integration hub', status: 'connected' },
    ],
  },
  {
    id: 3,
    title: 'Growth & Delivery',
    description: 'Content, SEO, and client portals on a shared data layer.',
    url: 'growth.digitalarchitect.com',
    systemName: 'Growth',
    metric: 'Publish queue',
    metricValue: '81%',
    navItems: ['Overview', 'Content', 'Reports'],
    stats: [
      { label: 'Published', value: '18' },
      { label: 'Organic', value: '+12%' },
      { label: 'Portals', value: '3' },
    ],
    modules: [
      { name: 'Content agent', status: 'running' },
      { name: 'SEO monitor', status: 'synced' },
      { name: 'Outreach agent', status: 'active' },
      { name: 'Client portal', status: 'connected' },
    ],
  },
];

export const statusLabels: Record<UseCaseModule['status'], string> = {
  synced: 'Synced',
  active: 'Active',
  connected: 'Connected',
  running: 'Running',
};
