import React from 'react';
import HeartRateMonitor from './HeartRateMonitor';
import VoiceAnalyzer from './VoiceAnalyzer';
import BreathingExercise from './BreathingExercise';
import MotivationalQuote from './MotivationalQuote';
import type { PermissionState } from '../types';

interface DashboardProps {
  userName: string;
  permissions: PermissionState;
  onRequestPermission: (type: 'camera' | 'microphone' | 'both') => void;
  onLogout: () => void;
}

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ userName, permissions, onRequestPermission, onLogout }) => {
  return (
    <div className="container mx-auto">
      <header className="relative text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300">Painel de Controle</h1>
        <p className="text-slate-400 mt-2 text-lg">
          Bem-vindo(a), <span className="font-semibold text-slate-300">{userName}</span>. Suas ferramentas para encontrar calma e foco.
        </p>
        <button
            onClick={onLogout}
            className="absolute top-0 right-0 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
            aria-label="Voltar ao menu principal e sair"
        >
            <LogoutIcon className="w-4 h-4" />
            <span>Sair</span>
        </button>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <HeartRateMonitor 
            permissionStatus={permissions.camera}
            onRequestPermission={() => onRequestPermission('camera')}
          />
          <VoiceAnalyzer 
            permissionStatus={permissions.microphone}
            onRequestPermission={() => onRequestPermission('microphone')}
          />
        </div>
        <div className="space-y-8">
          <BreathingExercise />
          <MotivationalQuote />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;