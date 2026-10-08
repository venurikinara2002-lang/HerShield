import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Book, Clock, Heart, Scale, Settings } from 'lucide-react';
import Help from './pages/Help';

// Basic Placeholder Components
const Log = () => <div className="p-4"><h1>Incident Log</h1></div>;
const Timeline = () => <div className="p-4"><h1>Timeline</h1></div>;
const Hope = () => <div className="p-4"><h1>Hope & Affirmations</h1></div>;
const Law = () => <div className="p-4"><h1>Legal Guide</h1></div>;
const SettingsTab = () => <div className="p-4"><h1>Settings</h1></div>;

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { path: '/help', icon: Shield, label: 'Help' },
    { path: '/log', icon: Book, label: 'Log' },
    { path: '/timeline', icon: Clock, label: 'Timeline' },
    { path: '/hope', icon: Heart, label: 'Hope' },
    { path: '/law', icon: Scale, label: 'Law' },
    { path: '/settings', icon: Settings, label: 'Settings' }
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
  return (
    <div className="min-h-screen pb-20">
      {/* Quick Exit Header could go here */}
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">HerShield</h1>
        <button className="bg-quickexit text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg" onClick={() => window.location.replace('https://open-meteo.com')}>
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

function AppContent() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Shield size={48} className="text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-8 text-textslate">Welcome to HerShield</h1>
        <div className="card-container w-full max-w-sm flex flex-col gap-4">
          <p className="text-sm text-center">Enter your PIN to unlock or continue without encryption.</p>
          <input 
            type="password" 
            placeholder="Enter PIN" 
            className="border border-tint rounded p-2 text-center text-xl tracking-[0.5em]"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button 
            onClick={() => setIsUnlocked(true)}
            className="bg-primary text-white p-3 rounded-lg font-bold"
          >
            Unlock
          </button>
          <button 
            onClick={() => setIsUnlocked(true)}
            className="text-textslate text-sm underline mt-2"
          >
            Continue without PIN (Not Encrypted)
          </button>
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
        <Route path="*" element={<Navigate to="/help" replace />} />
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
