'use client';

import { useState, useCallback } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ArtifactDrawer } from './ArtifactDrawer';
import { ContentPreviewArtifact } from './ContentPreviewArtifact';
import { useContentBuilder } from '@/hooks/useContentBuilder';
import { AlertCircle, PlusCircle, Database, PanelRightOpen } from 'lucide-react';

interface ContentBuilderChatProps {
  identity: {
    first_name: string;
    last_name?: string;
    tagline?: string;
    profile_image?: string | null;
  };
  onClearChat?: () => void;
}

const SUGGESTED_PROMPTS = [
  {
    title: 'Add technologies',
    description: 'Languages, frameworks, tools',
    prompt: 'Add Python, React, and TypeScript',
  },
  {
    title: 'Add a skill',
    description: 'Leadership, communication, etc',
    prompt: 'Add project management as a core skill',
  },
  {
    title: 'Add an accomplishment',
    description: 'Achievement with impact',
    prompt: 'I led a team that increased revenue by 25%',
  },
  {
    title: 'Add a certification',
    description: 'Professional credential',
    prompt: 'Add AWS Solutions Architect certification',
  },
];

export function ContentBuilderChat({ identity, onClearChat }: ContentBuilderChatProps) {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const {
    messages,
    isLoading,
    error,
    pendingContent,
    savedContent,
    sendMessage,
    clearChat,
    saveContent,
    discardContent,
    clearAllPending,
  } = useContentBuilder({
    apiEndpoint: '/api/interview/content-builder',
    persistKey: 'content-builder',
  });

  const handleClear = useCallback(() => {
    clearChat();
    onClearChat?.();
  }, [clearChat, onClearChat]);

  const handleSend = useCallback(async (content: string) => {
    // Auto-open drawer when sending a message
    if (!drawerOpen) {
      setDrawerOpen(true);
    }
    await sendMessage(content);
  }, [sendMessage, drawerOpen]);

  const totalPending = pendingContent.length;
  const totalSaved = savedContent.length;

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          overflow: 'hidden',
          padding: '24px',
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusCircle size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                Add Content
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Add experience, projects, skills, and more through conversation
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Stats Badge */}
            {(totalPending > 0 || totalSaved > 0) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0',
                }}
              >
                {totalPending > 0 && (
                  <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 500 }}>
                    {totalPending} pending
                  </span>
                )}
                {totalSaved > 0 && (
                  <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 500 }}>
                    {totalSaved} saved
                  </span>
                )}
              </div>
            )}

            {/* Toggle Artifact Button */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: drawerOpen ? '#f1f5f9' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#475569',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = drawerOpen ? '#f1f5f9' : 'white')}
            >
              <PanelRightOpen size={18} />
              {drawerOpen ? 'Hide Preview' : 'Show Preview'}
            </button>

            {/* Clear Button */}
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#dc2626',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col">
              {/* Welcome Section */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-lg">
                  {/* Icon */}
                  <div className="relative inline-block mb-6">
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <Database size={36} style={{ color: 'white' }} />
                    </div>
                  </div>

                  {/* Welcome Text */}
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#1e293b',
                      marginBottom: '12px',
                    }}
                  >
                    Quick Add
                  </h2>
                  <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6, marginBottom: '8px' }}>
                    Just tell me what to add. Example: &quot;Add Python&quot; or &quot;I know React and TypeScript&quot;
                  </p>
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Content appears in the preview panel. Click Save when ready.
                  </p>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div style={{ padding: '0 20px 20px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Quick examples
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {SUGGESTED_PROMPTS.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(item.prompt)}
                      disabled={isLoading}
                      style={{
                        flex: '1 1 200px',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: 'white',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.borderColor = '#10b981';
                          e.currentTarget.style.backgroundColor = '#f0fdf4';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {item.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              profileImage={identity.profile_image}
              firstName={identity.first_name}
              wideMode={!drawerOpen}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="mx-6 mb-4 px-5 py-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2 bg-red-100 rounded-xl">
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
          placeholder="Describe what you want to add..."
        />
      </div>

      {/* Artifact Drawer */}
      <ArtifactDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onToggle={() => setDrawerOpen(!drawerOpen)}
        title="Content Preview"
      >
        <ContentPreviewArtifact
          pendingContent={pendingContent}
          savedContent={savedContent}
          onSave={saveContent}
          onDiscard={discardContent}
          onClearAll={clearAllPending}
        />
      </ArtifactDrawer>
    </div>
  );
}
