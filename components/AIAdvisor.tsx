
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Bot, RefreshCw, LayoutTemplate, MessageSquareText } from 'lucide-react';
import { getLayoutAdvice, analyzeHouseholdHealth } from '../services/geminiService';
import { View, Household } from '../types';

interface AIAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: View;
  households: Household[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ isOpen, onClose, currentView, households }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [healthSummary, setHealthSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const layoutAdvice = await getLayoutAdvice(`User is currently looking at the ${currentView} view in their home management app Nestlog.`);
    const health = await analyzeHouseholdHealth(households);
    setAdvice(layoutAdvice || 'No advice available at this time.');
    setHealthSummary(health || 'Analysis unavailable.');
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdvice();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-none tracking-tight">Nestlog Advisor</h3>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 block">AI Engine</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <RefreshCw size={32} className="text-slate-800 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Consulting the architecture...</p>
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <LayoutTemplate size={14} className="text-slate-800" />
                <span>Layout Suggestions</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap shadow-inner font-medium">
                {advice}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Bot size={14} className="text-[#5a6b5d]" />
                <span>Health Analysis</span>
              </div>
              <div className="bg-[#f2f4f2]/50 border border-[#e1e6e1] rounded-2xl p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                {healthSummary}
              </div>
            </section>

            <div className="p-5 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-xl">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Pro-Tip</h4>
              <p className="text-xs text-slate-100 leading-relaxed font-medium italic">
                "You can link documents directly to inventory items to track warranties automatically across properties."
              </p>
            </div>
          </>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-sm"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all shadow-md active:scale-95">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
