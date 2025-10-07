import React, { useState } from 'react';

interface ForgotPasswordProps {
  onNavigateToLogin: () => void;
}

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);


const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // In a real app, this would trigger a backend service to send an email.
      console.log(`Password reset requested for: ${email}`);
      setSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <MailIcon className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-2">Recuperar Senha</h1>
        
        {submitted ? (
            <div className="text-slate-300 text-lg">
                <p>Se um e-mail correspondente for encontrado em nosso sistema, um link de recuperação de senha foi enviado para você.</p>
                <p className="mt-4">Por favor, verifique sua caixa de entrada e pasta de spam.</p>
            </div>
        ) : (
            <>
                <p className="text-slate-300 text-lg mb-8">
                Digite seu e-mail para receber um link de recuperação.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail cadastrado"
                    className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-lg rounded-lg p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                    aria-label="Seu e-mail"
                    required
                />
                <button
                    type="submit"
                    className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    disabled={!email.trim()}
                >
                    Enviar Link de Recuperação
                </button>
                </form>
            </>
        )}
        
        <p className="text-slate-400 mt-6 text-sm">
            Lembrou da senha?{' '}
            <button onClick={onNavigateToLogin} className="font-semibold text-cyan-400 hover:text-cyan-300 underline">
                Voltar para o login
            </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
