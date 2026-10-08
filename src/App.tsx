import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Book, Clock, Heart, Scale, Settings, Phone } from 'lucide-react';
import Help from './pages/Help';
import Hope from './pages/Hope';
import Law from './pages/Law';
import SettingsTab from './pages/Settings';
import Log from './pages/Log';
import Timeline from './pages/Timeline';
import SOS from './pages/SOS';

import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { path: '/sos', icon: Phone, label: t('SOS') },
    { path: '/help', icon: Shield, label: t('Help') },
    { path: '/log', icon: Book, label: t('Log') },
    { path: '/timeline', icon: Clock, label: t('Timeline') },
    { path: '/hope', icon: Heart, label: t('Hope') },
    { path: '/law', icon: Scale, label: t('Law') },
    { path: '/settings', icon: Settings, label: t('Settings') }
  ];

  return (
    <div className="fixed bottom-0 w-full bg-card border-t border-tint flex justify-around p-2 pb-4">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button 
            key={item.path} 
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-primary' : 'text-textslate'}`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        )
      })}
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const handleQuickExit = () => {
    const customUrl = localStorage.getItem('hershield-quick-exit');
    if (customUrl) {
      window.location.replace(customUrl);
    } else {
      window.location.replace('https://open-meteo.com');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">HerShield</h1>
        <button className="bg-quickexit text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg hover:bg-black transition-colors" onClick={handleQuickExit}>
          QUICK EXIT
        </button>
      </div>
      <main>
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

import { generateMasterKey, deriveKeyFromPassword, encryptMasterKey, decryptMasterKey, generateSalt, generateRecoveryCode, arrayBufferToBase64, base64ToArrayBuffer, setActiveMasterKey } from './lib/crypto';

function AppContent() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  
  // Synchronous check prevents flashing 'login' mode for new users
  const [mode, setMode] = useState<'login' | 'setup' | 'show-recovery' | 'recover'>(() => {
    return localStorage.getItem('hershield-salt') ? 'login' : 'setup';
  });
  const [recoveryCode, setRecoveryCode] = useState('');

  const handleSetup = async () => {
    if (pin.length < 4) return alert("Please use at least 4 digits for your PIN.");
    
    // 1. Generate core crypto material
    const salt = generateSalt();
    const masterKey = await generateMasterKey();
    
    // 2. Wrap Master Key with PIN
    const pinKey = await deriveKeyFromPassword(pin, salt);
    const { encryptedKey: pinWrappedKey, iv: pinIv } = await encryptMasterKey(masterKey, pinKey);
    
    // 3. Wrap Master Key with new Recovery Code
    const code = generateRecoveryCode();
    const recoveryKey = await deriveKeyFromPassword(code.replace(/-/g, ''), salt);
    const { encryptedKey: recWrappedKey, iv: recIv } = await encryptMasterKey(masterKey, recoveryKey);
    
    // 4. Save everything to localStorage
    localStorage.setItem('hershield-salt', arrayBufferToBase64(salt));
    localStorage.setItem('hershield-pin-wrapped-key', arrayBufferToBase64(pinWrappedKey));
    localStorage.setItem('hershield-pin-iv', arrayBufferToBase64(pinIv));
    localStorage.setItem('hershield-rec-wrapped-key', arrayBufferToBase64(recWrappedKey));
    localStorage.setItem('hershield-rec-iv', arrayBufferToBase64(recIv));
    
    setActiveMasterKey(masterKey);
    setRecoveryCode(code);
    setMode('show-recovery');
  };

  const handleLogin = async () => {
    try {
      const salt = base64ToArrayBuffer(localStorage.getItem('hershield-salt')!);
      const wrappedKey = base64ToArrayBuffer(localStorage.getItem('hershield-pin-wrapped-key')!);
      const iv = base64ToArrayBuffer(localStorage.getItem('hershield-pin-iv')!);
      
      const pinKey = await deriveKeyFromPassword(pin, salt);
      // If decryption fails, the PIN is wrong
      const masterKey = await decryptMasterKey(wrappedKey.buffer, iv, pinKey);
      
      setActiveMasterKey(masterKey);
      setIsUnlocked(true);
    } catch (e) {
      alert("That PIN did not match. Take your time and try again.");
      setPin('');
    }
  };

  const handleRecovery = async () => {
    try {
      const salt = base64ToArrayBuffer(localStorage.getItem('hershield-salt')!);
      const recWrappedKey = base64ToArrayBuffer(localStorage.getItem('hershield-rec-wrapped-key')!);
      const recIv = base64ToArrayBuffer(localStorage.getItem('hershield-rec-iv')!);
      
      const cleanCode = recoveryCode.replace(/-/g, '').trim().toUpperCase();
      const recoveryKey = await deriveKeyFromPassword(cleanCode, salt);
      
      // Decrypt master key using recovery code
      const masterKey = await decryptMasterKey(recWrappedKey.buffer, recIv, recoveryKey);
      
      // If we got here, recovery code is correct. Now re-wrap with new PIN.
      if (pin.length < 4) return alert("Please set a new PIN with at least 4 digits.");
      
      const pinKey = await deriveKeyFromPassword(pin, salt);
      const { encryptedKey: pinWrappedKey, iv: pinIv } = await encryptMasterKey(masterKey, pinKey);
      
      localStorage.setItem('hershield-pin-wrapped-key', arrayBufferToBase64(pinWrappedKey));
      localStorage.setItem('hershield-pin-iv', arrayBufferToBase64(pinIv));
      
      setActiveMasterKey(masterKey);
      alert("PIN successfully reset! Welcome back.");
      setIsUnlocked(true);
    } catch (e) {
      alert("Invalid Recovery Code. Please check the code and try again.");
    }
  };

  if (!isUnlocked) {
    if (mode === 'show-recovery') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
          <Shield size={48} className="text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-textslate">Your Recovery Code</h1>
          <div className="card-container w-full max-w-sm flex flex-col gap-4 text-center">
            <p className="text-sm">Write this down and hide it somewhere safe. If you forget your PIN, this is the <b>only</b> way to recover your data.</p>
            <div className="bg-pink-50 p-4 rounded text-xl font-black text-primary tracking-wider">{recoveryCode}</div>
            <button onClick={() => setIsUnlocked(true)} className="bg-primary text-white p-3 rounded-lg font-bold mt-2 shadow-md">
              I have hidden it safely. Enter HerShield
            </button>
          </div>
        </div>
      );
    }

    if (mode === 'recover') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
          <Shield size={48} className="text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-textslate">Recover Data</h1>
          <div className="card-container w-full max-w-sm flex flex-col gap-4">
            <p className="text-sm text-center">Enter your 12-character Recovery Code to unlock and set a new PIN.</p>
            <input 
              type="text" 
              placeholder="A4X9-B2M1-CQ8L" 
              className="border border-tint rounded p-2 text-center text-lg font-bold uppercase tracking-widest"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Enter NEW PIN" 
              className="border border-tint rounded p-2 text-center text-xl tracking-[0.5em] mt-2"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button onClick={handleRecovery} className="bg-primary text-white p-3 rounded-lg font-bold shadow-md">
              Reset PIN & Unlock
            </button>
            <button onClick={() => setMode('login')} className="text-textslate text-sm underline mt-2 text-center">
              Back to Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Shield size={48} className="text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-8 text-textslate text-center">
          {mode === 'setup' ? 'Create Your Vault' : 'Welcome Back'}
        </h1>
        <div className="card-container w-full max-w-sm flex flex-col gap-4">
          <p className="text-sm text-center">
            {mode === 'setup' 
              ? 'This is a private, offline space. Set a secure PIN (4+ digits) to encrypt and lock your data.' 
              : 'Enter your PIN to unlock your vault.'}
          </p>
          <input 
            type="password" 
            placeholder={mode === 'setup' ? "Create PIN" : "Enter PIN"} 
            className="border border-tint rounded p-2 text-center text-xl tracking-[0.5em]"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (mode === 'setup' ? handleSetup() : handleLogin())}
          />
          <button 
            onClick={mode === 'setup' ? handleSetup : handleLogin}
            className="bg-primary text-white p-3 rounded-lg font-bold shadow-md"
          >
            {mode === 'setup' ? 'Create PIN & Begin' : 'Unlock Vault'}
          </button>
          {mode === 'login' && (
            <button onClick={() => setMode('recover')} className="text-textslate text-xs underline mt-2 text-center hover:text-primary">
              Forgot PIN? Use Recovery Code
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/help" element={<Help />} />
        <Route path="/log" element={<Log />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/hope" element={<Hope />} />
        <Route path="/law" element={<Law />} />
        <Route path="/settings" element={<SettingsTab />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="*" element={<Navigate to="/sos" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
