/**
 * MCP Client for Directus
 * Uses MCP-style tool patterns to communicate with Directus REST API
 */

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

interface DirectusResponse<T = unknown> {
  data: T;
}

// Tool definitions that Claude can use
// These map to Directus MCP-style tools
export const CLAUDE_TOOLS = [
  {
    name: 'get_identity',
    description:
      'Get personal identity information including name, contact details, and professional tagline. Use this when asked about who the person is, contact information, or basic profile.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_positions',
    description:
      'Get work experience and positions. Returns job titles, companies, dates, descriptions, and accomplishments for each role. Use this when asked about work history, previous jobs, or career experience.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_name: {
          type: 'string',
          description: 'Optional: Filter by company name',
        },
        is_current: {
          type: 'boolean',
          description: 'Optional: Filter to only current positions',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_accomplishments',
    description:
      'Get specific accomplishments and achievements. Returns detailed descriptions with impact metrics. Use this when asked about achievements, successes, or specific results.',
    input_schema: {
      type: 'object' as const,
      properties: {
        accomplishment_type: {
          type: 'string',
          description:
            'Optional: Filter by type (e.g., "technical", "leadership", "process_improvement")',
        },
        is_featured: {
          type: 'boolean',
          description: 'Optional: Only return featured accomplishments',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_skills',
    description:
      'Get professional skills with proficiency levels. Returns skill names, categories, and whether they are core skills. Use this when asked about skills, abilities, or competencies.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          description:
            'Optional: Filter by category (e.g., "technical", "leadership", "communication")',
        },
        is_core_skill: {
          type: 'boolean',
          description: 'Optional: Only return core skills',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_technologies',
    description:
      'Get technologies and tools with proficiency and years of experience. Use this when asked about technical skills, programming languages, frameworks, or tools.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          description:
            'Optional: Filter by category (e.g., "programming_language", "framework", "database", "cloud")',
        },
        is_current: {
          type: 'boolean',
          description: 'Optional: Only return currently used technologies',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_projects',
    description:
      'Get personal and professional projects with descriptions, technologies used, and links. Use this when asked about projects, portfolio, or specific work examples.',
    input_schema: {
      type: 'object' as const,
      properties: {
        project_type: {
          type: 'string',
          description: 'Optional: Filter by type (e.g., "personal", "professional", "open_source")',
        },
        current_project: {
          type: 'boolean',
          description: 'Optional: Only return current/ongoing projects',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_education',
    description:
      'Get educational background including degrees, institutions, and fields of study. Use this when asked about education, degrees, or academic background.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_certifications',
    description:
      'Get professional certifications with issuing organizations and dates. Use this when asked about certifications, credentials, or professional qualifications.',
    input_schema: {
      type: 'object' as const,
      properties: {
        is_active: {
          type: 'boolean',
          description: 'Optional: Only return active/current certifications',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_professional_summaries',
    description:
      'Get professional summary statements tailored for different industries or roles. Use this when asked for an overview, introduction, or professional summary.',
    input_schema: {
      type: 'object' as const,
      properties: {
        target_industry: {
          type: 'string',
          description: 'Optional: Get summary targeted for specific industry',
        },
      },
      required: [],
    },
  },
  {
    name: 'search_resume',
    description:
      'Search across all resume data for a specific term or topic. Use this when the question is broad or you need to find relevant information across multiple categories.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'The search term or topic to look for',
        },
      },
      required: ['query'],
    },
  },
];

/**
 * MCP-style helper to call Directus API
 */
async function mcpReadItems<T = unknown>(
  collection: string,
  options?: {
    filter?: Record<string, unknown>;
    fields?: string;
    sort?: string;
    search?: string;
    limit?: number;
  }
): Promise<T[]> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (DIRECTUS_TOKEN) {
    headers['Authorization'] = `Bearer ${DIRECTUS_TOKEN}`;
  }

  const params = new URLSearchParams();

  if (options?.filter) {
    params.set('filter', JSON.stringify(options.filter));
  }
  if (options?.fields) {
    params.set('fields', options.fields);
  }
  if (options?.sort) {
    params.set('sort', options.sort);
  }
  if (options?.search) {
    params.set('search', options.search);
  }
  if (options?.limit) {
    params.set('limit', String(options.limit));
  }

  const queryString = params.toString();
  const url = `${DIRECTUS_URL}/items/${collection}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Directus API error: ${response.status}`);
  }

  const result: DirectusResponse<T[]> = await response.json();
  return result.data || [];
}

/**
 * Executes a tool call using MCP-style patterns
 */
export async function executeTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<string> {
  try {
    let result: unknown;

    switch (toolName) {
      case 'get_identity': {
        result = await mcpReadItems('identity', { fields: '*' });
        break;
      }

      case 'get_positions': {
        const filter: Record<string, unknown> = { status: { _eq: 'published' } };
        if (args.company_name) {
          filter['company'] = { name: { _icontains: args.company_name } };
        }
        if (args.is_current !== undefined) {
          filter['is_current'] = { _eq: args.is_current };
        }
        result = await mcpReadItems('positions', {
          fields: '*,company.*,accomplishments.*',
          filter,
          sort: '-start_date',
        });
        break;
      }

      case 'get_accomplishments': {
        const filter: Record<string, unknown> = { status: { _eq: 'published' } };
        if (args.accomplishment_type) {
          filter['accomplishment_type'] = { _eq: args.accomplishment_type };
        }
        if (args.is_featured !== undefined) {
          filter['is_featured'] = { _eq: args.is_featured };
        }
        const data = await mcpReadItems<Record<string, unknown>>('accomplishments', {
          fields: '*,related_skills.skills_id.name,related_technologies.technologies_id.name',
          filter,
          sort: '-date_achieved',
        });
        // Flatten nested relations
        result = data.map((acc) => ({
          ...acc,
          related_skills: (
            (acc.related_skills as Array<{ skills_id: { name: string } }>) || []
          )
            .map((r) => r.skills_id?.name)
            .filter(Boolean),
          related_technologies: (
            (acc.related_technologies as Array<{ technologies_id: { name: string } }>) || []
          )
            .map((r) => r.technologies_id?.name)
            .filter(Boolean),
        }));
        break;
      }

      case 'get_skills': {
        const filter: Record<string, unknown> = { status: { _eq: 'published' } };
        if (args.category) {
          filter['category'] = { _eq: args.category };
        }
        if (args.is_core_skill !== undefined) {
          filter['is_core_skill'] = { _eq: args.is_core_skill };
        }
        result = await mcpReadItems('skills', {
          fields: '*',
          filter,
          sort: 'category,name',
        });
        break;
      }

      case 'get_technologies': {
        const filter: Record<string, unknown> = { status: { _eq: 'published' } };
        if (args.category) {
          filter['category'] = { _eq: args.category };
        }
        if (args.is_current !== undefined) {
          filter['is_current'] = { _eq: args.is_current };
        }
        result = await mcpReadItems('technologies', {
          fields: '*',
          filter,
          sort: 'category,name',
        });
        break;
      }

      case 'get_projects': {
        const filter: Record<string, unknown> = { status: { _eq: 'published' } };
        if (args.project_type) {
          filter['project_type'] = { _eq: args.project_type };
        }
        if (args.current_project !== undefined) {
          filter['current_project'] = { _eq: args.current_project };
        }
        const data = await mcpReadItems<Record<string, unknown>>('projects', {
          fields: '*,technologies_used.technologies_id.name,skills_demonstrated.skills_id.name',
          filter,
          sort: '-start_date',
        });
        // Flatten nested relations
        result = data.map((proj) => ({
          ...proj,
          technologies_used: (
            (proj.technologies_used as Array<{ technologies_id: { name: string } }>) || []
          )
            .map((r) => r.technologies_id?.name)
            .filter(Boolean),
          skills_demonstrated: (
            (proj.skills_demonstrated as Array<{ skills_id: { name: string } }>) || []
          )
            .map((r) => r.skills_id?.name)
            .filter(Boolean),
        }));
        break;
      }

      case 'get_education': {
        result = await mcpReadItems('education', {
          fields: '*',
          filter: { status: { _eq: 'published' } },
          sort: '-graduation_date',
        });
        break;
      }

      case 'get_certifications': {
        const filter: Record<string, unknown> = { status: { _eq: 'published' } };
        if (args.is_active !== undefined) {
          filter['is_active'] = { _eq: args.is_active };
        }
        result = await mcpReadItems('certifications', {
          fields: '*',
          filter,
          sort: '-issue_date',
        });
        break;
      }

      case 'get_professional_summaries': {
        const filter: Record<string, unknown> = { status: { _eq: 'published' } };
        if (args.target_industry) {
          filter['target_industry'] = { _eq: args.target_industry };
        }
        result = await mcpReadItems('professional_summaries', {
          fields: '*',
          filter,
        });
        break;
      }

      case 'search_resume': {
        // Search across multiple collections using MCP pattern
        const query = String(args.query || '').toLowerCase();
        const searchResults: Record<string, unknown[]> = {};
        const baseFilter = { status: { _eq: 'published' } };

        // Search positions
        const positions = await mcpReadItems('positions', {
          fields: '*,company.*',
          filter: baseFilter,
          search: query,
        });
        if (positions.length > 0) {
          searchResults.positions = positions;
        }

        // Search accomplishments
        const accomplishments = await mcpReadItems('accomplishments', {
          fields: '*',
          filter: baseFilter,
          search: query,
        });
        if (accomplishments.length > 0) {
          searchResults.accomplishments = accomplishments;
        }

        // Search projects
        const projects = await mcpReadItems('projects', {
          fields: '*',
          filter: baseFilter,
          search: query,
        });
        if (projects.length > 0) {
          searchResults.projects = projects;
        }

        // Search skills
        const skills = await mcpReadItems('skills', {
          fields: '*',
          filter: baseFilter,
          search: query,
        });
        if (skills.length > 0) {
          searchResults.skills = skills;
        }

        // Search technologies
        const technologies = await mcpReadItems('technologies', {
          fields: '*',
          filter: baseFilter,
          search: query,
        });
        if (technologies.length > 0) {
          searchResults.technologies = technologies;
        }

        result = searchResults;
        break;
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    return JSON.stringify(result, null, 2);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return JSON.stringify({ error: message });
  }
}

// Legacy exports for backwards compatibility
export async function mcpRequest(
  method: string,
  params?: Record<string, unknown>
): Promise<unknown> {
  // Map old JSON-RPC style calls to new MCP tool pattern
  if (method === 'tools/call' && params) {
    const { name, arguments: args } = params as {
      name: string;
      arguments: Record<string, unknown>;
    };
    const result = await executeTool(name, args || {});
    return JSON.parse(result);
  }
  throw new Error(`Unsupported MCP method: ${method}`);
}

export async function callMCPTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const result = await executeTool(toolName, args);
  return JSON.parse(result);
}

export async function listMCPTools(): Promise<unknown> {
  return { tools: CLAUDE_TOOLS };
}
