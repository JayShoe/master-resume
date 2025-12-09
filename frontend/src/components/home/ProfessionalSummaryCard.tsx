'use client';

interface ProfessionalSummaryCardProps {
  summary: any;
  icon: string;
}

export default function ProfessionalSummaryCard({ summary, icon }: ProfessionalSummaryCardProps) {
  return (
    <div 
      style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #e5e7eb',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      <div style={{
        fontSize: '32px',
        marginBottom: '16px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: '#111827',
        margin: '0 0 4px 0'
      }}>
        {summary.title || 'Professional Summary'}
      </h3>
      {summary.target_industry && (
        <p style={{
          fontSize: '12px',
          color: '#3b82f6',
          fontWeight: '500',
          margin: '0 0 12px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {summary.target_industry}
        </p>
      )}
      <div 
        style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          margin: 0,
          lineHeight: '1.5'
        }}
        dangerouslySetInnerHTML={{ __html: summary.content?.substring(0, 150) + '...' || 'Summary content not available.' }}
      />
    </div>
  );
}