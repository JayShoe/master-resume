'use client';

import { motion } from 'framer-motion';
import { Award, Trophy, Medal, Star, Calendar, ExternalLink, Target } from 'lucide-react';

interface AwardsSectionProps {
  experience: any[];
  skills: any[];
  certifications: any[];
  accomplishments?: any[];
}

interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  category: 'achievement' | 'recognition' | 'competition' | 'honor';
  level: 'international' | 'national' | 'regional' | 'organizational';
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AwardsSection({ experience, skills, certifications, accomplishments = [] }: AwardsSectionProps) {
  // Convert accomplishments data to awards format
  const realAwards: Award[] = accomplishments.map((acc, index) => {
    const getIconForType = (type: string) => {
      switch (type?.toLowerCase()) {
        case 'award':
        case 'recognition':
          return Award;
        case 'achievement':
        case 'milestone':
          return Trophy;
        case 'competition':
        case 'contest':
          return Medal;
        case 'performance':
        case 'excellence':
          return Star;
        default:
          return Target;
      }
    };

    const getCategoryFromType = (type: string): Award['category'] => {
      switch (type?.toLowerCase()) {
        case 'award':
        case 'recognition':
          return 'recognition';
        case 'achievement':
        case 'milestone':
          return 'achievement';
        case 'competition':
        case 'contest':
          return 'competition';
        default:
          return 'honor';
      }
    };

    return {
      id: acc.id?.toString() || index.toString(),
      title: acc.primary_title,
      organization: acc.position?.company?.name || 'Professional Achievement',
      date: acc.date_achieved || acc.date_created,
      description: acc.primary_description + (acc.impact_metrics ? ` Impact: ${acc.impact_metrics}` : ''),
      category: getCategoryFromType(acc.accomplishment_type || 'achievement'),
      level: acc.is_featured ? 'national' : 'organizational',
      url: acc.evidence_links?.[0]?.url,
      icon: getIconForType(acc.accomplishment_type || 'achievement'),
    };
  });

  // Fallback sample awards if no real data
  const sampleAwards: Award[] = accomplishments.length === 0 ? [
    {
      id: '1',
      title: 'Innovation Excellence Award',
      organization: 'Tech Leadership Council',
      date: '2023-11-15',
      description: 'Recognized for outstanding innovation in product development and technology implementation that resulted in 40% improvement in system performance.',
      category: 'achievement',
      level: 'organizational',
      icon: Trophy,
    },
    {
      id: '2',
      title: 'Top Performer - Q4 2023',
      organization: 'Current Company',
      date: '2023-12-31',
      description: 'Achieved top performance metrics in team for exceptional project delivery and client satisfaction scores.',
      category: 'recognition',
      level: 'organizational',
      icon: Star,
    },
    {
      id: '3',
      title: 'Hackathon Winner',
      organization: 'Regional Tech Summit',
      date: '2023-09-22',
      description: 'First place winner in regional hackathon for developing an AI-powered solution that addresses sustainability challenges.',
      category: 'competition',
      level: 'regional',
      url: 'https://example.com/hackathon',
      icon: Medal,
    },
  ] : [];

  const awards = realAwards.length > 0 ? realAwards : sampleAwards;

  const getCategoryColor = (category: Award['category']) => {
    const colors = {
      achievement: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      recognition: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      competition: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      honor: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    };
    return colors[category];
  };

  const getLevelBadge = (level: Award['level']) => {
    const badges = {
      international: { label: 'International', color: 'bg-red-500' },
      national: { label: 'National', color: 'bg-blue-500' },
      regional: { label: 'Regional', color: 'bg-green-500' },
      organizational: { label: 'Organizational', color: 'bg-purple-500' },
    };
    return badges[level];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sortedAwards = [...awards].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const categoryStats = awards.reduce((acc, award) => {
    acc[award.category] = (acc[award.category] || 0) + 1;
    return acc;
  }, {} as Record<Award['category'], number>);

  return (
    <div className="space-y-8">
      {/* Awards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {sortedAwards.map((award, index) => {
          const colors = getCategoryColor(award.category);
          const levelBadge = getLevelBadge(award.level);
          const IconComponent = award.icon;
          
          return (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg border-2 ${colors.border} shadow-sm hover:shadow-md transition-shadow p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${colors.bg} rounded-lg`}>
                    <IconComponent className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{award.title}</h3>
                    <p className="text-sm font-medium text-primary">{award.organization}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${levelBadge.color}`}>
                    {levelBadge.label}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {award.category}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {award.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(award.date)}
                </div>
                
                {award.url && (
                  <a
                    href={award.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Details
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recognition Timeline */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Recognition Timeline
        </h3>
        
        <div className="space-y-4">
          {sortedAwards.slice(0, 5).map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{award.title}</h4>
                <p className="text-sm text-gray-600">{award.organization}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(award.date).getFullYear()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Awards & Recognition Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
          <div>
            <p className="text-2xl font-bold text-primary">{awards.length}</p>
            <p className="text-xs text-muted-foreground">Total Awards</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {new Date().getFullYear() - Math.min(...awards.map(a => new Date(a.date).getFullYear()))}+
            </p>
            <p className="text-xs text-muted-foreground">Years of Recognition</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {awards.filter(a => a.level === 'national' || a.level === 'international').length}
            </p>
            <p className="text-xs text-muted-foreground">National+ Level</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {awards.filter(a => new Date(a.date).getFullYear() === new Date().getFullYear()).length}
            </p>
            <p className="text-xs text-muted-foreground">This Year</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <h4 className="font-medium mb-3">Recognition Categories</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(categoryStats).map(([category, count]) => {
              const colors = getCategoryColor(category as Award['category']);
              return (
                <div
                  key={category}
                  className={`text-center p-3 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  <p className={`text-lg font-bold ${colors.text}`}>{count}</p>
                  <p className={`text-xs capitalize ${colors.text}`}>{category}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}