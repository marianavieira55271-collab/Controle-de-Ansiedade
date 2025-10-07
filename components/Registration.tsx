import React, { useState } from 'react';

interface RegistrationProps {
  onRegister: (name: string, email: string) => void;
  onNavigateToLogin: () => void;
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
);


const Registration: React.FC<RegistrationProps> = ({ onRegister, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && password.trim()) {
      onRegister(name.trim(), email.trim());
    }
  };
  
  const isFormValid = name.trim() !== '' && email.trim() !== '' && password.trim().length >= 6;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <UserIcon className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-2">Crie sua Conta</h1>
        <p className="text-slate-300 text-lg mb-8">
          Preencha os campos abaixo para começar.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-lg rounded-lg p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            aria-label="Seu nome"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-lg rounded-lg p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            aria-label="Seu e-mail"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha (mín. 6 caracteres)"
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-lg rounded-lg p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            aria-label="Sua senha"
            required
            minLength={6}
          />
          <button
            type="submit"
            className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            disabled={!isFormValid}
          >
            Cadastrar
          </button>
        </form>
         <p className="text-slate-400 mt-6 text-sm">
            Já tem uma conta?{' '}
            <button onClick={onNavigateToLogin} className="font-semibold text-cyan-400 hover:text-cyan-300 underline">
                Faça login
            </button>
        </p>
      </div>
    </div>
  );
};

export default Registration;