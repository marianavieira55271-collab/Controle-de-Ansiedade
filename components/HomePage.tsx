import React from 'react';

// Ícone que combina um coração (emoção, ansiedade) com uma onda (calma, monitoramento).
const CalmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        <path d="M5 12h2l2-4l3 6l2-3l2 1h2"></path>
    </svg>
);

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-700">
        <CalmIcon className="w-20 h-20 text-cyan-300 mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-300 mb-4">
          Encontre Sua Calma
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl mb-8">
          Uma ferramenta de apoio para gerenciar a ansiedade, encontrar o foco e falar com confiança.
        </p>
        <button
          onClick={onStart}
          className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-10 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/20"
        >
          Iniciar Jornada
        </button>
      </div>
    </div>
  );
};

export default HomePage;