import { invoke } from '@tauri-apps/api/core';

export async function checkRAM(): Promise<{ ok: boolean; totalGB: number }> {
  // Calls a Tauri command to get total RAM in GB
  const totalGB = await invoke<number>('get_total_ram_gb');
  return { ok: totalGB >= 8, totalGB };
}

export async function checkOllama(): Promise<{ ok: boolean; version?: string }> {
  // Calls a Tauri command to check if Ollama is installed and get version
  try {
    const version = await invoke<string>('get_ollama_version');
    return { ok: !!version, version };
  } catch {
    return { ok: false };
  }
} 