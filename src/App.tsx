import React from 'react';
import ThreadList from './components/ThreadList';
import ConversationView from './components/ConversationView';
import ComposePanel from './components/ComposePanel';
import SetupWizard from './components/SetupWizard';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-950">
      <ThreadList />
      <div className="flex-1 flex flex-col">
        {/* Show SetupWizard for onboarding; replace with ConversationView after setup */}
        <SetupWizard />
        {/* <ConversationView /> */}
      </div>
      <ComposePanel />
    </div>
  );
};

export default App; 