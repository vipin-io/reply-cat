import React from 'react';

const threads = [
  { id: '1', name: 'Emma Johnson', subject: 'Social Media Campaign', selected: true },
  { id: '2', name: 'David Brown', subject: 'Meeting Rescheduled', unread: true },
  { id: '3', name: 'Olivia Taylor', subject: 'Project Update', date: 'Friday' },
  { id: '4', name: 'Marketing Team', subject: 'New Campaign Ideas', new: true },
  { id: '5', name: 'James Wilson', subject: 'Budget Review', star: true },
  { id: '6', name: 'Saboila Martin', subject: 'Thank You!', date: '11 Aug' },
];

const ThreadList: React.FC = () => {
  return (
    <aside className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col h-full">
      <div className="px-6 py-4 text-lg font-bold text-white">Threads</div>
      <ul className="flex-1 overflow-y-auto">
        {threads.map((t) => (
          <li
            key={t.id}
            className={`flex items-center px-4 py-3 cursor-pointer transition-colors group ${
              t.selected ? 'bg-gray-800' : 'hover:bg-gray-900'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold mr-4">
              {t.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{t.name}</div>
              <div className="text-gray-400 text-xs truncate">{t.subject}</div>
            </div>
            {t.unread && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full" />}
            {t.new && <span className="ml-2 text-xs text-green-400">New</span>}
            {t.star && <span className="ml-2 text-yellow-400">★</span>}
            {t.date && <span className="ml-2 text-xs text-gray-500">{t.date}</span>}
          </li>
        ))}
      </ul>
      <div className="px-6 py-3 text-xs text-gray-500 border-t border-gray-800 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
        Local Inference
        <span className="mx-2">•</span>
        No telemetry
      </div>
    </aside>
  );
};

export default ThreadList; 