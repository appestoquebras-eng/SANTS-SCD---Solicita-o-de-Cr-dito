import React, { useState } from 'react';
import { X, Settings, Check, Phone, Mail, FileCode2 } from 'lucide-react';
import {
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_CONTACT_EMAIL,
  getActiveWhatsAppNumber,
  getActiveContactEmail,
} from '../config/creditConfig';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onSaved }) => {
  if (!isOpen) return null;

  const [whatsapp, setWhatsapp] = useState(
    getActiveWhatsAppNumber() === DEFAULT_WHATSAPP_NUMBER ? '' : getActiveWhatsAppNumber()
  );
  const [email, setEmail] = useState(
    getActiveContactEmail() === DEFAULT_CONTACT_EMAIL ? '' : getActiveContactEmail()
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsapp.trim()) {
      localStorage.setItem('sants_override_whatsapp', whatsapp.trim());
    } else {
      localStorage.removeItem('sants_override_whatsapp');
    }

    if (email.trim()) {
      localStorage.setItem('sants_override_email', email.trim());
    } else {
      localStorage.removeItem('sants_override_email');
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved();
      onClose();
    }, 900);
  };

  const handleReset = () => {
    localStorage.removeItem('sants_override_whatsapp');
    localStorage.removeItem('sants_override_email');
    setWhatsapp('');
    setEmail('');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">Configuração da Campanha</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs sm:text-sm">
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
            <div className="flex items-start gap-2">
              <FileCode2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Para produção estática, você pode editar diretamente o arquivo{' '}
                <strong className="font-mono text-blue-950">src/config/creditConfig.ts</strong>. 
                Os campos abaixo permitem testar o redirecionamento do WhatsApp e e-mail imediatamente pelo navegador.
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-500" />
              WhatsApp Oficial (com DDI e DDD)
            </label>
            <input
              type="text"
              placeholder="Ex: 5511999998888"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs sm:text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Valor padrão no código: <span className="font-mono">{DEFAULT_WHATSAPP_NUMBER}</span>
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-500" />
              E-mail Institucional de Contato
            </label>
            <input
              type="email"
              placeholder="Ex: contato@santsscd.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs sm:text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Valor padrão no código: <span className="font-mono">{DEFAULT_CONTACT_EMAIL}</span>
            </p>
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Configurações atualizadas com sucesso!
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Restaurar padrões
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Salvar Alterações
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
