const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin';

async function setupPublicPermissions() {
  try {
    // Login as admin
    console.log('Logging in as admin...');
    const loginResponse = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const { data: { access_token } } = await loginResponse.json();
    console.log('Login successful!');

    // Get the public role ID
    console.log('Fetching public role...');
    const rolesResponse = await fetch(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
      headers: { 
        'Authorization': `Bearer ${access_token}`
      }
    });

    const rolesData = await rolesResponse.json();
    const publicRole = rolesData.data?.[0];
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }

    const publicRoleId = publicRole.id;
    console.log(`Found public role with ID: ${publicRoleId}`);

    // Collections that need public read access
    const collections = [
      'identity',
      'professional_summaries',
      'skills',
      'technologies',
      'system_settings',
      'accomplishments',
      'positions',
      'companies',
      'education',
      'projects',
      'theme_settings',
      'design_tokens',
      'skills_accomplishments'
    ];

    // Set permissions for each collection
    for (const collection of collections) {
      console.log(`Setting permissions for ${collection}...`);
      
      // Check if permission already exists
      const existingPermResponse = await fetch(
        `${DIRECTUS_URL}/permissions?filter[role][_eq]=${publicRoleId}&filter[collection][_eq]=${collection}&filter[action][_eq]=read`,
        {
          headers: { 
            'Authorization': `Bearer ${access_token}`
          }
        }
      );

      const existingPerms = await existingPermResponse.json();
      
      if (existingPerms.data && existingPerms.data.length > 0) {
        console.log(`  ✓ Read permission already exists for ${collection}`);
        continue;
      }

      // Create read permission
      const permResponse = await fetch(`${DIRECTUS_URL}/permissions`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: publicRoleId,
          collection: collection,
          action: 'read',
          permissions: {},
          fields: '*'
        })
      });

      if (permResponse.ok) {
        console.log(`  ✓ Read permission added for ${collection}`);
      } else {
        const error = await permResponse.text();
        console.log(`  ✗ Failed to add permission for ${collection}: ${error}`);
      }
    }

    // Also set permissions for directus_files if needed
    console.log('Setting permissions for directus_files...');
    const filesPermResponse = await fetch(
      `${DIRECTUS_URL}/permissions?filter[role][_eq]=${publicRoleId}&filter[collection][_eq]=directus_files&filter[action][_eq]=read`,
      {
        headers: { 
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    const filesPerms = await filesPermResponse.json();
    
    if (!filesPerms.data || filesPerms.data.length === 0) {
      await fetch(`${DIRECTUS_URL}/permissions`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: publicRoleId,
          collection: 'directus_files',
          action: 'read',
          permissions: {},
          fields: '*'
        })
      });
      console.log('  ✓ Read permission added for directus_files');
    } else {
      console.log('  ✓ Read permission already exists for directus_files');
    }

    console.log('\n✅ Public permissions setup complete!');
    console.log('Your frontend should now be able to access the Directus API.');
    
  } catch (error) {
    console.error('Error setting up permissions:', error);
    console.log('\nIf the script failed, you can manually set permissions:');
    console.log('1. Go to http://localhost:8055/admin');
    console.log('2. Login with your admin credentials');
    console.log('3. Go to Settings → Roles & Permissions → Public');
    console.log('4. Enable read access for all collections listed above');
  }
}

setupPublicPermissions();