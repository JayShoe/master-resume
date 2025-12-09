#!/usr/bin/env node

/**
 * Export script to pull all data from Directus and save as static JSON files
 * This enables static site generation while keeping live development workflow
 */

const fs = require('fs').promises;
const path = require('path');
const { createDirectus, rest, readItems, readSingleton, staticToken } = require('@directus/sdk');
const https = require('https');
const http = require('http');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL) {
  console.error('❌ NEXT_PUBLIC_DIRECTUS_URL not found in environment');
  process.exit(1);
}

if (!DIRECTUS_TOKEN) {
  console.error('❌ DIRECTUS_TOKEN not found in environment');
  process.exit(1);
}

// Initialize Directus client with authentication
const directus = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(DIRECTUS_TOKEN));

// Output directories for static data and assets
const DATA_DIR = path.join(__dirname, '../src/data');
const ASSETS_DIR = path.join(__dirname, '../public/assets');

async function ensureDirectories() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('📁 Created data directory');
  }

  try {
    await fs.access(ASSETS_DIR);
  } catch {
    await fs.mkdir(ASSETS_DIR, { recursive: true });
    console.log('📁 Created assets directory');
  }
}

async function saveData(filename, data) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Exported ${filename}.json`);
}

// Track downloaded images to avoid duplicates
const downloadedImages = new Set();

async function downloadImage(fileId, filename) {
  if (downloadedImages.has(fileId)) {
    return `/assets/${fileId}`;
  }

  try {
    const imageUrl = `${DIRECTUS_URL}/assets/${fileId}`;
    const filePath = path.join(ASSETS_DIR, fileId);

    await new Promise((resolve, reject) => {
      const protocol = imageUrl.startsWith('https:') ? https : http;
      const file = require('fs').createWriteStream(filePath);

      protocol.get(imageUrl, {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`
        }
      }, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          downloadedImages.add(fileId);
          console.log(`📸 Downloaded ${filename || fileId}`);
          resolve();
        });
      }).on('error', reject);
    });

    return `/assets/${fileId}`;
  } catch (error) {
    console.error(`❌ Error downloading image ${fileId}:`, error.message);
    return null;
  }
}

async function processImages(data) {
  if (!data) return data;

  if (Array.isArray(data)) {
    return Promise.all(data.map(item => processImages(item)));
  }

  if (typeof data === 'object') {
    const processed = { ...data };

    for (const [key, value] of Object.entries(processed)) {
      if (key === 'profile_photo' && value?.id) {
        processed[key] = {
          ...value,
          localPath: await downloadImage(value.id, value.filename_download || value.title)
        };
      } else if (key === 'logo' && typeof value === 'string') {
        processed.logoPath = await downloadImage(value, 'company-logo');
      } else if (key === 'related_media' && Array.isArray(value)) {
        processed[key] = await Promise.all(value.map(async (media) => {
          if (media.directus_files_id?.id) {
            return {
              ...media,
              directus_files_id: {
                ...media.directus_files_id,
                localPath: await downloadImage(media.directus_files_id.id, media.directus_files_id.filename_download)
              }
            };
          }
          return media;
        }));
      } else if (typeof value === 'object') {
        processed[key] = await processImages(value);
      }
    }

    return processed;
  }

  return data;
}

async function exportIdentity() {
  try {
    const identity = await directus.request(readSingleton('identity', {
      fields: ['*', 'profile_photo.*']
    }));
    const processedIdentity = await processImages(identity);
    await saveData('identity', processedIdentity);
  } catch (error) {
    console.error('❌ Error exporting identity:', error.message);
  }
}

async function exportEducation() {
  try {
    const education = await directus.request(
      readItems('education', {
        filter: { status: { _eq: 'published' } },
        fields: [
          '*',
          'accomplishments.accomplishments_id.*'
        ],
        sort: ['sort', '-start_date']
      })
    );

    // Filter out unpublished accomplishments
    const filteredEducation = education.map((edu) => ({
      ...edu,
      accomplishments: edu.accomplishments?.filter((accRel) =>
        accRel.accomplishments_id?.status === 'published'
      ) || []
    }));

    await saveData('education', filteredEducation);
  } catch (error) {
    console.error('❌ Error exporting education:', error.message);
  }
}

async function exportPositions() {
  try {
    const positions = await directus.request(
      readItems('positions', {
        filter: { status: { _eq: 'published' } },
        fields: [
          '*',
          'company.*',
          'accomplishments.*',
          'accomplishments.related_technologies.technologies_id.name',
          'accomplishments.related_technologies.technologies_id.category',
          'accomplishments.related_projects.projects_id.name',
          'accomplishments.related_skills.skills_id.name'
        ],
        sort: ['sort', '-start_date']
      })
    );

    // Filter out unpublished accomplishments
    const filteredPositions = positions.map((position) => ({
      ...position,
      accomplishments: position.accomplishments?.filter((acc) => acc.status === 'published') || []
    }));

    const processedPositions = await processImages(filteredPositions);
    await saveData('positions', processedPositions);
  } catch (error) {
    console.error('❌ Error exporting positions:', error.message);
  }
}

async function exportSkills() {
  try {
    const skills = await directus.request(
      readItems('skills', {
        filter: { status: { _eq: 'published' } },
        fields: [
          '*',
          'accomplishments.accomplishments_id.*',
          'accomplishments.accomplishments_id.position.*',
          'accomplishments.accomplishments_id.position.company.*',
          'accomplishments.accomplishments_id.education.*'
        ],
        sort: ['category', 'sort', 'name']
      })
    );
    await saveData('skills', skills);
  } catch (error) {
    console.error('❌ Error exporting skills:', error.message);
  }
}

