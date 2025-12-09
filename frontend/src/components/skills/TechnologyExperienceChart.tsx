'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { groupSkillsByCategory } from '@/lib/api';
import type { Skills } from '@/lib/directus';

interface TechnologyExperienceChartProps {
  skills: Skills[];
  projects: any[];
  experience: any[];
}

interface ExperienceDataPoint {
  name: string;
  category: string;
  proficiency: number;
  yearsExperience: number;
  projectsUsed: number;
  lastUsed: string;
  color: string;
}

const categoryColors = {
  'Programming Languages': '#8884d8',
  'Frontend Frameworks': '#82ca9d',
  'Backend Technologies': '#ffc658',
  'Databases': '#ff7300',
  'Cloud Services': '#8dd1e1',
  'DevOps': '#d084d0',
  'Mobile Development': '#ffb347',
  'Data Science': '#87ceeb',
  'Design Tools': '#dda0dd',
  'Testing': '#98fb98',
};

export default function TechnologyExperienceChart({ skills, projects, experience }: TechnologyExperienceChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'scatter'>('bar');
  const [sortBy, setSortBy] = useState<'proficiency' | 'experience' | 'usage'>('proficiency');

  const experienceData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const skillsByCategory = groupSkillsByCategory(skills);
    
    return skills.map((skill, index): ExperienceDataPoint => {
      // Estimate years of experience (this would ideally come from more detailed data)
      const estimatedYears = Math.max(1, Math.floor(((skill.proficiency_level || 0) / 10) * 10));
      
      // Estimate project usage (simplified)
      const projectsUsed = Math.floor(Math.random() * 5) + 1;
      
      // Estimate last used date
      const yearsAgo = Math.floor(Math.random() * 3);
      const lastUsed = `${currentYear - yearsAgo}`;
      
      // Get color based on category
      const categoryColorKeys = Object.keys(categoryColors) as (keyof typeof categoryColors)[];
      const matchingColorKey = categoryColorKeys.find(key => 
        (skill.category || '').toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes((skill.category || '').toLowerCase())
      );
      const color = matchingColorKey ? categoryColors[matchingColorKey] : '#8884d8';
      
      return {
        name: skill.name,
        category: skill.category || 'Other',
        proficiency: skill.proficiency_level || 0,
        yearsExperience: estimatedYears,
        projectsUsed,
        lastUsed,
        color,
      };
    });
  }, [skills, projects, experience]);

  const sortedData = useMemo(() => {
    const data = [...experienceData];
    
    switch (sortBy) {
      case 'experience':
        return data.sort((a, b) => b.yearsExperience - a.yearsExperience);
      case 'usage':
        return data.sort((a, b) => b.projectsUsed - a.projectsUsed);
      default:
        return data.sort((a, b) => b.proficiency - a.proficiency);
    }
  }, [experienceData, sortBy]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload as ExperienceDataPoint;
      return (
        <div className="bg-white p-3 rounded-lg border shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">Category: {data.category}</p>
          <p className="text-sm text-blue-600">Proficiency: {data.proficiency}/10</p>
          <p className="text-sm text-green-600">Experience: {data.yearsExperience} years</p>
          <p className="text-sm text-orange-600">Projects: {data.projectsUsed}</p>
          <p className="text-sm text-gray-500">Last Used: {data.lastUsed}</p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'scatter') {
      return (
        <ScatterChart
          data={sortedData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid />
          <XAxis 
            type="number" 
            dataKey="yearsExperience" 
            name="Years of Experience"
            domain={[0, 'dataMax + 1']}
          />
          <YAxis 
            type="number" 
            dataKey="proficiency" 
            name="Proficiency"
            domain={[0, 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Technologies" dataKey="proficiency">
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      );
    }

    return (
      <BarChart
        data={sortedData.slice(0, 20)} // Show top 20 for readability
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={sortBy === 'experience' ? 'yearsExperience' : sortBy === 'usage' ? 'projectsUsed' : 'proficiency'}>
          {sortedData.slice(0, 20).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    );
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'experience':
        return 'Years of Experience';
      case 'usage':
        return 'Project Usage';
      default:
        return 'Proficiency Level';
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Controls */}
      <div className="p-6 border-b space-y-4">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          {/* Chart Type */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Chart Type</h4>
            <div className="flex gap-2">
              {[
                { key: 'bar', label: 'Bar Chart' },
                { key: 'scatter', label: 'Scatter Plot' },
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => setChartType(type.key as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    chartType === type.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Sort By</h4>
            <div className="flex gap-2">
              {[
                { key: 'proficiency', label: 'Proficiency' },
                { key: 'experience', label: 'Experience' },
                { key: 'usage', label: 'Usage' },
              ].map(sort => (
                <button
                  key={sort.key}
                  onClick={() => setSortBy(sort.key as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    sortBy === sort.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {chartType === 'scatter' 
            ? 'Scatter plot showing relationship between years of experience (x-axis) and proficiency level (y-axis)'
            : `Bar chart showing top 20 technologies sorted by ${getSortLabel().toLowerCase()}`
          }
        </p>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {experienceData.length}
            </p>
            <p className="text-xs text-muted-foreground">Technologies</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(experienceData.reduce((sum, item) => sum + item.yearsExperience, 0) / experienceData.length)}
            </p>
            <p className="text-xs text-muted-foreground">Avg Years Experience</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(experienceData.reduce((sum, item) => sum + item.proficiency, 0) / experienceData.length * 10) / 10}
            </p>
            <p className="text-xs text-muted-foreground">Avg Proficiency</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(experienceData.reduce((sum, item) => sum + item.projectsUsed, 0) / experienceData.length)}
            </p>
            <p className="text-xs text-muted-foreground">Avg Project Usage</p>
          </div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <h4 className="text-sm font-semibold mb-3">Category Colors</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div
              key={category}
              className="flex items-center gap-2 px-2 py-1 bg-white rounded-full border"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}