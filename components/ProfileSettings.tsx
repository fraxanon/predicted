'use client';

import { AgentSettings } from './AgentSettings';

interface ProfileSettingsProps {
  onClose: () => void;
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-black-900 border border-black-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-black-800 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">AI Agent Settings</h2>
          <button
            onClick={onClose}
            className="text-black-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* AI Agent Settings */}
          <AgentSettings 
            alwaysVisible={true}
            onSettingsChange={(settings) => {
              console.log('Agent settings updated:', settings);
            }}
          />
        </div>
      </div>
    </div>
  );
}
