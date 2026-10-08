import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Paperclip, Bold, Italic, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { saveEncryptedLog } from '../lib/storage';
import { getActiveMasterKey } from '../lib/crypto';

export default function Log() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [behaviours, setBehaviours] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState<number>(2); // Default to Anxious (2)

  const behaviourList = [
    'Verbal degradation', 'Gaslighting', 'Threats', 'Financial control', 
    'Isolation from family/friends', 'Monitoring/Stalking', 'Physical intimidation'
  ];

  const impactLevels = [
    { value: 1, label: t('Unsettled') },
    { value: 2, label: t('Anxious') },
    { value: 3, label: t('Fearful') },
    { value: 4, label: t('Drained') },
    { value: 5, label: t('Despairing') }
  ];

  const toggleBehaviour = (b: string) => {
    setBehaviours(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const handleSave = async () => {
    if (!description.trim()) {
      return alert("Please add a description of the incident.");
    }
    
    try {
      const entry = {
        date,
        behaviours,
        description,
        impact,
        evidence: [] // Evidence upload to be implemented
      };
      
      const id = crypto.randomUUID();
      const masterKey = getActiveMasterKey();
      
      await saveEncryptedLog(id, JSON.stringify(entry), masterKey);
      
      alert("Saved. You did something brave.");
      navigate('/timeline');
    } catch (e) {
      console.error(e);
      alert("Error saving log. Please ensure your vault is unlocked.");
    }
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-textslate border-b border-tint pb-2">{t('New Incident Entry')}</h2>

      <div className="space-y-2">
        <label className="font-bold text-sm block">{t('When')}</label>
        <input 
          type="datetime-local" 
          className="border border-tint rounded-lg p-2 w-full text-sm font-medium"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-sm block">{t('Behaviours')} ({t('Select all that apply')})</label>
        <div className="grid grid-cols-1 gap-2">
          {behaviourList.map(b => (
            <label key={b} className="flex items-center gap-2 text-sm bg-card p-2 rounded border border-tint">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-primary"
                checked={behaviours.includes(b)}
                onChange={() => toggleBehaviour(b)}
              />
              {t(b)}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-bold text-sm block flex justify-between items-center">
          {t('Description')}
          <div className="flex gap-2">
            <button className="p-1 bg-gray-100 rounded text-gray-700 hover:bg-gray-200"><Bold size={16}/></button>
            <button className="p-1 bg-gray-100 rounded text-gray-700 hover:bg-gray-200"><Italic size={16}/></button>
            <button className="p-1 bg-gray-100 rounded text-gray-700 hover:bg-gray-200"><List size={16}/></button>
          </div>
        </label>
        <textarea 
          className="border border-tint rounded-lg p-2 w-full text-sm min-h-[120px]"
          placeholder={t('Description Desc')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-sm block">{t('How did this make you feel?')}</label>
        <div className="flex flex-wrap gap-2">
          {impactLevels.map(lvl => (
            <button 
              key={lvl.value}
              onClick={() => setImpact(lvl.value)}
              className={`flex-1 min-w-[100px] p-2 rounded-lg border text-sm font-medium transition-all ${impact === lvl.value ? 'border-primary bg-pink-50 text-primary shadow-sm' : 'border-tint bg-card text-textslate'}`}
            >
              <div className="text-lg mb-1">{lvl.value}</div>
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-bold text-sm block">Evidence (voice note, screenshot, photo)</label>
        <button className="border border-dashed border-primary text-primary bg-primary bg-opacity-5 rounded-lg p-4 w-full flex flex-col items-center gap-2 hover:bg-opacity-10 transition-colors">
          <Paperclip size={24} />
          <span className="text-sm font-bold">Attach Files</span>
          <span className="text-xs opacity-70">Files are encrypted and stored locally. (Max 10MB)</span>
        </button>
      </div>

      <button onClick={handleSave} className="bg-primary text-white w-full p-4 rounded-[16px] font-bold shadow-md flex items-center justify-center gap-2">
        <Save size={20} /> Save this entry
      </button>

    </div>
  );
}
