import React, { useState } from 'react';

const tones = [
  'Friendly',
  'Formal',
  'Assertive',
  'Apologetic',
  'TL;DR',
];

const ToneChips: React.FC = () => {
  const [selected, setSelected] = useState('Assertive');
  return (
    <div className="flex gap-2 flex-wrap mb-2">
      {tones.map((tone) => (
        <button
          key={tone}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
            ${selected === tone ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
          onClick={() => setSelected(tone)}
        >
          {tone}
        </button>
      ))}
    </div>
  );
};

export default ToneChips; 