import { neon } from '@neondatabase/serverless';

// CORS Headers GitHub Pages permitidos
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://ultraseco.github.io',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Consulta de prueba simple
    const result = await sql`SELECT NOW() as server_time`;

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: 'Conexión a Neon OK',
        timestamp: result[0].server_time
      }),
    };

  } catch (error) {
    console.error('Neon Error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Error de conexión a base de datos',
        detail: error.message
      }),
    };
  }
};