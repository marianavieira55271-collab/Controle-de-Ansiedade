import React, { useState, useEffect, useRef } from 'react';

const LungsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 21c-4 0-7-2-7-6 0-4.5 3-6 7-6 4.5 0 7 1.5 7 6-.5 4-3 6-7 6Z"/>
        <path d="M12 15c-3 0-5-1-5-4 0-3.5 2-4 5-4s5 .5 5 4c0 3-2 4-5 4Z"/>
        <path d="M12 9c-1.5 0-2.5-.5-2.5-2s1-2 2.5-2 2.5.5 2.5 2-1 2-2.5 2Z"/>
        <path d="M12 21v-6"/>
        <path d="M6 15c0-3 2-3 6-3s6 0 6 3"/>
    </svg>
);

const Card: React.FC<{ children: React.ReactNode, title: string, icon: React.ReactNode }> = ({ children, title, icon }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 backdrop-blur-sm h-full flex flex-col">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-bold text-slate-200 ml-3">{title}</h2>
    </div>
    <div className="flex-grow flex flex-col">{children}</div>
  </div>
);

const BreathingExercise: React.FC = () => {
    const [duration, setDuration] = useState(60); // in seconds, default 1 min
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);
    const [text, setText] = useState("Iniciar");
    const [cycle, setCycle] = useState(0);

    const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const phases = [
        { name: "Inspire", duration: 4000 },
        { name: "Segure", duration: 4000 },
        { name: "Expire", duration: 6000 },
    ];

    const stopExercise = () => {
        setIsActive(false);
        setText("Iniciar");
        setCycle(0);
        setTimeLeft(duration);
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
    
    useEffect(() => {
        if (isActive) {
            const currentPhase = phases[cycle % phases.length];
            setText(currentPhase.name);
            phaseTimerRef.current = setTimeout(() => {
                setCycle(prevCycle => prevCycle + 1);
            }, currentPhase.duration);
        }
        return () => {
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        }
    }, [isActive, cycle]);

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(duration);
        }
    }, [duration, isActive]);

    const handleToggleExercise = () => {
        if (isActive) {
            stopExercise();
        } else {
            setIsActive(true);
            setTimeLeft(duration);
            countdownTimerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        stopExercise();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const currentPhase = phases[cycle % phases.length];
    const animationDuration = `${currentPhase.duration / 1000}s`;
    const animationClass = isActive ? (currentPhase.name === 'Inspire' ? 'animate-inhale' : 'animate-exhale') : '';
    
    const durationOptions = [ { label: '1 Min', value: 60 }, { label: '3 Min', value: 180 }, { label: '5 Min', value: 300 } ];

    return (
        <Card title="Respiração Guiada" icon={<LungsIcon className="w-7 h-7 text-teal-300" />}>
             <style>{`
                @keyframes inhale {
                    0% { transform: scale(0.6); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes exhale {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(0.6); opacity: 0.7; }
                }
                .animate-inhale { animation: inhale ${animationDuration} ease-in-out forwards; }
                .animate-exhale { animation: exhale ${animationDuration} ease-in-out forwards; }
            `}</style>
            <div className="flex flex-col items-center justify-between h-full">
                <p className="text-slate-400 text-center mb-4">
                    Sincronize sua respiração com o círculo para acalmar seu sistema nervoso.
                </p>
                <div className="relative flex items-center justify-center flex-grow w-full my-4">
                    <div className={`absolute w-32 h-32 md:w-40 md:h-40 bg-cyan-500/20 rounded-full transition-all duration-1000 ${animationClass}`}></div>
                    <div className={`absolute w-48 h-48 md:w-56 md:h-56 bg-cyan-500/10 rounded-full transition-all duration-1000 delay-150 ${animationClass}`}></div>
                    <div className={`relative w-24 h-24 md:w-32 md:h-32 bg-cyan-500 rounded-full flex items-center justify-center transition-transform transform ${animationClass} shadow-2xl shadow-cyan-500/30`}>
                        <span className="text-xl md:text-2xl font-bold text-slate-900">{text}</span>
                    </div>
                     {isActive && (
                        <div className="absolute bottom-[-25px] text-slate-400 text-sm bg-slate-900/50 px-2 py-1 rounded">
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>

                {!isActive ? (
                     <div className="mb-6 w-full">
                        <p className="text-center text-slate-400 mb-3 text-sm">Selecione a duração:</p>
                        <div className="flex justify-center gap-3">
                            {durationOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setDuration(opt.value)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                        duration === opt.value
                                        ? 'bg-teal-500 text-slate-900'
                                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : <div className="mb-6 h-[56px]"></div> }

                <button
                    onClick={handleToggleExercise}
                    className={`w-full font-bold py-3 px-4 rounded-lg transition-all text-base ${
                        isActive 
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' 
                        : 'bg-teal-500 hover:bg-teal-600 text-slate-900'
                    }`}
                >
                    {isActive ? 'Parar Exercício' : 'Iniciar Exercício'}
                </button>
            </div>
        </Card>
    );
};

export default BreathingExercise;