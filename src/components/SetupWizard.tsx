import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { checkRAM, checkOllama } from '../services/SystemCheck';
import { ensureModel, latencyTest, getDefaultModel, getLatencyBadge } from '../services/OllamaService';
import { isSessionPresent, startOAuth, isMockMode } from '../services/GmailService';

const steps = [
  'Check hardware',
  'Check Ollama',
  'Download model',
  'Latency test',
  'Google OAuth',
  'Ready',
];

const SetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<(string | null)[]>(Array(steps.length).fill(null));
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<{ p50: number; p95: number } | null>(null);
  const [ram, setRam] = useState<number | null>(null);
  const [ollamaVersion, setOllamaVersion] = useState<string | null>(null);
  const [model, setModel] = useState(getDefaultModel());
  const [session, setSession] = useState<boolean>(false);
  const [mock, setMock] = useState(isMockMode());

  const runStep = async (i: number) => {
    setCurrentStep(i);
    setErrors((prev) => prev.map((e, idx) => (idx === i ? null : e)));
    try {
      if (i === 0) {
        // RAM check
        const res = await checkRAM();
        setRam(res.totalGB);
        if (!res.ok) throw new Error('At least 8GB RAM recommended');
      } else if (i === 1) {
        // Ollama check
        const res = await checkOllama();
        if (!res.ok) throw new Error('Ollama not found');
        setOllamaVersion(res.version || null);
      } else if (i === 2) {
        // Model check
        const ok = await ensureModel(model);
        if (!ok) throw new Error('Model not available');
      } else if (i === 3) {
        // Latency test
        const result = await latencyTest(model);
        setLatency(result);
      } else if (i === 4) {
        // Google OAuth
        const present = await isSessionPresent();
        setSession(present);
        if (!present) {
          await startOAuth();
          const present2 = await isSessionPresent();
          setSession(present2);
          if (!present2) throw new Error('Google login failed');
        }
      }
    } catch (e: any) {
      setErrors((prev) => prev.map((err, idx) => (idx === i ? e.message : err)));
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleStart = async () => {
    setLoading(true);
    for (let i = currentStep; i < steps.length - 1; i++) {
      const ok = await runStep(i);
      if (!ok) return;
    }
    setCurrentStep(steps.length - 1);
    setLoading(false);
  };

  const handleFix = async (idx: number) => {
    setErrors((prev) => prev.map((e, i) => (i === idx ? null : e)));
    setCurrentStep(idx);
    setLoading(true);
    await runStep(idx);
    setLoading(false);
  };

  // RAM/latency fallback suggestion
  const fallback = (latency && ram !== null && (latency.p95 > 5000 || ram < 6));
  const badge = latency && ram !== null ? getLatencyBadge(latency.p95, ram) : null;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 rounded-xl shadow-lg p-8 mt-16 text-white">
      <h2 className="text-2xl font-bold mb-6">On First-Run</h2>
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={mock} onChange={e => setMock(e.target.checked)} />
          Mock Gmail mode
        </label>
        {badge && <span className={`px-2 py-1 rounded text-xs bg-${badge.color}-900 text-${badge.color}-300`}>{badge.badge}</span>}
      </div>
      <ProgressBar step={currentStep} total={steps.length} />
      <ul className="my-6 space-y-3">
        {steps.map((step, idx) => (
          <li key={step} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-3 ${
                idx < currentStep ? 'bg-green-500' : idx === currentStep ? 'bg-blue-400' : 'bg-gray-600'
              }`} />
              <span className={idx === currentStep ? 'font-semibold' : ''}>{step}</span>
              {/* Show details for RAM, Ollama, Latency, Session */}
              {idx === 0 && ram !== null && <span className="ml-2 text-xs text-gray-400">{ram} GB RAM</span>}
              {idx === 1 && ollamaVersion && <span className="ml-2 text-xs text-gray-400">Ollama {ollamaVersion}</span>}
              {idx === 2 && <span className="ml-2 text-xs text-gray-400">Model: {model}</span>}
              {idx === 3 && latency && <span className="ml-2 text-xs text-gray-400">p50: {latency.p50.toFixed(0)}ms</span>}
              {idx === 4 && <span className="ml-2 text-xs text-gray-400">{session ? 'Connected' : 'Not connected'}</span>}
            </div>
            {errors[idx] && (
              <div className="flex items-center space-x-2">
                <span className="text-red-400 text-sm">{errors[idx]}</span>
                <button
                  className="bg-red-600 px-2 py-1 rounded text-xs hover:bg-red-700"
                  onClick={() => handleFix(idx)}
                >Fix</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {fallback && (
        <div className="bg-yellow-900 text-yellow-200 rounded p-3 mb-4 text-xs">
          <b>Performance warning:</b> Your system may be slow for this model. <button className="underline" onClick={() => setModel('phi3:mini')}>Switch to phi3:mini</button> for better speed.
        </div>
      )}
      <div className="flex items-center justify-between mt-8">
        <span className="text-xs text-gray-400">Local Inference • No telemetry</span>
        <button
          className="bg-blue-600 px-6 py-2 rounded text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          onClick={handleStart}
          disabled={loading || currentStep === steps.length - 1}
        >
          {currentStep === 0 ? 'Start' : loading ? 'Running...' : currentStep === steps.length - 1 ? 'Done' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default SetupWizard; 