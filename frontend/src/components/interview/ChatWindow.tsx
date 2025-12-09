'use client';

import { InterviewHeader } from './InterviewHeader';
import { MessageList } from './MessageList';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ChatInput } from './ChatInput';
import { useInterview } from '@/hooks/useInterview';
import { AlertCircle, Sparkles } from 'lucide-react';

interface ChatWindowProps {
  identity: {
    first_name: string;
    last_name?: string;
    tagline?: string;
    profile_image?: string | null;
  };
  apiEndpoint?: string;
  modeId?: string;
  onClearChat?: () => void;
}

export function ChatWindow({ identity, apiEndpoint = '/api/interview/chat', modeId, onClearChat }: ChatWindowProps) {
  // Use modeId for localStorage persistence key so each mode has its own history
  const persistKey = modeId ? `interview-chat-${modeId}` : undefined;
  const { messages, isLoading, error, sendMessage, clearChat } = useInterview({ apiEndpoint, persistKey });

  const handleClear = () => {
    clearChat();
    onClearChat?.();
  };

  const handleSend = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div
      className="h-full w-full flex flex-col bg-white overflow-hidden p-2 sm:p-6"
    >
      {/* Header */}
      <InterviewHeader
        firstName={identity.first_name}
        lastName={identity.last_name}
        tagline={identity.tagline}
        profileImage={identity.profile_image}
        onClear={handleClear}
        hasMessages={messages.length > 0}
      />

      {/* Chat Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col">
              {/* Welcome Section */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-12">
                <div className="text-center max-w-md">
                  {/* Animated avatar */}
                  <div className="relative inline-block mb-4 sm:mb-8">
                    {/* Rotating gradient ring */}
                    <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-75 blur-sm animate-spin-slow" style={{ animationDuration: '8s' }} />
                    <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-40" />

                    {/* Avatar */}
                    <div className="relative">
                      {identity.profile_image ? (
                        <img
                          src={identity.profile_image}
                          alt={identity.first_name}
                          className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-3 sm:border-4 border-white dark:border-slate-800 shadow-2xl"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-3 sm:border-4 border-white dark:border-slate-800 shadow-2xl">
                          <span className="text-2xl sm:text-4xl text-white font-bold">
                            {identity.first_name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Online indicator */}
                      <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 sm:border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Welcome Text */}
                  <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-2 sm:mb-4">
                    Chat with {identity.first_name}
                  </h2>
                  <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-1 sm:mb-2">
                    I&apos;m an AI trained on {identity.first_name}&apos;s experience.
                  </p>
                  <p className="text-xs sm:text-base text-slate-500 dark:text-slate-500">
                    Ask me anything about skills, projects, or career journey.
                  </p>
                </div>
              </div>

              {/* Suggested Questions */}
              <SuggestedQuestions onSelect={handleSend} disabled={isLoading} />
            </div>
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              profileImage={identity.profile_image}
              firstName={identity.first_name}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="mx-6 mb-4 px-5 py-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-2xl">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder={`Ask ${identity.first_name} anything...`}
      />
    </div>
  );
}
