import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Filter, Calendar, Edit2, Trash2, Paperclip, Loader } from 'lucide-react';
import { getAllDecryptedLogs } from '../lib/storage';
import { getActiveMasterKey } from '../lib/crypto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Timeline() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const masterKey = getActiveMasterKey();
        const dbLogs = await getAllDecryptedLogs(masterKey);
        const parsedLogs = dbLogs.map(log => ({
          dbId: log.id,
          ...JSON.parse(log.data)
        }));
        setEntries(parsedLogs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const handleGenerateReport = () => {
    if (entries.length === 0) return alert("There are no entries to export yet.");
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(45, 55, 72); // textslate
      doc.text("Incident Documentation Record", 14, 22);
      
      // Meta
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text("CONFIDENTIAL - This document contains sensitive personal safety records.", 14, 35);
      
      // Table
      const tableData = entries.map((entry, index) => {
        const impactLabel = ['Unsettled', 'Anxious', 'Fearful', 'Drained', 'Despairing'][entry.impact - 1] || 'Unknown';
        return [
          entry.date.replace('T', ' '),
          entry.behaviours.join(', '),
          impactLabel,
          entry.description
        ];
      });

      autoTable(doc, {
        startY: 45,
        head: [['Date', 'Behaviours', 'Impact Level', 'Description']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [224, 98, 135] }, // primary color #E06287
        styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
        columnStyles: { 3: { cellWidth: 80 } }
      });
      
      doc.save("HerShield-Incident-Report.pdf");
    } catch (e) {
      console.error(e);
      alert("Error generating PDF. Please ensure you have entries saved.");
    }
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
      
      <button 
        onClick={handleGenerateReport}
        className="w-full bg-primary text-white p-4 rounded-[16px] font-bold shadow-md flex items-center justify-center gap-2 hover:bg-opacity-90 transition"
      >
        <FileText size={20} /> Generate Police & Legal Evidence Report
      </button>

      <div className="flex items-center justify-between border-b border-tint pb-2">
        <h2 className="text-xl font-bold text-textslate">Your timeline ({entries.length})</h2>
        <div className="flex gap-2">
          <button className="p-2 bg-card rounded-lg border border-tint text-textslate"><Calendar size={18}/></button>
          <button className="p-2 bg-card rounded-lg border border-tint text-textslate"><Filter size={18}/></button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8 opacity-70">
          <Loader className="animate-spin text-primary" size={24} />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center p-8 opacity-70 text-sm">
          Nothing here yet. When you feel ready, your entries will appear here, newest first. There is no rush.
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-tint before:to-transparent">
          {entries.map(entry => (
            <div key={entry.dbId} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Dot */}
              <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-primary shadow shrink-0 ml-[14.5px] md:order-1 md:ml-[calc(50%-6px)] md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
              
              {/* Card */}
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] card-container relative p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold opacity-70">{entry.date}</span>
                  <span className="text-xs font-bold bg-pink-50 text-primary px-2 py-1 rounded-full border border-primary/20">Impact: {entry.impact}/5</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {entry.behaviours.map(b => (
                    <span key={b} className="text-[10px] uppercase tracking-wide bg-gray-100 px-2 py-1 rounded font-bold opacity-80">{b}</span>
                  ))}
                </div>
                
                <div className="text-sm border-l-2 border-tint pl-3 opacity-90 italic">
                  {entry.description}
                </div>
                
                {entry.evidence.length > 0 && (
                  <div className="flex gap-2">
                    {entry.evidence.map(e => (
                      <button key={e} className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                        <Paperclip size={12}/> {e}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2 border-t border-tint/50 mt-2">
                  <button className="flex items-center gap-1 text-xs font-bold opacity-70 hover:opacity-100"><Edit2 size={14}/> Edit</button>
                  <button className="flex items-center gap-1 text-xs font-bold text-red-500 opacity-80 hover:opacity-100"><Trash2 size={14}/> Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
