'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { groupSkillsByCategory } from '@/lib/api';
import type { Skills } from '@/lib/directus';
import AccomplishmentModal from '@/components/shared/AccomplishmentModal';

interface SkillsMatrixProps {
  skills: Skills[];
}

const proficiencyColors = {
  1: 'bg-red-100 text-red-800 border-red-200',
  2: 'bg-red-200 text-red-900 border-red-300',
  3: 'bg-orange-100 text-orange-800 border-orange-200',
  4: 'bg-orange-200 text-orange-900 border-orange-300',
  5: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  6: 'bg-yellow-200 text-yellow-900 border-yellow-300',
  7: 'bg-lime-100 text-lime-800 border-lime-200',
  8: 'bg-green-100 text-green-800 border-green-200',
  9: 'bg-green-200 text-green-900 border-green-300',
  10: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const proficiencyLabels = {
  1: 'Beginner',
  2: 'Novice',
  3: 'Limited',
  4: 'Basic',
  5: 'Intermediate',
  6: 'Competent',
  7: 'Proficient',
  8: 'Advanced',
  9: 'Expert',
  10: 'Master',
};

export default function SkillsMatrix({ skills }: SkillsMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skills | null>(null);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState<any>(null);

  const skillsByCategory = groupSkillsByCategory(skills);
  const categories = Object.keys(skillsByCategory);

  const getProficiencyColor = (level: number): string => {
    return proficiencyColors[Math.min(10, Math.max(1, level)) as keyof typeof proficiencyColors] || proficiencyColors[5];
  };

  const getProficiencyLabel = (level: number): string => {
    return proficiencyLabels[Math.min(10, Math.max(1, level)) as keyof typeof proficiencyLabels] || 'Intermediate';
  };

  const getProgressBarWidth = (level: number): string => {
    return `${Math.min(100, Math.max(0, level * 10))}%`;
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Category Filters */}
      <div className="p-6 border-b">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category} ({skillsByCategory[category]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="p-6">
        {categories
          .filter(category => !selectedCategory || category === selectedCategory)
          .map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-8 last:mb-0"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {category}
                <span className="text-sm text-muted-foreground ml-2">
                  ({skillsByCategory[category]?.length || 0} skills)
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsByCategory[category]?.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getProficiencyColor(skill.proficiency_level)}`}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-sm leading-tight">{skill.name}</h4>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/50">
                        {skill.proficiency_level}/10
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{getProficiencyLabel(skill.proficiency_level)}</span>
                        <span>{skill.proficiency_level * 10}%</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: getProgressBarWidth(skill.proficiency_level) }}
                          transition={{ delay: (categoryIndex * 0.1) + (skillIndex * 0.05) + 0.3, duration: 0.8 }}
                          className="h-2 rounded-full bg-current opacity-60"
                        />
                      </div>
                    </div>

                    {skill.description && (
                      <p className="text-xs opacity-75 line-clamp-2">
                        {skill.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
      </div>

      {/* Professional Skill Detail Modal */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSkill(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '600px',
              maxHeight: '80vh',
              width: '100%',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedSkill(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#64748b',
                zIndex: 10,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '32px 40px 24px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              {/* Category */}
              {selectedSkill.category && (
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '8px',
                  letterSpacing: '0.025em'
                }}>
                  {selectedSkill.category}
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: '1.25',
                  letterSpacing: '-0.025em'
                }}>
                  {selectedSkill.name}
                </h2>
                
                {/* Optional Proficiency Badge */}
                {selectedSkill.proficiency_level && (
                  <div style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #dbeafe',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#1d4ed8'
                  }}>
                    Level {Math.ceil((selectedSkill.proficiency_level || 5) / 2)}
                  </div>
                )}
              </div>
              
              {/* Proficiency Level - Visual Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#64748b'
                    }}>
                      Proficiency Level
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1e40af'
                    }}>
                      {Math.ceil((selectedSkill.proficiency_level || 5) / 2)}/5
                    </span>
                  </div>
                  
                  {/* Simple 5-dot indicator */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div
                        key={dot}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: dot <= Math.ceil((selectedSkill.proficiency_level || 5) / 2)
                            ? '#3b82f6' 
                            : '#e2e8f0',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                    <span style={{
                      fontSize: '14px',
                      color: '#64748b',
                      marginLeft: '8px'
                    }}>
                      {getProficiencyLabel(selectedSkill.proficiency_level || 5)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ 
              padding: '0 40px 40px',
              maxHeight: 'calc(80vh - 200px)',
              overflowY: 'auto'
            }}>
              {selectedSkill.accomplishments && (selectedSkill.accomplishments as any[]).length > 0 ? (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 16px 0',
                    letterSpacing: '-0.025em'
                  }}>
                    Related Accomplishments
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {(selectedSkill.accomplishments as any[]).map((junction: any, idx: number) => {
                      const accomplishment = junction.accomplishments_id || junction;
                      const position = accomplishment?.position;
                      const company = position?.company;
                      const isFeatured = accomplishment?.is_featured;
                      
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: '16px',
                            backgroundColor: isFeatured ? '#fefce8' : '#f8fafc',
                            border: isFeatured ? '1px solid #fde047' : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            position: 'relative'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isFeatured ? '#fef3c7' : '#f1f5f9';
                            e.currentTarget.style.borderColor = isFeatured ? '#f59e0b' : '#cbd5e1';
                            e.currentTarget.style.transform = 'translateX(2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isFeatured ? '#fefce8' : '#f8fafc';
                            e.currentTarget.style.borderColor = isFeatured ? '#fde047' : '#e2e8f0';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAccomplishment(accomplishment);
                          }}
                        >
                          {/* Featured Badge */}
                          {isFeatured && (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: '600',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Featured
                            </div>
                          )}
                          
                          {/* Primary Title */}
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#0f172a',
                            marginBottom: '8px',
                            lineHeight: '1.4',
                            paddingRight: isFeatured ? '70px' : '0'
                          }}>
                            {accomplishment?.primary_title || accomplishment?.title || 'Accomplishment'}
                          </div>
                          
                          {/* Summary if available */}
                          {accomplishment?.summary && (
                            <div style={{
                              fontSize: '14px',
                              color: '#475569',
                              marginBottom: '8px',
                              lineHeight: '1.5'
                            }}>
                              {accomplishment.summary}
                            </div>
                          )}
                          
                          {/* Company and Position Info */}
                          {(company?.name || position?.primary_title) && (
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#1e40af',
                              marginBottom: '6px'
                            }}>
                              {company?.name && <span>{company.name}</span>}
                              {company?.name && position?.primary_title && <span> • </span>}
                              {position?.primary_title && <span>{position.primary_title}</span>}
                            </div>
                          )}
                          
                          {/* Meta Line */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            fontSize: '12px',
                            color: '#64748b'
                          }}>
                            {/* Position Date */}
                            {position?.start_date && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <div style={{
                                  width: '3px',
                                  height: '3px',
                                  borderRadius: '50%',
                                  backgroundColor: '#94a3b8'
                                }}></div>
                                {new Date(position.start_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short'
                                })}
                              </div>
                            )}
                            
                            {/* Achievement Date (if different from position) */}
                            {accomplishment?.date_achieved && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <div style={{
                                  width: '3px',
                                  height: '3px',
                                  borderRadius: '50%',
                                  backgroundColor: '#10b981'
                                }}></div>
                                Achieved: {new Date(accomplishment.date_achieved).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short'
                                })}
                              </div>
                            )}
                            
                            {/* Impact Metric */}
                            {accomplishment?.impact_metrics && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: '500',
                                color: '#059669'
                              }}>
                                📈 {accomplishment.impact_metrics}
                              </div>
                            )}
                            
                            {/* Evidence Link */}
                            {accomplishment?.evidence_links && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#3b82f6',
                                fontWeight: '500'
                              }}>
                                🔗 View proof
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Show message if no accomplishments */}
              {(!selectedSkill.accomplishments || (selectedSkill.accomplishments as any[]).length === 0) && (
                <div style={{
                  textAlign: 'center',
                  padding: '32px 20px',
                  color: '#64748b',
                  fontSize: '15px',
                  fontStyle: 'italic'
                }}>
                  No related accomplishments found for this skill.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <h4 className="text-sm font-semibold mb-2">Proficiency Scale</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(proficiencyLabels).map(([level, label]) => (
            <div
              key={level}
              className={`px-2 py-1 rounded-full border ${getProficiencyColor(Number(level))}`}
            >
              {level}: {label}
            </div>
          ))}
        </div>
      </div>

      {/* Accomplishment Modal */}
      <AccomplishmentModal
        accomplishment={selectedAccomplishment}
        isOpen={!!selectedAccomplishment}
        onClose={() => setSelectedAccomplishment(null)}
      />
    </div>
  );
}