interface AvailabilityCalloutProps {
  education?: any[];
  identity?: any;
}

export default function AvailabilityCallout({ education = [], identity }: AvailabilityCalloutProps) {
  // Filter education with graduation dates
  const completedDegrees = education.filter(edu => edu.graduation_date && edu.degree_type && edu.institution);

  // Map degree type values to display text
  const degreeTypeMap: Record<string, string> = {
    high_school: "High School Diploma",
    associates: "Associate's Degree",
    bachelors: "Bachelor's Degree", 
    masters: "Master's Degree",
    doctorate: "Doctorate/PhD",
    certificate: "Certificate",
    bootcamp: "Bootcamp"
  };

  const formatDegree = (edu: any) => {
    const degreeText = degreeTypeMap[edu.degree_type] || edu.degree_type;
    if (edu.field_of_study) {
      return `${degreeText} in ${edu.field_of_study} from ${edu.institution}`;
    }
    return `${degreeText} from ${edu.institution}`;
  };

  return (
    <div style={{
      textAlign: 'left',
      fontSize: '13px',
      lineHeight: '1.6',
      color: '#374151'
    }}>
      {/* Name */}
      <div style={{
        fontWeight: '700',
        fontSize: '18px',
        color: '#111827',
        marginBottom: '4px'
      }}>
        {identity ?
          `${identity.first_name} ${identity.last_name}` :
          'Portfolio'
        }
      </div>

      {/* Title */}
      <div style={{
        fontSize: '14px',
        color: '#3b82f6',
        fontWeight: '600',
        marginBottom: '8px'
      }}>
        Product Leader
      </div>

      {/* Location */}
      <div style={{ 
        marginBottom: '2px',
        fontSize: '13px',
        color: '#6b7280'
      }}>
        {identity?.city && identity?.state ? 
          `${identity.city}, ${identity.state}, USA` : 
          'Blackwood, NJ, USA'
        }
      </div>

      {/* Citizenship */}
      <div style={{ 
        marginBottom: completedDegrees.length > 0 ? '12px' : '0',
        fontSize: '13px',
        color: '#6b7280'
      }}>
        United States Citizen
      </div>

      {/* Education */}
      {completedDegrees.length > 0 && (
        <div>
          {completedDegrees.map((edu, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              {formatDegree(edu)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}