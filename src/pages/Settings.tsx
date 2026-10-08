import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Lock, EyeOff, Globe, Trash2, AlertTriangle, Download, Upload, Heart } from 'lucide-react';
import { clearAllData } from '../lib/storage';

export default function SettingsTab() {
  const { t, i18n } = useTranslation();
  const [stealthMode, setStealthMode] = useState(localStorage.getItem('hershield-stealth') === 'true');
  const [quickExitUrl, setQuickExitUrl] = useState(localStorage.getItem('hershield-quick-exit') || '');
  const [urlStatus, setUrlStatus] = useState('');
  
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('hershield-lang', lang);
  };

  const handleStealthToggle = () => {
    const newStealth = !stealthMode;
    setStealthMode(newStealth);
    localStorage.setItem('hershield-stealth', newStealth.toString());
    window.dispatchEvent(new Event('stealth-changed'));
  };

  const handleSaveUrl = () => {
    let url = quickExitUrl.trim();
    if (!url) {
      localStorage.removeItem('hershield-quick-exit');
      setUrlStatus('Quick Exit will open the weather page.');
      return;
    }
    
    if (url.startsWith('javascript:') || url.startsWith('data:')) {
      setUrlStatus('Please enter a valid web address, for example news.google.com');
      return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
      setQuickExitUrl(url);
    }
    
    localStorage.setItem('hershield-quick-exit', url);
    setUrlStatus('Saved. Quick Exit will now open this page.');
  };

  const handleEraseAll = async () => {
    if (window.confirm("Erase ALL entries and settings? This cannot be undone.")) {
      await clearAllData();
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
      
      <h2 className="text-2xl font-bold text-textslate border-b border-tint pb-2 flex items-center gap-2">
        <Settings className="text-primary" /> {t('Settings')}
      </h2>

      {/* Language */}
      <div className="card-container flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2 text-primary"><Globe size={18} /> {t('Language')}</h3>
          <p className="text-sm opacity-80">{t('Choose language')}</p>
        </div>
        <select 
          className="border border-tint rounded-lg p-2 text-sm bg-white font-bold text-textslate"
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="en">English</option>
          <option value="si">සිංහල (Sinhala)</option>
          <option value="ta">தமிழ் (Tamil)</option>
        </select>
      </div>

      {/* Privacy & Safety */}
      <div className="card-container flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2"><EyeOff size={18}/> {t('Stealth Mode')}</h3>
          <p className="text-sm opacity-80 max-w-[200px]">{t('Stealth Desc')}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={stealthMode} onChange={handleStealthToggle} />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {/* Encryption / PIN */}
      <div className="card-container space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2"><Lock size={18}/> Encryption</h3>
        <p className="text-sm opacity-80">Encrypted with your PIN (AES-256-GCM). The app also locks itself after 3 idle minutes.</p>
        <div className="flex gap-2">
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm w-full" onClick={() => alert("Change PIN not fully implemented yet.")}>
            Change PIN
          </button>
          <button className="bg-textslate text-white px-4 py-2 rounded-lg font-bold text-sm w-full" onClick={() => window.location.reload()}>
            Lock now
          </button>
        </div>
      </div>

      {/* Quick Exit Config */}
      <div className="card-container space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2"><Globe size={18}/> {t('Quick Exit Button')}</h3>
        <p className="text-sm opacity-80">
          {t('Quick Exit Desc')}
        </p>
        <div className="flex gap-2">
          <input 
            type="url" 
            placeholder="https://www.example.com" 
            className="border border-tint rounded-lg p-2 flex-grow text-sm"
            value={quickExitUrl}
            onChange={(e) => setQuickExitUrl(e.target.value)}
          />
          <button className="bg-textslate text-white px-4 py-2 rounded-lg font-bold text-sm" onClick={handleSaveUrl}>Save</button>
        </div>
        {urlStatus && <p className="text-xs text-primary font-bold">{urlStatus}</p>}
      </div>

      {/* Backup */}
      <div className="card-container space-y-3">
        <h3 className="font-bold text-lg">Backup & Restore</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 border border-primary text-primary px-4 py-2 rounded-lg font-bold text-sm w-full justify-center">
            <Download size={16}/> Export
          </button>
          <button className="flex items-center gap-1 border border-primary text-primary px-4 py-2 rounded-lg font-bold text-sm w-full justify-center">
            <Upload size={16}/> Import
          </button>
        </div>
      </div>

      {/* Safer Use Tip */}
      <div className="bg-pink-50 border-l-4 border-primary p-4 rounded text-sm text-pink-900 shadow-sm flex gap-2">
        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
        <p><strong>Tip:</strong> use a private browsing window if the device is shared, and clear history after use. Do not rely on any app alone for your safety.</p>
      </div>

      {/* Erase All */}
      <div className="card-container border-red-200 bg-red-50 space-y-3">
        <h3 className="font-bold text-lg text-red-700 flex items-center gap-2"><Trash2 size={18}/> {t('Erase Vault')}</h3>
        <p className="text-sm text-red-700 opacity-80 mb-3">{t('Erase Desc')}</p>
        <button onClick={handleEraseAll} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm w-full shadow-sm">
          {t('Erase All Data Instantly')}
        </button>
      </div>

    </div>
  );
}
