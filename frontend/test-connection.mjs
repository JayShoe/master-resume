import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.local' });

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_TOKEN;

console.log('🚀 Testing Directus connection...');
console.log(`📍 URL: ${directusUrl}`);
console.log(`🔑 Token: ${directusToken ? '✅ Provided' : '❌ Missing'}`);

if (!directusUrl) {
  console.error('❌ NEXT_PUBLIC_DIRECTUS_URL not found in .env.local');
  process.exit(1);
}

async function testConnection() {
  try {
    // Test basic connection
    console.log('\n📡 Testing basic connection...');
    const response = await fetch(`${directusUrl}/server/info`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const serverInfo = await response.json();
    console.log('✅ Server reachable!');
    console.log(`🏷️  Directus Version: ${serverInfo.data?.directus?.version || 'Unknown'}`);
    
    // Test authenticated endpoint
    if (directusToken) {
      console.log('\n🔐 Testing authenticated access...');
      const collectionsResponse = await fetch(`${directusUrl}/collections`, {
        headers: {
          'Authorization': `Bearer ${directusToken}`
        }
      });
      
      if (collectionsResponse.ok) {
        const collections = await collectionsResponse.json();
        console.log('✅ Authentication successful!');
        console.log(`📊 Found ${collections.data?.length || 0} collections`);
        
        // List non-system collections
        const userCollections = collections.data?.filter(col => !col.collection.startsWith('directus_')) || [];
        if (userCollections.length > 0) {
          console.log('\n📋 User Collections:');
          userCollections.forEach(col => {
            console.log(`   • ${col.collection} ${col.meta?.singleton ? '(singleton)' : ''}`);
          });
        } else {
          console.log('ℹ️  No user collections found (only system collections exist)');
        }
      } else {
        console.log('❌ Authentication failed');
        console.log(`   Status: ${collectionsResponse.status} ${collectionsResponse.statusText}`);
      }
    } else {
      console.log('⚠️  No token provided - skipping authenticated tests');
    }
    
    console.log('\n🎉 Connection test completed!');
    
  } catch (error) {
    console.error('\n💥 Connection test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your Directus instance is running on', directusUrl);
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 Check if the Directus URL is correct:', directusUrl);
    }
    
    process.exit(1);
  }
}

testConnection();