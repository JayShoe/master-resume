import { createDirectus, rest, staticToken, readCollections, readFields, readRelations } from '@directus/sdk';
import fs from 'fs';
import path from 'path';

// Types for Directus schema information
interface DirectusCollection {
  collection: string;
  meta: {
    collection: string;
    icon: string | null;
    note: string | null;
    display_template: string | null;
    hidden: boolean;
    singleton: boolean;
    translations: any | null;
    archive_field: string | null;
    archive_app_filter: boolean;
    archive_value: string | null;
    unarchive_value: string | null;
    sort_field: string | null;
    accountability: string | null;
    color: string | null;
    item_duplication_fields: string[] | null;
    sort: number | null;
    group: string | null;
    collapse: string;
    preview_url: string | null;
    versioning: boolean;
  };
  schema: {
    name: string;
    comment: string | null;
  } | null;
}

interface DirectusField {
  collection: string;
  field: string;
  type: string;
  meta: {
    id: number;
    collection: string;
    field: string;
    special: string[] | null;
    interface: string | null;
    options: any | null;
    display: string | null;
    display_options: any | null;
    readonly: boolean;
    hidden: boolean;
    sort: number | null;
    width: string;
    translations: any | null;
    note: string | null;
    conditions: any[] | null;
    required: boolean;
    group: string | null;
    validation: any | null;
    validation_message: string | null;
  };
  schema: {
    name: string;
    table: string;
    data_type: string;
    default_value: any;
    max_length: number | null;
    numeric_precision: number | null;
    numeric_scale: number | null;
    is_nullable: boolean;
    is_unique: boolean;
    is_primary_key: boolean;
    has_auto_increment: boolean;
    foreign_key_column: string | null;
    foreign_key_table: string | null;
    comment: string | null;
  } | null;
}

interface DirectusRelation {
  collection: string;
  field: string;
  related_collection: string | null;
  meta: {
    id: number;
    many_collection: string;
    many_field: string;
    one_collection: string | null;
    one_field: string | null;
    one_collection_field: string | null;
    one_allowed_collections: string[] | null;
    junction_field: string | null;
    sort_field: string | null;
    one_deselect_action: string;
  } | null;
  schema: {
    table: string;
    column: string;
    foreign_key_table: string | null;
    foreign_key_column: string | null;
    constraint_name: string | null;
    on_update: string;
    on_delete: string;
  } | null;
}

// Create Directus client with authentication
function createAuthenticatedDirectus(url: string, token?: string) {
  const client = createDirectus(url).with(rest());
  
  if (token) {
    return client.with(staticToken(token));
  }
  
  return client;
}

// Convert Directus field type to TypeScript type
function mapDirectusTypeToTypeScript(field: DirectusField): string {
  const { type, schema } = field;
  const isNullable = schema?.is_nullable !== false;
  
  let tsType: string;
  
  switch (type) {
    case 'integer':
    case 'bigInteger':
    case 'float':
    case 'decimal':
      tsType = 'number';
      break;
    case 'string':
    case 'text':
    case 'uuid':
    case 'hash':
    case 'json':
      tsType = 'string';
      break;
    case 'boolean':
      tsType = 'boolean';
      break;
    case 'date':
    case 'dateTime':
    case 'time':
    case 'timestamp':
      tsType = 'string'; // ISO date strings
      break;
    case 'json':
      tsType = 'any';
      break;
    default:
      tsType = 'unknown';
  }
  
  return isNullable ? `${tsType} | null` : tsType;
}

// Generate TypeScript interface for a collection
function generateCollectionInterface(
  collection: DirectusCollection, 
  fields: DirectusField[], 
  relations: DirectusRelation[]
): string {
  const collectionName = collection.collection;
  const className = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
  
  let interfaceDefinition = `export interface ${className} {\n`;
  
  // Sort fields: required first, then optional
  const requiredFields = fields.filter(f => f.meta.required);
  const optionalFields = fields.filter(f => !f.meta.required);
  const sortedFields = [...requiredFields, ...optionalFields];
  
  for (const field of sortedFields) {
    const fieldName = field.field;
    const fieldType = mapDirectusTypeToTypeScript(field);
    const isOptional = !field.meta.required ? '?' : '';
    const comment = field.meta.note ? `  // ${field.meta.note}\n` : '';
    
    // Check if this field is a relation
    const relation = relations.find(r => r.collection === collectionName && r.field === fieldName);
    
    let finalType = fieldType;
    if (relation && relation.related_collection) {
      const relatedClassName = relation.related_collection.charAt(0).toUpperCase() + relation.related_collection.slice(1);
      
      // Check if it's a many-to-many relation (has junction_field)
      if (relation.meta?.junction_field) {
        finalType = `${relatedClassName}[]`;
      } else {
        finalType = field.meta.required ? relatedClassName : `${relatedClassName} | null`;
      }
    }
    
    interfaceDefinition += comment;
    interfaceDefinition += `  ${fieldName}${isOptional}: ${finalType};\n`;
  }
  
  interfaceDefinition += '}\n\n';
  
  return interfaceDefinition;
}

