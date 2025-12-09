'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'text' | 'profile' | 'chart' | 'table' | 'timeline';
  count?: number;
  className?: string;
}

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear" as any
    }
  }
};

const pulseVariants = {
  initial: { opacity: 1 },
  animate: {
    opacity: 0.4,
    transition: {
      repeat: Infinity,
      duration: 1.2,
      repeatType: "reverse" as any,
      ease: "easeInOut" as any
    }
  }
};

const SkeletonBox = ({ className = '', ...props }) => (
  <motion.div
    className={`relative overflow-hidden bg-gray-200 rounded ${className}`}
    variants={pulseVariants}
    initial="initial"
    animate="animate"
    {...props}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
    />
  </motion.div>
);

export default function LoadingSkeleton({ variant = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'profile':
        return (
          <div className={`space-y-6 ${className}`}>
            {/* Profile header */}
            <div className="flex items-center space-x-4">
              <SkeletonBox className="w-20 h-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <SkeletonBox className="h-6 w-3/4" />
                <SkeletonBox className="h-4 w-1/2" />
                <SkeletonBox className="h-4 w-2/3" />
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <SkeletonBox className="h-8 w-16 mx-auto mb-2" />
                  <SkeletonBox className="h-3 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'card':
        return (
          <div className={`space-y-4 ${className}`}>
            {[...Array(count)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-lg border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <SkeletonBox className="w-12 h-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <SkeletonBox className="h-5 w-3/4" />
                      <SkeletonBox className="h-4 w-1/2" />
                    </div>
                  </div>
                  <SkeletonBox className="w-20 h-6 rounded-full" />
                </div>
                <div className="space-y-2">
                  <SkeletonBox className="h-4 w-full" />
                  <SkeletonBox className="h-4 w-5/6" />
                  <SkeletonBox className="h-4 w-4/6" />
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    {[...Array(3)].map((_, j) => (
                      <SkeletonBox key={j} className="w-16 h-6 rounded-full" />
                    ))}
                  </div>
                  <SkeletonBox className="w-8 h-8 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {[...Array(count)].map((_, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-3 p-3 bg-white rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <SkeletonBox className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-4 w-2/3" />
                  <SkeletonBox className="h-3 w-1/2" />
                </div>
                <SkeletonBox className="w-16 h-4" />
              </motion.div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {[...Array(count)].map((_, i) => (
              <SkeletonBox
                key={i}
                className={`h-4 ${
                  i === count - 1 ? 'w-3/4' : 'w-full'
                }`}
              />
            ))}
          </div>
        );

      case 'chart':
        return (
          <div className={`bg-white p-6 rounded-lg border shadow-sm ${className}`}>
            {/* Chart header */}
            <div className="mb-6">
              <SkeletonBox className="h-6 w-1/3 mb-2" />
              <SkeletonBox className="h-4 w-2/3" />
            </div>
            
            {/* Chart area */}
            <div className="h-64 flex items-end justify-between space-x-2">
              {[...Array(8)].map((_, i) => (
                <SkeletonBox
                  key={i}
                  className="flex-1"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
            
            {/* Chart legend */}
            <div className="flex justify-center space-x-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <SkeletonBox className="w-4 h-4 rounded-full" />
                  <SkeletonBox className="w-16 h-4" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'table':
        return (
          <div className={`bg-white rounded-lg border shadow-sm overflow-hidden ${className}`}>
            {/* Table header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <SkeletonBox key={i} className="h-4" />
                ))}
              </div>
            </div>
            
            {/* Table rows */}
            <div className="divide-y">
              {[...Array(count)].map((_, i) => (
                <motion.div
                  key={i}
                  className="p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <SkeletonBox className="h-4 w-3/4" />
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-6 w-16 rounded-full" />
                    <SkeletonBox className="h-4 w-1/2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className={`space-y-8 ${className}`}>
            {[...Array(count)].map((_, i) => (
              <motion.div
                key={i}
                className="relative flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4">
                  <SkeletonBox className="w-full h-full rounded-full" />
                </div>
                
                {/* Content */}
                <div className="ml-16 bg-white rounded-lg border shadow-sm p-6 w-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <SkeletonBox className="w-8 h-8 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <SkeletonBox className="h-5 w-3/4" />
                        <SkeletonBox className="h-4 w-1/2" />
                      </div>
                    </div>
                    <SkeletonBox className="w-24 h-4" />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-5/6" />
                    <SkeletonBox className="h-4 w-2/3" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {[...Array(4)].map((_, j) => (
                      <SkeletonBox key={j} className="w-12 h-5 rounded-full" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return (
          <div className={`space-y-4 ${className}`}>
            {[...Array(count)].map((_, i) => (
              <SkeletonBox key={i} className="h-20" />
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
}

// Utility components for specific use cases
export const SkillsMatrixSkeleton = () => (
  <LoadingSkeleton variant="card" count={6} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />
);

export const ExperienceTimelineSkeleton = () => (
  <LoadingSkeleton variant="timeline" count={4} />
);

export const ProjectGridSkeleton = () => (
  <LoadingSkeleton variant="card" count={9} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />
);

export const ProfileHeaderSkeleton = () => (
  <LoadingSkeleton variant="profile" />
);

export const ChartSkeleton = () => (
  <LoadingSkeleton variant="chart" />
);

export const TableSkeleton = () => (
  <LoadingSkeleton variant="table" count={5} />
);