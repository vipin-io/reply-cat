import React from 'react';

interface StatusBarProps {
  email: string;
  scopesOk: boolean;
  model: string;
  p50: number;
  p95: number;
  ram: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ email, scopesOk, model, p50, p95, ram }) => (
  <div className="w-full bg-gray-950 border-t border-gray-800 text-xs text-gray-300 flex items-center px-4 py-2 gap-6">
    <span>{email || 'Not signed in'}</span>
    <span className={scopesOk ? 'text-green-400' : 'text-red-400'}>{scopesOk ? 'Scopes OK' : 'Scopes missing'}</span>
    <span>Model: <b>{model}</b></span>
    <span>p50: {p50 ? `${p50.toFixed(0)}ms` : '—'}</span>
    <span>p95: {p95 ? `${p95.toFixed(0)}ms` : '—'}</span>
    <span>RAM: {ram ? `${ram}GB` : '—'}</span>
  </div>
);

export default StatusBar; 