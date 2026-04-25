import { neon } from '@neondatabase/serverless';

// CORS Headers GitHub Pages permitidos
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://ultraseco.github.io',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Todas las tablas que deberían existir en la base de datos
const TABLES = [
  'products',
  'product_options',
  'orders',
  'order_items',
  'clients',
  'vendors',
  'users',
  'postulations',
  'xplog',
  'dailytasks'
];

export const handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Verificar cada tabla individualmente
    const status = {};
    
    for (const table of TABLES) {
      try {
        await sql`SELECT 1 FROM ${sql.unsafe(table)} LIMIT 1`;
        status[table] = { exists: true, ok: true };
      } catch (err) {
        status[table] = { 
          exists: false, 
          ok: false, 
          error: err.message,
          code: err.code
        };
      }
    }

    // Verificar también schemas y metadatos
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const tableNames = tables.map(t => t.table_name);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        database_check: status,
        tables_encontradas: tableNames,
        resumen: {
          total: TABLES.length,
          ok: Object.values(status).filter(s => s.ok).length,
          error: Object.values(status).filter(s => !s.ok).length
        }
      }),
    };

  } catch (error) {
    console.error('Neon Error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Error de conexión a base de datos',
        detail: error.message,
        code: error.code
      }),
    };
  }
};
