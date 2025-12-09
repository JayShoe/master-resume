'use client';

import { useState } from 'react';
import AccomplishmentModal from '@/components/shared/AccomplishmentModal';

// Component for individual accomplishment with modal
function AccomplishmentItem({ accomplishment, position, index }: { accomplishment: any, position: any, index: number }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <li 
        style={{
          marginBottom: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid transparent',
          transition: 'all 0.15s ease',
          backgroundColor: 'rgba(248, 250, 252, 0.5)'
        }}
        onClick={() => setShowModal(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.transform = 'translateX(2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.5)';
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          marginTop: '8px',
          flexShrink: 0
        }}></div>
        {accomplishment.primary_title ? (
          <div
            style={{
              color: '#475569',
              fontSize: '15px',
              lineHeight: '1.5',
              fontWeight: '400'
            }}
            dangerouslySetInnerHTML={{ __html: accomplishment.primary_title }}
          />
        ) : (
          <div style={{
            color: '#64748b',
            fontSize: '15px',
            lineHeight: '1.5',
            fontStyle: 'italic'
          }}>
            Accomplishment details not available
          </div>
        )}
      </li>

      <AccomplishmentModal
        accomplishment={accomplishment}
        position={position}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

// Main component for accomplishments list
export default function AccomplishmentsList({ position }: { position: any }) {
  // Get accomplishments directly from the position
  const accomplishments = position.accomplishments || [];
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#0f172a',
        margin: '0 0 16px 0',
        letterSpacing: '-0.025em',
        textAlign: 'center'
      }}>
        {position.summary || 'Key Accomplishments'}
      </h4>
      
      {accomplishments && accomplishments.length > 0 ? (
        <ul style={{
          margin: 0,
          padding: '0 0 0 20px',
          listStyle: 'none'
        }}>
          {accomplishments.map((accomplishment: any, idx: number) => (
            <AccomplishmentItem key={idx} accomplishment={accomplishment} position={position} index={idx} />
          ))}
        </ul>
      ) : (
        <div style={{
          color: '#6b7280',
          fontSize: '14px',
          fontStyle: 'italic',
          padding: '12px',
          background: '#f9fafb',
          borderRadius: '6px',
          border: '1px dashed #e5e7eb'
        }}>
          No accomplishments recorded for this position
        </div>
      )}
    </div>
  );
}