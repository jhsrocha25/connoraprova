
import React from 'react';
import { Timer } from 'lucide-react';

interface SessionTimerProps {
  sessionTimeLeft: number;
  sessionExpired: boolean;
  onReset?: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ 
  sessionTimeLeft, 
  sessionExpired,
  onReset
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="mb-4 flex justify-center">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        sessionTimeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-primary/10 text-primary'
      }`}>
        <Timer className="h-4 w-4" />
        <span className="text-sm font-medium">
          Tempo restante: {formatTime(sessionTimeLeft)}
        </span>
      </div>
    </div>
  );
};

export default SessionTimer;
