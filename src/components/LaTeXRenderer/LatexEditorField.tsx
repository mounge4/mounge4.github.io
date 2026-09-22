import React, { useState } from 'react';
import { LaTeXContentRenderer } from './LaTeXContentRenderer';
import { Code, Eye, Edit3, HelpCircle, Sparkles } from 'lucide-react';

interface LatexEditorFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  contentType: 'plain' | 'latex';
  onContentTypeChange: (type: 'plain' | 'latex') => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export const LatexEditorField: React.FC<LatexEditorFieldProps> = ({
  label,
  value,
  onChange,
  contentType,
  onContentTypeChange,
  placeholder,
  rows = 6,
  required = false
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const insertSnippet = (snippet: string) => {
    const updated = value ? `${value}\n${snippet}` : snippet;
    onChange(updated);
  };

  return (
    <div className="space-y-2 font-serif-bn">
      {/* Header: Label & Mode Selector */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block font-bold text-slate-800 text-xs sm:text-sm">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Content Type Selector: Option A (Plain) vs Option B (LaTeX) */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => onContentTypeChange('plain')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              contentType === 'plain'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            সাধারণ লেখা
          </button>
          <button
            type="button"
            onClick={() => onContentTypeChange('latex')}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              contentType === 'latex'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>LaTeX সাপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Toolbar */}
      <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-t-xl px-3 py-1.5 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>এডিটর</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>লাইভ প্রিভিউ</span>
          </button>
        </div>

        {contentType === 'latex' && (
          <button
            type="button"
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>LaTeX নির্দেশিকা</span>
          </button>
        )}
      </div>

      {/* LaTeX CheatSheet / Quick Inserts Bar */}
      {contentType === 'latex' && activeTab === 'edit' && (
        <div className="p-2 bg-emerald-50/70 border-x border-b border-emerald-200/60 rounded-b-lg space-y-1.5 text-xs">
          <div className="flex items-center gap-1 text-emerald-900 font-bold text-[11px]">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>দ্রুত কোড যুক্ত করুন:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => insertSnippet('\\section{নতুন অনুচ্ছেদ শিরোনাম}')}
              className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono cursor-pointer"
            >
              \section&#123;...&#125;
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('\\textbf{বোল্ড লেখা}')}
              className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono cursor-pointer"
            >
              \textbf&#123;...&#125;
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('$E = mc^2$')}
              className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono cursor-pointer"
            >
              ইনলাইন সমীকরণ ($...$)
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('\\[\n\\int_{0}^{\\infty} e^{-x} dx = 1\n\\]')}
              className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono cursor-pointer"
            >
              ব্লক সমীকরণ (\[...\])
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('\\frac{লব}{হর}')}
              className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono cursor-pointer"
            >
              \frac&#123;a&#125;&#123;b&#125;
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('\\begin{itemize}\n  \\item প্রথম পয়েন্ট\n  \\item দ্বিতীয় পয়েন্ট\n\\end{itemize}')}
              className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono cursor-pointer"
            >
              বুলেট তালিকা (\begin&#123;itemize&#125;)
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('\\begin{enumerate}\n  \\item ১নং দফা\n  \\item ২নং দফা\n\\end{enumerate}')}
              className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono cursor-pointer"
            >
              ক্রমিক তালিকা (\begin&#123;enumerate&#125;)
            </button>
          </div>

          {showCheatSheet && (
            <div className="mt-2 p-2.5 bg-white border border-emerald-200 rounded-lg text-[11px] text-slate-700 leading-relaxed font-sans space-y-1">
              <p className="font-bold text-emerald-900">সহজ উদাহরণ:</p>
              <ul className="list-disc list-inside space-y-0.5 font-mono text-[10.5px]">
                <li>ইনলাইন সমীকরণ: <code className="bg-slate-100 px-1 py-0.5 rounded">$a^2 + b^2 = c^2$</code></li>
                <li>বড় সমীকরণ: <code className="bg-slate-100 px-1 py-0.5 rounded">{'\\['} \sum_&#123;i=1&#125;^&#123;n&#125; x_i {'\\]'}</code></li>
                <li>আরবি বা হাদিস টেক্সট সরাসরি পেস্ট করা যাবে।</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Editor Content vs Live Preview */}
      {activeTab === 'edit' ? (
        <textarea
          rows={rows}
          required={required}
          placeholder={
            placeholder ||
            (contentType === 'latex'
              ? 'এখানে LaTeX কোড অথবা মিশ্রিত টেক্সট ও সমীকরণ লিখুন...'
              : 'এখানে সাধারণ বিবরণ লিখুন...')
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-b-xl text-sm focus:ring-2 focus:ring-emerald-500 font-serif-bn ${
            contentType === 'latex' ? 'font-mono text-xs' : ''
          }`}
        />
      ) : (
        <div className="p-4 min-h-[160px] max-h-[360px] overflow-y-auto bg-slate-50 border border-slate-200 rounded-b-xl">
          {value.trim() ? (
            <LaTeXContentRenderer content={value} contentType={contentType} />
          ) : (
            <p className="text-xs text-slate-400 italic font-sans-bn">
              প্রিভিউ দেখার জন্য কিছু লিখুন...
            </p>
          )}
        </div>
      )}
    </div>
  );
};
