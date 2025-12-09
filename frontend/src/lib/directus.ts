import { 
  directus, 
  Positions, 
  Accomplishments,
  Skills,
  Education,
  Certifications,
  Identity
} from '@/types/generated-schema';
import { readItems, readSingleton, readItem } from '@directus/sdk';

// The Directus client and all type definitions are now imported from generated-schema.ts

// Export types for other modules to use
export type {
  Skills,
  Education,
  Certifications,
  Identity,
  Positions,
  Accomplishments
};

// Export the directus client
export { directus };

// Helper functions for common queries

// Get identity (singleton) with profile image
export async function getIdentity() {
  try {
    const identity = await directus.request(readSingleton('identity', {
      fields: ['*', 'profile_photo.*'] as any
    }));
    return identity;
  } catch (error) {
    console.error('Error fetching identity:', error);
    throw error;
  }
}

// Get all education entries
export async function getEducation() {
  try {
    console.log('Fetching education with accomplishments...');
    const education = await directus.request(
      readItems('education', {
        filter: { status: { _eq: 'published' } } as any,
        fields: [
          '*',
          'accomplishments.accomplishments_id.*'
        ] as any,
        sort: ['sort', '-start_date'] as any
      })
    );
    console.log('First education data:', JSON.stringify(education[0], null, 2));

    // Filter out unpublished accomplishments from each education entry
    const filteredEducation = education.map((edu: any) => ({
      ...edu,
      accomplishments: edu.accomplishments?.filter((accRel: any) =>
        accRel.accomplishments_id?.status === 'published'
      ) || []
    }));

    return filteredEducation;
  } catch (error) {
    console.error('Error fetching education:', error);
    throw error;
  }
}