async function exportProjects() {
  try {
    const projects = await directus.request(
      readItems('projects', {
        filter: { status: { _eq: 'published' } },
        fields: [
          '*',
          'companies.companies_id.*',
          'positions.positions_id.*',
          'skills.skills_id.*',
          'technologies.technologies_id.*',
          'related_media.directus_files_id.*'
        ],
        sort: ['sort', '-start_date']
      })
    );
    const processedProjects = await processImages(projects);
    await saveData('projects', processedProjects);
  } catch (error) {
    console.error('❌ Error exporting projects:', error.message);
  }
}

async function exportFeaturedProjects() {
  try {
    // First try to get projects with featured field
    let projects;
    try {
      projects = await directus.request(
        readItems('projects', {
          filter: {
            _and: [
              { featured: { _eq: true } },
              { status: { _eq: 'published' } }
            ]
          },
          fields: [
            '*',
            'technologies.technologies_id.*'
          ],
          sort: ['sort', '-start_date']
        })
      );
    } catch (featuredError) {
      // If featured field doesn't exist, just get first few published projects
      console.warn('⚠️ Featured field not available, using first 6 published projects');
      projects = await directus.request(
        readItems('projects', {
          filter: { status: { _eq: 'published' } },
          fields: [
            '*',
            'technologies.technologies_id.*'
          ],
          sort: ['sort', '-start_date'],
          limit: 6
        })
      );
    }
    await saveData('featured-projects', projects);
  } catch (error) {
    console.error('❌ Error exporting featured projects:', error.message);
  }
}

async function exportTechnologies() {
  try {
    const technologies = await directus.request(
      readItems('technologies', {
        filter: { status: { _eq: 'published' } },
        fields: [
          '*',
          'accomplishments.accomplishments_id.*',
          'accomplishments.accomplishments_id.position.*',
          'accomplishments.accomplishments_id.position.company.*',
          'accomplishments.accomplishments_id.education.*'
        ],
        sort: ['category', 'sort', 'name']
      })
    );
    await saveData('technologies', technologies);
  } catch (error) {
    console.error('❌ Error exporting technologies:', error.message);
  }
}

async function exportCertifications() {
  try {
    const certifications = await directus.request(
      readItems('certifications', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort', '-issue_date']
      })
    );
    await saveData('certifications', certifications);
  } catch (error) {
    console.error('❌ Error exporting certifications:', error.message);
  }
}

async function exportAccomplishments() {
  try {
    const accomplishments = await directus.request(
      readItems('accomplishments', {
        filter: { status: { _eq: 'published' } },
        fields: [
          '*',
          'position.*',
          'position.company.*',
          'education.*',
          'related_technologies.technologies_id.*',
          'related_projects.projects_id.*',
          'related_skills.skills_id.*',
          'accomplishment_variations.*'
        ],
        sort: ['sort', '-date_achieved']
      })
    );
    await saveData('accomplishments', accomplishments);
  } catch (error) {
    console.error('❌ Error exporting accomplishments:', error.message);
  }
}

async function exportFeaturedAccomplishments() {
  try {
    const accomplishments = await directus.request(
      readItems('accomplishments', {
        filter: {
          _and: [
            { is_featured: { _eq: true } },
            { status: { _eq: 'published' } }
          ]
        },
        fields: [
          '*',
          'position.*',
          'position.company.*',
          'education.*',
          'related_technologies.technologies_id.*',
          'related_projects.projects_id.*',
          'related_skills.skills_id.*'
        ],
        sort: ['sort', '-date_achieved']
      })
    );
    await saveData('featured-accomplishments', accomplishments);
  } catch (error) {
    console.error('❌ Error exporting featured accomplishments:', error.message);
  }
}

async function exportSystemSettings() {
  try {
    // Try as singleton first
    let settings = null;
    try {
      settings = await directus.request(
        readSingleton('system_settings', {
          fields: [
            '*',
            'theme_settings.*',
            'theme_settings.design_tokens.*'
          ]
        })
      );
    } catch {
      // Try as collection if singleton fails
      const settingsArray = await directus.request(
        readItems('system_settings', {
          filter: { status: { _eq: 'published' } },
          fields: [
            '*',
            'theme_settings.*',
            'theme_settings.design_tokens.*'
          ],
          limit: 1
        })
      );
      settings = settingsArray?.[0] || null;
    }
    await saveData('system-settings', settings);
  } catch (error) {
    console.error('❌ Error exporting system settings:', error.message);
  }
}

async function exportFootnotes() {
  try {
    const footnotes = await directus.request(
      readItems('footnotes', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
        fields: ['*']
      })
    );
    await saveData('footnotes', footnotes);
  } catch (error) {
    console.error('❌ Error exporting footnotes:', error.message);
  }
}

async function exportProfessionalSummaries() {
  try {
    const summaries = await directus.request(
      readItems('professional_summaries', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort', '-date_created']
      })
    );
    await saveData('professional-summaries', summaries);
  } catch (error) {
    console.error('❌ Error exporting professional summaries:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting data export from Directus...');
  console.log(`📡 Directus URL: ${DIRECTUS_URL}`);

  await ensureDirectories();

  // Export all data collections
  await Promise.all([
    exportIdentity(),
    exportEducation(),
    exportPositions(),
    exportSkills(),
    exportProjects(),
    exportFeaturedProjects(),
    exportTechnologies(),
    exportCertifications(),
    exportAccomplishments(),
    exportFeaturedAccomplishments(),
    exportSystemSettings(),
    exportFootnotes(),
    exportProfessionalSummaries()
  ]);

  console.log('✨ Data export completed successfully!');
  console.log(`📁 Files saved to: ${DATA_DIR}`);
}

// Run the export
main().catch((error) => {
  console.error('❌ Export failed:', error);
  process.exit(1);
});