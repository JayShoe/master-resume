'use client';

import { InterviewFeedback } from '@/lib/interview/types';
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp, Star, Target, MessageSquare } from 'lucide-react';

interface FeedbackArtifactProps {
  feedback: InterviewFeedback | null;
  isAnalyzing?: boolean;
}

function ScoreBar({ score, label, color }: { score: number; label: string; color: string }) {
  const percentage = (score / 10) * 100;

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color }}>{score}/10</span>
      </div>
      <div
        style={{
          height: '8px',
          backgroundColor: '#e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: color,
            borderRadius: '4px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#f59e0b';
  return '#ef4444';
}

function getOverallGrade(score: number): { grade: string; color: string; message: string } {
  if (score >= 9) return { grade: 'A+', color: '#22c55e', message: 'Excellent! Interview-ready response.' };
  if (score >= 8) return { grade: 'A', color: '#22c55e', message: 'Great answer with strong structure.' };
  if (score >= 7) return { grade: 'B+', color: '#84cc16', message: 'Good response with room for polish.' };
  if (score >= 6) return { grade: 'B', color: '#f59e0b', message: 'Solid foundation, needs more specifics.' };
  if (score >= 5) return { grade: 'C', color: '#f97316', message: 'Adequate but missing key elements.' };
  return { grade: 'D', color: '#ef4444', message: 'Needs significant improvement.' };
}

export function FeedbackArtifact({ feedback, isAnalyzing }: FeedbackArtifactProps) {
  if (isAnalyzing) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite',
            }}
          >
            <Target size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Analyzing Your Answer
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Evaluating structure, relevance, and impact...
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '40px',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes shimmer {
            0% { opacity: 0.5; }
            50% { opacity: 0.8; }
            100% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <MessageSquare size={28} style={{ color: '#6366f1' }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
          No Feedback Yet
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
          Select a question and provide your answer to receive detailed feedback on your interview response.
        </p>
      </div>
    );
  }

  const overallGrade = getOverallGrade(feedback.overallScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Overall Score Card */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              backgroundColor: `${overallGrade.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '28px', fontWeight: 700, color: overallGrade.color }}>
              {overallGrade.grade}
            </span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Star size={16} style={{ color: overallGrade.color, fill: overallGrade.color }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                Overall Score: {feedback.overallScore}/10
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              {overallGrade.message}
            </p>
            {feedback.starMethodUsed && (
              <div
                style={{
                  marginTop: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#166534',
                }}
              >
                <CheckCircle2 size={12} />
                STAR Method Used
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '16px', margin: '0 0 16px 0' }}>
          Score Breakdown
        </h4>
        <ScoreBar score={feedback.structureScore} label="Structure & Organization" color={getScoreColor(feedback.structureScore)} />
        <ScoreBar score={feedback.relevanceScore} label="Relevance to Question" color={getScoreColor(feedback.relevanceScore)} />
        <ScoreBar score={feedback.clarityScore} label="Clarity & Conciseness" color={getScoreColor(feedback.clarityScore)} />
      </div>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              What You Did Well
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {feedback.strengths.map((strength, index) => (
              <li key={index} style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {feedback.improvements.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertCircle size={18} style={{ color: '#f59e0b' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Areas to Improve
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {feedback.improvements.map((improvement, index) => (
              <li key={index} style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={18} style={{ color: '#6366f1' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Actionable Tips
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Revised Answer */}
      {feedback.revisedAnswer && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <TrendingUp size={18} style={{ color: '#8b5cf6' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Improved Version
            </h4>
          </div>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
              {feedback.revisedAnswer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