// Get all positions with company information and related accomplishments
export async function getPositions() {
  try {
    console.log('Fetching positions with accomplishments...');
    const positions = await directus.request(
      readItems('positions', {
        filter: { status: { _eq: 'published' } } as any,
        fields: [
          '*',
          'company.*',
          'accomplishments.*',
          'accomplishments.related_technologies.technologies_id.name',
          'accomplishments.related_technologies.technologies_id.category',
          'accomplishments.related_projects.projects_id.name',
          'accomplishments.related_skills.skills_id.name'
        ] as any,
        sort: ['sort', '-start_date'] as any
      })
    );
    console.log('First position data:', JSON.stringify(positions[0], null, 2));

    // Filter out unpublished accomplishments from each position
    const filteredPositions = positions.map((position: any) => ({
      ...position,
      accomplishments: position.accomplishments?.filter((acc: any) => acc.status === 'published') || []
    }));

    return filteredPositions;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
}

// Get all skills grouped by category
export async function getSkills() {
  try {
    const skills = await directus.request(
      readItems('skills', {
        filter: { status: { _eq: 'published' } } as any,
        fields: [
          '*',
          'accomplishments.accomplishments_id.*',
          'accomplishments.accomplishments_id.position.*',
          'accomplishments.accomplishments_id.position.company.*',
          'accomplishments.accomplishments_id.education.*'
        ] as any,
        sort: ['category', 'sort', 'name'] as any
      })
    );
    return skills;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
}

// Get all projects with related data
export async function getProjects() {
  try {
    const projects = await directus.request(
      readItems('projects', {
        filter: { status: { _eq: 'published' } } as any,
        fields: [
          '*',
          'companies.companies_id.*',
          'positions.positions_id.*',
          'skills.skills_id.*',
          'technologies.technologies_id.*',
          'related_media.directus_files_id.*'
        ] as any,
        sort: ['sort', '-start_date'] as any
      })
    );
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// Get featured projects
export async function getFeaturedProjects() {
  try {
    const projects = await directus.request(
      readItems('projects', {
        filter: {
          _and: [
            { featured: { _eq: true } },
            { status: { _eq: 'published' } }
          ]
        } as any,
        fields: [
          '*',
          'technologies.technologies_id.*'
        ] as any,
        sort: ['sort', '-start_date'] as any
      })
    );
    return projects;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }
}

// Get all technologies
export async function getTechnologies() {
  try {
    const technologies = await directus.request(
      readItems('technologies', {
        filter: { status: { _eq: 'published' } } as any,
        fields: [
          '*',
          'accomplishments.accomplishments_id.*',
          'accomplishments.accomplishments_id.position.*',
          'accomplishments.accomplishments_id.position.company.*',
          'accomplishments.accomplishments_id.education.*'
        ] as any,
        sort: ['category', 'sort', 'name'] as any
      })
    );
    return technologies;
  } catch (error) {
    console.error('Error fetching technologies:', error);
    throw error;
  }
}

// Get certifications
export async function getCertifications() {
  try {
    const certifications = await directus.request(
      readItems('certifications', {
        filter: { status: { _eq: 'published' } } as any,
        sort: ['sort', '-issue_date'] as any
      })
    );
    return certifications;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    throw error;
  }
}

// Get accomplishments with related data
export async function getAccomplishments() {
  try {
    const accomplishments = await directus.request(
      readItems('accomplishments', {
        filter: { status: { _eq: 'published' } } as any,
        fields: [
          '*',
          'position.*',
          'position.company.*',
          'education.*',
          'related_technologies.technologies_id.*',
          'related_projects.projects_id.*',
          'related_skills.skills_id.*',
          'accomplishment_variations.*'
        ] as any,
        sort: ['sort', '-date_achieved'] as any
      })
    );
    return accomplishments;
  } catch (error) {
    console.error('Error fetching accomplishments:', error);
    throw error;
  }
}

// Get featured accomplishments
export async function getFeaturedAccomplishments() {
  try {
    const accomplishments = await directus.request(
      readItems('accomplishments', {
        filter: {
          _and: [
            { is_featured: { _eq: true } },
            { status: { _eq: 'published' } }
          ]
        } as any,
        fields: [
          '*',
          'position.*',
          'position.company.*',
          'education.*',
          'related_technologies.technologies_id.*',
          'related_projects.projects_id.*',
          'related_skills.skills_id.*'
        ] as any,
        sort: ['sort', '-date_achieved'] as any
      })
    );
    return accomplishments;
  } catch (error) {
    console.error('Error fetching featured accomplishments:', error);
    throw error;
  }
}

// Get accomplishments by type
export async function getAccomplishmentsByType(type: string) {
  try {
    const accomplishments = await directus.request(
      readItems('accomplishments', {
        filter: {
          _and: [
            { accomplishment_type: { _eq: type } },
            { status: { _eq: 'published' } }
          ]
        } as any,
        fields: [
          '*',
          'position.*',
          'position.company.*',
          'education.*',
          'related_technologies.technologies_id.*'
        ] as any,
        sort: ['sort', '-date_achieved'] as any
      })
    );
    return accomplishments;
  } catch (error) {
    console.error('Error fetching accomplishments by type:', error);
    throw error;
  }
}

// Get resumes
export async function getResumes() {
  try {
    const resumes = await directus.request(
      readItems('resumes', {
        sort: ['sort', '-date_created'] as any
      })
    );
    return resumes;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
}

// Get system settings for theming
export async function getSystemSettings() {
  try {
    // First try as singleton
    try {
      const singletonSettings = await directus.request(
        readSingleton('system_settings' as any, {
          fields: [
            '*',
            'theme_settings.*',
            'theme_settings.design_tokens.*'
          ]
        })
      );
      if (singletonSettings) {
        console.log('Fetched system settings as singleton');
        return singletonSettings;
      }
    } catch (singletonError) {
      console.log('Singleton approach failed, trying collection:', singletonError instanceof Error ? singletonError.message : 'Unknown error');
    }

    // If singleton fails, try as collection
    const collectionSettings = await directus.request(
      readItems('system_settings', {
        filter: { status: { _eq: 'published' } } as any,
        fields: [
          '*',
          'theme_settings.*',
          'theme_settings.design_tokens.*'
        ] as any,
        limit: 1
      })
    );

    if (collectionSettings && collectionSettings.length > 0) {
      console.log('Fetched system settings as collection');
      return collectionSettings[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching system settings (both singleton and collection failed):', error);
    throw error;
  }
}

// Get footnotes
export async function getFootnotes() {
  try {
    const footnotes = await directus.request(
      readItems('footnotes', {
        filter: { status: { _eq: 'published' } } as any,
        sort: ['sort'] as any,
        fields: ['*'] as any
      })
    );
    return footnotes;
  } catch (error) {
    console.error('Error fetching footnotes:', error);
    throw error;
  }
}

// Get professional summaries
export async function getProfessionalSummaries() {
  try {
    const summaries = await directus.request(
      readItems('professional_summaries', {
        filter: { status: { _eq: 'published' } } as any,
        sort: ['sort', '-date_created'] as any
      })
    );
    return summaries;
  } catch (error) {
    console.error('Error fetching professional summaries:', error);
    throw error;
  }
}

// Get complete portfolio data
export async function getCompletePortfolio() {
  try {
    const [
      identity,
      education,
      positions,
      skills,
      projects,
      certifications,
      accomplishments
    ] = await Promise.all([
      getIdentity(),
      getEducation(),
      getPositions(),
      getSkills(),
      getFeaturedProjects(),
      getCertifications(),
      getAccomplishments()
    ]);

    return {
      identity,
      education,
      positions,
      skills,
      projects,
      certifications,
      accomplishments
    };
  } catch (error) {
    console.error('Error fetching complete portfolio:', error);
    throw error;
  }
}