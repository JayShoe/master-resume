'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';
import type { Certifications } from '@/lib/directus';

interface CertificationDisplayProps {
  certifications: Certifications[];
}

type FilterType = 'all' | 'active' | 'expired' | 'expiring';

export default function CertificationDisplay({ certifications }: CertificationDisplayProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCert, setSelectedCert] = useState<Certifications | null>(null);

  const now = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  const getCertificationStatus = (cert: Certifications) => {
    // Use is_active field instead of expiry_date since that's what exists in the schema
    if (cert.is_active) {
      return { status: 'active', label: 'Active', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    } else if (cert.is_active === false) {
      return { status: 'expired', label: 'Inactive', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle };
    }
    
    // Default to permanent if is_active is null/undefined
    return { status: 'permanent', label: 'No Expiry', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
  };

  const filteredCertifications = certifications.filter(cert => {
    const { status } = getCertificationStatus(cert);
    
    switch (filter) {
      case 'active':
        return status === 'active' || status === 'permanent';
      case 'expired':
        return status === 'expired';
      case 'expiring':
        return status === 'expiring';
      default:
        return true;
    }
  });

  const sortedCertifications = [...filteredCertifications].sort((a, b) => {
    // Sort by issue date, most recent first
    return new Date(b.issue_date || '').getTime() - new Date(a.issue_date || '').getTime();
  });

  const getFilterCounts = () => {
    const counts = { all: certifications.length, active: 0, expired: 0, expiring: 0 };
    
    certifications.forEach(cert => {
      const { status } = getCertificationStatus(cert);
      if (status === 'active' || status === 'permanent') counts.active++;
      else if (status === 'expired') counts.expired++;
      else if (status === 'expiring') counts.expiring++;
    });
    
    return counts;
  };

  const counts = getFilterCounts();

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Certifications
          </h3>
          <span className="text-sm text-muted-foreground">
            Showing {filteredCertifications.length} of {certifications.length}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all' as FilterType, label: 'All', count: counts.all },
            { key: 'active' as FilterType, label: 'Active', count: counts.active },
            { key: 'expiring' as FilterType, label: 'Expiring Soon', count: counts.expiring },
            { key: 'expired' as FilterType, label: 'Expired', count: counts.expired },
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedCertifications.map((cert, index) => {
          const { status, label, color, bgColor, icon: StatusIcon } = getCertificationStatus(cert);
          
          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCert(cert)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">{cert.name}</h3>
                      <p className="text-sm text-primary font-medium">{cert.issuing_organization}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {label}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Issued: {cert.issue_date ? formatDate(cert.issue_date) : 'Unknown'}</span>
                  </div>
                  
                </div>


              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCertifications.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications found</h3>
          <p className="text-gray-600">Try adjusting your filter to see more results.</p>
        </div>
      )}

      {/* Certification Detail Modal */}
      {selectedCert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCert(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedCert.name}</h3>
                <p className="text-primary font-medium">{selectedCert.issuing_organization}</p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const { status, label, color, bgColor, icon: StatusIcon } = getCertificationStatus(selectedCert);
                return (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${bgColor} ${color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {label}
                  </div>
                );
              })()}
              
              <div>
                <label className="text-sm font-medium text-gray-600">Issue Date</label>
                <p className="text-sm">{selectedCert.issue_date ? formatDate(selectedCert.issue_date) : 'Unknown'}</p>
              </div>
              
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Statistics */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Certification Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{certifications.length}</p>
            <p className="text-xs text-muted-foreground">Total Certifications</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{counts.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{counts.expiring}</p>
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{counts.expired}</p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </div>
        </div>
      </div>
    </div>
  );
}