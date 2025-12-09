import { NextRequest, NextResponse } from 'next/server';
import type { PendingContent, ContentType } from '@/lib/interview/types';

// This route requires runtime server access (MCP/Directus API)
export const dynamic = 'force-dynamic';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

// Map content types to Directus collection names
const COLLECTION_MAP: Record<ContentType, string> = {
  position: 'positions',
  accomplishment: 'accomplishments',
  skill: 'skills',
  technology: 'technologies',
  project: 'projects',
  education: 'education',
  certification: 'certifications',
  company: 'companies',
};

interface DirectusResponse {
  data: { id: number | string; [key: string]: unknown };
}

interface DirectusItemsResponse {
  data: Array<{ id: number | string; [key: string]: unknown }>;
}

/**
 * MCP-style helper to call Directus API
 * Uses the same patterns as the MCP bridge
 */
async function mcpCall<T = unknown>(
  tool: string,
  params: Record<string, unknown>
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${DIRECTUS_TOKEN}`,
  };

  switch (tool) {
    case 'create-item': {
      const { collection, item } = params as {
        collection: string;
        item: Record<string, unknown>;
      };
      const response = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...item, status: 'published' }),
      });
      if (!response.ok) {
        const error = await parseDirectusError(response);
        throw new Error(error);
      }
      return response.json() as Promise<T>;
    }

    case 'read-items': {
      const { collection, query } = params as {
        collection: string;
        query?: { filter?: Record<string, unknown>; limit?: number };
      };
      const queryParams = new URLSearchParams();
      if (query?.filter) {
        queryParams.set('filter', JSON.stringify(query.filter));
      }
      if (query?.limit) {
        queryParams.set('limit', String(query.limit));
      }
      const queryString = queryParams.toString();
      const url = `${DIRECTUS_URL}/items/${collection}${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, { headers });
      if (!response.ok) {
        const error = await parseDirectusError(response);
        throw new Error(error);
      }
      return response.json() as Promise<T>;
    }

    default:
      throw new Error(`Unknown MCP tool: ${tool}`);
  }
}

async function parseDirectusError(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    if (json.errors?.length > 0) {
      return json.errors.map((e: { message: string }) => e.message).join(', ');
    }
  } catch {
    // Not JSON
  }
  return `Directus error (${response.status}): ${text}`;
}

async function findOrCreateCompany(companyName: string): Promise<number | string> {
  // Search for existing company
  const result = await mcpCall<DirectusItemsResponse>('read-items', {
    collection: 'companies',
    query: { filter: { name: { _eq: companyName } }, limit: 1 },
  });

  if (result.data?.length > 0) {
    return result.data[0].id;
  }

  // Create new company
  const createResult = await mcpCall<DirectusResponse>('create-item', {
    collection: 'companies',
    item: { name: companyName },
  });

  return createResult.data.id;
}

async function findPositionId(positionTitle: string): Promise<number | string | null> {
  const result = await mcpCall<DirectusItemsResponse>('read-items', {
    collection: 'positions',
    query: { filter: { primary_title: { _icontains: positionTitle } }, limit: 1 },
  });

  return result.data?.length > 0 ? result.data[0].id : null;
}

async function findSkillIds(skillNames: string[]): Promise<(number | string)[]> {
  const ids: (number | string)[] = [];
  for (const name of skillNames) {
    const result = await mcpCall<DirectusItemsResponse>('read-items', {
      collection: 'skills',
      query: { filter: { name: { _icontains: name } }, limit: 1 },
    });
    if (result.data?.length > 0) {
      ids.push(result.data[0].id);
    }
  }
  return ids;
}

async function findTechnologyIds(techNames: string[]): Promise<(number | string)[]> {
  const ids: (number | string)[] = [];
  for (const name of techNames) {
    const result = await mcpCall<DirectusItemsResponse>('read-items', {
      collection: 'technologies',
      query: { filter: { name: { _icontains: name } }, limit: 1 },
    });
    if (result.data?.length > 0) {
      ids.push(result.data[0].id);
    }
  }
  return ids;
}

async function linkRelatedItems(
  junctionCollection: string,
  mainIdField: string,
  mainId: number | string,
  relatedIdField: string,
  relatedIds: (number | string)[]
): Promise<void> {
  for (const relatedId of relatedIds) {
    await mcpCall('create-item', {
      collection: junctionCollection,
      item: {
        [mainIdField]: mainId,
        [relatedIdField]: relatedId,
      },
    });
  }
}

async function savePosition(data: Record<string, unknown>): Promise<DirectusResponse> {
  let companyId = null;
  if (data.company_name) {
    companyId = await findOrCreateCompany(data.company_name as string);
  }

  return mcpCall<DirectusResponse>('create-item', {
    collection: 'positions',
    item: {
      primary_title: data.primary_title,
      department: data.department,
      start_date: data.start_date,
      end_date: data.end_date,
      is_current: data.is_current,
      employment_type: data.employment_type,
      summary: data.summary,
      description: data.description,
      company: companyId,
    },
  });
}

