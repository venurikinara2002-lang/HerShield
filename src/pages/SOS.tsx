import { useState, useEffect } from 'react';
import { Phone, Heart, MessageSquare, Save, Trash2, Plus, Users, ChevronDown, ChevronUp, Edit2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Contact = { id: string, name: string, number: string };

function ContactCard({ contact, onRemove, onUpdate }: { contact: Contact, onRemove: (id: string) => void, onUpdate: (c: Contact) => void }) {
  const [msg, setMsg] = useState('I need help right now. Please call or come over.');
  const [expanded, setExpanded] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(contact.name);
  const [editNum, setEditNum] = useState(contact.number);

  const cleanForWhatsapp = (num: string) => {
    let cleaned = num.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '94' + cleaned.substring(1); 
    return cleaned;
  };

  const handleSave = () => {
    if (!editName.trim() || !editNum.trim()) return alert("Name and number cannot be empty.");
    onUpdate({ ...contact, name: editName.trim(), number: editNum.trim().replace(/\s+/g, '') });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card-container border-primary/40 bg-white shadow-md relative space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm text-textslate">Edit Contact</h3>
          <button onClick={() => { setIsEditing(false); setEditName(contact.name); setEditNum(contact.number); }} className="text-textslate opacity-50 hover:opacity-100"><X size={18}/></button>
        </div>
        <input type="text" placeholder="Name" className="w-full border border-tint rounded-lg p-2 text-sm" value={editName} onChange={(e) => setEditName(e.target.value)} />
        <input type="tel" placeholder="Phone Number" className="w-full border border-tint rounded-lg p-2 text-sm" value={editNum} onChange={(e) => setEditNum(e.target.value)} />
        <button onClick={handleSave} className="w-full bg-primary text-white p-2 rounded-lg font-bold text-sm">Save Changes</button>
      </div>
    );
  }

  return (
    <div className="card-container border-primary/20 bg-primary/5 shadow-sm relative">
      <div className="absolute top-4 right-4 flex gap-3">
        <button onClick={() => setIsEditing(true)} className="text-primary opacity-60 hover:opacity-100">
          <Edit2 size={16}/>
        </button>
        <button onClick={() => onRemove(contact.id)} className="text-red-500 opacity-60 hover:opacity-100">
          <Trash2 size={16}/>
        </button>
      </div>

      <div className="flex items-center justify-between pr-14 mb-4 border-b border-primary/10 pb-4">
        <div>
          <h3 className="font-bold text-lg text-primary">{contact.name}</h3>
          <p className="font-black text-primary text-xl tracking-wide">{contact.number}</p>
        </div>
        <a href={`tel:${contact.number}`} className="bg-primary bg-opacity-20 p-3 rounded-full text-primary shadow-sm hover:bg-opacity-30">
          <Phone size={24} className="fill-primary" />
        </a>
      </div>

      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between text-xs font-bold text-primary mb-2 opacity-80 hover:opacity-100 p-2 bg-white rounded-lg shadow-sm border border-primary/10">
        <span className="flex items-center gap-2"><MessageSquare size={14}/> Compose custom message for {contact.name}</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="space-y-2 mb-3 bg-white p-3 rounded-lg border border-primary/10">
          <select 
            className="w-full border border-primary/20 rounded p-2 text-xs bg-gray-50 text-textslate outline-none"
            onChange={(e) => {
              if (e.target.value !== 'custom') setMsg(e.target.value);
              else setMsg('');
            }}
          >
            <option value="I need help right now. Please call or come over.">"I need help right now."</option>
            <option value="He is escalating. Please call me and pretend it's an emergency so I can leave.">"Call me with a fake emergency"</option>
            <option value="I am leaving safely now. Just keeping you informed.">"I am leaving safely."</option>
            <option value="custom">Type a custom message...</option>
          </select>
          <textarea 
            className="w-full border border-primary/20 rounded p-2 text-xs bg-gray-50 text-textslate min-h-[60px] outline-none"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={`Message for ${contact.name}...`}
          />
        </div>
      )}

      <div className="flex gap-2">
        <a href={`sms:${contact.number}?body=${encodeURIComponent("[HerShield SOS] " + msg)}`} className="flex-1 bg-textslate text-white text-center p-2 rounded-lg font-bold text-xs shadow-sm hover:bg-black">
          Send SMS
        </a>
        <a href={`https://wa.me/${cleanForWhatsapp(contact.number)}?text=${encodeURIComponent("[HerShield SOS] " + msg)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 text-white text-center p-2 rounded-lg font-bold text-xs shadow-sm hover:bg-green-700">
          WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function SOS() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [groupSmsText, setGroupSmsText] = useState('I need help right now.');

  useEffect(() => {
    const saved = localStorage.getItem('hershield-sos-contacts');
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    } else {
      setIsAdding(true);
    }
  }, []);

  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem('hershield-sos-contacts', JSON.stringify(newContacts));
  };

  const handleAdd = () => {
    if (!newName.trim() || !newNumber.trim()) return alert("Please enter both a name and a phone number.");
    const newContact = { id: crypto.randomUUID(), name: newName.trim(), number: newNumber.trim().replace(/\s+/g, '') };
    saveContacts([...contacts, newContact]);
    setNewName(''); setNewNumber(''); setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    if (window.confirm("Remove this trusted contact?")) {
      saveContacts(contacts.filter(c => c.id !== id));
      if (contacts.length === 1) setIsAdding(true);
    }
  };

  const handleUpdate = (updated: Contact) => {
    saveContacts(contacts.map(c => c.id === updated.id ? updated : c));
  };

  const allNumbers = contacts.map(c => c.number).join(',');
  const groupSmsLink = `sms:${allNumbers}?body=${encodeURIComponent("[HerShield SOS] " + groupSmsText)}`;

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-textslate border-b border-tint pb-2 flex items-center gap-2">
        <Heart className="text-primary" /> {t('Emergency SOS')}
      </h2>

      {/* Group Alert Composer */}
      {contacts.length > 1 && (
        <div className="card-container border-red-500/50 bg-red-50 space-y-3 shadow-md">
          <label className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
            <Users size={16}/> Mass Emergency Alert
          </label>
          <select 
            className="w-full border border-red-200 rounded-lg p-2 text-xs bg-white text-textslate outline-none"
            onChange={(e) => {
              if (e.target.value !== 'custom') setGroupSmsText(e.target.value);
              else setGroupSmsText('');
            }}
          >
            <option value="I need help right now. Please call or come over.">"I need help right now."</option>
            <option value="He is escalating. Please call me and pretend it's an emergency so I can leave.">"Call me with a fake emergency"</option>
            <option value="I am leaving safely now. Just keeping you informed.">"I am leaving safely."</option>
            <option value="custom">Type a custom message...</option>
          </select>
          <textarea 
            className="w-full border border-red-200 rounded-lg p-3 text-sm bg-white mb-2 text-textslate min-h-[50px] outline-none"
            value={groupSmsText}
            onChange={(e) => setGroupSmsText(e.target.value)}
            placeholder="Type emergency message for ALL contacts..."
          />
          <a href={groupSmsLink} className="block w-full bg-red-600 text-white text-center p-3 rounded-xl font-bold text-sm shadow hover:bg-red-700 active:scale-95 transition flex justify-center items-center gap-2">
            Send Group SMS to ALL ({contacts.length})
          </a>
        </div>
      )}

      {/* Contact List */}
      <div className="space-y-4">
        {contacts.map(c => <ContactCard key={c.id} contact={c} onRemove={handleRemove} onUpdate={handleUpdate} />)}
      </div>

      {/* Add New */}
      {isAdding ? (
        <div className="card-container border-dashed border-tint space-y-3">
          <h3 className="font-bold text-sm text-textslate">Add Trusted Contact</h3>
          <div className="space-y-2">
            <input type="text" placeholder="Name (e.g. Sister)" className="w-full border border-tint rounded-lg p-2 text-sm" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <input type="tel" placeholder="Phone Number" className="w-full border border-tint rounded-lg p-2 text-sm" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 bg-primary text-white p-2 rounded-lg font-bold text-sm">Save</button>
              {contacts.length > 0 && <button onClick={() => setIsAdding(false)} className="flex-1 border border-tint p-2 rounded-lg font-bold text-sm">Cancel</button>}
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className="w-full border-2 border-dashed border-primary text-primary p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/5">
          <Plus size={18} /> Add another contact
        </button>
      )}
    </div>
  );
}
