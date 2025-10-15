'use client';

interface SimpleAgentStatusProps {
  name: string;
  status: 'active' | 'pending' | 'idle' | 'error';
  description: string;
}

export function SimpleAgentStatus({ name, status, description }: SimpleAgentStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'idle': return 'bg-black-600';
      case 'error': return 'bg-red-500';
      default: return 'bg-black-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'idle': return 'Idle';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 md:p-3 bg-black-700 border border-black-600">
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${getStatusColor()} ${status === 'active' ? 'animate-pulse' : ''}`}></div>
        <div>
          <div className="text-white font-medium text-xs md:text-sm">{name}</div>
          <div className="text-black-400 text-xs hidden md:block">{description}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-xs font-medium ${
          status === 'active' ? 'text-green-400' :
          status === 'pending' ? 'text-yellow-400' :
          status === 'error' ? 'text-red-400' :
          'text-black-400'
        }`}>
          {getStatusText()}
        </div>
      </div>
    </div>
  );
}
