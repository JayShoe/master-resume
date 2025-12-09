'use client';

import { Lightbulb, ArrowRight } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const suggestedQuestions = [
  { text: 'Tell me about your most impactful project', icon: '🚀', color: 'from-orange-500 to-pink-500' },
  { text: 'What technologies are you experienced with?', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { text: 'Describe a challenging problem you solved', icon: '🧩', color: 'from-purple-500 to-indigo-500' },
  { text: 'Walk me through your career progression', icon: '📈', color: 'from-emerald-500 to-teal-500' },
];

export function SuggestedQuestions({ onSelect, disabled = false }: SuggestedQuestionsProps) {
  return (
    <div className="px-3 sm:px-8 py-4 sm:py-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3 sm:mb-5">
        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl shadow-lg shadow-orange-500/25">
          <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
          Try asking...
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question.text)}
            disabled={disabled}
            className="group relative flex items-center gap-3 sm:gap-4 text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl
                       bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm
                       border border-slate-200/50 dark:border-slate-700/50
                       hover:border-transparent
                       hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${question.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            {/* Icon */}
            <div className={`relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${question.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-xl sm:text-2xl">{question.icon}</span>
            </div>

            {/* Text */}
            <div className="relative flex-1 min-w-0">
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-2">
                {question.text}
              </span>
            </div>

            {/* Arrow */}
            <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
