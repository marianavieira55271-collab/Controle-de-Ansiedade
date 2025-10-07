import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

const LoginIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
);


const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      // In a real app, you'd verify credentials. Here, we just log in.
      // We pass a placeholder name as it's not available at login. App.tsx will handle it.
      onLogin('User');
    }
  };
  
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <LoginIcon className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-2">Bem-vindo(a) de volta!</h1>
        <p className="text-slate-300 text-lg mb-8">
          Faça login para continuar sua jornada.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-lg rounded-lg p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            aria-label="Seu e-mail"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-lg rounded-lg p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            aria-label="Sua senha"
            required
          />
           <button 
                onClick={onNavigateToForgotPassword} 
                type="button"
                className="text-sm text-cyan-400 hover:underline text-right -mb-2">
              Esqueceu a senha?
            </button>
          <button
            type="submit"
            className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            disabled={!isFormValid}
          >
            Entrar
          </button>
        </form>
        <p className="text-slate-400 mt-6 text-sm">
            Não tem uma conta?{' '}
            <button onClick={onNavigateToRegister} className="font-semibold text-cyan-400 hover:text-cyan-300 underline">
                Cadastre-se
            </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
