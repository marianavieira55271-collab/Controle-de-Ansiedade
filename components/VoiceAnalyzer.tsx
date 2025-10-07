import React, { useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { analyzeVoice } from '../services/geminiService';
import type { VoiceAnalysisResult, PermissionStatus } from '../types';

const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);

const Card: React.FC<{ children: React.ReactNode, title: string, icon: React.ReactNode }> = ({ children, title, icon }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 backdrop-blur-sm h-full flex flex-col min-h-[400px]">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-bold text-slate-200 ml-3">{title}</h2>
    </div>
    <div className="flex-grow flex flex-col">{children}</div>
  </div>
);

interface VoiceAnalyzerProps {
    permissionStatus: PermissionStatus;
    onRequestPermission: () => void;
}

const VoiceAnalyzer: React.FC<VoiceAnalyzerProps> = ({ permissionStatus, onRequestPermission }) => {
    const { isRecording, startRecording, stopRecording } = useAudioRecorder(handleAudio);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<VoiceAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleAudio(audioBlob: Blob) {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeVoice(audioBlob);
            setAnalysis(result);
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro ao analisar sua voz. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    const toggleRecording = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            setAnalysis(null);
            setError(null);
            try {
                await startRecording();
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocorreu um erro desconhecido ao iniciar a gravação.");
                }
            }
        }
    };

    if (permissionStatus !== 'granted') {
        return (
            <Card title="Análise de Voz" icon={<MicIcon className="w-7 h-7 text-sky-400" />}>
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-slate-400 mb-4 text-lg">
                        É necessário permitir o acesso ao microfone para analisar sua voz.
                    </p>
                    {permissionStatus === 'prompt' && (
                        <button 
                            onClick={onRequestPermission} 
                            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                        >
                            Permitir Microfone
                        </button>
                    )}
                    {permissionStatus === 'denied' && (
                        <p className="text-red-400 bg-red-900/20 p-3 rounded-lg">
                           A permissão do microfone foi negada. Por favor, habilite nas configurações do seu navegador para usar este recurso.
                        </p>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <Card title="Análise de Voz" icon={<MicIcon className="w-7 h-7 text-sky-400" />}>
            <div className="flex flex-col items-center justify-between h-full">
                <p className="text-slate-400 text-center mb-4">
                    Grave um pequeno trecho da sua fala (10-15 seg) para receber feedback sobre seu tom e ritmo.
                </p>

                <div className="flex-grow flex items-center justify-center w-full my-4">
                    {isLoading ? (
                        <div className="text-center">
                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                           <p className="mt-3 text-slate-300">Analisando áudio...</p>
                        </div>
                    ) : analysis ? (
                        <div className="text-left bg-slate-700/50 p-4 rounded-lg w-full">
                            <p className="font-semibold text-slate-200">Feedback:</p>
                            <p className="text-slate-300">{analysis.feedback}</p>
                        </div>
                    ) : (
                         <p className="text-slate-500 italic">Aguardando gravação</p>
                    )}
                </div>
                {error && <p className="text-red-400 text-sm text-center my-2">{error}</p>}

                <button
                    onClick={toggleRecording}
                    className={`w-full font-bold py-3 px-4 rounded-lg transition-all text-base flex items-center justify-center gap-2 ${
                        isRecording 
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' 
                        : 'bg-sky-500 hover:bg-sky-600 text-slate-900'
                    }`}
                >
                    <MicIcon className="w-5 h-5"/>
                    {isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
                </button>
            </div>
        </Card>
    );
};

export default VoiceAnalyzer;