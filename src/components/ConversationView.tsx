import React from 'react';

const messages = [
  {
    id: 1,
    sender: 'Emma Johnson',
    avatar: 'E',
    time: '11:32 AM',
    text: `I'll put together the strategy and target audience insights. Looking forward to your feedback!`,
  },
  {
    id: 2,
    sender: 'Michael Williams',
    avatar: 'M',
    time: '11:52 AM',
    text: `That sounds great, Emma. Please send me the details by Friday. Thank you!`,
  },
];

const ConversationView: React.FC = () => {
  return (
    <section className="flex-1 flex flex-col bg-gray-900 h-full">
      <div className="px-8 py-6 border-b border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-2">Social Media Campaign</h3>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                {msg.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{msg.sender}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <div className="text-gray-200 mt-1 whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* SetupWizard or other content can be rendered below */}
    </section>
  );
};

export default ConversationView; 