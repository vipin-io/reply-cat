import { invoke } from '@tauri-apps/api/tauri';

declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

const MOCK = (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_MOCK_GMAIL === 'true') || (typeof process !== 'undefined' && process.env.MOCK_GMAIL === 'true');

// Mock fixtures
const mockThreads = [
  { id: 't1', snippet: 'Mock thread 1', messages: [] },
  { id: 't2', snippet: 'Mock thread 2', messages: [] },
  { id: 't3', snippet: 'Mock thread 3', messages: [] },
  { id: 't4', snippet: 'Mock thread 4', messages: [] },
  { id: 't5', snippet: 'Mock thread 5', messages: [] },
];

export async function listRecentThreads(limit = 20) {
  if (MOCK) return mockThreads.slice(0, limit);
  return await invoke('gmail_list_threads', { limit });
}

export async function getThread(threadId: string) {
  if (MOCK) return mockThreads.find(t => t.id === threadId) || null;
  return await invoke('gmail_get_thread', { threadId });
}

export async function insertDraft({ threadId, subject, bodyHtml, bodyText, to, cc, inReplyTo, references }: any) {
  if (MOCK) return true;
  return await invoke('gmail_insert_draft', {
    threadId,
    subject,
    bodyHtml,
    bodyText,
    to,
    cc,
    inReplyTo,
    references,
  });
}

export function isMockMode() {
  return MOCK;
} 