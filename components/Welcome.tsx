import React from 'react';
import type { PermissionState, PermissionStatus } from '../types';

interface CameraIconProps {
  className?: string;
}

const CameraIcon: React.FC<CameraIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
        <circle cx="12" cy="13" r="3"></circle>
    </svg>
);

interface MicIconProps {
    className?: string;
}

const MicIcon: React.FC<MicIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);

const getStatusInfo = (status: PermissionStatus) => {
    switch (status) {
        case 'granted':
            return { text: 'Permitido', color: 'text-green-400' };
        case 'denied':
            return { text: 'Negado', color: 'text-red-400' };
        default:
            return { text: 'Pendente', color: 'text-yellow-400' };
    }
};

interface PermissionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    status: PermissionStatus;
    onRequest: () => void;
}

const PermissionCard: React.FC<PermissionCardProps> = ({ icon, title, description, status, onRequest }) => {
    const statusInfo = getStatusInfo(status);
    const isDisabled = status === 'granted' || status === 'denied';

    return (
        <div className="flex flex-col items-center gap-4 bg-slate-700 p-6 rounded-lg flex-1 text-center">
            {icon}
            <div className="text-left">
              <p className="font-semibold text-xl text-center">{title}</p>
              <p className="text-sm text-slate-400 text-center mt-1">{description}</p>
            </div>
             <p className={`text-sm font-semibold ${statusInfo.color}`}>Status: {statusInfo.text}</p>
            <button 
                onClick={onRequest}
                disabled={isDisabled}
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-2 px-4 rounded-lg transition-all disabled:bg-slate-600 disabled:cursor-not-allowed disabled:hover:bg-slate-600"
            >
                {status === 'granted' ? 'Permitido' : 'Permitir'}
            </button>
        </div>
    );
};


interface WelcomeProps {
  permissions: PermissionState;
  onRequest: (type: 'camera' | 'microphone' | 'both') => void;
  requestError: string | null;
}

const Welcome: React.FC<WelcomeProps> = ({ permissions, onRequest, requestError }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="max-w-3xl w-full bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-300 mb-4">Bem-vindo(a) ao Controle de Ansiedade</h1>
        <p className="text-slate-300 text-lg mb-6">
          Para começar, precisamos da sua permissão para acessar a câmera e o microfone. Escolha quais permissões deseja conceder.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
            <PermissionCard 
                icon={<CameraIcon className="w-10 h-10 text-teal-400" />}
                title="Câmera"
                description="Para medir sua frequência cardíaca"
                status={permissions.camera}
                onRequest={() => onRequest('camera')}
            />
            <PermissionCard 
                icon={<MicIcon className="w-10 h-10 text-teal-400" />}
                title="Microfone"
                description="Para analisar sua voz"
                status={permissions.microphone}
                onRequest={() => onRequest('microphone')}
            />
        </div>

        {(permissions.camera === 'denied' || permissions.microphone === 'denied') && (
          <p className="text-red-400 mb-4">
            Uma ou mais permissões foram negadas. Para usar todos os recursos, habilite-as nas configurações do seu navegador.
          </p>
        )}

        {requestError && (
          <p className="text-yellow-300 mb-4 bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/50">
            <strong>Atenção:</strong> {requestError}
          </p>
        )}
        
        <button
          onClick={() => onRequest('both')}
          className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/20"
          disabled={permissions.camera === 'granted' && permissions.microphone === 'granted'}
        >
          Conceder Ambas as Permissões
        </button>
      </div>
    </div>
  );
};

export default Welcome;
