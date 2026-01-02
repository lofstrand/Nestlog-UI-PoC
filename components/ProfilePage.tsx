
import React, { useState } from 'react';
import { User, ShieldCheck, Bell, Globe, Layout, CreditCard, Sparkles, Save, Camera, CheckCircle2, ChevronRight, Monitor, Ruler, DollarSign } from 'lucide-react';
import { Button, Card, PageHeader, SectionHeading, Badge, Input } from './UIPrimitives';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [userName, setUserName] = useState('John Doe');
  const [jobTitle, setJobTitle] = useState('Chief Household Officer');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [currency, setCurrency] = useState('SEK');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highDensityMode, setHighDensityMode] = useState(false);
  const [blueprintGrid, setBlueprintGrid] = useState(true);

  const tabs = [
    { id: 'profile', label: 'User Identity', icon: User },
    { id: 'settings', label: 'Site Preferences', icon: Layout },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto">
      <PageHeader 
        title="System Configuration" 
        description="Manage your identity and global environment settings."
        action={<Button icon={Save} onClick={() => {}}>Commit Changes</Button>}
      />

      <div className="flex space-x-1 p-1 bg-slate-100/50 rounded-2xl border border-slate-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}
            `}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card noPadding className="overflow-hidden">
              <div className="h-48 bg-slate-900 relative">
                <div className="absolute inset-0 blueprint-grid opacity-20"></div>
                <button className="absolute bottom-4 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all">
                  <Camera size={20} />
                </button>
              </div>
              <div className="px-10 pb-10 -mt-16 relative">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-[2rem] bg-slate-800 border-8 border-white flex items-center justify-center text-4xl font-black text-white shadow-xl">
                    JD
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]">
                    <Camera size={24} />
                  </button>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Legal Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                  <Input label="Administrative Role" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <SectionHeading label="Professional Biography" />
                    <Button variant="ghost" size="sm" icon={Sparkles} className="text-[#a47148]">Refine with AI</Button>
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Briefly describe your responsibilities..."
                    defaultValue="Managing multiple high-value properties in Stockholm and Gotland. Focused on sustainability and energy efficiency."
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-5 py-4 text-sm font-bold text-slate-900 leading-relaxed focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all resize-none shadow-inner"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Account Status</p>
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={20} className="text-[#5a6b5d]" />
                  <span className="text-xl font-black text-white tracking-tight">Nestlog Elite</span>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-800 space-y-6">
                <div className="flex items-center justify-between text-slate-400 text-sm font-bold tracking-tight">
                  <span>Storage Utilization</span>
                  <span className="text-white">6.8 GB / 50 GB</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5a6b5d] w-[14%] rounded-full shadow-[0_0_12px_rgba(90,107,93,0.6)]"></div>
                </div>
              </div>
              <Button variant="secondary" className="w-full bg-slate-800 text-white hover:bg-slate-700">Manage Plan</Button>
            </div>

            <Card>
               <SectionHeading icon={Bell} label="Alert Channels" />
               <div className="space-y-4">
                 {[
                   { label: 'Push Notifications', enabled: notificationsEnabled, set: setNotificationsEnabled },
                   { label: 'Security Alerts', enabled: true, locked: true },
                   { label: 'Maintenance Reminders', enabled: true, set: () => {} },
                 ].map((channel, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <span className={`text-sm font-bold ${channel.locked ? 'text-slate-400 italic' : 'text-slate-700'}`}>
                       {channel.label}
                     </span>
                     <button 
                      disabled={channel.locked}
                      onClick={() => channel.set && channel.set(!channel.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${channel.enabled ? 'bg-[#5a6b5d]' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${channel.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                   </div>
                 ))}
               </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <SectionHeading icon={Globe} label="Localization & Standards" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <SectionHeading icon={Ruler} label="Unit System" color="text-slate-300" />
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['metric', 'imperial'].map(u => (
                    <button key={u} onClick={() => setUnitSystem(u as any)} className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${unitSystem === u ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                      {u === 'metric' ? 'Metric (m²)' : 'Imperial (ft²)'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <SectionHeading icon={DollarSign} label="Global Currency" color="text-slate-300" />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all">
                  <option value="SEK">Swedish Krona (kr)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeading icon={Monitor} label="Interface Engine" />
            <div className="space-y-6">
              {[
                { label: 'Display Blueprint Grid', desc: 'Show architectural grid lines', state: blueprintGrid, toggle: setBlueprintGrid },
                { label: 'High Density Mode', desc: 'Reduce whitespace in lists', state: highDensityMode, toggle: setHighDensityMode }
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 tracking-tight">{pref.label}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{pref.desc}</p>
                  </div>
                  <button onClick={() => pref.toggle(!pref.state)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pref.state ? 'bg-slate-900' : 'bg-slate-200'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pref.state ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