async function saveAccomplishment(data: Record<string, unknown>): Promise<DirectusResponse> {
  let positionId = null;
  if (data.position_title) {
    positionId = await findPositionId(data.position_title as string);
  }

  const result = await mcpCall<DirectusResponse>('create-item', {
    collection: 'accomplishments',
    item: {
      primary_title: data.primary_title,
      primary_description: data.primary_description,
      impact_metrics: data.impact_metrics,
      accomplishment_type: data.accomplishment_type,
      date_achieved: data.date_achieved,
      is_featured: data.is_featured || false,
      position: positionId,
    },
  });

  const accomplishmentId = result.data.id;

  // Link related skills
  if (data.related_skills && Array.isArray(data.related_skills)) {
    const skillIds = await findSkillIds(data.related_skills as string[]);
    await linkRelatedItems(
      'accomplishments_skills',
      'accomplishments_id',
      accomplishmentId,
      'skills_id',
      skillIds
    );
  }

  // Link related technologies
  if (data.related_technologies && Array.isArray(data.related_technologies)) {
    const techIds = await findTechnologyIds(data.related_technologies as string[]);
    await linkRelatedItems(
      'accomplishments_technologies',
      'accomplishments_id',
      accomplishmentId,
      'technologies_id',
      techIds
    );
  }

  return result;
}

async function saveProject(data: Record<string, unknown>): Promise<DirectusResponse> {
  const result = await mcpCall<DirectusResponse>('create-item', {
    collection: 'projects',
    item: {
      name: data.name,
      description: data.description,
      role: data.role,
      project_type: data.project_type,
      start_date: data.start_date,
      end_date: data.end_date,
      is_featured: data.is_featured,
      project_url: data.project_url,
      github_url: data.github_url,
    },
  });

  const projectId = result.data.id;

  // Link technologies
  if (data.technologies_used && Array.isArray(data.technologies_used)) {
    const techIds = await findTechnologyIds(data.technologies_used as string[]);
    await linkRelatedItems(
      'projects_technologies',
      'projects_id',
      projectId,
      'technologies_id',
      techIds
    );
  }

  // Link skills
  if (data.skills_demonstrated && Array.isArray(data.skills_demonstrated)) {
    const skillIds = await findSkillIds(data.skills_demonstrated as string[]);
    await linkRelatedItems('projects_skills', 'projects_id', projectId, 'skills_id', skillIds);
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    if (!DIRECTUS_TOKEN) {
      return NextResponse.json({ error: 'Directus token not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { content } = body as { content: PendingContent };

    if (!content || !content.type || !content.data) {
      return NextResponse.json({ error: 'Invalid content data' }, { status: 400 });
    }

    let result: DirectusResponse;

    switch (content.type) {
      case 'position':
        result = await savePosition(content.data);
        break;

      case 'accomplishment':
        result = await saveAccomplishment(content.data);
        break;

      case 'project':
        result = await saveProject(content.data);
        break;

      case 'skill':
        result = await mcpCall<DirectusResponse>('create-item', {
          collection: 'skills',
          item: {
            name: content.data.name,
            category: content.data.category,
            proficiency_level: content.data.proficiency_level,
            is_core_skill: content.data.is_core_skill,
            start_date: content.data.start_date,
          },
        });
        break;

      case 'technology':
        result = await mcpCall<DirectusResponse>('create-item', {
          collection: 'technologies',
          item: {
            name: content.data.name,
            category: content.data.category,
            proficiency_level: content.data.proficiency_level,
            years_experience: content.data.years_experience,
            is_current: content.data.is_current,
            last_used: content.data.last_used,
          },
        });
        break;

      case 'education':
        result = await mcpCall<DirectusResponse>('create-item', {
          collection: 'education',
          item: {
            institution: content.data.institution,
            degree_type: content.data.degree_type,
            field_of_study: content.data.field_of_study,
            graduation_date: content.data.graduation_date,
            start_date: content.data.start_date,
            summary: content.data.summary,
            description: content.data.description,
          },
        });
        break;

      case 'certification':
        result = await mcpCall<DirectusResponse>('create-item', {
          collection: 'certifications',
          item: {
            name: content.data.name,
            issuing_organization: content.data.issuing_organization,
            issue_date: content.data.issue_date,
            is_active: content.data.is_active,
          },
        });
        break;

      case 'company':
        result = await mcpCall<DirectusResponse>('create-item', {
          collection: 'companies',
          item: {
            name: content.data.name,
            industry: content.data.industry,
            size: content.data.size,
            location: content.data.location,
            website: content.data.website,
            description: content.data.description,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported content type: ${content.type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      id: result.data.id,
      collection: COLLECTION_MAP[content.type],
    });
  } catch (error) {
    console.error('Save content error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
