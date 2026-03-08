#!/usr/bin/env node

/**
 * BOLTR Tasks MCP Server
 *
 * Exposes all BOLTR Tasks functionality as MCP tools for AI agent management.
 * Authenticates with user's BOLTR credentials (email/password).
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initAuthenticatedClient } from './auth.js';
import { registerTaskTools } from './tools/tasks.js';
import { registerSubtaskTools } from './tools/subtasks.js';
import { registerListTools } from './tools/lists.js';
import { registerGoalTools } from './tools/goals.js';
import { registerRecurrenceTools } from './tools/recurrence.js';
import { registerFocusTools } from './tools/focus.js';
import { registerDashboardTools } from './tools/dashboard.js';

async function main() {
  // Authenticate with Supabase
  const supabase = await initAuthenticatedClient();

  // Create MCP server
  const server = new McpServer({
    name: 'boltr-tasks',
    version: '1.0.0',
  });

  // Register all tools
  registerTaskTools(server, supabase);
  registerSubtaskTools(server, supabase);
  registerListTools(server, supabase);
  registerGoalTools(server, supabase);
  registerRecurrenceTools(server, supabase);
  registerFocusTools(server, supabase);
  registerDashboardTools(server, supabase);

  console.error(`BOLTR MCP Server v1.0.0 - 25 tools registered`);

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
