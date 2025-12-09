'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { groupSkillsByCategory } from '@/lib/api';
import type { Skills } from '@/lib/directus';

interface TechnologyRadarProps {
  skills: Skills[];
}

interface RadarDataPoint {
  category: string;
  proficiency: number;
  skillCount: number;
  averageScore: number;
  skills: Skills[];
}

const categoryColors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#8dd1e1',
  '#d084d0',
  '#ffb347',
  '#87ceeb',
  '#dda0dd',
  '#98fb98',
];

export default function TechnologyRadar({ skills }: TechnologyRadarProps) {
  const [viewMode, setViewMode] = useState<'average' | 'max' | 'total'>('average');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const radarData = useMemo(() => {
    const skillsByCategory = groupSkillsByCategory(skills);
    
    return Object.entries(skillsByCategory).map(([category, categorySkills], index): RadarDataPoint => {
      const avgProficiency = categorySkills.reduce((sum, skill) => sum + skill.proficiency_level, 0) / categorySkills.length;
      const maxProficiency = Math.max(...categorySkills.map(skill => skill.proficiency_level));
      const totalProficiency = categorySkills.reduce((sum, skill) => sum + skill.proficiency_level, 0);
      
      let proficiency: number;
      switch (viewMode) {
        case 'max':
          proficiency = maxProficiency;
          break;
        case 'total':
          proficiency = Math.min(10, totalProficiency / 10); // Normalize to 0-10 scale
          break;
        default:
          proficiency = avgProficiency;
      }
      
      return {
        category: category.length > 15 ? category.substring(0, 15) + '...' : category,
        proficiency: Math.round(proficiency * 10) / 10,
        skillCount: categorySkills.length,
        averageScore: Math.round(avgProficiency * 10) / 10,
        skills: categorySkills,
      };
    });
  }, [skills, viewMode]);

  const filteredData = useMemo(() => {
    if (selectedCategories.size === 0) {
      return radarData;
    }
    return radarData.filter(item => selectedCategories.has(item.category));
  }, [radarData, selectedCategories]);

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload as RadarDataPoint;
      return (
        <div className="bg-white p-3 rounded-lg border shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-600">
            {viewMode === 'average' && `Average Proficiency: ${data.averageScore}/10`}
            {viewMode === 'max' && `Max Proficiency: ${data.proficiency}/10`}
            {viewMode === 'total' && `Total Score (normalized): ${data.proficiency}/10`}
          </p>
          <p className="text-sm text-gray-600">Skills: {data.skillCount}</p>
          <div className="mt-2">
            <p className="text-xs font-medium mb-1">Top Skills:</p>
            {data.skills
              .sort((a, b) => (b.proficiency_level || 0) - (a.proficiency_level || 0))
              .slice(0, 3)
              .map(skill => (
                <p key={skill.id} className="text-xs text-gray-600">
                  • {skill.name} ({skill.proficiency_level || 0}/10)
                </p>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'max':
        return 'Highest proficiency skill in each category';
      case 'total':
        return 'Total cumulative proficiency (normalized)';
      default:
        return 'Average proficiency across all skills in category';
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Controls */}
      <div className="p-6 border-b space-y-4">
        {/* View Mode Toggle */}
        <div>
          <h4 className="text-sm font-semibold mb-2">View Mode</h4>
          <div className="flex gap-2">
            {[
              { key: 'average', label: 'Average' },
              { key: 'max', label: 'Maximum' },
              { key: 'total', label: 'Total' },
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === mode.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {getViewModeLabel()}
          </p>
        </div>

        {/* Category Filters */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategories(new Set())}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategories.size === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {radarData.map((item, index) => (
              <button
                key={item.category}
                onClick={() => toggleCategory(item.category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategories.has(item.category)
                    ? 'text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                style={{
                  backgroundColor: selectedCategories.has(item.category) 
                    ? categoryColors[index % categoryColors.length]
                    : undefined
                }}
              >
                {item.category} ({item.skillCount})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-6">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={filteredData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                className="text-xs"
              />
              <PolarRadiusAxis 
                angle={0} 
                domain={[0, 10]} 
                tick={{ fontSize: 10 }}
                tickCount={6}
              />
              <Radar
                name="Proficiency"
                dataKey="proficiency"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 1, r: 4 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {filteredData.length}
            </p>
            <p className="text-xs text-muted-foreground">Categories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {filteredData.reduce((sum, item) => sum + item.skillCount, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Skills</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {filteredData.length > 0 
                ? Math.round((filteredData.reduce((sum, item) => sum + item.averageScore, 0) / filteredData.length) * 10) / 10
                : 0}
            </p>
            <p className="text-xs text-muted-foreground">Avg Proficiency</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {filteredData.length > 0 
                ? Math.max(...filteredData.map(item => Math.round(item.averageScore)))
                : 0}/10
            </p>
            <p className="text-xs text-muted-foreground">Highest Avg</p>
          </div>
        </div>
      </div>
    </div>
  );
}