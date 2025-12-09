'use client';

import { CheckCircle, Calendar } from 'lucide-react';

interface AvailabilityStatusProps {
  identity: any;
  projects?: any[];
  experience?: any[];
  skills?: any[];
}

export default function AvailabilityStatus({ identity, projects = [], experience = [], skills = [] }: AvailabilityStatusProps) {
  // Calculate basic metrics
  const totalExperience = experience.length;
  const totalSkills = skills.length;
  const totalProjects = projects.length;
  
  const yearsExperience = totalExperience > 0 ? totalExperience * 2 : 15; // rough estimate
  
  return (
    <div style={{
      background: '#f0fdf4',
      border: '2px solid #bbf7d0',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center'
    }}>
      {/* Status Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '16px'
      }}>
        <div style={{ position: 'relative' }}>
          <CheckCircle size={28} style={{ color: '#10b981' }} />
          <div style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '12px',
            height: '12px',
            background: '#10b981',
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        </div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#10b981',
          margin: 0
        }}>
          Available for New Projects
        </h3>
      </div>

      <p style={{
        fontSize: '14px',
        color: '#166534',
        marginBottom: '20px',
        lineHeight: '1.5'
      }}>
        Ready to take on product leadership and consulting opportunities
      </p>

      {/* Quick Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '20px',
        gap: '10px'
      }}>
        <div>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#059669'
          }}>
            {yearsExperience}+
          </div>
          <div style={{
            fontSize: '11px',
            color: '#065f46'
          }}>
            Years Exp.
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#059669'
          }}>
            {totalSkills || '25'}+
          </div>
          <div style={{
            fontSize: '11px',
            color: '#065f46'
          }}>
            Tech Skills
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#059669'
          }}>
            {totalProjects || '30'}+
          </div>
          <div style={{
            fontSize: '11px',
            color: '#065f46'
          }}>
            Projects
          </div>
        </div>
      </div>

      {/* Work Types */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '6px',
        marginBottom: '20px'
      }}>
        {['Remote', 'Hybrid', 'Contract', 'Full-time'].map(type => (
          <span
            key={type}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              background: '#dcfce7',
              color: '#166534',
              borderRadius: '10px',
              fontWeight: '500'
            }}
          >
            {type}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <a
        href="#contact-form"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          background: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#059669';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#10b981';
        }}
      >
        <Calendar size={16} />
        Let's Connect
      </a>
    </div>
  );
}