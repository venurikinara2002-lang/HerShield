import { useState } from 'react';
import { affirmations } from '../data/affirmations';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Hope() {
  const { i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % affirmations.length
  );

  const nextMessage = () => {
    setCurrentIndex((prev) => (prev + 1) % affirmations.length);
  };

  const getMessageText = (msg: any) => {
    if (i18n.language === 'si') return msg.si;
    if (i18n.language === 'ta' && msg.ta) return msg.ta;
    return msg.en;
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
      
      {/* Daily Message Card */}
      <div className="bg-primary text-white p-8 rounded-[16px] shadow-sm text-center flex flex-col items-center gap-4">
        <Shield size={32} className="opacity-80" />
        <h2 className="text-xl font-bold opacity-90">A message for you today</h2>
        <p className="text-2xl font-medium leading-relaxed my-4">
          "{getMessageText(affirmations[currentIndex])}"
        </p>
        <button 
          onClick={nextMessage}
          className="bg-white text-primary px-6 py-2 rounded-full font-bold shadow hover:bg-tint transition-colors mt-2"
        >
          Another message
        </button>
      </div>

      {/* Full List */}
      <div>
        <h3 className="font-bold text-lg text-textslate mb-3 border-b border-tint pb-2">To remember</h3>
        <div className="space-y-3">
          {affirmations.map((msg) => (
            <div key={msg.id} className="card-container bg-opacity-50">
              <p className="text-sm font-medium opacity-90">"{getMessageText(msg)}"</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
