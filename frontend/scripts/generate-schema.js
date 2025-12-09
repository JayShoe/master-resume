#!/usr/bin/env node

const { generateSchemaTypes } = require('../dist/src/lib/schema-generator.js');

async function main() {
  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });
    
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const directusToken = process.env.DIRECTUS_TOKEN;
    
    console.log('🚀 Starting Directus schema generation...');
    console.log(`📍 Directus URL: ${directusUrl || 'Not set'}`);
    console.log(`🔐 Token: ${directusToken ? '✅ Provided' : '❌ Missing'}`);
    
    if (!directusUrl) {
      console.error('❌ NEXT_PUBLIC_DIRECTUS_URL is not set in .env.local');
      process.exit(1);
    }
    
    await generateSchemaTypes(directusUrl, directusToken);
    console.log('✨ Schema generation completed!');
    
  } catch (error) {
    console.error('💥 Schema generation failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Make sure your Directus instance is running and accessible');
    }
    process.exit(1);
  }
}

main();