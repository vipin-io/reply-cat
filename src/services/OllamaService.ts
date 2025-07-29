const OLLAMA_URL = 'http://127.0.0.1:11434';

export const DEFAULT_MODEL = 'phi3:mini';
export const PHI3_MODEL = 'phi3:mini';
export const ZEPHYR_MODEL = 'stablelm-zephyr';

export async function ensureModel(modelId: string): Promise<boolean> {
  // Check if model is present, pull if missing
  const res = await fetch(`${OLLAMA_URL}/api/tags`);
  const data = await res.json();
  const found = data.models?.some((m: any) => m.name.startsWith(modelId));
  if (found) return true;
  // Pull model
  await fetch(`${OLLAMA_URL}/api/pull`, {
    method: 'POST',
    body: JSON.stringify({ name: modelId }),
    headers: { 'Content-Type': 'application/json' },
  });
  return true;
}

export async function latencyTest(modelId: string): Promise<{ p50: number; p95: number }> {
  const times: number[] = [];
  for (let i = 0; i < 5; i++) {
    const start = performance.now();
    await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: 'Say OK' }],
        stream: false,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  const p50 = times[Math.floor(times.length / 2)];
  const p95 = times[Math.floor(times.length * 0.95)];
  return { p50, p95 };
}

export async function streamChat({ model, messages, onData }: { model: string, messages: any[], onData: (chunk: string) => void }) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({ model, messages, stream: true }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  while (!done) {
    const { value, done: d } = await reader.read();
    if (value) onData(decoder.decode(value));
    done = d;
  }
}

export function getDefaultModel() {
  return DEFAULT_MODEL;
}

export function getLatencyBadge(p95: number, ram: number) {
  if (p95 > 5000 || ram < 6) {
    return { badge: '⚠️ Fallback suggested', color: 'yellow' };
  }
  if (p95 < 2000) {
    return { badge: 'Fast', color: 'green' };
  }
  return { badge: 'OK', color: 'blue' };
} 