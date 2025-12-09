'use client';

import { RotateCcw, Bot, Zap } from 'lucide-react';

interface InterviewHeaderProps {
  firstName: string;
  lastName?: string;
  tagline?: string;
  profileImage?: string | null;
  onClear?: () => void;
  hasMessages?: boolean;
}

export function InterviewHeader({
  firstName,
  lastName,
  tagline,
  profileImage,
  onClear,
  hasMessages = false,
}: InterviewHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        flexWrap: 'wrap',
        gap: '12px',
      }}
      className="px-4 py-3 sm:px-8 sm:py-5"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Avatar with status */}
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt={firstName}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover shadow-lg ring-2 ring-white/80 dark:ring-slate-700/80"
            />
          ) : (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-white/80 dark:ring-slate-700/80">
              <span className="text-base sm:text-xl text-white font-bold">
                {firstName.charAt(0)}
              </span>
            </div>
          )}
          {/* Pulse indicator */}
          <div className="absolute -bottom-1 -right-1">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
              <div className="relative w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-slate-800" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
              {firstName} {lastName}
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </div>
          </div>
          {tagline && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 line-clamp-1">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 flex-shrink-0" />
              <span className="truncate">{tagline}</span>
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {hasMessages && onClear && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100/80 rounded-lg sm:rounded-xl border border-slate-200/50 hover:bg-slate-200/80 transition-all"
          aria-label="Start new conversation"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">New Chat</span>
        </button>
      )}
    </div>
  );
}
