/**
 * Data source switcher - automatically chooses between live Directus and static data
 *
 * In development: Uses live Directus for real-time updates (server-side only)
 * In production: Uses static JSON files for fast, offline operation
 * On client-side: Always uses static data (can't use Directus SDK in browser)
 * Can be overridden with USE_STATIC environment variable
 */

// Determine data source based on environment
function shouldUseStatic() {
  // Client-side MUST use static data - Directus SDK is server-only
  if (typeof window !== 'undefined') {
    return true;
  }

  // Server-side: respect explicit USE_STATIC setting
  if (process.env.NEXT_PUBLIC_USE_STATIC === 'false' || process.env.USE_STATIC === 'false') {
    return false;
  }
  if (process.env.NEXT_PUBLIC_USE_STATIC === 'true' || process.env.USE_STATIC === 'true') {
    return true;
  }

  // Default: use static in production, live in development
  return process.env.NODE_ENV === 'production';
}

// Dynamically import the appropriate data layer based on context
async function getDataSource() {
  if (shouldUseStatic()) {
    return import('./static-data');
  } else {
    return import('./directus');
  }
}

// Re-export all functions with the same interface
export async function getIdentity() {
  const source = await getDataSource();
  return source.getIdentity();
}

export async function getEducation() {
  const source = await getDataSource();
  return source.getEducation();
}

export async function getPositions() {
  const source = await getDataSource();
  return source.getPositions();
}

export async function getSkills() {
  const source = await getDataSource();
  return source.getSkills();
}

export async function getProjects() {
  const source = await getDataSource();
  return source.getProjects();
}

export async function getFeaturedProjects() {
  const source = await getDataSource();
  return source.getFeaturedProjects();
}

export async function getTechnologies() {
  const source = await getDataSource();
  return source.getTechnologies();
}

export async function getCertifications() {
  const source = await getDataSource();
  return source.getCertifications();
}

export async function getAccomplishments() {
  const source = await getDataSource();
  return source.getAccomplishments();
}

export async function getFeaturedAccomplishments() {
  const source = await getDataSource();
  return source.getFeaturedAccomplishments();
}

export async function getAccomplishmentsByType(type: string) {
  const source = await getDataSource();
  return source.getAccomplishmentsByType(type);
}

export async function getResumes() {
  const source = await getDataSource();
  return source.getResumes();
}

export async function getSystemSettings() {
  const source = await getDataSource();
  return source.getSystemSettings();
}

export async function getFootnotes() {
  const source = await getDataSource();
  return source.getFootnotes();
}

export async function getProfessionalSummaries() {
  const source = await getDataSource();
  return source.getProfessionalSummaries();
}

export async function getCompletePortfolio() {
  const source = await getDataSource();
  return source.getCompletePortfolio();
}

// Export the current data source info for debugging
export function getDataSourceInfo() {
  const useStatic = shouldUseStatic();
  return {
    useStatic,
    nodeEnv: process.env.NODE_ENV,
    useStaticEnv: process.env.NEXT_PUBLIC_USE_STATIC || process.env.USE_STATIC,
    source: useStatic ? 'static-files' : 'directus-api',
    context: typeof window !== 'undefined' ? 'client' : 'server'
  };
}

// Log the data source being used
if (typeof window === 'undefined') { // Server-side only
  const useStatic = shouldUseStatic();
  console.log(`📊 Data source: ${useStatic ? 'Static JSON files' : 'Live Directus API'}`);
}