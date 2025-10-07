import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { PermissionStatus } from '../types';

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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

interface HeartRateMonitorProps {
    permissionStatus: PermissionStatus;
    onRequestPermission: () => void;
}

const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({ permissionStatus, onRequestPermission }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [bpm, setBpm] = useState<number>(0);
    const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [statusText, setStatusText] = useState<string>('Pronto para iniciar');
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    
    const dataPointsRef = useRef<number[]>([]);
    const peakTimestampsRef = useRef<number[]>([]);
    
    const stopMonitoring = useCallback(() => {
        setIsMonitoring(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        dataPointsRef.current = [];
        peakTimestampsRef.current = [];
        setBpm(0);
        setStatusText('Pronto para iniciar');
    }, []);

    const processFrame = useCallback(() => {
        if (!isMonitoring || !videoRef.current || !canvasRef.current) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const center_x = canvas.width / 2;
        const center_y = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 5;
        
        const imageData = ctx.getImageData(center_x - radius, center_y - radius, 2 * radius, 2 * radius).data;
        let redSum = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            redSum += imageData[i];
        }
        
        const avgRed = redSum / (imageData.length / 4);

        if (avgRed < 150) { 
            setStatusText('Cubra a câmera com o dedo');
            dataPointsRef.current = [];
            peakTimestampsRef.current = [];
            setBpm(0);
            animationFrameRef.current = requestAnimationFrame(processFrame);
            return;
        }
        
        dataPointsRef.current.push(avgRed);
        
        const bufferSize = 150;
        if (dataPointsRef.current.length < bufferSize) {
            setStatusText(`Calibrando... ${Math.round(dataPointsRef.current.length / bufferSize * 100)}%`);
            animationFrameRef.current = requestAnimationFrame(processFrame);
            return;
        } else {
             setStatusText('Medindo...');
        }
        
        dataPointsRef.current.shift();

        const data = dataPointsRef.current;
        const mean = data.reduce((a, b) => a + b) / data.length;
        const threshold = mean * 1.01;
        const peakIndex = data.indexOf(Math.max(...data.slice(45, 105)));
        
        if (peakIndex > 0 && data[peakIndex] > threshold) {
            const now = performance.now();
            const lastPeakTime = peakTimestampsRef.current[peakTimestampsRef.current.length - 1] || 0;
            if (now - lastPeakTime > 400) { 
                peakTimestampsRef.current.push(now);
                if (peakTimestampsRef.current.length > 5) {
                    peakTimestampsRef.current.shift();
                }
            }
        }
        
        if (peakTimestampsRef.current.length >= 2) {
            const intervals = [];
            for (let i = 1; i < peakTimestampsRef.current.length; i++) {
                intervals.push(peakTimestampsRef.current[i] - peakTimestampsRef.current[i-1]);
            }
            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const calculatedBpm = 60000 / avgInterval;
            if (calculatedBpm > 40 && calculatedBpm < 180) {
                setBpm(Math.round(calculatedBpm));
            }
        }

        animationFrameRef.current = requestAnimationFrame(processFrame);
    }, [isMonitoring]);

    const startMonitoring = async () => {
        stopMonitoring();
        setError(null);
        setStatusText('Iniciando câmera...');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsMonitoring(true);
            animationFrameRef.current = requestAnimationFrame(processFrame);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Não foi possível acessar a câmera. Por favor, verifique as permissões.");
            setIsMonitoring(false);
            setStatusText('Erro na câmera');
        }
    };

    useEffect(() => {
        return () => stopMonitoring();
    }, [stopMonitoring]);

    if (permissionStatus !== 'granted') {
        return (
            <Card title="Frequência Cardíaca" icon={<HeartIcon className="w-7 h-7 text-red-500" />}>
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-slate-400 mb-4 text-lg">
                        É necessário permitir o acesso à câmera para medir sua frequência cardíaca.
                    </p>
                    {permissionStatus === 'prompt' && (
                        <button 
                            onClick={onRequestPermission} 
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                        >
                            Permitir Câmera
                        </button>
                    )}
                    {permissionStatus === 'denied' && (
                        <p className="text-red-400 bg-red-900/20 p-3 rounded-lg">
                           A permissão da câmera foi negada. Por favor, habilite nas configurações do seu navegador para usar este recurso.
                        </p>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <Card title="Frequência Cardíaca" icon={<HeartIcon className="w-7 h-7 text-red-500" />}>
             <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="flex flex-col items-center justify-between h-full">
                <p className="text-slate-400 text-center mb-4">
                    Cubra a câmera com o dedo de forma suave para medir sua frequência cardíaca.
                    <span className="block text-xs mt-1">(A precisão pode variar. Apenas para fins de referência.)</span>
                </p>
                <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden mb-4">
                    <video ref={videoRef} className="w-full h-full object-cover transform scaleX-[-1]" muted playsInline />
                    {!isMonitoring && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <p className="text-slate-300">Câmera Desligada</p>
                         </div>
                    )}
                </div>
                {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}
                <div className="text-center mb-4">
                    <p className="text-slate-400 text-lg">{isMonitoring ? statusText : 'BPM Atual'}</p>
                    <p className={`text-5xl font-bold transition-colors ${bpm > 90 ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {bpm > 0 ? bpm : '--'}
                    </p>
                </div>
                <button
                    onClick={isMonitoring ? stopMonitoring : startMonitoring}
                    className={`w-full font-bold py-3 px-4 rounded-lg transition-all text-base ${
                        isMonitoring 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-cyan-500 hover:bg-cyan-600 text-slate-900'
                    }`}
                >
                    {isMonitoring ? 'Parar Monitoramento' : 'Iniciar Monitoramento'}
                </button>
            </div>
        </Card>
    );
};

export default HeartRateMonitor;