// Generate complete schema types
export async function generateSchemaTypes(directusUrl?: string, directusToken?: string): Promise<void> {
  const url = directusUrl || process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const token = directusToken || process.env.DIRECTUS_TOKEN;
  
  if (!url) {
    throw new Error('Directus URL is required. Set NEXT_PUBLIC_DIRECTUS_URL or pass it as parameter.');
  }
  
  console.log('🔗 Connecting to Directus at:', url);
  console.log('🔑 Using token:', token ? 'Yes' : 'No (public access)');
  
  const directus = createAuthenticatedDirectus(url, token);
  
  try {
    // Fetch schema information
    console.log('📡 Fetching collections...');
    const collections = await directus.request(readCollections());
    
    console.log('📡 Fetching fields...');
    const fields = await directus.request(readFields());
    
    console.log('📡 Fetching relations...');
    const relations = await directus.request(readRelations());
    
    console.log(`✅ Found ${collections.length} collections, ${fields.length} fields, ${relations.length} relations`);
    
    // Filter out system collections (start with directus_)
    const userCollections = collections.filter(col => !col.collection.startsWith('directus_'));
    
    // Generate TypeScript definitions
    let generatedTypes = `// Generated by schema-generator.ts\n`;
    generatedTypes += `// DO NOT EDIT - This file is auto-generated from Directus schema\n`;
    generatedTypes += `// Generated at: ${new Date().toISOString()}\n\n`;
    
    // Generate schema interface for type safety
    let schemaInterface = 'export interface Schema {\n';
    
    for (const collection of userCollections) {
      const collectionFields = fields.filter(f => f.collection === collection.collection);
      const collectionRelations = relations.filter(r => r.collection === collection.collection);
      
      const interfaceCode = generateCollectionInterface(collection as any, collectionFields as any, collectionRelations as any);
      generatedTypes += interfaceCode;
      
      // Add to schema interface
      const className = collection.collection.charAt(0).toUpperCase() + collection.collection.slice(1);
      const isArray = !collection.meta.singleton;
      schemaInterface += `  ${collection.collection}: ${className}${isArray ? '[]' : ''};\n`;
    }
    
    schemaInterface += '}\n\n';
    generatedTypes += schemaInterface;
    
    // Generate helper functions for each collection
    generatedTypes += `// Helper functions\n`;
    generatedTypes += `import { createDirectus, rest, staticToken, readItems, readItem, readSingleton } from '@directus/sdk';\n\n`;
    
    generatedTypes += `const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;\n`;
    generatedTypes += `const directusToken = process.env.DIRECTUS_TOKEN;\n\n`;
    
    generatedTypes += `if (!directusUrl) {\n`;
    generatedTypes += `  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined in environment variables');\n`;
    generatedTypes += `}\n\n`;
    
    generatedTypes += `const baseClient = createDirectus<Schema>(directusUrl).with(rest());\n`;
    generatedTypes += `export const directus = directusToken ? baseClient.with(staticToken(directusToken)) : baseClient;\n\n`;
    
    // Generate collection-specific helper functions
    for (const collection of userCollections) {
      const collectionName = collection.collection;
      const className = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
      const isSingleton = collection.meta.singleton;
      
      if (isSingleton) {
        generatedTypes += `export async function get${className}() {\n`;
        generatedTypes += `  try {\n`;
        generatedTypes += `    return await directus.request(readSingleton('${collectionName}'));\n`;
        generatedTypes += `  } catch (error) {\n`;
        generatedTypes += `    console.error('Error fetching ${collectionName}:', error);\n`;
        generatedTypes += `    throw error;\n`;
        generatedTypes += `  }\n`;
        generatedTypes += `}\n\n`;
      } else {
        // Get all items
        generatedTypes += `export async function getAll${className}() {\n`;
        generatedTypes += `  try {\n`;
        generatedTypes += `    return await directus.request(readItems('${collectionName}'));\n`;
        generatedTypes += `  } catch (error) {\n`;
        generatedTypes += `    console.error('Error fetching ${collectionName}:', error);\n`;
        generatedTypes += `    throw error;\n`;
        generatedTypes += `  }\n`;
        generatedTypes += `}\n\n`;
        
        // Get single item by ID
        generatedTypes += `export async function get${className}ById(id: string | number) {\n`;
        generatedTypes += `  try {\n`;
        generatedTypes += `    return await directus.request(readItem('${collectionName}', id));\n`;
        generatedTypes += `  } catch (error) {\n`;
        generatedTypes += `    console.error('Error fetching ${collectionName} by id:', error);\n`;
        generatedTypes += `    throw error;\n`;
        generatedTypes += `  }\n`;
        generatedTypes += `}\n\n`;
      }
    }
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'src', 'types', 'directus-schema.ts');
    await fs.promises.writeFile(outputPath, generatedTypes, 'utf8');
    
    console.log(`✅ Generated TypeScript definitions: ${outputPath}`);
    console.log(`📊 Generated ${userCollections.length} collection interfaces`);
    
  } catch (error) {
    console.error('❌ Error generating schema types:', error);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const urlArg = args.find(arg => arg.startsWith('--url='))?.split('=')[1];
  const tokenArg = args.find(arg => arg.startsWith('--token='))?.split('=')[1];
  
  generateSchemaTypes(urlArg, tokenArg)
    .then(() => {
      console.log('🎉 Schema generation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Schema generation failed:', error);
      process.exit(1);
    });
}