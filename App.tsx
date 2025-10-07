import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Registration from './components/Registration';
import HomePage from './components/HomePage';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import { PermissionState } from './types';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: 'prompt',
    microphone: 'prompt',
  });
  const [isChecking, setIsChecking] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register' | 'forgotPassword' | 'dashboard'>('home');

  const checkPermissions = useCallback(async () => {
    // This function can be simplified if permissions are only checked on dashboard
    try {
      const cameraStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphoneStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissions({
        camera: cameraStatus.state,
        microphone: microphoneStatus.state,
      });
    } catch (error) {
      console.error("Error checking permissions:", error);
      setPermissions({ camera: 'prompt', microphone: 'prompt' });
    }
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';

    if (storedName && loggedInStatus) {
      setUserName(storedName);
      setIsLoggedIn(true);
      setCurrentView('dashboard');
      checkPermissions().finally(() => setIsChecking(false));
    } else {
      setIsChecking(false);
      // New users will land on home, but if they refresh on login/register they should stay there
      // This simple logic defaults to home, navigation handlers will manage the rest.
      setCurrentView('home');
    }
  }, [checkPermissions]);

  const handleRegister = (name: string) => {
    localStorage.setItem('userName', name);
    localStorage.setItem('isLoggedIn', 'true');
    setUserName(name);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };
  
  const handleLogin = (name: string) => {
    // In a real app, you'd verify credentials. Here we simulate.
    // We'll use the stored name if available, or the provided one as a fallback.
    const finalName = localStorage.getItem('userName') || name;
    localStorage.setItem('isLoggedIn', 'true');
    if(finalName) localStorage.setItem('userName', finalName);

    setUserName(finalName);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    setUserName(null);
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const navigateTo = (view: 'home' | 'login' | 'register' | 'forgotPassword' | 'dashboard') => {
    setCurrentView(view);
  };

  const handleRequestPermissions = async (type: 'camera' | 'microphone' | 'both') => {
    setRequestError(null);
    const constraints: MediaStreamConstraints = {};
    if (type === 'camera' || type === 'both') constraints.video = true;
    if (type === 'microphone' || type === 'both') constraints.audio = true;

    try {
      await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.error("Error requesting permissions:", err);
       if (err instanceof DOMException && (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError')) {
          setRequestError("Dispositivos não encontrados. Verifique se a câmera e o microfone estão conectados e tente novamente.");
      } else if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
          // The UI will show the "permission denied" message based on state.
      } else {
          setRequestError("Ocorreu um erro desconhecido ao solicitar permissões.");
      }
    } finally {
      await checkPermissions();
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <p className="text-xl text-slate-300">Carregando...</p>
      </div>
    );
  }

  const renderContent = () => {
     switch (currentView) {
        case 'home':
            return <HomePage onStart={() => navigateTo('login')} />;
        case 'login':
            return <Login onLogin={handleLogin} onNavigateToRegister={() => navigateTo('register')} onNavigateToForgotPassword={() => navigateTo('forgotPassword')} />;
        case 'register':
            return <Registration onRegister={handleRegister} onNavigateToLogin={() => navigateTo('login')} />;
        case 'forgotPassword':
            return <ForgotPassword onNavigateToLogin={() => navigateTo('login')} />;
        case 'dashboard':
            if (!userName || !isLoggedIn) {
                return <Login onLogin={handleLogin} onNavigateToRegister={() => navigateTo('register')} onNavigateToForgotPassword={() => navigateTo('forgotPassword')} />;
            }
            return (
                 <Dashboard 
                    userName={userName}
                    permissions={permissions}
                    onRequestPermission={handleRequestPermissions} 
                    onLogout={handleLogout}
                />
            );
        default:
            return <HomePage onStart={() => navigateTo('login')} />;
     }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-0 sm:p-4 lg:p-6">
        {renderContent()}
    </div>
  );
};

export default App;