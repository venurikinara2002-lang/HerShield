import { useTranslation } from 'react-i18next';
import { Scale, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Law() {
  const { t } = useTranslation();
  const lastReviewed = "2026-10-08"; // TODO: verify with a Sri Lankan lawyer

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded text-sm text-yellow-900 shadow-sm">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} />
          <div>
            <p className="font-bold mb-1">{t('General Info')}</p>
            <p>{t('Confirm Details')}</p>
            <p className="text-xs mt-2 opacity-75">{t('Last reviewed')}: {lastReviewed}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-textslate border-b border-tint pb-2 flex items-center gap-2">
        <Scale className="text-primary" /> {t('Legal Guide')}
      </h2>

      {/* Steps */}
      <div className="card-container">
        <h3 className="font-bold text-lg mb-4 text-primary">{t('Step-by-Step')}</h3>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3"><CheckCircle2 size={20} className="text-green-500 shrink-0"/> <span>{t('Step 1')}</span></li>
          <li className="flex gap-3"><CheckCircle2 size={20} className="text-green-500 shrink-0"/> <span>{t('Step 2')}</span></li>
          <li className="flex gap-3"><CheckCircle2 size={20} className="text-green-500 shrink-0"/> <span>{t('Step 3')}</span></li>
          <li className="flex gap-3"><CheckCircle2 size={20} className="text-green-500 shrink-0"/> <span>{t('Step 4')}</span></li>
        </ol>
      </div>

      {/* Acts */}
      <div className="space-y-4">
        <div className="card-container">
          <h3 className="font-bold text-md text-textslate mb-1">{t('Law 1')}</h3>
          <p className="text-sm opacity-90">
            {t('Law 1 Desc')}
          </p>
        </div>

        <div className="card-container">
          <h3 className="font-bold text-md text-textslate mb-1">{t('Law 2')}</h3>
          <p className="text-sm opacity-90">
            {t('Law 2 Desc')}
          </p>
        </div>

        <div className="card-container">
          <h3 className="font-bold text-md text-textslate mb-1">{t('Law 3')}</h3>
          <p className="text-sm opacity-90">
            {t('Law 3 Desc')}
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="card-container bg-primary bg-opacity-5">
        <h3 className="font-bold text-lg mb-3">{t('Legal Contacts')}</h3>
        <ul className="space-y-3 text-sm font-medium">
          <li>
            <a href="https://www.legalaid.gov.lk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
              Legal Aid Commission <ExternalLink size={16} />
            </a>
          </li>
          <li>
            <a href="https://www.police.lk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
              Sri Lanka Police <ExternalLink size={16} />
            </a>
          </li>
          <li>
            <a href="https://www.hrcsl.lk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
              Human Rights Commission <ExternalLink size={16} />
            </a>
          </li>
          <li>
            <a href="https://www.justice.gov/eoir/vll/country/foreign_law/sri_lanka/SriLanka-DomesticViolence.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
              Domestic Violence Act (Full Text PDF) <ExternalLink size={16} />
            </a>
          </li>
        </ul>
      </div>

    </div>
  );
}
