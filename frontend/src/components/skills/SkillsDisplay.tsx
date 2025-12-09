'use client';

import { Code, Monitor, Database, Globe, Wrench, Cpu, Cloud, Server, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function getCategoryIcon(category: string) {
  switch (category) {
    case 'technical':
      return { icon: Code, color: '#2563eb', flagColor: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', text: 'Technical' };
    case 'leadership':
      return { icon: Wrench, color: '#7c3aed', flagColor: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', text: 'Leadership' };
    case 'communication':
      return { icon: Globe, color: '#059669', flagColor: 'linear-gradient(135deg, #10b981, #047857)', text: 'Communication' };
    case 'design':
      return { icon: Monitor, color: '#dc2626', flagColor: 'linear-gradient(135deg, #ef4444, #b91c1c)', text: 'Design' };
    case 'business':
      return { icon: Database, color: '#ea580c', flagColor: 'linear-gradient(135deg, #f97316, #c2410c)', text: 'Business' };
    case 'project_management':
      return { icon: Server, color: '#0891b2', flagColor: 'linear-gradient(135deg, #06b6d4, #0e7490)', text: 'Project Management' };
    case 'analytics':
      return { icon: Cloud, color: '#7c2d12', flagColor: 'linear-gradient(135deg, #a3a3a3, #525252)', text: 'Analytics' };
    default:
      return { icon: Cpu, color: '#6b7280', flagColor: 'linear-gradient(135deg, #f59e0b, #d97706)', text: 'Other' };
  }
}

function calculateSkillYearsFromAccomplishments(skill: any): number | null {
  if (!skill.accomplishments || !Array.isArray(skill.accomplishments) || skill.accomplishments.length === 0) {
    return null;
  }

  const positionDates = skill.accomplishments
    .map((accomplishmentJunction: any) => accomplishmentJunction.accomplishments_id?.position?.start_date)
    .filter((date: string) => date)
    .map((date: string) => new Date(date));

  if (positionDates.length === 0) {
    return null;
  }

  const earliestDate = positionDates.reduce((earliest: Date, current: Date) =>
    current < earliest ? current : earliest
  );

  const now = new Date();
  const yearsDiff = now.getFullYear() - earliestDate.getFullYear();
  const monthsDiff = now.getMonth() - earliestDate.getMonth();

  return monthsDiff < 0 ? yearsDiff - 1 : yearsDiff;
}

function getTechnologyIcon(category: string) {
  switch (category.toLowerCase()) {
    case 'language':
      return { icon: Monitor, color: '#2563eb', text: 'Programming Language' };
    case 'framework':
      return { icon: Server, color: '#dc2626', text: 'Framework' };
    case 'database':
      return { icon: Database, color: '#059669', text: 'Database' };
    case 'cloud':
      return { icon: Cloud, color: '#7c3aed', text: 'Cloud Service' };
    case 'tool':
      return { icon: Wrench, color: '#ea580c', text: 'Tool' };
    case 'platform':
      return { icon: Cpu, color: '#0891b2', text: 'Platform' };
    case 'library':
      return { icon: Monitor, color: '#8b5cf6', text: 'Library' };
    default:
      return { icon: Cpu, color: '#6b7280', text: 'Technology' };
  }
}

function getTechnologyIconUrl(technology: any, directusUrl: string | undefined): string | null {
  if (!technology || !technology.icon || !directusUrl) return null;
  const baseUrl = directusUrl.endsWith('/') ? directusUrl.slice(0, -1) : directusUrl;
  return `${baseUrl}/assets/${technology.icon}`;
}

function getSVGColorFilter(color: string): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `sepia(100%) saturate(1000%) hue-rotate(${Math.round(Math.atan2(g - 128, r - 128) * 180 / Math.PI)}deg) brightness(${Math.max(r, g, b) / 255})`;
}

interface SkillsDisplayProps {
  skills: any[];
  technologies: any[];
  directusUrl?: string;
}

export default function SkillsDisplay({ skills, technologies, directusUrl }: SkillsDisplayProps) {
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<any | null>(null);

  // Handle modal behavior
  useEffect(() => {
    if (selectedSkill || selectedTechnology) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedSkill, selectedTechnology]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSkill(null);
        setSelectedTechnology(null);
      }
    };

    if (selectedSkill || selectedTechnology) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedSkill, selectedTechnology]);

  return (
    <>
      {/* Skills Cloud */}
      {skills.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '20px',
            justifyContent: 'center',
            padding: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {skills
              .sort((a, b) => {
                const yearsA = calculateSkillYearsFromAccomplishments(a) || 0;
                const yearsB = calculateSkillYearsFromAccomplishments(b) || 0;
                return yearsB - yearsA;
              })
              .map((skill, index) => {
                const categoryInfo = getCategoryIcon(skill.category || '');
                const IconComponent = categoryInfo.icon;
                const yearsExp = calculateSkillYearsFromAccomplishments(skill);
                const fontSize = 16;

                return (
                  <div key={skill.id || index} style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '20px 24px',
                    background: 'white',
                    border: `2px solid ${categoryInfo.color}20`,
                    borderRadius: '12px',
                    fontSize: `${fontSize}px`,
                    fontWeight: '600',
                    color: '#374151',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    width: '140px',
                    height: '120px',
                    justifyContent: 'center',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.borderColor = categoryInfo.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = `${categoryInfo.color}20`;
                  }}
                  onClick={() => {
                    setSelectedSkill(selectedSkill?.id === skill.id ? null : skill);
                  }}>
                    {/* Category Flag */}
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '-8px',
                      background: categoryInfo.flagColor,
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      zIndex: 10
                    }}>
                      {categoryInfo.text}
                    </div>

                    <IconComponent
                      size={36}
                      style={{ color: categoryInfo.color }}
                    />
                    <div style={{
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        lineHeight: '1.2'
                      }}>{skill.name || skill.skill_name}</span>
                    </div>

                    {/* Years Experience Flag */}
                    {yearsExp !== null && yearsExp > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-8px',
                        right: '-6px',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                        zIndex: 5
                      }}>
                        {yearsExp} Year{yearsExp !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Technologies Section */}
      {technologies.length > 0 && (
        <div style={{ marginTop: '80px' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 36px)',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 16px 0'
            }}>
              Technical Skills
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              lineHeight: '1.6',
              margin: 0
            }}>
              The technology stack and tools that drive successful product delivery
            </p>
          </div>

          {/* Technologies as tiles like skills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '20px',
            justifyContent: 'center',
            padding: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {technologies
              .sort((a, b) => {
                const proficiencyA = a.proficiency_level || 0;
                const proficiencyB = b.proficiency_level || 0;
                if (proficiencyB !== proficiencyA) return proficiencyB - proficiencyA;
                return (a.name || '').localeCompare(b.name || '');
              })
              .map((tech, index) => {
                const categoryInfo = getTechnologyIcon(tech.category || 'other');
                const IconComponent = categoryInfo.icon;
                const fontSize = 16;
                const proficiencyLevel = tech.proficiency_level || 3;

                const getProficiencyTextColor = (level: number) => {
                  if (level >= 5) return '#10b981';
                  if (level >= 4) return '#3b82f6';
                  if (level >= 3) return '#f59e0b';
                  if (level >= 2) return '#f97316';
                  return '#6b7280';
                };

                const proficiencyColor = getProficiencyTextColor(proficiencyLevel);

                return (
                  <div key={tech.id || index} style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '20px 24px',
                    background: 'white',
                    border: `2px solid ${categoryInfo.color}20`,
                    borderRadius: '12px',
                    fontSize: `${fontSize}px`,
                    fontWeight: '600',
                    color: '#374151',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    width: '140px',
                    height: '120px',
                    justifyContent: 'center',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.borderColor = categoryInfo.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = `${categoryInfo.color}20`;
                  }}
                  onClick={() => {
                    setSelectedTechnology(selectedTechnology?.id === tech.id ? null : tech);
                  }}>
                    {/* Category Flag */}
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '-8px',
                      background: categoryInfo.color,
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      zIndex: 10
                    }}>
                      {categoryInfo.text}
                    </div>

                    {/* Technology Icon */}
                    {getTechnologyIconUrl(tech, directusUrl) ? (
                      <img
                        src={getTechnologyIconUrl(tech, directusUrl)!}
                        alt={`${tech.name} icon`}
                        style={{
                          width: '36px',
                          height: '36px',
                          objectFit: 'contain',
                          filter: `brightness(0) saturate(100%) ${getSVGColorFilter(categoryInfo.color)}`
                        }}
                      />
                    ) : (
                      <IconComponent
                        size={36}
                        style={{ color: categoryInfo.color }}
                      />
                    )}
                    <div style={{
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        lineHeight: '1.2'
                      }}>{tech.name}</span>
                    </div>

                    {/* Proficiency Level Flag */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-8px',
                      right: '-6px',
                      background: '#f3f4f6',
                      color: proficiencyColor,
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 8px',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      zIndex: 5
                    }}>
                      {proficiencyLevel >= 5 ? 'Expert' :
                       proficiencyLevel >= 4 ? 'Advanced' :
                       proficiencyLevel >= 3 ? 'Intermediate' :
                       proficiencyLevel >= 2 ? 'Beginner' : 'Novice'}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Skills Accomplishments Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                border: '1px solid rgba(229, 231, 235, 0.8)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderBottom: '1px solid #e2e8f0',
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {(() => {
                    const categoryInfo = getCategoryIcon(selectedSkill.category);
                    const IconComponent = categoryInfo.icon;
                    return (
                      <>
                        <div style={{
                          padding: '16px',
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${categoryInfo.color}15 0%, ${categoryInfo.color}25 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${categoryInfo.color}30`,
                          boxShadow: `0 4px 12px ${categoryInfo.color}20`
                        }}>
                          <IconComponent size={28} style={{ color: categoryInfo.color }} />
                        </div>
                        <div>
                          <h2 style={{
                            fontSize: '28px',
                            fontWeight: '800',
                            color: '#111827',
                            margin: '0 0 4px 0',
                            letterSpacing: '-0.025em'
                          }}>
                            {selectedSkill.name || selectedSkill.skill_name}
                          </h2>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontSize: '14px',
                              color: '#6b7280',
                              fontWeight: '500'
                            }}>
                              {categoryInfo.text}
                            </span>
                            <span style={{
                              fontSize: '12px',
                              color: categoryInfo.color,
                              backgroundColor: `${categoryInfo.color}15`,
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontWeight: '600'
                            }}>
                              SKILL
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    fontSize: '0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div style={{
                padding: '32px',
                overflowY: 'auto',
                maxHeight: 'calc(90vh - 140px)'
              }}>
                {selectedSkill.accomplishments && selectedSkill.accomplishments.length > 0 ? (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '24px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      <div style={{
                        width: '4px',
                        height: '24px',
                        background: `linear-gradient(135deg, ${getCategoryIcon(selectedSkill.category).color} 0%, ${getCategoryIcon(selectedSkill.category).color}80 100%)`,
                        borderRadius: '2px'
                      }} />
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0,
                        letterSpacing: '-0.025em'
                      }}>
                        Related Accomplishments
                      </h3>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        backgroundColor: '#f8fafc',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: '500'
                      }}>
                        {selectedSkill.accomplishments.length} item{selectedSkill.accomplishments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      {selectedSkill.accomplishments.map((accomplishmentJunction: any, index: number) => {
                        const accomplishment = accomplishmentJunction.accomplishments_id;
                        const positionStartDate = accomplishment?.position?.start_date;
                        const educationDate = accomplishment?.education?.graduation_date || accomplishment?.education?.start_date;
                        const dateToUse = positionStartDate || educationDate;
                        const displayDate = dateToUse
                          ? new Date(dateToUse).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            })
                          : '';
                        const companyName = accomplishment?.position?.company?.name;
                        const institutionName = accomplishment?.education?.institution;
                        const organizationName = companyName || institutionName;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            style={{
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '16px',
                              padding: '24px',
                              transition: 'all 0.3s ease',
                              cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = getCategoryIcon(selectedSkill.category).color + '40';
                              e.currentTarget.style.boxShadow = `0 8px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px ${getCategoryIcon(selectedSkill.category).color}20`;
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '16px'
                            }}>
                              <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${getCategoryIcon(selectedSkill.category).color} 0%, ${getCategoryIcon(selectedSkill.category).color}80 100%)`,
                                marginTop: '6px',
                                flexShrink: 0,
                                boxShadow: `0 2px 8px ${getCategoryIcon(selectedSkill.category).color}30`
                              }} />
                              <div style={{ flex: 1 }}>
                                <h4 style={{
                                  fontSize: '18px',
                                  fontWeight: '700',
                                  color: '#111827',
                                  marginBottom: '8px',
                                  lineHeight: '1.4',
                                  letterSpacing: '-0.025em'
                                }}>
                                  {accomplishment?.primary_title || 'Accomplishment'}
                                </h4>

                                {accomplishment?.summary && (
                                  <div style={{
                                    fontSize: '15px',
                                    color: '#4b5563',
                                    marginBottom: '16px',
                                    lineHeight: '1.6',
                                    fontWeight: '500'
                                  }}>
                                    {accomplishment.summary}
                                  </div>
                                )}

                                {accomplishment?.primary_description && (
                                  <div
                                    style={{
                                      fontSize: '15px',
                                      color: '#4b5563',
                                      marginBottom: '16px',
                                      lineHeight: '1.6',
                                      fontWeight: '400'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: accomplishment.primary_description }}
                                  />
                                )}

                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '16px',
                                  marginTop: '12px',
                                  paddingTop: '12px',
                                  borderTop: '1px solid #f1f5f9'
                                }}>
                                  {organizationName && (
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}>
                                      <div style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}>
                                        {companyName ? '\u{1F3E2}' : '\u{1F393}'}
                                      </div>
                                      <span style={{
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        fontWeight: '500'
                                      }}>
                                        {organizationName}
                                      </span>
                                    </div>
                                  )}
                                  {displayDate && (
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}>
                                      <div style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}>
                                        {'\u{1F4C5}'}
                                      </div>
                                      <span style={{
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        fontWeight: '500'
                                      }}>
                                        {displayDate}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 40px'
                  }}>
                    <div style={{
                      fontSize: '64px',
                      marginBottom: '20px',
                      opacity: 0.3
                    }}>
                      {'\u{1F4CB}'}
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '8px',
                      letterSpacing: '-0.025em'
                    }}>
                      No accomplishments recorded
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      No accomplishments have been recorded for this skill yet.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technology Modal */}
      <AnimatePresence>
        {selectedTechnology && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setSelectedTechnology(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                border: '1px solid rgba(229, 231, 235, 0.8)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderBottom: '1px solid #e2e8f0',
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {(() => {
                    const categoryInfo = getTechnologyIcon(selectedTechnology.category);
                    const IconComponent = categoryInfo.icon;
                    return (
                      <>
                        <div style={{
                          padding: '16px',
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${categoryInfo.color}15 0%, ${categoryInfo.color}25 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${categoryInfo.color}30`,
                          boxShadow: `0 4px 12px ${categoryInfo.color}20`
                        }}>
                          <IconComponent size={28} style={{ color: categoryInfo.color }} />
                        </div>
                        <div>
                          <h2 style={{
                            fontSize: '28px',
                            fontWeight: '800',
                            color: '#111827',
                            margin: '0 0 4px 0',
                            letterSpacing: '-0.025em'
                          }}>
                            {selectedTechnology.name}
                          </h2>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontSize: '14px',
                              color: '#6b7280',
                              fontWeight: '500'
                            }}>
                              {categoryInfo.text}
                            </span>
                            <span style={{
                              fontSize: '12px',
                              color: categoryInfo.color,
                              backgroundColor: `${categoryInfo.color}15`,
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontWeight: '600'
                            }}>
                              TECHNOLOGY
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setSelectedTechnology(null)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    fontSize: '0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div style={{
                padding: '32px',
                overflowY: 'auto',
                maxHeight: 'calc(90vh - 140px)'
              }}>
                {selectedTechnology.accomplishments && selectedTechnology.accomplishments.length > 0 ? (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '24px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      <div style={{
                        width: '4px',
                        height: '24px',
                        background: `linear-gradient(135deg, ${getTechnologyIcon(selectedTechnology.category).color} 0%, ${getTechnologyIcon(selectedTechnology.category).color}80 100%)`,
                        borderRadius: '2px'
                      }} />
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0,
                        letterSpacing: '-0.025em'
                      }}>
                        Related Accomplishments
                      </h3>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        backgroundColor: '#f8fafc',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: '500'
                      }}>
                        {selectedTechnology.accomplishments.length} item{selectedTechnology.accomplishments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      {selectedTechnology.accomplishments.map((accomplishmentJunction: any, index: number) => {
                        const accomplishment = accomplishmentJunction.accomplishments_id;
                        const positionStartDate = accomplishment?.position?.start_date;
                        const educationDate = accomplishment?.education?.graduation_date || accomplishment?.education?.start_date;
                        const dateToUse = positionStartDate || educationDate;
                        const displayDate = dateToUse
                          ? new Date(dateToUse).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            })
                          : '';
                        const companyName = accomplishment?.position?.company?.name;
                        const institutionName = accomplishment?.education?.institution;
                        const organizationName = companyName || institutionName;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            style={{
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '16px',
                              padding: '24px',
                              transition: 'all 0.3s ease',
                              cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = getTechnologyIcon(selectedTechnology.category).color + '40';
                              e.currentTarget.style.boxShadow = `0 8px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px ${getTechnologyIcon(selectedTechnology.category).color}20`;
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '16px'
                            }}>
                              <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${getTechnologyIcon(selectedTechnology.category).color} 0%, ${getTechnologyIcon(selectedTechnology.category).color}80 100%)`,
                                marginTop: '6px',
                                flexShrink: 0,
                                boxShadow: `0 2px 8px ${getTechnologyIcon(selectedTechnology.category).color}30`
                              }} />
                              <div style={{ flex: 1 }}>
                                <h4 style={{
                                  fontSize: '18px',
                                  fontWeight: '700',
                                  color: '#111827',
                                  marginBottom: '8px',
                                  lineHeight: '1.4',
                                  letterSpacing: '-0.025em'
                                }}>
                                  {accomplishment?.primary_title || 'Accomplishment'}
                                </h4>

                                {accomplishment?.summary && (
                                  <div style={{
                                    fontSize: '15px',
                                    color: '#4b5563',
                                    marginBottom: '16px',
                                    lineHeight: '1.6',
                                    fontWeight: '500'
                                  }}>
                                    {accomplishment.summary}
                                  </div>
                                )}

                                {accomplishment?.primary_description && (
                                  <div
                                    style={{
                                      fontSize: '15px',
                                      color: '#4b5563',
                                      marginBottom: '16px',
                                      lineHeight: '1.6',
                                      fontWeight: '400'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: accomplishment.primary_description }}
                                  />
                                )}

                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '16px',
                                  marginTop: '12px',
                                  paddingTop: '12px',
                                  borderTop: '1px solid #f1f5f9'
                                }}>
                                  {organizationName && (
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}>
                                      <div style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}>
                                        {companyName ? '\u{1F3E2}' : '\u{1F393}'}
                                      </div>
                                      <span style={{
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        fontWeight: '500'
                                      }}>
                                        {organizationName}
                                      </span>
                                    </div>
                                  )}
                                  {displayDate && (
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}>
                                      <div style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}>
                                        {'\u{1F4C5}'}
                                      </div>
                                      <span style={{
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        fontWeight: '500'
                                      }}>
                                        {displayDate}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 40px'
                  }}>
                    <div style={{
                      fontSize: '64px',
                      marginBottom: '20px',
                      opacity: 0.3
                    }}>
                      {'\u{1F4CB}'}
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '8px',
                      letterSpacing: '-0.025em'
                    }}>
                      No accomplishments recorded
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      No accomplishments have been recorded for this technology yet.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {skills.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          color: '#6b7280'
        }}>
          <Code size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            No Skills Found
          </h3>
          <p>Skills information will appear here once loaded.</p>
        </div>
      )}
    </>
  );
}
