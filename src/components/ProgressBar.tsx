import React from 'react';

interface ProgressBarProps {
  step: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, total }) => {
  const percent = Math.round(((step + 1) / total) * 100);
  return (
    <div className="w-full h-3 bg-gray-800 rounded mb-4">
      <div
        className="h-3 bg-blue-500 rounded transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar; 