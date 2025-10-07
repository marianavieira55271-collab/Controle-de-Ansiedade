import React, { useState, useCallback, useEffect } from 'react';
import { getMotivationalQuote } from '../services/geminiService';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L9.5 8.5L4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5L12 3z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

const Card: React.FC<{ children: React.ReactNode, title: string, icon: React.ReactNode }> = ({ children, title, icon }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 backdrop-blur-sm h-full flex flex-col">
        <div className="flex items-center mb-4">
            {icon}
            <h2 className="text-xl font-bold text-slate-200 ml-3">{title}</h2>
        </div>
        <div className="flex-grow">{children}</div>
    </div>
);


const MotivationalQuote: React.FC = () => {
    const [quote, setQuote] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuote = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newQuote = await getMotivationalQuote();
            setQuote(newQuote);
        } catch (err) {
            console.error("Failed to fetch motivational quote:", err);
            setError("Não foi possível buscar a mensagem. Por favor, tente novamente.");
            setQuote("Lembre-se de respirar. Você consegue superar isso.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card title="Mensagem Motivacional" icon={<SparkleIcon className="w-7 h-7 text-yellow-400" />}>
            <div className="flex flex-col items-center justify-between h-full">
                <div className="flex-grow flex items-center justify-center w-full my-4 p-4 bg-slate-700/50 rounded-lg min-h-[120px]">
                    {isLoading ? (
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-300"></div>
                    ) : (
                        <p className="text-center text-lg italic text-slate-300">"{quote}"</p>
                    )}
                </div>
                {error && <p className="text-red-400 text-sm my-2 text-center">{error}</p>}
                <button
                    onClick={fetchQuote}
                    disabled={isLoading}
                    className="w-full font-bold py-3 px-4 rounded-lg transition-all text-base bg-yellow-500 hover:bg-yellow-600 text-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Gerando..." : "Nova Mensagem"}
                </button>
            </div>
        </Card>
    );
};

export default MotivationalQuote;