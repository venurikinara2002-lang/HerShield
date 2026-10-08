import { helplines } from '../data/helplines';
import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Help() {
  const { t } = useTranslation();

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* KPI Card */}
      <div className="bg-primary text-white p-4 rounded-xl shadow-sm text-center">
        <p className="font-bold text-lg mb-2">You are not alone. Support is here for you.</p>
        <div className="flex justify-around mt-4 text-sm font-medium">
          <div className="flex flex-col items-center">
            <span className="text-2xl">0</span>
            <span className="opacity-80">Brave Steps</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl">1</span>
            <span className="opacity-80">Days Here</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl">{helplines.length}</span>
            <span className="opacity-80">Helplines</span>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-900">
        <p className="font-bold mb-1">If you are in immediate danger, call 119.</p>
        <p>What happened is not your fault.</p>
      </div>

      {/* Helpline Cards */}
      <div className="flex flex-col gap-3">
        {helplines.map((hl) => (
          <a href={`tel:${hl.number}`} key={hl.number} className="card-container flex items-center justify-between hover:bg-tint transition-colors">
            <div>
              <h3 className="font-bold text-lg text-textslate">{hl.service}</h3>
              <p className="text-sm opacity-70">{hl.si} | {hl.ta}</p>
            </div>
            <div className="bg-primary bg-opacity-10 p-3 rounded-full text-primary">
              <Phone size={24} />
            </div>
          </a>
        ))}
      </div>

      {/* Grounding Checklist (Preview) */}
      <div className="card-container bg-opacity-50 mt-4">
        <h3 className="font-bold text-lg mb-2">Grounding & Safety</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Breathe: In for 4 seconds, Out for 6.</li>
          <li>Find 5 things you can see, 4 you can touch...</li>
          <li>Move to a safer room away from the kitchen.</li>
          <li>Keep key documents (NIC, Passport) ready.</li>
        </ul>
      </div>
    </div>
  );
}
