'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import type { Skills } from '@/lib/directus';

interface SkillsTimelineProps {
  skills: Skills[];
  projects: any[];
  experience: any[];
}

interface TimelineDataPoint {
  year: number;
  skillsLearned: number;
  totalSkills: number;
  averageProficiency: number;
  projects: number;
  positions: number;
}

export default function SkillsTimeline({ skills, projects, experience }: SkillsTimelineProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('area');
  const [metric, setMetric] = useState<'skills' | 'proficiency' | 'activity'>('skills');

  const timelineData = useMemo(() => {
    // Create timeline based on project and experience dates
    const yearMap = new Map<number, TimelineDataPoint>();
    const currentYear = new Date().getFullYear();
    const startYear = 2010; // Adjust based on your career start

    // Initialize years
    for (let year = startYear; year <= currentYear; year++) {
      yearMap.set(year, {
        year,
        skillsLearned: 0,
        totalSkills: 0,
        averageProficiency: 0,
        projects: 0,
        positions: 0,
      });
    }

    // Add project data
    projects.forEach(project => {
      if (project.start_date) {
        const year = new Date(project.start_date).getFullYear();
        const data = yearMap.get(year);
        if (data) {
          data.projects += 1;
          // Estimate skills learned per project (simplified)
          data.skillsLearned += Math.floor(Math.random() * 3) + 1;
        }
      }
    });

    // Add experience data
    experience.forEach(position => {
      if (position.start_date) {
        const startYear = new Date(position.start_date).getFullYear();
        const endYear = position.end_date 
          ? new Date(position.end_date).getFullYear()
          : currentYear;
        
        for (let year = startYear; year <= endYear; year++) {
          const data = yearMap.get(year);
          if (data) {
            data.positions = Math.max(data.positions, 1);
          }
        }
      }
    });

    // Calculate cumulative skills and average proficiency
    let cumulativeSkills = 0;
    const sortedData = Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
    
    sortedData.forEach(data => {
      cumulativeSkills += data.skillsLearned;
      data.totalSkills = cumulativeSkills;
      
      // Calculate average proficiency (simplified - in reality would be more complex)
      const yearsExperience = data.year - startYear + 1;
      data.averageProficiency = Math.min(10, Math.max(1, 
        (cumulativeSkills / 10) + (yearsExperience * 0.2)
      ));
    });

    return sortedData.filter(data => data.year >= startYear && data.year <= currentYear);
  }, [skills, projects, experience]);

  const getChartData = () => {
    switch (metric) {
      case 'proficiency':
        return timelineData.map(d => ({
          year: d.year,
          value: Math.round(d.averageProficiency * 10) / 10,
          label: 'Avg Proficiency'
        }));
      case 'activity':
        return timelineData.map(d => ({
          year: d.year,
          value: d.projects + d.positions,
          label: 'Projects + Positions'
        }));
      default:
        return timelineData.map(d => ({
          year: d.year,
          value: d.totalSkills,
          label: 'Cumulative Skills'
        }));
    }
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = timelineData.find(d => d.year === label);
      if (data) {
        return (
          <div className="bg-white p-3 rounded-lg border shadow-lg">
            <p className="font-semibold">Year {label}</p>
            <p className="text-sm text-blue-600">
              Skills Learned: {data.skillsLearned}
            </p>
            <p className="text-sm text-green-600">
              Total Skills: {data.totalSkills}
            </p>
            <p className="text-sm text-purple-600">
              Avg Proficiency: {Math.round(data.averageProficiency * 10) / 10}/10
            </p>
            <p className="text-sm text-orange-600">
              Projects: {data.projects}
            </p>
            <p className="text-sm text-gray-600">
              Active Positions: {data.positions}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      case 'area':
      default:
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
            />
          </AreaChart>
        );
    }
  };

  const getMetricDescription = () => {
    switch (metric) {
      case 'proficiency':
        return 'Average skill proficiency level over time';
      case 'activity':
        return 'Combined count of projects and positions per year';
      default:
        return 'Cumulative number of skills acquired over career';
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Controls */}
      <div className="p-6 border-b space-y-4">
        {/* Chart Type */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Chart Type</h4>
          <div className="flex gap-2">
            {[
              { key: 'area', label: 'Area' },
              { key: 'line', label: 'Line' },
              { key: 'bar', label: 'Bar' },
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

        {/* Metric Selection */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Metric</h4>
          <div className="flex gap-2">
            {[
              { key: 'skills', label: 'Cumulative Skills' },
              { key: 'proficiency', label: 'Avg Proficiency' },
              { key: 'activity', label: 'Career Activity' },
            ].map(metricOption => (
              <button
                key={metricOption.key}
                onClick={() => setMetric(metricOption.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  metric === metricOption.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {metricOption.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {getMetricDescription()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Career Milestones */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <h4 className="text-sm font-semibold mb-3">Career Milestones</h4>
        <div className="space-y-2">
          {timelineData
            .filter(data => data.projects > 0 || data.positions > 0)
            .slice(-5)
            .reverse()
            .map(data => (
              <motion.div
                key={data.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="font-medium">{data.year}</span>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {data.skillsLearned > 0 && (
                    <span>+{data.skillsLearned} skills</span>
                  )}
                  {data.projects > 0 && (
                    <span>{data.projects} projects</span>
                  )}
                  {data.positions > 0 && (
                    <span>Active role</span>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {timelineData[timelineData.length - 1]?.totalSkills || 0}
            </p>
            <p className="text-xs text-muted-foreground">Total Skills</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round((timelineData[timelineData.length - 1]?.averageProficiency || 0) * 10) / 10}
            </p>
            <p className="text-xs text-muted-foreground">Current Avg Proficiency</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {timelineData.length}
            </p>
            <p className="text-xs text-muted-foreground">Years Tracked</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {timelineData.reduce((sum, data) => sum + data.skillsLearned, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Skills Learned</p>
          </div>
        </div>
      </div>
    </div>
  );
}