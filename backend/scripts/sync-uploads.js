/**
 * Sync Upload Files with Database
 * This script scans the uploads directory and ensures all files are registered in Directus
 */

const fs = require('fs');
const path = require('path');
const { Directus } = require('@directus/sdk');

async function syncUploads() {
  const directus = new Directus(process.env.DIRECTUS_URL || 'http://localhost:8055', {
    auth: {
      staticToken: process.env.DIRECTUS_TOKEN || 'your-admin-token'
    }
  });

  const uploadsDir = path.join(__dirname, '..', 'uploads');

  try {
    // Get all files from uploads directory
    const files = fs.readdirSync(uploadsDir).filter(f => f !== '.gitkeep');

    // Get existing files from database
    const existingFiles = await directus.items('directus_files').readByQuery({
      limit: -1,
      fields: ['filename_disk']
    });

    const existingFilenames = new Set(existingFiles.data.map(f => f.filename_disk));

    // Find files that exist on disk but not in database
    const missingFiles = files.filter(f => !existingFilenames.has(f));

    if (missingFiles.length === 0) {
      console.log('✅ All files are already synced with database');
      return;
    }

    console.log(`Found ${missingFiles.length} files to sync...`);

    for (const filename of missingFiles) {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);

      // Determine file type
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.avif': 'image/avif'
      };

      // Create file record in Directus
      await directus.items('directus_files').createOne({
        filename_disk: filename,
        filename_download: filename,
        filesize: stats.size,
        type: mimeTypes[ext] || 'application/octet-stream',
        storage: 'local',
        uploaded_on: stats.birthtime
      });

      console.log(`✓ Synced: ${filename}`);
    }

    console.log('✅ File sync complete!');

  } catch (error) {
    console.error('Error syncing files:', error);
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
  syncUploads();
}

module.exports = { syncUploads };