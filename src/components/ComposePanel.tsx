import React, { useState } from 'react';
import ToneChips from './ToneChips';

const replies = [
  {
    id: 'A',
    text: `Sure, I'll review your plan and provide feedback. Please send the details when ready.`,
  },
  {
    id: 'B',
    text: `Yes, I will review the strategy and let you know my thoughts by Friday.`,
  },
  {
    id: 'C',
    text: `Thanks for sharing, Emma. I'll get back to you with feedback soon.`,
  },
];

function scrubPII(text: string) {
  // Simple email/phone regex
  return text.replace(/([\w.-]+@[\w.-]+\.[A-Za-z]{2,6})/g, '[email]')
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, '[phone]');
}

const ComposePanel: React.FC = () => {
  const [showReview, setShowReview] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [selected, setSelected] = useState('A');

  const handleInsertDraft = () => {
    const reply = replies.find(r => r.id === selected)?.text || '';
    const scrubbed = scrubPII(reply);
    if (scrubbed !== reply) {
      setReviewText(scrubbed);
      setShowReview(true);
      return;
    }
    // TODO: Insert draft with To/CC, In-Reply-To, References, quoting last message
    alert('Draft inserted!');
  };

  const handleConfirm = () => {
    setShowReview(false);
    // TODO: Insert draft with reviewText
    alert('Draft inserted (scrubbed)!');
  };

  return (
    <aside className="w-96 bg-gray-950 border-l border-gray-800 flex flex-col h-full p-6">
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-1">AI Compose</div>
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="font-semibold text-white mb-2">TLDR</div>
          <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
            <li>Develop strategy and audience insights</li>
            <li>Feedback needed on plan</li>
            <li>Details due by Friday, Apr</li>
          </ul>
        </div>
        <ToneChips />
      </div>
      <div className="flex-1 space-y-4">
        {replies.map((r) => (
          <div key={r.id} className={`bg-gray-900 rounded-lg p-4 ${selected === r.id ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setSelected(r.id)}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Option {r.id}</span>
              <div className="flex gap-2">
                <button className="text-xs text-blue-400 hover:underline">Edit</button>
                <button className="text-xs text-gray-400 hover:underline">Regenerate</button>
                <button className="text-xs text-gray-400 hover:underline">Copy</button>
              </div>
            </div>
            <div className="text-gray-200 text-sm">{r.text}</div>
          </div>
        ))}
      </div>
      <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700" onClick={handleInsertDraft}>
        Insert as Draft
      </button>
      {showReview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg max-w-md w-full">
            <div className="font-bold mb-2">Review changes</div>
            <div className="text-gray-200 mb-4 whitespace-pre-line">{reviewText}</div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700" onClick={handleConfirm}>
              Confirm & Insert
            </button>
            <button className="ml-4 text-gray-400 hover:underline" onClick={() => setShowReview(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ComposePanel; 